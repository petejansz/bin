# Check, validate, test ESA api-keys.
# Author: Pete Jansz, IGT 2018
param
(
    [string] $proto,
    [string] $hostname,
    [string] $h,
    [string] $password = "Password1",
    [string] $p = "Password1",
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

$devApiPath = "players/self/attributes"
$prodApiPath = "second-chance/site"
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
    exit 1
}

if ( $help ) { showHelp }
if (-not($proto)) { showHelp }
if (-not ($h -or $hostname)) { showHelp }
if (-not($keyfile)) { showHelp }
if ($h) { $hostname = $h }
if ($p) { $password = $p }
if ($u) { $username = $u }

. lib-register-ca-player.ps1

function createHeader2($apiKey, $oauthToken)
{
    $header = @{                                        `
            'content-type'   = 'application/json'       ; `
            'cache-control'  = 'no-cache'               ; `
            'authorization'  = ("OAuth " + $oauthToken) ; `
            'x-ex-system-id' = 8                        ; `
            'x-channel-id'   = 3                        ; `
            'x-site-id'      = 35                       ; `
            'x-esa-api-key'  = $apiKey                  ; `

    }

    return $header
}

# Defaults:
$port = 80
$apipath = $devApiPath

if ( $proto -match "https" )
{
    $port = 443
    $apipath = $prodApiPath
}

$uri = "{0}://{1}/api/v1/{2}" -f $proto, $hostname, $apipath

if ( $keyFile -match "`.xml$" )
{
    $keys = (Select-Xml $keyFile -xpath "//apikey").Node.signaturekey
}
else
{
    $keys = Get-Content $keyFile
}

$oauthToken = login $hostname $port $username $password

foreach ( $apiKey in $keys )
{
    Write-Output $apiKey
    $header = createHeader2 $apiKey $oauthToken
    Invoke-WebRequest -uri $uri -Method GET -Headers $header | Out-Null
}