@echo off
REM Face Tracking App - Automated Deployment Script for Vercel (Windows)
REM Run this script to deploy your application to Vercel

echo 🚀 Starting Face Tracking App Deployment to Vercel...
echo ================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo ✅ Project validation passed

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Error: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

REM Run build to test everything works
echo 🔨 Testing production build...
call npm run build
if errorlevel 1 (
    echo ❌ Error: Build failed. Please fix errors before deploying.
    pause
    exit /b 1
)
echo ✅ Build successful

REM Check if git repository is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: Face tracking application ready for deployment"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Check if vercel CLI is installed
where vercel >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ❌ Error: Failed to install Vercel CLI
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
    echo ✅ Vercel CLI installed
) else (
    echo ✅ Vercel CLI already installed
)

REM Login to Vercel (if not already logged in)
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo Please login to Vercel:
    vercel login
    if errorlevel 1 (
        echo ❌ Error: Failed to login to Vercel
        pause
        exit /b 1
    )
)
echo ✅ Vercel authentication successful

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
echo This will create a new project and deploy your application.
echo Follow the prompts to configure your deployment.
echo.

vercel
if errorlevel 1 (
    echo ❌ Error: Deployment failed
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment completed successfully!
echo ================================================
echo Your Face Tracking Application is now live!
echo.
echo Next steps:
echo 1. Test all features on the deployed URL
echo 2. Set up custom domain (optional)
echo 3. Enable Vercel Analytics for monitoring
echo 4. Share your application with users
echo.
echo For production deployment, run: vercel --prod
echo.
echo Happy coding! 🎭📹
pause
