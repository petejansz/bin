<#
    Add, remove, list ESA api-keys to/from jboss-env-config.xml file
    Author: Pete Jansz, IGT, 2019-04-03
#>

param
(
    [switch]    $addKeys,
    [switch]    $lsKeys,
    [switch]    $rmKeys,
    [string]    $configfile,
    [string]    $keyFile,
    [switch]    $quiet,
    [switch]    $stdout,
    [switch]    $update,
    [switch]    $help,
    [switch]    $h
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug  -Off
$whereWasI = $pwd

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception)
    Set-Location $whereWasI
}

$ScriptName = $MyInvocation.MyCommand.Name
function showHelp()
{
    Write-Host "Add or remove ESA api-keys to/from jboss-env-config.xml file"
    Write-Host "Only update config file, write xml to stdout if config xml changed"
    Write-Host "USAGE: $ScriptName [option] <function> -configfile <jboss-env-config.xml> -keyfile <text file>"
    Write-Host "  [function] -addKeys | -rmKeys | -lsKeys"
    Write-Host "  [option]"
    Write-Host "      -lsKeys     # List/write keys to stdout"
    Write-Host "      -quiet      # Don't tell me what your'e doing"
    Write-Host "      -stdout     # Write XML to stdout"
    Write-Host "      -update     # Backup, update (overwrite) configfile"
    exit 1
}

if ( $h -or $help ) { showHelp }
if ( -not ( $addKeys -xor $lsKeys -xor $rmKeys ) ) { showHelp }
if ( -not $configfile ) { showHelp }
if ( (-not $keyFile) -and ($addKeys -or $rmKeys) ) {showHelp}


function speak( [string] $msg )
{
    if (-not ($quiet))
    {
        Write-Host $msg
    }
}
function dateNow()
{
    return Get-Date (Get-Date) -format "yyyy-MM-dd"
}

function createEnvConfigKeyAsString ($key)
{
    $str = "<api-key key=`"{0}`" />" -f $key
    return $str
}

function keyInnerText($index)
{
    $text = "Android or iOS App {0} {1}" -f (dateNow), $index
    return $text
}

function listKeys( [string]$configFilename )
{
    (Select-Xml $configFilename -xpath "//apikey").Node
}

function addKeys( [string]$configFilename, [string]$keyFile ) # $xmlObj or $null if no changes
{
    $configContents = Get-Content $configFilename
    $xmlObj = New-Object -TypeName XML
    $xmlObj.Load($configFilename)
    $keys = Get-Content $keyFile
    $count = 0
    $xmlChanged = $false

    foreach ($newApiKeyValue in $keys)
    {
        $count++

        $keyExists = $configContents | Select-String -Quiet -Pattern $newApiKeyValue -SimpleMatch

        if ( -not ( $keyExists ) )
        {
            speak ("Adding " + $newApiKeyValue)
            $apikeyElem = $xmlObj.CreateElement("apikey")
            $keyElem = $xmlObj.CreateElement("key")
            $keyElem.set_InnerText((keyInnerText $count)) | Out-Null
            $signaturekey = $xmlObj.CreateElement("signaturekey")
            $signaturekey.set_InnerText($newApiKeyValue) | Out-Null
            $apikeyElem.AppendChild($keyElem) | Out-Null
            $apikeyElem.AppendChild($signaturekey) | Out-Null
            $xmlObj.config.applications.mobile.apikeys.AppendChild($apikeyElem) | Out-Null
            $xmlChanged = $True
        }
    }

    if ((-not $xmlChanged))
    {
        Remove-Item $xmlObj -force -erroraction silentlycontinue
        $xmlObj = $null
    }

    return $xmlObj
}
function removeKeys( [string]$configFilename, [string]$keyFile ) # xmlObj or $null if no changes
{
    $xmlObj = New-Object -TypeName XML
    $xmlObj.Load($configFilename)
    $keys = Get-Content $keyFile
    $apiKeys = $xmlObj.config.applications.mobile.apikeys
    $xmlChanged = $false

    foreach ($signature in $keys)
    {
        foreach ($apiKey in $apiKeys.apiKey)
        {
            if ($apikey.signatureKey -eq $signature.Trim())
            {
                speak ("Removing " + $apikey.signatureKey)
                $apiKeys.RemoveChild($apiKey) | Out-Null
                $xmlChanged = $true
            }
        }
    }

    if ((-not $xmlChanged))
    {
        Remove-Item $xmlObj  -force -erroraction silentlycontinue
        $xmlObj = $null
    }

    return $xmlObj
}

[string]$configFilename = Resolve-Path $configfile
$configXml = $null

if ($addkeys -and $configfile -and $keyFile)
{
    [string]$keyFile = Resolve-Path $keyFile
    $configXml = addKeys $configFilename $keyFile
}
elseif ($rmKeys -and $configfile -and $keyFile)
{
    [string]$keyFile = Resolve-Path $keyFile
    $configXml = removeKeys $configFilename $keyFile
}
elseif ($lsKeys -and $configfile)
{
    listKeys $configFilename
}
else
{
    showHelp
}

if ( $configXml -and $update )
{
    # Backup original confige file:
    $backupFilename = $configFilename -replace '.xml', '.bak'
    Copy-Item $configFilename $backupFilename -Force

    # Over-write original config file:
    $configXml.Save($configFilename)
}

if ( $configXml -and $stdout )
{
    $tempFile = New-TemporaryFile
    $configXml.Save( $tempFile.FullName )
    Get-Content $tempFile
    Remove-Item $tempFile
}
