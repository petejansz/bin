<#
    Help build, deploy CAP site and manage servers.
    Author: Pete Jansz, IGT, Nov 2019
#>

param
(
    [switch]    $scheduler,
    [switch]    $solr,
    [switch]    $jboss,
    [switch]    $navigator,
    [switch]    $casdb,
    [switch]    $site,
    [switch]    $build,
    [switch]    $deploy,
    [switch]    $restart,
    [switch]    $notest,
    [switch]    $stop,
    [switch]    $start,
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
# $site = 'cal'
$env:DB2CLP = 'DB20FADE'
$env:DB2INSTANCE = 'DB2'
$env:DB2PATH = 'C:\Program Files\IBM\SQLLIB'
$CAP_HOME = "$env:USERPROFILE/Documents/Projects/igt/aurora/cap/cas-ps"

function showHelp()
{
    Write-Output "USAGE: $ScriptName [option] -solr -scheduler | -site | -jboss | -navigator -casdb"
    Write-Output "  option"
    Write-Output "    -site              # Build entire SITE code"
    Write-Output "    -build"
    Write-Output "    -notest"           # Skip JUnit tests
    Write-Output "    -deploy            # Deploy WAR to local server container"
    Write-Output "    -restart"
    Write-Output "    -start"
    Write-Output "    -stop"
    exit 1
}

if ($h -or $help) { showHelp }
if ( -not($build) -and -not($deploy) -and -not($restart) -and -not($start) -and -not($stop) )
{ showHelp }

if (-not $env:JBOSS_HOME)
{
    Write-Warning 'Not defined: $env:JBOSS_HOME'
    exit 1
}

class ServerClass
{
    [string] $shortname
    [string] $startFilename
    [string] $mainWindowTitle
    [int] $port

    ServerClass([string] $shortname, [string] $startFilename, [string] $mainWindowTitle)
    {
        $this.shortname = $shortname
        $this.startFilename = $startFilename
        $this.mainWindowTitle = $mainWindowTitle
        $this.port = $this.mainWindowTitle.split()[0].split(':')[1]
    }

    isRunning()
    {
        Test-NetConnection -InformationLevel quiet -Port $this.port -ComputerName localhost -WarningAction silentlyContinue
    }

    stop()
    {
        try
        {
            $pid = ((netstat -ano | grep $this.port) -replace "  ", '').split()[2]
            Write-Warning $pid
            Stop-Process -force -id $pid
        }
        catch { }
    }

    start()
    {
        if ( -not (Test-NetConnection -InformationLevel quiet -Port $this.port -ComputerName localhost -WarningAction silentlyContinue ))
        {
            Start-Process -PassThru -FilePath $this.startFilename
        }
    }
}

function manageServers()
{
    $schedulerServer = [ServerClass]::new('scheduler', 'jboss_init_crm-core.bat', 'crm-core:8280 - run.bat -b 0.0.0.0 -c crm-core')

    if ($core)
    {
        if ($stop ) { $coreServer.stop() }
        if ($start -or $restart) { $coreServer.start() }
    }
}

function deployArtifact()
{
    # Set-Location $CAP_HOME
    Get-ChildItem -file ps-api.war -r -path $CAP_HOME | ForEach-Object { Copy-Item -force $_.FullName $env:jboss_home\cal\deployments\. }
}

function doSolr()
{
    $solar_home = "${env:USERPROFILE}\Documents\Projects\igt\solr-6.6.5"

    if ($start)
    {
        & "${solar_home}\bin\solr.cmd" -s solr_cas -cloud '-Des.configuration=c:/etc/igt/cas-navigator' `
            #  -a '-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=1044'
    }

    if ($stop)
    {
        & "${solar_home}\bin\solr.cmd" stop -all
    }
}

function buildSite()
{
    Set-Location $CAP_HOME
    if ( $notest )
    {
        mvn -DskipTests=true clean install
    }
    else
    {
        mvn clean install
    }
}

function doCasdb()
{
    if ( $build )
    {
        Set-Location $CAP_HOME/ps-db-liquibase

        if ( -not $site )
        {
            mvn clean install
        }

        if ($?)
        {
            Set-Location /opt/cas-core-db-coordinator/core-db-coordinator-build
            ./alter-all.bat
        }
    }
}

if ( $solr ) { doSolr }
if ( $scheduler -and $start) { scheduler.cmd }
if ( $site -and $build ) { buildSite }
if ( $casdb ) { doCasdb }
if ( $? -and $deploy ) { deployArtifact }
if ( $? -and $jboss -and ( $restart -or $start ) ) { cap-jboss.cmd }
if ( $navigator -and $start ) { navigator.cmd }

Set-Location $whereWasI
