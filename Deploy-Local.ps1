# Deploy-Local.ps1 - BMSuite Enterprise System Launcher

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      BMSuite Enterprise Edition         " -ForegroundColor Cyan
Write-Host "          System Launcher                " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check for Environment Prerequisites
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] System prerequisites not met. Docker is required to run BMSuite." -ForegroundColor Red
    Write-Host "Please install Docker Desktop to proceed."
    exit
}

# 2. Verify Service Engine
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] System engine is offline. Please start Docker Desktop." -ForegroundColor Red
    exit
}

# 3. Initialize Services
Write-Host "`n[1/4] Optimizing environment and starting services..." -ForegroundColor Yellow
docker compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] System initialization failed. Please check your connection." -ForegroundColor Red
    exit
}
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Services failed to start." -ForegroundColor Red
    exit
}

# 4. Finalize Initialization
Write-Host "`n[2/4] Finalizing application core..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 5. Network Access Configuration
$IPv4 = (Get-NetIPAddress | Where-Object { 
    $_.AddressFamily -eq 'IPv4' -and 
    $_.InterfaceAlias -notlike '*Loopback*' -and 
    $_.InterfaceAlias -notlike '*vEthernet*' -and
    $_.IPAddress -notlike '169.*' -and
    $_.IPAddress -notlike '172.*'
}).IPAddress | Select-Object -First 1

Write-Host "`n[3/4] System is now online!" -ForegroundColor Green
Write-Host "------------------------------------------"
Write-Host "Access Link (Local): http://localhost:3000" -ForegroundColor Green
Write-Host "Access Link (LAN):   http://$($IPv4):3000" -ForegroundColor Green
Write-Host "------------------------------------------"
Write-Host "BMSuite is now active and accessible across your local network."

# 6. Desktop Integration
Write-Host "`n[4/4] Finalizing desktop integration..." -ForegroundColor Yellow
powershell.exe -ExecutionPolicy Bypass -File ".\Add-Shortcut.ps1"

Write-Host "`nSystem Logs (Last 10 entries):" -ForegroundColor Gray
docker compose logs --tail 10 bms-app

Write-Host "`nKeep this window open to maintain the system, or press any key to exit."

Pause
