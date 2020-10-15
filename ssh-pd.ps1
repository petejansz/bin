param
(
    [int] $node = 1,
    [string] $env,
    [string] $h,
    [string] $hostname,
    [switch] $help
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception)
}

$ScriptName = $MyInvocation.MyCommand.Name

$hostnames = @('crmcorea', 'boapp', 'ppapp', 'crmexta', 'hornetq', 'scapp', 'ppweb', 'boweb', 'b2cdb', 'scdb', 'scboapp') | Sort-Object
$envnames = @('apl', 'dev', 'bdc', 'cat', 'pdc', 'sit') | Sort-Object

function showHelp()
{
    # $valid_names = $environments.Keys
    Write-Host "Ssh login to a CA PD env, host"
    Write-Host "USAGE: $ScriptName [options] <args>"
    Write-Host "  <args>"
    Write-Host "      -env < $envnames >"
    Write-Host "      -h[ostname] < $hostnames >"
    Write-Host "  [options]"
    Write-Host "    -node <number (default=1)>"

    exit 1
}

function go-ssh([string]$env, [string]$hostname, [int]$node = 1)
{
    $site = 'ca'
    $gw = 'rengw2'
    $gwusername = $env:USERNAME.ToLower()
    $username = $gwusername

    if ($env -match "pdc")
    {
        $envname = ''
        $gw = 'rengw1'
    }
    elseif ($env -match "bdc")
    {
        $envname = ''
        $gw = 'rengw3'
    }
    elseif ($env -match "dev")
    {
        $gw = $null
        $username = 'pilot'
    }
    elseif ($env -match "apl")
    {
        $envname = $env
    }
    elseif ($env -match "cat")
    {
        $envname = 'cat'
    }
    elseif ($env -match "sit")
    {
        $envname = 'cat'
        $node = 2
    }

    if ($hostname -match "db")
    {
        $username = 'gtkinst1'
    }

    $sshHost = "{0}{1}{2}{3}" -f $site, $envname, $hostname, $node
    $Host.ui.RawUI.WindowTitle = $sshHost
    ssh -t -l $gwusername $gw "ssh -l $username $sshHost"
    $Host.ui.RawUI.WindowTitle = "Powershell"
}

# Validate options, args:
if ( $help ) { showHelp }
if ( -not($env) ) { showHelp }
if (-not ($h -or $hostname)) { showHelp }

if ($h) { $hostname = $h }

if (-not ($envnames.Contains($env)))
{
    Write-Host "Hostname not found: $env"
    Write-Host "Valid envnames: $envnames"
    exit 1
}

if (-not ($hostnames.Contains($hostname)))
{
    Write-Host "Hostname not found: $hostname"
    Write-Host "Valid hostnames: $hostnames"
    exit 1
}

go-ssh $env $hostname $node