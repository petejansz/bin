<#
    Report time-diff in seconds between adjacent log statements, statement(N+1 -N), e.g.,
2018-06-23:06:33:28 login-archiver.sh: Archive pass: 95
2018-06-23:06:37:37 login-archiver.sh: Archive pass: 96
2018-06-23:06:41:43 login-archiver.sh: Archive pass: 97
2018-06-23:06:45:27 login-archiver.sh: Archive pass: 98
2018-06-23:06:49:18 login-archiver.sh: Archive pass: 99
2018-06-23:06:53:11 login-archiver.sh: Archive pass: 100
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

if ($h -or $help) { showHelp }
if ( -not($file) ) { showHelp }

New-Variable -Name DateRegEx -Option ReadOnly -Value '^20[0-9]{2}-[0-9]{2}-[0-9]{2}'
New-Variable -Name TimeRegEx -Option ReadOnly -Value '[0-9]{2}:[0-9]{2}:[0-9]{2}'
$times = @() # Array of System.DateTime

foreach ($line in (Get-Content $file))
{
    if ($line -match "${DateRegEx}.${TimeRegEx}")
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
