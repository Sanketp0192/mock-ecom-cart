Write-Host "🧹 Cleaning up database and node modules..." -ForegroundColor Yellow

# Remove database file if it exists
if (Test-Path "db\ecommerce.db") {
    Remove-Item -Force "db\ecommerce.db"
    Write-Host "✅ Database file removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No database file found" -ForegroundColor Blue
}

# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ node_modules removed" -ForegroundColor Green
}

Write-Host "🎉 Cleanup complete! Run 'npm install' and 'npm start' to restart." -ForegroundColor Green