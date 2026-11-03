<#
.SYNOPSIS
  One-command local setup for fixit-mobile (Windows PowerShell 5.1 or PowerShell 7).

.DESCRIPTION
  Checks Node.js, installs dependencies (npm ci) and creates .env with the backend address
  (this computer's local IP, so a phone with Expo Go or the Android emulator can reach it).
  Safe to run again: an existing .env is kept. Then start the app with: npm start

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\bootstrap.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\bootstrap.ps1 -ApiUrl http://192.168.1.20:8000
#>
param(
    # Backend base URL for .env. Detected automatically when omitted.
    [string]$ApiUrl = ''
)

# Native commands (node, npm) report failures via $LASTEXITCODE, checked explicitly below.
$ErrorActionPreference = 'Continue'

function Write-Step([string]$Message) { Write-Host "`n==> $Message" -ForegroundColor Cyan }
function Stop-WithError([string]$Message) {
    Write-Host "`nERROR: $Message" -ForegroundColor Red
    exit 1
}

# IPv4 address of this computer on the local network (the adapter with a default gateway).
function Get-LanIp {
    try {
        $config = Get-NetIPConfiguration -ErrorAction Stop |
            Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } |
            Select-Object -First 1
        if ($config) { return @($config.IPv4Address)[0].IPAddress }
    } catch { }
    return ''
}

$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
    Write-Step 'Checking Node.js'
    $wanted = (Get-Content -LiteralPath (Join-Path $root '.nvmrc') -TotalCount 1).Trim()
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Stop-WithError "Node.js is not installed. Install Node $wanted LTS: https://nodejs.org/"
    }
    $nodeVersion = (node -p 'process.versions.node')
    # No double quotes inside: Windows PowerShell 5.1 drops them from native command arguments.
    $check = 'const [a, b] = process.versions.node.split(/\./).map(Number);' +
        'process.exit((a === 22 && b >= 13) || (a === 24 && b >= 3) || a >= 26 ? 0 : 1);'
    node -e $check
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Node $nodeVersion found, but Expo needs Node ^22.13 or ^24.3." -ForegroundColor Yellow
        Write-Host "         With nvm-windows: nvm install $wanted; nvm use $wanted" -ForegroundColor Yellow
    } else {
        Write-Host "Node $nodeVersion"
    }

    Write-Step 'Installing dependencies (npm ci)'
    npm ci
    if ($LASTEXITCODE -ne 0) { Stop-WithError 'npm ci failed. See the output above.' }

    Write-Step 'Preparing .env'
    $envPath = Join-Path $root '.env'
    if (Test-Path $envPath) {
        Write-Host '.env already exists, keeping it.'
    } else {
        if (-not $ApiUrl) {
            $ip = Get-LanIp
            if ($ip) {
                $ApiUrl = "http://${ip}:8000"
            } else {
                $ApiUrl = 'http://localhost:8000'
                Write-Host "WARNING: could not detect this computer's local IP. Using $ApiUrl," -ForegroundColor Yellow
                Write-Host '         which works only for web. Edit .env for a phone or emulator.' -ForegroundColor Yellow
            }
        }
        # UTF-8 without BOM.
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($envPath, "EXPO_PUBLIC_API_URL=$ApiUrl`n", $utf8NoBom)
        Write-Host "Created .env with EXPO_PUBLIC_API_URL=$ApiUrl"
    }

    Write-Host ''
    Write-Host 'FixIt mobile is ready.' -ForegroundColor Green
    Write-Host '  Start the app:  npm start   (then scan the QR code with Expo Go, or press "a" for Android)'
    Write-Host '  The backend must be running (fixit-backend: scripts\bootstrap.ps1) and reachable at the'
    Write-Host '  address in .env (EXPO_PUBLIC_API_URL).'
} finally {
    Pop-Location
}
