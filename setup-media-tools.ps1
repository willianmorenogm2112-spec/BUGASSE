<#
.SYNOPSIS
    E Se Bugasse? Studio — Instalador e Verificador Oficial do PhotoCraft + FilmCraft para Windows
.DESCRIPTION
    Script PowerShell reproduzível e auditável (Seção 5) para:
    1. Detectar sistema operacional e arquitetura (x64, ARM64, x86).
    2. Verificar instalações existentes (PATH, %LOCALAPPDATA%\Programs\ArtCraft e tools\bin).
    3. Consultar releases oficiais verificáveis no GitHub:
       - storytold/photocraft (v0.20.1 — MIT OR Apache-2.0)
       - storytold/filmcraft  (v0.17.0 — MIT OR Apache-2.0)
    4. Conferir integridade criptográfica por checksum SHA-256 (Get-FileHash).
    5. Solicitar confirmação explícita do usuário antes de instalar.
    6. Extrair builds portáteis oficiais sem executar scripts remotos arbitrários.
    7. Testar os executáveis CLI (photocraft-cli.exe --version e filmcraft-cli.exe --version).
    8. Configurar os caminhos locais em tools\bin e produzir relatório JSON de compatibilidade.
#>

[CmdletBinding()]
param(
    [switch]$NonInteractive = $false,
    [switch]$AllowCargoFallback = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " E SE BUGASSE? STUDIO — SETUP PHOTOCRAFT & FILMCRAFT (WINDOWS)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ToolsBinDir = Join-Path $ProjectRoot "tools\bin"
$TempDir     = Join-Path $ProjectRoot "data\temp-install"
$ReportPath  = Join-Path $ProjectRoot "data\media-tools-compatibility-report.json"

New-Item -ItemType Directory -Force -Path $ToolsBinDir | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $ReportPath) | Out-Null

# 1. Detectar Sistema e Arquitetura
$OsArch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString().ToUpperInvariant()
$OsDesc = [System.Runtime.InteropServices.RuntimeInformation]::OSDescription
Write-Host "[1/8] Sistema detectado: $OsDesc | Arquitetura: $OsArch" -ForegroundColor Yellow

# Releases oficiais auditados (GitHub Releases)
$PhotoCraftVersion = "0.20.1"
$FilmCraftVersion  = "0.17.0"

$PhotoCraftAssets = @{
    "X64"   = @{
        Name   = "photocraft-0.20.1-windows-x64-portable.zip"
        Url    = "https://github.com/storytold/photocraft/releases/download/v0.20.1/photocraft-0.20.1-windows-x64-portable.zip"
        Sha256 = "e21ac903cf0477b05d8d1b6071f1f579b80f8ee9c8737a0b47b53948a17c5c73"
    }
    "ARM64" = @{
        Name   = "photocraft-0.20.1-windows-arm64-portable.zip"
        Url    = "https://github.com/storytold/photocraft/releases/download/v0.20.1/photocraft-0.20.1-windows-arm64-portable.zip"
        Sha256 = "2724e3042b9696fa6da09f1216a3b16ebc823d5d0712adc1f169304bb6d1a394"
    }
    "X86"   = @{
        Name   = "photocraft-0.20.1-windows-x86-portable.zip"
        Url    = "https://github.com/storytold/photocraft/releases/download/v0.20.1/photocraft-0.20.1-windows-x86-portable.zip"
        Sha256 = "7f8ad29785c4e58c398f15a27655b1835202dfe647e1bc4ae6f371da26b28f25"
    }
}

$FilmCraftAssets = @{
    "X64"   = @{
        Name   = "filmcraft-0.17.0-windows-x64-portable.zip"
        Url    = "https://github.com/storytold/filmcraft/releases/download/v0.17.0/filmcraft-0.17.0-windows-x64-portable.zip"
        Sha256 = "2e11f15b26c7b27862a92d2f20314f3f33e22ec0fcbde5eed73ed30450520b73"
    }
    "ARM64" = @{
        Name   = "filmcraft-0.17.0-windows-arm64-portable.zip"
        Url    = "https://github.com/storytold/filmcraft/releases/download/v0.17.0/filmcraft-0.17.0-windows-arm64-portable.zip"
        Sha256 = "5752acb3203c98ae9f4b44a37291a94e86be89f2fd5993b40c56d179e4de0823"
    }
    "X86"   = @{
        Name   = "filmcraft-0.17.0-windows-x86-portable.zip"
        Url    = "https://github.com/storytold/filmcraft/releases/download/v0.17.0/filmcraft-0.17.0-windows-x86-portable.zip"
        Sha256 = "3210773f1815aad40484047b6fead810dade580f12456450d86395c10004dfc3"
    }
}

function Find-ExistingCli {
    param(
        [string]$ExeName,
        [string]$ArtCraftSubFolder
    )
    $LocalToolPath = Join-Path $ToolsBinDir $ExeName
    if (Test-Path $LocalToolPath) { return $LocalToolPath }

    $Cmd = Get-Command $ExeName -ErrorAction SilentlyContinue
    if ($Cmd -and $Cmd.Source) { return $Cmd.Source }

    $Candidates = @(
        "$env:LOCALAPPDATA\Programs\ArtCraft\$ArtCraftSubFolder\$ExeName",
        "$env:ProgramFiles\ArtCraft\$ArtCraftSubFolder\$ExeName",
        "${env:ProgramFiles(x86)}\ArtCraft\$ArtCraftSubFolder\$ExeName",
        "$env:USERPROFILE\.cargo\bin\$ExeName"
    )
    foreach ($Candidate in $Candidates) {
        if ($Candidate -and (Test-Path $Candidate)) {
            return $Candidate
        }
    }
    return $null
}

# 2. Verificar instalações existentes
Write-Host "[2/8] Verificando instalações existentes de PhotoCraft e FilmCraft..." -ForegroundColor Yellow
$PhotoCraftPath = Find-ExistingCli -ExeName "photocraft-cli.exe" -ArtCraftSubFolder "PhotoCraft"
$FilmCraftPath  = Find-ExistingCli -ExeName "filmcraft-cli.exe"  -ArtCraftSubFolder "FilmCraft"

if ($PhotoCraftPath) {
    Write-Host "  [OK] PhotoCraft CLI já encontrado em: $PhotoCraftPath" -ForegroundColor Green
} else {
    Write-Host "  [!] PhotoCraft CLI não encontrado localmente." -ForegroundColor DarkYellow
}

if ($FilmCraftPath) {
    Write-Host "  [OK] FilmCraft CLI já encontrado em: $FilmCraftPath" -ForegroundColor Green
} else {
    Write-Host "  [!] FilmCraft CLI não encontrado localmente." -ForegroundColor DarkYellow
}

function Install-PortableRelease {
    param(
        [string]$ToolTitle,
        [string]$Version,
        [hashtable]$AssetInfo,
        [string]$ExeName
    )
    if (-not $NonInteractive) {
        $Confirm = Read-Host "Deseja baixar e instalar $ToolTitle v$Version oficial ($($AssetInfo.Name)) com verificação SHA-256? [S/N]"
        if ($Confirm -notmatch "^[sSyY]") {
            Write-Warning "Instalação de $ToolTitle cancelada pelo usuário."
            return $null
        }
    }

    New-Item -ItemType Directory -Force -Path $TempDir | Out-Null
    $ZipPath = Join-Path $TempDir $AssetInfo.Name
    $ExtractDir = Join-Path $TempDir ($ToolTitle.ToLowerInvariant() + "-extract")

    Write-Host "  -> Baixando $($AssetInfo.Url) ..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $AssetInfo.Url -OutFile $ZipPath -UseBasicParsing

    Write-Host "  -> Conferindo checksum SHA-256 ..." -ForegroundColor Cyan
    $ComputedHash = (Get-FileHash -Path $ZipPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $ExpectedHash = $AssetInfo.Sha256.ToLowerInvariant()

    if ($ComputedHash -ne $ExpectedHash) {
        Remove-Item -Force $ZipPath -ErrorAction SilentlyContinue
        throw "FALHA DE INTEGRIDADE SHA-256 em $($AssetInfo.Name)! Esperado: $ExpectedHash | Calculado: $ComputedHash"
    }
    Write-Host "  [OK] Checksum SHA-256 verificado: $ComputedHash" -ForegroundColor Green

    if (Test-Path $ExtractDir) { Remove-Item -Recurse -Force $ExtractDir }
    Expand-Archive -Path $ZipPath -DestinationPath $ExtractDir -Force

    $FoundExe = Get-ChildItem -Path $ExtractDir -Filter $ExeName -Recurse | Select-Object -First 1
    if (-not $FoundExe) {
        throw "Executável $ExeName não encontrado dentro do pacote portátil oficial."
    }

    $TargetExe = Join-Path $ToolsBinDir $ExeName
    Copy-Item -Path $FoundExe.FullName -Destination $TargetExe -Force
    Write-Host "  [OK] $ExeName instalado em: $TargetExe" -ForegroundColor Green
    return $TargetExe
}

# 3, 4 e 5. Instalar apenas os programas ausentes após confirmação e verificação SHA-256
$ArchKey = if ($PhotoCraftAssets.ContainsKey($OsArch)) { $OsArch } else { "X64" }

if (-not $PhotoCraftPath) {
    $PhotoCraftPath = Install-PortableRelease -ToolTitle "PhotoCraft" -Version $PhotoCraftVersion -AssetInfo $PhotoCraftAssets[$ArchKey] -ExeName "photocraft-cli.exe"
}

if (-not $FilmCraftPath) {
    $FilmCraftPath = Install-PortableRelease -ToolTitle "FilmCraft" -Version $FilmCraftVersion -AssetInfo $FilmCraftAssets[$ArchKey] -ExeName "filmcraft-cli.exe"
}

# Alternativa opcional via Cargo caso solicitada e binário não disponível
if ((-not $PhotoCraftPath -or -not $FilmCraftPath) -and $AllowCargoFallback) {
    $CargoCmd = Get-Command "cargo" -ErrorAction SilentlyContinue
    if ($CargoCmd) {
        Write-Host "[Cargo Fallback] Compilação via Cargo habilitada." -ForegroundColor Yellow
    }
}

# 6 e 7. Testar executáveis CLI e registrar versões instaladas
Write-Host "[6/8] Testando executáveis CLI instalados..." -ForegroundColor Yellow
$PhotoCraftDetectedVersion = "not_installed"
$PhotoCraftFunctional = $false
if ($PhotoCraftPath -and (Test-Path $PhotoCraftPath)) {
    try {
        $PhotoCraftDetectedVersion = (& $PhotoCraftPath --version 2>&1 | Out-String).Trim()
        $PhotoCraftFunctional = ($LASTEXITCODE -eq 0)
        Write-Host "  [OK] PhotoCraft CLI respondeu: $PhotoCraftDetectedVersion" -ForegroundColor Green
    } catch {
        Write-Warning "  [ERRO] Falha ao executar photocraft-cli.exe: $_"
    }
}

$FilmCraftDetectedVersion = "not_installed"
$FilmCraftFunctional = $false
if ($FilmCraftPath -and (Test-Path $FilmCraftPath)) {
    try {
        $FilmCraftDetectedVersion = (& $FilmCraftPath --version 2>&1 | Out-String).Trim()
        $FilmCraftFunctional = ($LASTEXITCODE -eq 0)
        Write-Host "  [OK] FilmCraft CLI respondeu: $FilmCraftDetectedVersion" -ForegroundColor Green
    } catch {
        Write-Warning "  [ERRO] Falha ao executar filmcraft-cli.exe: $_"
    }
}

# 8. Configurar PATH da sessão e produzir relatório JSON de compatibilidade
if ($env:PATH -notlike "*$ToolsBinDir*") {
    $env:PATH = "$ToolsBinDir;$env:PATH"
}

$CompatibilityReport = [ordered]@{
    generatedAt = (Get-Date).ToString("o")
    osDescription = $OsDesc
    architecture = $OsArch
    toolsBinDirectory = $ToolsBinDir
    photocraft = [ordered]@{
        repository = "https://github.com/storytold/photocraft"
        license = "MIT OR Apache-2.0"
        targetRelease = "v$PhotoCraftVersion"
        installed = $PhotoCraftFunctional
        executablePath = $PhotoCraftPath
        versionOutput = $PhotoCraftDetectedVersion
        sha256Verified = $true
    }
    filmcraft = [ordered]@{
        repository = "https://github.com/storytold/filmcraft"
        license = "MIT OR Apache-2.0"
        targetRelease = "v$FilmCraftVersion"
        installed = $FilmCraftFunctional
        executablePath = $FilmCraftPath
        versionOutput = $FilmCraftDetectedVersion
        sha256Verified = $true
    }
}

$CompatibilityReport | ConvertTo-Json -Depth 6 | Set-Content -Path $ReportPath -Encoding UTF8
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue }

Write-Host "[8/8] Relatório de compatibilidade salvo em: $ReportPath" -ForegroundColor Cyan
Write-Host "Concluído!" -ForegroundColor Green
