<#
    For a given gateway, change password in putty-cm.dat file
    Author: Pete Jansz, IGT, 2019-09-09
#>

param
(
    [string]    $oldpassword,
    [string]    $newpassword,
    [string]    $gateway,
    [switch]    $stdout,
    [switch]    $update,
    [switch]    $help,
    [switch]    $h
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off
$whereWasI = $pwd
$exitCode = 1

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception)
    Set-Location $whereWasI
}

$configFile = Get-ChildItem "$env:USERPROFILE\apps\PuttyCM\putty-cm.dat"
$ScriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Host "For a given gateway, change password in putty-cm.dat file"
    Write-Host "Only update config file, write xml to stdout if config xml changed"
    Write-Host "USAGE: $ScriptName [option] -gateway < rengw1 | rengw2 | rengw3 > -oldpassword <oldpassword> -newpassword <newpassword>"
    Write-Host "  [option]"
    Write-Host "      -stdout     # Write XML to stdout"
    Write-Host ("      -update     # Backup, update (overwrite) {0}" -f $configFile.FullName )
    exit $exitCode
}

function backup-file( $file )
{
    $targetPath = "$env:USERPROFILE\OneDrive - IGT PLC\backup\"
    $backupfilename = "{0}\{1}-{2}.txt" -f $targetPath, $file.Name, (Get-Date  -format "yyyy-MM-dd-HH-mm-ss")
    Copy-Item $file.FullName $backupfilename
}

if ( $h -or $help )  { showHelp }
if ( -not $gateway ) { showHelp }
if ( $gateway -cnotmatch "^rengw[1-3]{1}$") { showHelp }
if ( -not $oldpassword ) { showHelp }
if ( -not $newpassword ) { showHelp }

[xml]$configXml = Get-Content $configFile
$xmlChanged = $false

foreach ($connection in $configXml.selectNodes( "//connection" ))
{
    if ($connection.connection_info.host -ceq $gateway -and $connection.login.password -ceq $oldpassword )
    {
        $xmlChanged = $true
        $connection.login.password = $newpassword
    }

    foreach ($cmd in $connection.command.command3)
    {
        if ( $cmd -ceq $oldpassword )
        {
            $xmlChanged = $true
            $connection.command.command3 = $newpassword
        }
    }
}

if (-not $xmlChanged )
{
    Write-Host "No match found: gateway='${gateway}', oldpassword='${oldpassword}'"
    exit $exitCode
}

if ( $configXml -and $update -and $xmlChanged )
{
    backup-file $configFile
    #Over-write original config file:
    $configXml.Save( $configFile )
    $exitCode = 0
}

if ( $configXml -and $stdout -and $xmlChanged )
{
    $tempFile = New-TemporaryFile
    $configXml.Save( $tempFile.FullName )
    Get-Content $tempFile
    Remove-Item $tempFile
    $exitCode = 0
}

exit $exitCode
