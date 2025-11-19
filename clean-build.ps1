# Clean build script for Next.js project

Write-Host "Cleaning Next.js build artifacts..." -ForegroundColor Yellow

# Remove .next directory
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Removed .next directory" -ForegroundColor Green
}

# Remove node_modules (optional - uncomment if needed)
# if (Test-Path "node_modules") {
#     Remove-Item -Recurse -Force "node_modules"
#     Write-Host "Removed node_modules directory" -ForegroundColor Green
# }

# Remove out directory
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
    Write-Host "Removed out directory" -ForegroundColor Green
}

Write-Host "Clean complete!" -ForegroundColor Green
Write-Host "Run 'npm install' and 'npm run dev' to start fresh" -ForegroundColor Cyan
