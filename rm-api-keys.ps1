<#
    Remove ESA api-keys from jboss-env-config.xml files
    Author: Pete Jansz, IGT, 2019-04-03
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
    Write-Output "USAGE: $ScriptName [option] -configfile <jboss-env-config.xml> -keyfile <text file>"
    Write-Output "  [option]"
    Write-Output "      -stdout     # Write XML to stdout"
    Write-Output "      -update     # Uptdate (overwrite) configfile"
    exit 1
}

if ($h -or $help) { showHelp }
if ( -not($configfile) -or -not ($keyfile ) )
{
    showHelp
}

function removeKeys([string]$configFilename, [string]$keyFile) # xmlObject
{
    $xmlObj = New-Object -TypeName XML
    $xmlObj.Load($configFilename)
    $keys = Get-Content $keyFile
    $apiKeys = $xmlObj.config.applications.mobile.apikeys

    foreach ($signature in $keys)
    {
        foreach ($apiKey in $apiKeys.apiKey)
        {
            if ($apikey.signatureKey -eq $signature.Trim())
            {
                $apiKeys.RemoveChild($apiKey) | Out-Null
            }
        }
    }

    return $xmlObj
}

[string]$configFilename = Resolve-Path $configfile
[string]$keyFile = Resolve-Path $keyFile
$configXml = removeKeys $configFilename $keyFile

if ( $update )
{
    # Backup original confige file:
    $backupFilename = $configFilename -replace '.xml', '.bak'
    Copy-Item $configFilename $backupFilename -Force

    # Over-write original config file:
    $configXml.Save($configFilename)
}

if ($stdout)
{
    $tempFile = New-TemporaryFile
    $configXml.Save( $tempFile.FullName )
    Get-Content $tempFile
    Remove-Item $tempFile
}
