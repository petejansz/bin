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
#(admin-search-players.js -h localhost -p 8380 -e 'zzzz%'|ConvertFrom-Json).Count
processes-player-note.js -h localhost -i 1000004997 #| Out-Null
#admin-get-playerid -h localhost -p 8380 -u test888@yopmail.com | Out-Null
$sw.Stop()
Write-Host -ForegroundColor Green $sw.Elapsed.TotalSeconds
