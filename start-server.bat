@echo off
echo ========================================
echo    DM Lab Website - Local Server
echo ========================================
echo.

:: Check if Python is available
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting Python HTTP server...
    echo.
    echo Website will be available at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.

    :: Open browser after a short delay
    start "" http://localhost:8000

    :: Start Python server
    python -m http.server 8000
    goto :end
)

:: Check if Node.js is available
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting Node.js server...
    echo.
    echo Website will be available at: http://localhost:3000
    echo Press Ctrl+C to stop the server
    echo.

    :: Open browser after a short delay
    start "" http://localhost:3000

    :: Start Node server
    npx serve -l 3000
    goto :end
)

:: Neither Python nor Node.js found
echo ERROR: No suitable web server found!
echo.
echo Please install one of the following:
echo   - Python 3: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
pause

:end
