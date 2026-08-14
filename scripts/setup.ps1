<#
.SYNOPSIS
  Configuración inicial del proyecto TenoMerca.
.DESCRIPTION
  Verifica requisitos (Node, npm, PostgreSQL), configura los .env si faltan,
  prueba la conexión a PostgreSQL, crea la base de datos si no existe,
  instala dependencias con npm workspaces y ejecuta migraciones y seed.
#>

$ErrorActionPreference = "Stop"
$ROOT_DIR = Split-Path -Parent $PSScriptRoot
$BACKEND_DIR = Join-Path $ROOT_DIR "backend"
$FRONTEND_DIR = Join-Path $ROOT_DIR "frontend"
$BACKEND_ENV = Join-Path $BACKEND_DIR ".env"
$BACKEND_ENV_EXAMPLE = Join-Path $BACKEND_DIR ".env.example"
$FRONTEND_ENV = Join-Path $FRONTEND_DIR ".env.local"
$FRONTEND_ENV_EXAMPLE = Join-Path $FRONTEND_DIR ".env.example"
$PG_PROGRAM_FILES = "C:\Program Files\PostgreSQL"

function Write-Success { Write-Host "[✔] $args" -ForegroundColor Green }
function Write-Error   { Write-Host "[✘] $args" -ForegroundColor Red }
function Write-Info    { Write-Host "[i] $args" -ForegroundColor Cyan }
function Write-Warn    { Write-Host "[!] $args" -ForegroundColor Yellow }
function Write-Step    { Write-Host "`n=== $args ===" -ForegroundColor Magenta }

# Evita que $ErrorActionPreference "Stop" rompa comandos nativos (npm, psql)
function Invoke-Native {
  param([ScriptBlock]$ScriptBlock)
  $local:ErrorActionPreference = "Continue"
  & $ScriptBlock
}

function Parse-DatabaseUrl {
  param([string]$Url)
  if (-not $Url -or $Url -notmatch '://') { return $null }
  $authHost = ($Url -split '://', 2)[1]
  if ($authHost -notmatch '@') { return $null }
  $credHost = $authHost -split '@', 2
  $credParts = $credHost[0] -split ':', 2
  $user = $credParts[0]
  $pass = if ($credParts.Count -gt 1) { $credParts[1] } else { "" }
  $hostDb = $credHost[1] -split '/', 2
  $hostPort = $hostDb[0]
  $db = if ($hostDb.Count -gt 1) { $hostDb[1] } else { "" }
  $hostParts = $hostPort -split ':', 2
  $server = $hostParts[0]
  $port = if ($hostParts.Count -gt 1) { $hostParts[1] } else { "5432" }
  return [pscustomobject]@{ User = $user; Password = $pass; Host = $server; Port = $port; Database = $db }
}

# ── 1. VERIFICAR REQUISITOS ──
Write-Step "1. Verificando requisitos"

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
  Write-Error "Node.js no está instalado o no está en PATH."
  Write-Host "  Instala Node.js LTS desde https://nodejs.org y vuelve a intentarlo." -ForegroundColor Yellow
  exit 1
}
Write-Success "Node $nodeVersion detectado"

$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
  Write-Error "npm no está disponible (debería venir incluido con Node.js)."
  exit 1
}
Write-Success "npm $npmVersion detectado"

$PSQL = "psql"
$psqlVersion = psql --version 2>$null
if (-not $psqlVersion) {
  Write-Warn "psql no está en PATH. Buscando en C:\Program Files\PostgreSQL..."
  $PSQL = $null
  $pgDirs = Get-ChildItem $PG_PROGRAM_FILES -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending
  foreach ($pgDir in $pgDirs) {
    $candidate = Join-Path $pgDir.FullName "bin\psql.exe"
    if (Test-Path $candidate) { $PSQL = $candidate; break }
  }
  if (-not $PSQL) {
    Write-Error "PostgreSQL no está instalado o no se encontró psql.exe."
    Write-Host "  Instala PostgreSQL desde https://www.postgresql.org/download/windows/ y vuelve a intentarlo." -ForegroundColor Yellow
    exit 1
  }
  Write-Success "PostgreSQL encontrado en $PSQL"
} else {
  Write-Success "PostgreSQL $psqlVersion detectado"
}

# ── 2. CONFIGURAR .env (SOLO si no existe) ──
Write-Step "2. Configurando archivos .env"

if (Test-Path $BACKEND_ENV) {
  Write-Info "backend/.env ya existe — no se modifica."
} else {
  if (-not (Test-Path $BACKEND_ENV_EXAMPLE)) {
    Write-Error "No se encuentra backend/.env.example"
    exit 1
  }
  Copy-Item $BACKEND_ENV_EXAMPLE $BACKEND_ENV
  Write-Success "backend/.env creado a partir de .env.example"
}

if (Test-Path $FRONTEND_ENV) {
  Write-Info "frontend/.env.local ya existe — no se modifica."
} else {
  if (-not (Test-Path $FRONTEND_ENV_EXAMPLE)) {
    Write-Error "No se encuentra frontend/.env.example"
    exit 1
  }
  Copy-Item $FRONTEND_ENV_EXAMPLE $FRONTEND_ENV
  Write-Success "frontend/.env.local creado a partir de .env.example"
}

# ── 3. PROBAR CONEXIÓN A POSTGRESQL ──
Write-Step "3. Probando conexión a PostgreSQL"

$dbUrlLine = Get-Content $BACKEND_ENV | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
if (-not $dbUrlLine) {
  Write-Error "backend/.env no define DATABASE_URL. Agrégalo antes de ejecutar este script."
  exit 1
}
$dbUrl = ($dbUrlLine -replace '^DATABASE_URL=', '').Trim()
$dbInfo = Parse-DatabaseUrl $dbUrl
if (-not $dbInfo) {
  Write-Error "DATABASE_URL en backend/.env no tiene un formato válido (se espera postgresql://user:pass@host:port/db)."
  exit 1
}

$env:PGPASSWORD = $dbInfo.Password
$connTest = Invoke-Native { & $PSQL -h $dbInfo.Host -p $dbInfo.Port -U $dbInfo.User -c "SELECT 1" }
if ($LASTEXITCODE -ne 0) {
  Write-Error "No se pudo conectar a PostgreSQL en $($dbInfo.Host):$($dbInfo.Port) con usuario $($dbInfo.User)"
  Write-Host "  Verifica que el servicio esté corriendo: Services.msc → postgresql-x64-* → iniciar." -ForegroundColor Yellow
  exit 1
}
Write-Success "Conexión a PostgreSQL exitosa"

# ── 4. CREAR LA BASE DE DATOS SI NO EXISTE ──
Write-Step "4. Creando la base de datos"

$dbExists = Invoke-Native { & $PSQL -h $dbInfo.Host -p $dbInfo.Port -U $dbInfo.User -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$($dbInfo.Database)'" }
if ("$dbExists".Trim() -eq "1") {
  Write-Info "La base de datos '$($dbInfo.Database)' ya existe"
} else {
  Invoke-Native { & $PSQL -h $dbInfo.Host -p $dbInfo.Port -U $dbInfo.User -d postgres -c "CREATE DATABASE `"$($dbInfo.Database)`"" }
  if ($LASTEXITCODE -eq 0) {
    Write-Success "Base de datos '$($dbInfo.Database)' creada"
  } else {
    Write-Error "No se pudo crear la base de datos '$($dbInfo.Database)'"
    exit 1
  }
}

# ── 5. INSTALAR DEPENDENCIAS ──
Write-Step "5. Instalando dependencias (npm workspaces)"

Set-Location $ROOT_DIR
Invoke-Native { npm install }
if ($LASTEXITCODE -ne 0) {
  Write-Error "Error al instalar dependencias con npm."
  exit 1
}
Write-Success "Dependencias instaladas"

# ── 6. MIGRAR Y SEMBRAR LA BASE DE DATOS ──
Write-Step "6. Ejecutando migraciones y seed"

Invoke-Native { npm --prefix backend run migrate }
if ($LASTEXITCODE -eq 0) {
  Write-Success "Migraciones aplicadas"
} else {
  Write-Error "Falló la migración. Revisa el mensaje anterior."
  exit 1
}

Invoke-Native { npm --prefix backend run seed }
if ($LASTEXITCODE -eq 0) {
  Write-Success "Seed completado"
} else {
  Write-Error "Falló el seed. Revisa el mensaje anterior."
  exit 1
}

Set-Location $ROOT_DIR

# ── MENSAJE FINAL ──
Write-Step "Configuración completada"
Write-Host "`n  Para iniciar el proyecto:" -ForegroundColor Cyan
Write-Host "    npm start" -ForegroundColor White
Write-Host "`n  Usuarios de prueba:" -ForegroundColor Cyan
Write-Host "    admin@tenomerca.test / AdminPass123!   (rol: admin)" -ForegroundColor White
Write-Host "    buyer@tenomerca.test  / BuyerPass123!  (rol: comprador)" -ForegroundColor White
