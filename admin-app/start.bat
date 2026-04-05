@echo off
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 " ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
echo Starting Admin App on port 3001...
npm start
