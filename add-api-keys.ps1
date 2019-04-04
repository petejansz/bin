<#
    Add ESA api-keys to jboss-env-config.xml files.
    Author: Pete Jansz, IGT, 2018-05-29
#>

param
(
    [string]    $configfile,
    [string]    $keyFile,
    [switch]    $stdout,
    [switch]    $envConfigKeys,
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
    [Console]::Error.WriteLine($_.Exception)
    Set-Location $whereWasI
}

$ScriptName = $MyInvocation.MyCommand.Name
function showHelp()
{
    Write-Output "USAGE: $ScriptName [option] -configfile <jboss-env-config.xml> -keyfile <text file>"
    Write-Output "  [option]"
    Write-Output "      -envConfigKeys  Write env-config/*-mobile.xml api-key element to stdout"
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

function createEnvConfigKeyAsString ($key)
{
    $str = "<api-key key=`"{0}`" />" -f $key
    return $str
}

$configfile = Resolve-Path $configfile
$keyFile = Resolve-Path $keyFile

$configContents = Get-Content $configfile
$xml = New-Object -TypeName XML
$xml.Load($configfile)
$keys = Get-Content $keyFile
$count = 0
$doUpdate = $false
# $xml.config.applications.mobile.apikeys.apikey[0].key
# $xml.config.applications.mobile.apikeys.apikey[0].signaturekey

foreach ($newApiKeyValue in $keys)
{
    $count++

    if ($envConfigKeys)
    {
        Write-Output( "<api-key key=`"{0}`" />" -f $newApiKeyValue )
    }

    $expression = "//signaturekey[.=`'{0}`']" -f $newApiKeyValue
    $keyExists = $configContents | Select-String -Quiet -Pattern $newApiKeyValue

    if ( -not ($keyExists ) )
    {
        $doUpdate = $True
        $apikeyElem = $xml.CreateElement("apikey")
        $keyElem = $xml.CreateElement("key")
        $keyElem.set_InnerText((keyInnerText $count)) | Out-Null
        $signaturekey = $xml.CreateElement("signaturekey")
        $signaturekey.set_InnerText($newApiKeyValue) | Out-Null
        $apikeyElem.AppendChild($keyElem) | Out-Null
        $apikeyElem.AppendChild($signaturekey) | Out-Null
        $xml.config.applications.mobile.apikeys.AppendChild($apikeyElem) | Out-Null
    }
}

$encoding = New-Object System.Text.UTF8Encoding($true)
$tempFile = New-TemporaryFile
$strWriter = New-Object System.IO.StreamWriter($tempFile, $false, $encoding)
$xml.Save($strWriter)
$strWriter.Close()

if ($stdout)
{
    Get-Content $tempFile
}

if ($doUpdate -and $update)
{
    # Backup original confige file:
    $backupFilename = $configfile -replace '.xml', '.bak'
    Copy-Item $configfile $backupFilename -Force
    Remove-Item $tempFile
}
