@echo off
title TechGear Backend Server
echo.
echo ====================================================
echo   TechGear Backend Server
echo ====================================================
echo.

echo [1] Freeing ports 5000-5003...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 " ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 " ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5002 " ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1

echo [2] Using MongoDB settings from server\.env...
echo [3] Starting server...
echo.
node server.js
