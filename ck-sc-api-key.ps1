# Check, validate, test ESA api-keys.
# Author: Pete Jansz, IGT 2018
param
(
    [string]    $proto,
    [string]    $hostname,
    [string]    $apipath = "second-chance/site", #"players/self/attributes", #
    [string]    $keyFile,
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
    Write-Host "Check, validate, test ESA api-keys"
    Write-Host "USAGE: $ScriptName [option] -proto <http|https> -hostname <hostname> -keyfile <xml or text file>"
    Write-Host "  [option]"
    Write-Host "      -apipath <path> # Default = ${apipath}"
    exit 1
}

if ($h -or $help) {showHelp}
if (-not($proto)) {showHelp}
if (-not($hostname)) {showHelp}
if (-not($keyfile)) {showHelp}
function createHeader($apiKey)
{
    $header = @{                                `
            'Content-Type'   = 'application/json'    ; `
            'cache-control'  = 'no-cache'            ; `
            'x-ex-system-id' = 8             ; `
            'x-channel-id'   = 3              ; `
            'x-site-id'      = 35               ; `
            'X-ESA-API-KEY'  = $apiKey   ; `

    }

    return $header
}

$uri = "{0}://{1}/api/v1/{2}" -f $proto, $hostname, $apipath
if ($keyFile -match "`.xml$")
{
    $keys = (select-xml $keyFile -xpath "//apikey").Node.signaturekey
}
else
{
    $keys = Get-Content $keyFile
}

foreach ($apiKey in $keys)
{
    Write-Output $apiKey
    $header = createHeader $apiKey
    $response = Invoke-WebRequest -uri $uri -Method GET -Headers $header
}