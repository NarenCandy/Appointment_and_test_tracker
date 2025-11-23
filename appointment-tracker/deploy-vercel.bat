@echo off
REM Deployment script for Vercel (Windows)
REM This script will build and deploy your app to Vercel

echo.
echo 🚀 Starting deployment process...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the appointment-tracker directory.
    exit /b 1
)

REM Install dependencies if needed
echo 📦 Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Build the project
echo.
echo 🔨 Building production version...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed! Please fix the errors and try again.
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if errorlevel 1 (
    echo 📥 Vercel CLI not found. Installing...
    call npm install -g vercel
)

REM Deploy to Vercel
echo.
echo 🌍 Deploying to Vercel...
echo.
call vercel --prod

echo.
echo 🎉 Deployment complete!
echo.
echo Your app is now live and accessible worldwide!
echo.

pause
