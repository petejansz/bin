<#
    Report time-diff in seconds between adjacent log statements, statement(N+1 -N), e.g.,
2018-06-23:06:33:28 login-archiver.sh: Archive pass: 95
2018-06-23:06:37:37 login-archiver.sh: Archive pass: 96

or DB2 history log:
4-16-2020 05:10:28
4-16-2020 05:10:30
4-16-2020 05:10:33
#>

param
(
    [string]$file,
    [switch]$help,
    [switch]$h
)

. lib-general.ps1

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
$ScriptName = $MyInvocation.MyCommand.Name
$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
function showHelp()
{
    Write-Host "USAGE: ${ScriptName} [options] -file <filename>"
    Write-Host "Options:"

    exit 1
}

function convertDB2HistoryTSToTime( [string] $db2HistoryTS )
{
    $tokens = $db2HistoryTS.Split()
    $mo = $tokens[0].Split('-')[0]
    $dy = $tokens[0].Split('-')[1]
    $yr = $tokens[0].Split('-')[2]
    $log4JDT = "{0}-{1}-{2} {3}" -f $yr, $mo, $dy, $tokens[1]
    $time = convertLog4JDateToDateTime $log4JDT
    return $time
}

if ($h -or $help) { showHelp }
if ( -not($file) ) { showHelp }

New-Variable -Name Log4JDateRegEx -Option ReadOnly -Value '^20[0-9]{2}-[0-9]{2}-[0-9]{2}'
New-Variable -Name TimeRegEx -Option ReadOnly -Value '[0-9]{2}:[0-9]{2}:[0-9]{2}'
New-Variable -Name DateFormat -Option ReadOnly -Value 'yyyy-MM-dd hh:mm:ss'
New-Variable -Name DB2HistoryRegEx -Option ReadOnly -Value ('^[0-9]{2}-[0-9]{2}-[0-9]{4} ' + $TimeRegEx)

$times = @() # Array of System.DateTime

foreach ($line in (Get-Content $file))
{
    if ($line -match "${DB2HistoryRegEx}")
    {
        $times += convertDB2HistoryTSToTime $line
    }
    elseif ($line -match "${Log4JDateRegEx}.${TimeRegEx}")
    {
        $times += convertLog4JDateToDateTime $line
    }
}

for ($i = 0; $i -lt $times.Length; $i++ )
{
    $current = $times[$i]
    $next = $null

    if ($i + 1 -lt $times.Length)
    {
        if ($times[$i + 1] -ne $current)
        {
            $next = $times[$i + 1]
        }
    }

    if ($null -ne $next)
    {
        $difference = ($next.Ticks - $current.Ticks) #/ 60000
        if ($difference -gt 1)
        {
            $delta = [System.Math]::Round($difference, 2)
            Write-Output ("{0}: {1} {2} {3}" -f $file, (Get-Date $current -Format $DateFormat), (Get-Date $next -Format $DateFormat), $delta)
        }
    }
}
