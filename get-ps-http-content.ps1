<#
    From a PS Invoke-WebRequest GET response object,
    Microsoft.PowerShell.Commands.HtmlWebResponseObject, get the Content as formatted JSON text.
    Author: Pete Jansz, IGT, 2019-02-13
#>

param
(
    [string] $f,
    [switch] $quiet,
    [switch] $help
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
$whereWasI = $pwd

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception)
    Set-Location $whereWasI
}

$ScriptName = $MyInvocation.MyCommand.Name
function showHelp()
{
    Write-Output "From a PS Invoke-WebRequest GET response object, Microsoft.PowerShell.Commands.HtmlWebResponseObject"
    Write-Output ", write Content child object as formatted JSON string"
    Write-Output "USAGE: $ScriptName [option] "
    Write-Output "  [option]"
    Write-Output "      -f <filename> # Write JSON to filename"
    Write-Output "      -quiet        # Default=write to stdout"
    exit 1
}

if ($help) {showHelp}

$jsonBody = $input.content  | format-json.js
if ($f)
{
    $jsonBody | Out-File -Force -Encoding UTF8 $f
    if (-not $quiet) { Write-Output $jsonBody }
}
else
{
    Write-Output $jsonBody
}
