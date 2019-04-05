# Check, validate, test ESA api-keys.
# Author: Pete Jansz, IGT 2018
param
(
    [string] $proto,
    [string] $hostname,
    [string] $h,
    [string] $password = "Password1",
    [string] $p = "Password1",
    [string] $apipath = "second-chance/site",
    [string] $keyFile,
    [switch] $help,
    [string] $username,
    [string] $u
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception)
}

$ScriptName = $MyInvocation.MyCommand.Name
function showHelp()
{
    Write-Host "Check, validate, test ESA api-keys"
    Write-Host "USAGE: $ScriptName [options] <args>"
    Write-Host "  <args>"
    Write-Host "      -proto <http|https>"
    Write-Host "      -h[ostname] <host>"
    Write-Host "      -u[sername] <username>"
    Write-Host "      -p[assword] <password default=${password}>"
    Write-Host "      -keyfile <jboss-env-config.xml or text file>"
    Write-Host "  [options]"
    Write-Host "      -apipath <path> # Default = ${apipath}"
    exit 1
}

if ( $help ) { showHelp }
if (-not($proto)) { showHelp }
if (-not ($h -or $hostname)) { showHelp }
if (-not($keyfile)) { showHelp }
if ($h) { $hostname = $h }
if ($p) { $password = $p }
if ($u) { $username = $u }


function createHeader($apiKey, $oauthToken)
{
    $header = @{                                `
            'Content-Type'   = 'application/json'    ; `
            'cache-control'  = 'no-cache'            ; `
            'authorization'  = ("OAuth " + $oauthToken) ; `
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

$port = 80
if ($proto -match "https")
{$port = 443}

$oauthToken = pdplayer -h $hostname -port $port -logintoken $username -password $password

foreach ($apiKey in $keys)
{
    Write-Output $apiKey
    $header = createHeader $apiKey $oauthToken
    $response = Invoke-WebRequest -uri $uri -Method GET -Headers $header
}