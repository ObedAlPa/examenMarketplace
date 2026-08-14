<#
.SYNOPSIS
  Inicia backend y frontend de TenoMerca.
.DESCRIPTION
  Libera los puertos 4000 (backend) y 5173 (frontend) matando procesos
  huérfanos, luego inicia ambos servicios en ventanas separadas de PowerShell.
.USAGE
  .\start.ps1
#>

$ErrorActionPreference = "Continue"
$ROOT_DIR = Split-Path -Parent $PSScriptRoot
$BACKEND_DIR = Join-Path $ROOT_DIR "backend"
$FRONTEND_DIR = Join-Path $ROOT_DIR "frontend"

function Write-Success { Write-Host "[✔] $args" -ForegroundColor Green }
function Write-Error   { Write-Host "[✘] $args" -ForegroundColor Red }
function Write-Info    { Write-Host "[i] $args" -ForegroundColor Cyan }
function Write-Warn    { Write-Host "[!] $args" -ForegroundColor Yellow }
function Write-Step    { Write-Host "`n=== $args ===" -ForegroundColor Magenta }

Write-Host "=== TenoMerca — Iniciando ===" -ForegroundColor Magenta
Write-Host ""

# ── Verificar Node ──
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
  Write-Error "Node.js no está instalado o no está en PATH."
  exit 1
}

# ── Verificar node_modules ──
if (-not (Test-Path (Join-Path $ROOT_DIR "node_modules"))) {
  Write-Warn "No se encontró node_modules en la raíz del proyecto."
  Write-Host "  Ejecuta primero: npm run setup   (o npm install)" -ForegroundColor Yellow
  exit 1
}

# ── Liberar puertos ──
Write-Info "Liberando puertos..."
$backendPort = 4000
$frontendPort = 5173

foreach ($port in @($backendPort, $frontendPort)) {
  $listening = netstat -ano | Select-String ":$port " | Select-String "LISTENING"
  if ($listening) {
    $line = ($listening | Select-Object -First 1).ToString()
    $procId = ($line -split '\s+')[-1]
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Write-Success "  Puerto $port liberado (proceso $procId)"
  } else {
    Write-Info "  Puerto $port libre"
  }
}

# ── Iniciar backend ──
Write-Info "Iniciando backend (puerto $backendPort)..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$BACKEND_DIR'; npm run dev" -PassThru
Write-Success "  Backend iniciado"

# ── Iniciar frontend ──
Write-Info "Iniciando frontend (puerto $frontendPort)..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$FRONTEND_DIR'; npm run dev" -PassThru
Write-Success "  Frontend iniciado"

Write-Host "`n=== Proyecto en ejecución ===" -ForegroundColor Magenta
Write-Host "  Backend:  http://localhost:$backendPort" -ForegroundColor White
Write-Host "  Frontend: http://localhost:$frontendPort" -ForegroundColor White
Write-Host "`n  Presiona Ctrl+C en cada ventana para detener." -ForegroundColor Cyan
