@echo off
echo ========================================
echo SERVISOO - AUTO FIX DEPLOYMENT SCRIPT
echo ========================================
echo.

echo [INFO] Checking current directory structure...
dir /b
echo.

echo [INFO] Verifying dist folder exists...
if not exist "dist" (
    echo [ERROR] dist folder not found!
    echo [ACTION] Please run 'npm run build' first
    pause
    exit /b 1
)

echo [SUCCESS] dist folder found
echo.

echo [INFO] Checking dist folder contents...
dir /b dist
echo.

echo [INFO] Verifying required files in dist...
if not exist "dist\index.html" (
    echo [ERROR] index.html not found in dist!
    pause
    exit /b 1
)

if not exist "dist\assets" (
    echo [ERROR] assets folder not found in dist!
    pause
    exit /b 1
)

echo [SUCCESS] Required files found
echo.

echo [INFO] Creating new deployment package...
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set zipname=servisoo-emergency-fix-%timestamp%.zip

echo [ACTION] Creating %zipname%...
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath '%zipname%' -Force"

if %errorlevel% equ 0 (
    echo [SUCCESS] Deployment package created: %zipname%
) else (
    echo [ERROR] Failed to create deployment package
    pause
    exit /b 1
)

echo.
echo [INFO] Verifying package contents...
powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('%zipname%'); $zip.Entries | Select-Object Name, Length; $zip.Dispose()"

echo.
echo ========================================
echo DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.
echo 1. Upload %zipname% to Hostinger File Manager
echo 2. Navigate to public_html folder
echo 3. DELETE all existing files in public_html
echo 4. Upload the zip file to public_html
echo 5. RIGHT-CLICK the zip file and select EXTRACT
echo 6. DELETE the zip file after extraction
echo 7. Verify files are directly in public_html (not in subfolder)
echo.
echo CRITICAL: Files must be in public_html ROOT, not in subfolder!
echo.
echo Expected structure after extraction:
echo public_html/
echo ├── index.html
echo ├── .htaccess
echo ├── .env
echo ├── assets/
echo │   ├── index-*.js
echo │   ├── index-*.css
echo │   └── other assets
echo └── other files
echo.
echo ========================================
echo VERIFICATION URLS
echo ========================================
echo.
echo After deployment, test these URLs:
echo 1. https://www.servisoo.com/
echo 2. https://www.servisoo.com/assets/ (should show file listing or 403)
echo.
echo If still getting 404, contact Hostinger Support immediately!
echo.
echo Package ready: %zipname%
echo.
pause