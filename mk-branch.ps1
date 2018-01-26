param
(
    [string]$src,    #, e.g., "https://156.24.30.205/svn/gga-src/pd-sites/tags/cpd_all_2_0_15_14"
    [string]$newbranch, #, e.g., "https://156.24.30.205/svn/gga-src/pd-sites/branches/cpd_all_2_0_15_15_branch"
    [string]$msg,
    [switch]$help,
    [switch]$h
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
#Set-PSDebug -Trace 2

$ScriptName = $MyInvocation.MyCommand.Name
$ScriptDir = Split-Path $MyInvocation.MyCommand.Path

function showHelp()
{
    Write-Host "USAGE: ${ScriptName} [options] -src <svn-repo-uri> -newbranch <svn-repo-uri> -msg <text>"
    exit 1
}

if ($h -or $help)   {showHelp}
if (-not($src)) {showHelp}
if (-not($newbranch))  {showHelp}
if (-not($msg))  {showHelp}

svn cp $src $newbranch -m $msg
