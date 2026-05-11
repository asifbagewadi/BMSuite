# Add-Shortcut.ps1 - Creates a Desktop Shortcut for BMSuite (Portable Version)
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$ShortcutPath = [System.IO.Path]::Combine($DesktopPath, "BMSuite.lnk")
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)

# Get the current directory dynamically
$CurrentDir = Get-Location
$BatPath = Join-Path $CurrentDir "Start-BMSuite.bat"

# Point the shortcut to the .bat file
$Shortcut.TargetPath = $BatPath
$Shortcut.WorkingDirectory = $CurrentDir.Path
$Shortcut.Description = "Launch BMSuite CRM"

# Set the icon
$IconPath = Join-Path $CurrentDir.Path "static\favicon.ico"
if (Test-Path $IconPath) { 
    $Shortcut.IconLocation = $IconPath 
}

$Shortcut.Save()

Write-Host "[SUCCESS] BMSuite shortcut created on your Desktop!" -ForegroundColor Green
