<#
    Script Sum count of logins per/month from CSV file format:
        PLAYER_ID,LAST_LOGIN_DATE
        0001172108,2017-02-01 03:31:27

// Use with \Projects\igt\pd\branches\sql\list-contract_identity, last login_date.sql'
//  1000006528,2020-12-04 11:43:33.148000
//  1000006529,2020-12-09 12:51:15.783000
//  2000000000,2020-09-17 15:56:02.782000

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

if ($h -or $help) {showHelp}
if (-not($csvfile)) {showHelp}

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

#initialize maps:
foreach ($year in $years)
{
    foreach ($monthName in $MonthNames)
    {
        $monthMap = @{$monthName = [int]0; }
        $key = mkYearMonthKey $year $monthName
        $yearMonthMap.Add($key, $monthMap)
    }
}

function buildStatistics($csvObject)
{
    [boolean] $somethingToReport = $false

    # Go through the CSV object mapping year, month, count to objects:
    foreach ($item in $csvObject)
    {
        $year = $item.LAST_LOGIN_DATE.Split('-')[0]
        $month = $item.LAST_LOGIN_DATE.Split('-')[1]
        $monthName = convertNumToMonthname $month
        $ymMapKey = mkYearMonthKey $year $monthName
        $itsMonthMap = $yearMonthMap[$ymMapKey]
        if ($itsMonthMap)
        {
            $somethingToReport = $true
            $itsMonthMap[$monthName] += 1
            $yearMonthMap[$ymMapKey] = $itsMonthMap
        }
    }

    return $somethingToReport
}

function produceReport([boolean]$somethingToReport)
{
    if ($somethingToReport)
    {
        "{0},{1},{2}" -f 'YEAR', 'MONTH', 'LOGIN_COUNT'
        # Report the findings:
        foreach ($year in $years)
        {
            foreach ($monthName in $MonthNames)
            {
                $ymMapKey = mkYearMonthKey $year $monthName

                foreach ($monthMap in $yearMonthMap[$ymMapKey])
                {
                    $loginCount = $monthMap[$monthName]

                    if ($loginCount -gt 0)
                    {
                        "{0},{1},{2}" -f $year, $monthName, $loginCount
                    }
                }
            }
        }
    }
}

produceReport (buildStatistics $csvObj)
