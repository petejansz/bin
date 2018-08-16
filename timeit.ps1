param
(
    [string]$it,
    [switch]$help,
    [switch]$h
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
$scriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Output "USAGE: [options] ${scriptName} -it <it-program> [`"its-args`"]"
    Write-Output "Options:"
    exit 1
}

#if ($h -or $help -or (-not ($it))) {showHelp}
$sw = [Diagnostics.Stopwatch]::StartNew()
# $it = which $it
# $psArgs = @($it) + @("$args")
# Start-Process node.exe -NoNewWindow -Wait -ArgumentList $psArgs
$sw = [Diagnostics.Stopwatch]::StartNew()
$token = oauth-login.js -h cadev1 -u test18@yopmail.com -p Password2
Write-Output $token
$sw.Stop()
Write-Host -ForegroundColor Green $sw.Elapsed.TotalSeconds

$token = pd-login.js    -h cadev1 -u test18@yopmail.com -p Password2
Write-Output $token
$sw.Stop()
Write-Host -ForegroundColor Green $sw.Elapsed.TotalSeconds
