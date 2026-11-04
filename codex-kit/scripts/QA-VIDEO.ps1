[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Arquivo,[string]$PastaSaida='')
$ErrorActionPreference='Stop'
foreach($name in @('ffmpeg','ffprobe')){
  if(-not (Get-Command $name -ErrorAction SilentlyContinue)){throw "Falta $name no PATH"}
}
$full=[System.IO.Path]::GetFullPath($Arquivo)
if(-not (Test-Path $full)){throw "MP4 nao encontrado: $full"}
if(-not $PastaSaida){$PastaSaida=Join-Path (Split-Path -Parent $full) 'qa'}
New-Item -ItemType Directory -Force -Path $PastaSaida | Out-Null
$raw=& ffprobe -v error -show_streams -show_format -of json $full
$raw | Out-File -Encoding UTF8 (Join-Path $PastaSaida 'ffprobe.json')
$info=($raw -join "`n") | ConvertFrom-Json
$v=@($info.streams|Where-Object {$_.codec_type -eq 'video'})
$a=@($info.streams|Where-Object {$_.codec_type -eq 'audio'})
if($v.Count -lt 1 -or $a.Count -lt 1){throw 'Video ou audio ausente no MP4.'}
if($v[0].width -ne 1080 -or $v[0].height -ne 1920){throw 'Resolução diferente de 1080x1920.'}
& ffmpeg -v error -i $full -f null NUL
if($LASTEXITCODE -ne 0){throw 'Decodificacao integral falhou.'}
$sheet=Join-Path $PastaSaida 'contato.png'
& ffmpeg -y -v error -i $full -vf 'fps=2,scale=180:320,tile=6x4:padding=4:margin=4' -frames:v 1 $sheet
$audioLog=Join-Path $PastaSaida 'loudness.txt'
cmd /c "ffmpeg -hide_banner -nostats -i `"$full`" -filter_complex ebur128=peak=true -f null NUL > `"$audioLog`" 2>&1"
$sha=(Get-FileHash $full -Algorithm SHA256).Hash
@('# QA Tecnico MP4','',"- Arquivo: $full","- SHA256: $sha","- Video: $($v[0].codec_name) $($v[0].width)x$($v[0].height)","- Audio: $($a[0].codec_name)","- Duracao: $($info.format.duration) s",'- Decode: OK','- Revisao artistica: PENDENTE',"- Contact sheet: $sheet","- Audio metrics: $audioLog") | Set-Content (Join-Path $PastaSaida 'RENDER-QA.md') -Encoding UTF8
Write-Host 'QA tecnico OK. Escutar e inspecionar sequencias de frames antes de aprovar.' -ForegroundColor Green
