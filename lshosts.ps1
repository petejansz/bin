param
(
    [string]    $hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts",
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
    Write-Output "USAGE: $ScriptName [option]"
    Write-Output "  option"
    Write-Output "    -hostsFile [filename] # Default=$hostsFile"
    exit 1
}

if ($h -or $help) {showHelp}

class HostClass
{
    [string] $Name
    [string] $IPAddress
    [string] $Description

    HostClass($IPAddress, $name='', $description='')
    {
        $this.IPAddress = $IPAddress.trim()
        $this.name = $name.trim()
        $this.description = $description.trim()
    }

    [string] ToString()
    {
        return $this.name, $this.IPAddress, $this.description
    }
}

$hosts = @()

foreach ($line in (Get-Content $hostsFile))
{
    if ($line -notmatch "^#|^$")
    {
        $IPAddress, $name = [regex]::split($line.trim(), '\s+')
        if ($null -eq $IPAddress -or $null -eq $name)
        {
            continue
        }

        $description = ''
        if ($IPAddress -and $name -and $line -match '#')
        {
            $description = [regex]::split($line.trim(), '#')[1]
        }

        $ahost = [HostClass]::new($IPAddress, $name, $description)
        $hosts += $ahost
    }
}

$hosts | Sort-Object -Property Name
