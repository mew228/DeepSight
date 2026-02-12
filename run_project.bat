@echo off
setlocal
echo ===================================================
echo   DeepSight - Object Detection Project Launcher
echo ===================================================

echo [1/2] Checking Python Dependencies...
pip install -r requirements-server.txt --quiet
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies.
)

echo [2/2] Checking Frontend Dependencies...
if not exist node_modules (
    echo Installing node_modules...
    call npm install
)

echo Starting Backend Server...
start "DeepSight Backend" cmd /k "python server.py"

echo Starting Frontend Server...
start "DeepSight Frontend" cmd /k "npm run dev"

echo ===================================================
echo Project is running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo ===================================================
endlocal
pause
