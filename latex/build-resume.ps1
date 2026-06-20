$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$repoRoot = Split-Path $here -Parent
$tectonicDir = Join-Path $here '.tectonic'
$tectonicExe = Join-Path $tectonicDir 'tectonic.exe'
$tex = Join-Path $here 'Prajwal_BR_Resume.tex'
$texAts = Join-Path $here 'Prajwal_BR_Resume_ATS.tex'
$outPdf = Join-Path $here 'Prajwal_BR_Resume.pdf'
$outPdfAts = Join-Path $here 'Prajwal_BR_Resume_ATS.pdf'
$destDir = Join-Path $repoRoot 'public\documents'
$destPdf = Join-Path $destDir 'prajwal-b-r-resume.pdf'
$destPdfAts = Join-Path $destDir 'prajwal-b-r-resume-ats.pdf'

if (-not (Test-Path $tectonicExe)) {
  Write-Host 'Tectonic not found. Downloading portable Tectonic (~50 MB)...'
  New-Item -ItemType Directory -Force -Path $tectonicDir | Out-Null
  $ver = '0.15.0'
  $zip = Join-Path $env:TEMP "tectonic-$ver-win.zip"
  $url = "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40$ver/tectonic-$ver-x86_64-pc-windows-msvc.zip"
  Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  Expand-Archive -Path $zip -DestinationPath $tectonicDir -Force
}

Push-Location $here
# Tectonic prints a harmless "Fontconfig error" to stderr on Windows; don't let
# that abort the script. We check $LASTEXITCODE explicitly for real failures.
$ErrorActionPreference = 'Continue'
& $tectonicExe $tex
if ($LASTEXITCODE -ne 0) { $ErrorActionPreference = 'Stop'; Pop-Location; exit $LASTEXITCODE }

if (Test-Path $texAts) {
  & $tectonicExe $texAts
  if ($LASTEXITCODE -ne 0) { $ErrorActionPreference = 'Stop'; Pop-Location; exit $LASTEXITCODE }
}
$ErrorActionPreference = 'Stop'
Pop-Location

if (-not (Test-Path $outPdf)) {
  Write-Error "Expected PDF at $outPdf"
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item -Force $outPdf $destPdf
Write-Host "Wrote $destPdf"

if (Test-Path $texAts) {
  if (-not (Test-Path $outPdfAts)) {
    Write-Error "Expected PDF at $outPdfAts"
  }
  Copy-Item -Force $outPdfAts $destPdfAts
  Write-Host "Wrote $destPdfAts"
}