@echo off
echo ==========================================
echo    BMSuite One-Click Launcher
echo ==========================================
echo.
powershell -ExecutionPolicy Bypass -File ".\Deploy-Local.ps1"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] There was an issue starting the application.
)
echo.
echo Press any key to close this window...
pause

