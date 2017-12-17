param
(
    [string]$sourcePath,
    [string]$targetPath,
    [switch]$extract,
    [switch]$help,
    [switch]$h
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$ScriptName = $MyInvocation.MyCommand.Name
$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
function showHelp()
{
    Write-Host "USAGE: ${ScriptName} [option] -sourcePath <path] -targetPath <path>"
    Write-Output "  option"
    Write-Output "    -extract # Do extract tar package into targetPath, overwriting existing target files"

    exit 1
}

if ($h -or $help)    {showHelp}
if ( -not($targetPath) -or -not($sourcePath) ) {showHelp}

$whereWasI = $PWD
$sourcePath = (Resolve-Path $sourcePath).ToString()
$targetPath = (Resolve-Path $targetPath).ToString()

Set-Location $sourcePath
$sourceFilenames = @(svn status | Select-String -pattern "^M " | %{$n=$_ -replace "^M *", ""; $n= $n -replace "\\", "/"; $n })
$tarFilename = 'svn-mod-files.tar'
tar.exe cvf $tarFilename $sourceFilenames
$tarFile = Get-ChildItem $tarFilename
Set-Location $targetPath
if ($extract)
{
    tar xvf $tarFile.FullName
}

Move-Item $tarFile.FullName .

Set-Location $whereWasI