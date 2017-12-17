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

function convertNumToMonthname([int] $num)
{
    return $MonthNames[$num - 1]
}

function mkYearMonthKey ($year, $monthName)
{
    return [string]$year + ":" + $monthName
}

$csvObj = import-csv $csvFile
$years = @()
$yearMonthMap = @{}

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

# Go through the CSV object mapping year, month, count to objects:
foreach ($item in $csvObj)
{
    $year = $item.LAST_LOGIN_DATE.Split('-')[0]
    $month = $item.LAST_LOGIN_DATE.Split('-')[1]
    $monthName = convertNumToMonthname $month
    $ymMapKey = mkYearMonthKey $year $monthName
    $itsMonthMap = $yearMonthMap[$ymMapKey]
    if ($itsMonthMap)
    {
        $itsMonthMap[$monthName] += 1
        $yearMonthMap[$ymMapKey] = $itsMonthMap
    }
}

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