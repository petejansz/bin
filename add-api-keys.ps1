<#
    Add ESA api-keys to jboss-env-config.xml files.
    Author: Pete Jansz, IGT, 2018-05-29
#>

param
(
    [string]    $configfile,
    [string]    $keyFile,
    [switch]    $stdout,
    [switch]    $update,
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
    Write-Output "USAGE: $ScriptName [option] -configfile <xml configfile> -keyfile <text file>"
    Write-Output "  [option]"
    Write-Output "      -stdout     # Write XML to stdout"
    Write-Output "      -update     # Uptdate (overwrite) configfile"
    exit 1
}

function dateNow()
{
    return get-date (get-date) -format "yyyy-MM-dd"
}

function keyInnerText($index)
{
    $text = "Android or iOS App {0} {1}" -f (dateNow), $index
    return $text
}

if ($h -or $help) {showHelp}
if ( -not($configfile) -or -not ($keyfile ) )
{
    showHelp
}

$configfile = Resolve-Path $configfile
$keyFile = Resolve-Path $keyFile

[xml] $xml = (Get-Content $configfile)
$keys = Get-Content $keyFile
$count = 0
# $xml.config.applications.mobile.apikeys.apikey[0].key
# $xml.config.applications.mobile.apikeys.apikey[0].signaturekey

foreach ($newApiKeyValue in $keys)
{
    $count++
    $apikeyElem = $xml.CreateElement("apikey")
    $keyElem = $xml.CreateElement("key")
    $keyElem.set_InnerText((keyInnerText $count)) | Out-Null
    $signaturekey = $xml.CreateElement("signaturekey")
    $signaturekey.set_InnerText($newApiKeyValue) | Out-Null
    $apikeyElem.AppendChild($keyElem) | Out-Null
    $apikeyElem.AppendChild($signaturekey) | Out-Null
    $xml.config.applications.mobile.apikeys.AppendChild($apikeyElem) | Out-Null
}

$tempFile = New-TemporaryFile
$xml.Save($tempFile)

if ($stdout)
{
    Get-Content $tempFile
}

if ($update)
{
    Move-Item -force $tempFile $configfile
}
