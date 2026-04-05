@echo off
title TechGear Platform - Full Launch
echo.
echo ============================================================
echo   TechGear Platform Launcher
echo   Server:5000  User-App:3000  Admin-App:3001
echo ============================================================
echo.

echo [1/4] Freeing ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 " ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 " ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
echo    Done.

echo [2/4] Starting Backend (port 5000)...
start "TechGear Backend" cmd /k "cd /d %~dp0server && npm install --silent && node server.js"
echo    Waiting for server to start...
timeout /t 6 /nobreak >nul

echo [3/4] Starting User App (port 3000)...
start "User App :3000" cmd /k "cd /d %~dp0user-app && npm install --silent && npm start"
timeout /t 3 /nobreak >nul

echo [4/4] Starting Admin App (port 3001)...
start "Admin App :3001" cmd /k "cd /d %~dp0admin-app && npm install --silent && npm start"

echo.
echo ============================================================
echo   All services starting! URLs:
echo.
echo   User Store   -->  http://localhost:3000
echo   Admin Panel  -->  http://localhost:3001
echo   API Health   -->  http://localhost:5000/health
echo.
echo   Admin Code   -->  TECHGEAR_ADMIN_2026
echo.
echo   NOTE: Make sure "mongod" is running in another terminal!
echo         Without MongoDB, accounts won't persist on restart.
echo ============================================================
echo.
pause
