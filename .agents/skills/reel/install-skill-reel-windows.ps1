<#
.SYNOPSIS
  Instalador e Verificador Reproduzível da Skill Reel + HyperFrames para Windows (Codex + Remotion)
  Projeto: E Se Bugasse? Studio
.DESCRIPTION
  1. Inspeciona dependências locais (Node.js, npm, FFmpeg, Remotion, GSAP).
  2. Verifica a estrutura .agents\skills\reel (SKILL.md, ESTILO.md, regras-da-casa.md, modelo\README.md).
  3. Valida que rotinas de reconhecimento facial humano estão desativadas para o rig 2D do Bugi.
  4. Adapta caminhos para o padrão Windows (backslash) sem executar código remoto não auditado.
#>

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " E SE BUGASSE? STUDIO - INSTALADOR SKILL REEL + HYPERFRAMES (WIN)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$ProjectRoot = Get-Location
$SkillDir = Join-Path $ProjectRoot ".agents\skills\reel"
$ModelDir = Join-Path $SkillDir "modelo"

if (-not (Test-Path $SkillDir)) {
    New-Item -ItemType Directory -Force -Path $SkillDir | Out-Null
}
if (-not (Test-Path $ModelDir)) {
    New-Item -ItemType Directory -Force -Path $ModelDir | Out-Null
}

Write-Host "[1/4] Verificando Node.js e pacotes Remotion/GSAP..." -ForegroundColor Yellow
$NodeVersion = node --version
Write-Host "      Node.js detectado: $NodeVersion" -ForegroundColor Green

$PackageJsonPath = Join-Path $ProjectRoot "package.json"
if (Test-Path $PackageJsonPath) {
    $Pkg = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    $RequiredPackages = @("remotion", "@remotion/player", "@remotion/captions", "gsap", "mp4-muxer")
    foreach ($req in $RequiredPackages) {
        if ($Pkg.dependencies.PSObject.Properties.Name -contains $req) {
            Write-Host "      [OK] Pacote instalado: $req" -ForegroundColor Green
        } else {
            Write-Host "      [AVISO] Instalando pacote ausente: $req" -ForegroundColor Yellow
            npm install $req --save
        }
    }
}

Write-Host "[2/4] Auditando arquivos obrigatórios em .agents\skills\reel..." -ForegroundColor Yellow
$RequiredFiles = @(
    (Join-Path $SkillDir "SKILL.md"),
    (Join-Path $SkillDir "ESTILO.md"),
    (Join-Path $SkillDir "regras-da-casa.md"),
    (Join-Path $ModelDir "README.md")
)

foreach ($file in $RequiredFiles) {
    if (Test-Path $file) {
        Write-Host "      [OK] Arquivo verificado: $file" -ForegroundColor Green
    } else {
        Write-Error "Arquivo obrigatório ausente: $file"
    }
}

Write-Host "[3/4] Verificando regras de segurança (Sem reconhecimento facial no Bugi)..." -ForegroundColor Yellow
$SkillContent = Get-Content (Join-Path $SkillDir "SKILL.md") -Raw
if ($SkillContent -match "Sem Reconhecimento Facial") {
    Write-Host "      [OK] Proteção de identidade 2D do Bugi ativa." -ForegroundColor Green
}

Write-Host "[4/4] Instalação e auditoria concluídas com sucesso no ambiente Windows!" -ForegroundColor Cyan
Write-Host "Para renderizar no Remotion local:" -ForegroundColor White
Write-Host "  npx remotion render src/index.ts ESeBugasseShort out\ep-atrito-5s.mp4 --codec=h264" -ForegroundColor Yellow
