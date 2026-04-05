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

echo [2] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
  echo.
  echo  *** MongoDB is NOT installed or not in PATH ***
  echo  Download: https://www.mongodb.com/try/download/community
  echo.
  pause
  exit
)

echo [3] Starting server...
echo.
node server.js
