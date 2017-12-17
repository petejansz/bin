<#
    Script to test emailavailable false, rename username-email and confirm emailavailble to be true
    Author: Pete Jansz
#>

param
(
    [int]$id,
    [string]$origUsername,
    [string]$password = "RegTest6100",
    [string]$secGwHost = "cadev1",
    [int]$secGwPort = 80,
    [string]$pdCrmProcessesHost = "localhost",
    [int]$pdCrmProcessesPort = 8180,
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
    Write-Host "USAGE: ${ScriptName} [options] -id <contract_identity] -origUsername <origUsername>"
    Write-Host "Options:"
    Write-Host "  -secGwHost <hostname>             default = cadev1"
    Write-Host "  -secGwPort <port>                 default = 80"
    Write-Host "  -pdCrmProcessesHost <hostname>    default = localhost"
    Write-Host "  -pdCrmProcessesPort <port>        default = 8180"
    Write-Host "  -username <username>"
    Write-Host "  -password <password>              default = RegTest6100"

    exit 1
}

if ($h -or $help)    {showHelp}
if ( -not($id) -or -not($origUsername) ) {showHelp}

$origUsername = $origUsername.Trim()

$emailAvailable = pdplayer -hostname $secGwHost -port $secGwPort -emailavailable $origUsername

if (-not ($emailAvailable) )
{
    (pdplayer -hostname $secGwHost -port $secGwPort -getpersonalinfo -username $origUsername -password $password |convertfrom-json).emails
    Write-Output "processes-close-account.js $id $pdCrmProcessesHost $pdCrmProcessesPort ..."
    processes-close-account.js $id $pdCrmProcessesHost $pdCrmProcessesPort
    $emailAvailable = pdplayer -hostname $secGwHost -port $secGwPort -emailavailable $origUsername
    Write-Output "Email available ${origUsername}: $emailAvailable"
}

