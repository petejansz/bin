<#
    Parse DLV_NOTIFICATION_REQUESTS.extra_parameters text

    1. Copy DLV_NOTIFICATION_REQUESTS.extra_parameters text to clipboard.
    2. Run this command to parse the text

    Author: Pete Jansz, IGT, Aug 2017
#>

param
(
    [switch]    $clip,
    [switch]    $ls,
    [switch]    $token,
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
    Write-Output "USAGE: $ScriptName [-clip] <-ls | -token>"
    Write-Output "  option"
    exit 1
}

echo $ls
if ($h -or $help) {showHelp}
if ($ls -eq $null -and $token -eq $null)  {showHelp}
if ($clip)
{
    $inputText = Get-Clipboard
}
else
{   # Read stdin
    $inputText = $input
}

if (-not($inputText) -or ($inputText.length -lt 1)) {exit 1}

$map = @{}

foreach ($item in $inputText.split(';'))
{
    if ($ls)
    {
        $key = $item.split('=')[0]
        $value = $item.split('=')[1]
        $map.Add($key, $value)
    }

    if ($token)
    {
        if ($item -match "^token=")
        {
            $code = $item.split('=')[1]
            $code
            break;
        }
    }
}

if ($ls)
{
    $map | ConvertTo-Json -Depth 100
}