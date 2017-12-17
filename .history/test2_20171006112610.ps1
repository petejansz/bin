<#
    Script Sum count of logins per/month from CSV file format:
        PLAYER_ID,LAST_LOGIN_DATE
        0001172108,2017-02-01 03:31:27
    Author: Pete Jansz, IGT, Oct 2017
#>

param
(
    [string]$csvfile,
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
    Write-Host "USAGE: ${scriptName} [options] -csvfile <csvfile>"
    exit 1
}

$csvfile = $env:USERPROFILE + '/Documents/pd/california/apl/emailVerified-2ndchance-last_login_date.csv';
$MonthNames = @('JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', "AUG", "SEP", "OCT", "NOV", "DEC");
$csvObj = import-csv $csvFile
$years = @()
$yearMonthMap = @{}

function convertNumToMonthname([int] $num)
{
    return $MonthNames[$num - 1]
}

function mkYearMonthKey ($year, $monthName)
{
    return [string]$year + ":" + $monthName
}

# Initialize lists, map objects.
# get unique years:
foreach ($item in $csvObj)
{
    $years += $item.LAST_LOGIN_DATE.Split('-')[0]
}

$years = $years | Sort-Object -Unique
$years
