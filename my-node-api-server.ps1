<#
    Stop or start my node api server
    Author: Pete Jansz, Feb 2019
#>

param
(
    [switch]    $stop,
    [switch]    $start,
    [switch]    $help,
    [switch]    $h
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
$whereWasI = $pwd

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

$ScriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Output "USAGE: $ScriptName [option] -start | -stop"
    Write-Output "  option"
    exit 1
}

if ($h -or $help) {showHelp}
if ( -not($start) -and -not($stop) ) {showHelp}

API_SERVER_HOME = "$env:USERPROFILE/Documents/Projects/learning/nodejs/api-server"
$serverListening = Test-NetConnection -InformationLevel quiet -Port 8680 -ComputerName localhost -WarningAction silentlyContinue

if ($start)
{
    if (-not $serverListening )
    {
        Set-Location $API_SERVER_HOME
        Start-Process -FilePath npm -Args start -WorkingDirectory $API_SERVER_HOME -WindowStyle Minimized
        Set-Location $whereWasI
    }
}
elseif ( $stop )
{
    if ( $serverListening )
    {
        closewindow npm
    }
}
