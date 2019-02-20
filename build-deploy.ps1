<#
    Help build, deploy various california EAR, WAR files and manage servers.
    Author: Pete Jansz, IGT, June 2017
#>

param
(
    [switch]    $broker,
    [switch]    $ca,
    [switch]    $core,
    [switch]    $pdadmin,   # default build only war
    [switch]    $ear,       # also build pdadmin ear
    [switch]    $ext,
    [switch]    $proc,
    [string]    $caVersion,
    [string]    $caHome,
    [string]    $pd2Home,
    [switch]    $build,
    [switch]    $deploy,
    [switch]    $push,
    [switch]    $pd2,
    [switch]    $restart,
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
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

$ScriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Output "USAGE: $ScriptName [option] -broker | -core | -ext | -pdadmin [-ear] | -proc"
    Write-Output "  option"
    Write-Output "    -ca                # Build entire CA"
    Write-Output '    -caVersion <version> default = $env:CA_VERSION'
    Write-Output "    -caHome    <path>"
    Write-Output "    -ear               # Also build pd-admin EAR"
    Write-Output "    -pd2Home   <path>"
    Write-Output "    -build             # Build EAR/WAR file"
    Write-Output "    -deploy            # Deploy to local server container"
    Write-Output "    -pd2               # Build entire PD2"
    Write-Output "    -push              # Push to remote dev host"
    Write-Output "    -restart           # Restart each JBoss server"
    Write-Output "    -start             # Start each JBoss server"
    Write-Output "    -stop              # Stop each JBoss server"
    exit 1
}

if ($h -or $help) {showHelp}
if ( -not($core) -and -not($pdadmin) -and -not($proc) -and -not($ca) -and -not($pd2) -and -not($broker) -and -not($ext)) {showHelp}
if ( -not($build) -and -not($deploy) -and -not($push) -and -not($restart) -and -not($start) -and -not($stop) )
{showHelp}

if (-not $env:JBOSS_HOME)
{
    Write-Warning 'Not defined: $env:JBOSS_HOME'
    exit 1
}

if (-not ($caVersion))
{
    if ( $env:CA_VERSION )
    {
        $caVersion = $env:CA_VERSION
    }
    else
    {
        Write-Warning 'Not defined: $env:CA_VERSION'
        exit 1
    }
}
if (-not ($caHome -and (Test-Path $caHome )))
{
    $caHome = $env:CA
}

if (-not ($pd2Home -and (Test-Path $pd2Home )))
{
    $pd2Home = $env:PD2
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
            stop-process -force -id $pid
        }
        catch {}
    }

    start()
    {
        if ( -not (Test-NetConnection -InformationLevel quiet -Port $this.port -ComputerName localhost -WarningAction silentlyContinue ))
        {
            Start-process -PassThru -FilePath $this.startFilename
        }
    }
}

function manageServers()
{
    $coreServer = [ServerClass]::new('core', 'jboss_init_crm-core.bat', 'crm-core:8280 - run.bat -b 0.0.0.0 -c crm-core')
    $pdadminServer = [ServerClass]::new('pdadmin', 'jboss_init_pd2-admin-rest.bat', 'pd2-admin-rest:8380 - run.bat -b 0.0.0.0 -c pd2-admin-rest')
    $procServer = [ServerClass]::new('proc', 'jboss_init_pd-crm-processes.bat', 'pd-crm-processes:8180 - run.bat -b 0.0.0.0 -c pd-crm-processes')

    if ($core)
    {
        if ($stop ) {$coreServer.stop()}
        if ($start -or $restart) {$coreServer.start()}
    }

    if ($proc)
    {
        if ($stop ) {$procServer.stop()}
        if ($start -or $restart) {$procServer.start()}
    }

    if ($pdadmin)
    {
        if ($stop ) {$pdadminServer.stop()}
        if ($start -or $restart) {$pdadminServer.start()}
    }
}

function extractFromArtifact([string]$artifactName, [string]$fileToExtract)
{
    jar xvf $artifactName $fileToExtract
}
function deployArtifact([string] $buildTargetDir, [string] $artifactName, [string] $serverName)
{
    if ($deploy)
    {
        "Deploy ${buildTargetDir}/${artifactName} $env:JBOSS_HOME/server/${serverName}/deploy/."
        Copy-Item "${buildTargetDir}/${artifactName}" "$env:JBOSS_HOME/server/${serverName}/deploy/."
    }
}

function pushToDev([string]$artifact, [string]$hostname, [string]$targetDir)
{
    if ($push)
    {
        $pushTarget = "pilot@${hostname}:$targetDir/."
        $msg = "Pushing {0} to {1}" -f (split-path -leaf $artifact), $pushTarget
        Write-Host $msg
        pscp -pw "pilot12" $artifact $pushTarget
        if (-not($?)) {exit 1}
    }
}


function build( $componentPaths )
{
    if ($build)
    {
        foreach ($componentPath in $componentPaths)
        {
            Write-Host "Building ${componentPath} ..."
            Set-Location $componentPath
            mvn -DskipTests clean package install | Out-File -Encoding UTF8 -Force "build.log"

            if (-not ($?))
            {
                Write-Warning "Build ${componentPath} failed"
                Get-Content "build.log"
                exit 1;
            }
        }
    }
}

function doAdminFrontend()
{
    #Build california-admin-frontend WAR:
    $componentPaths = @("$caHome/components/admin/admin-frontend")
    build $componentPaths;
    $targetDir = "$caHome/components/admin/admin-frontend/target"
    deployArtifact $targetDir "california-admin-frontend-${caVersion}.war" "pd2-admin-rest"
    $artifact = "{0}/{1}" -f $targetDir, "california-admin-frontend-${caVersion}.war"
    $pushOutput = pushToDev $artifact "pdadmin" "/tmp/server/pd2-admnin-rest/deploy"
    $pushOutput | Out-Null

    if ($ear)
    {
        # Build california-admin-rest-app EAR:
        $componentPaths = @("$pd2Home/components/admin/admin-player-resources")
        $componentPaths += "$caHome/components/admin/admin-rest"
        build $componentPaths
        $targetDir = "$caHome/components/admin/admin-rest/admin-rest-application/target"
        deployArtifact $targetDir "california-admin-rest-app-${caVersion}.ear" "pd2-admin-rest"
        $artifact = "{0}/{1}" -f $targetDir, "california-admin-rest-app-${caVersion}.ear"
        $pushOutput = pushToDev $artifact "pdadmin" "/tmp/server/pd2-admnin-rest/deploy"
        $pushOutput | Out-Null
    }
}

function doCrmExt()
{
    Write-Host "Building crm-ext prov-action-plugins jar ..."
    Set-Location $env:PD2\components\prov\prov-action-plugins
    mvn -q -DskipTests clean install | out-null
    Get-ChildItem -file *.jar -r -path .| %{pscp -pw pilot12 $_.fullname pilot@pdext:/tmp/.}

    Write-Host "Building crm-ext dlv-plugins-essns jar ..."
    Set-Location $env:PD2\components\dlv\dlv-plugins-essns
    mvn -q -DskipTests clean install | out-null
    Get-ChildItem -file *.jar -r -path .| %{pscp -pw pilot12 $_.fullname pilot@pdext:/tmp/.}

    $targetDir = "$caHome/components/bi-adapter/bi-adapter-application/target"
    #deployArtifact $targetDir "california-pd-backend-bus-app-${caVersion}.ear" "crm-ext"
    $artifact = "{0}/{1}" -f $targetDir, "california-bi-adapter-app-${caVersion}.ear"
    pushToDev $artifact "pdext" "/tmp/server/crm-ext/deploy"
}

function doCrmBroker()
{
    $targetDir = "$caHome/components/pd-backend-bus/pd-backend-bus-application/target"
    #deployArtifact $targetDir "california-pd-backend-bus-app-${caVersion}.ear" "broker"
    $artifact = "{0}/{1}" -f $targetDir, "california-pd-backend-bus-app-${caVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/broker/deploy"
}

function doCrmCore()
{
    # Member of crm-core/deploy/california-crm-connector-app-2.0.15.0-SNAPSHOT.ear
    $componentPaths = @("$caHome/components/crm-connector/crm-connector-application")

    # Member of crm-core/deploy/california-pd-crm-adapter-app-2.0.15.0-SNAPSHOT.ear
    $componentPaths += "$pd2Home/components/gms4/domain-model"
    $componentPaths += "$pd2Home/components/connectors/crm-player-connector-api"
    $componentPaths += "$pd2Home/components/connectors/crm-connector/crm-connector-sms"
    $componentPaths += "$caHome/components/crm-connector"
    $componentPaths += "$caHome/components/pd-crm-adapter"

    build $componentPaths
    $targetDir = "$caHome/components/crm-connector/crm-connector-application/target"
    deployArtifact $targetDir "california-crm-connector-app-${caVersion}.ear" "crm-core"
    $artifact = "{0}/{1}" -f $targetDir, "california-crm-connector-app-${caVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/crm-core/deploy/."

    $targetDir = "$caHome/components/pd-crm-adapter/pd-crm-adapter-application/target"
    deployArtifact $targetDir "california-pd-crm-adapter-app-${caVersion}.ear" "crm-core"
    $artifact = "{0}/{1}" -f $targetDir, "california-pd-crm-adapter-app-${caVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/crm-core/deploy"
}
function doPdCrmProcesses()
{
    # Member of pd-crm-processes/deploy/california-pd-crm-processes-app-2.0.*-SNAPSHOT.ear
    # $componentPaths = @("$pd2Home/components/pd-crm-processes/processes-commons")
    $componentPaths = @("$pd2Home/components/pd-crm-processes")
    # $componentPaths += "$pd2Home/components/pd-crm-processes/processor-core"
    # $componentPaths += "$pd2Home/components/pd-crm-processes/processes/closeaccount-process"
    # $componentPaths += "$pd2Home/components/pd-crm-processes/processes/updateprofile-process"

    # $componentPaths += "$caHome/components/pd-crm-processes/ca-processes"
    # $componentPaths += "$caHome/components/pd-crm-processes/pd-crm-processes-camel-context"
    $componentPaths += "$caHome/components/pd-crm-processes"

    # $componentPaths += "$caHome/components/batch"

    build $componentPaths

    # california-pd-crm-processes-app-${caVersion}.ear
    $targetDir = "$caHome/components/pd-crm-processes/pd-crm-processes-application/target"
    deployArtifact $targetDir "california-pd-crm-processes-app-${caVersion}.ear" "pd-crm-processes"
    $artifact = "{0}/{1}" -f $targetDir, "california-pd-crm-processes-app-${caVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/pd-crm-processes/deploy"

    # Batch california-batch-admin-application.ear
    $targetDir = "$caHome/components/batch/batch-admin-application/target"
    deployArtifact $targetDir "california-batch-admin-application.ear" "pd-crm-processes"
    $artifact = "{0}/{1}" -f $targetDir, "california-batch-admin-application.ear"
    pushToDev $artifact "pdcore" "/tmp/server/pd-crm-processes/deploy"
}

Write-Output "CA Version: ${caVersion}"
if ($pd2)
{
    Set-Location $env:PD2
    mvn -DskipTests clean install
}

if ($ca)
{
    Set-Location $env:CA
    mvn -DskipTests clean install
}

if ($broker) {doCrmBroker}
if ($core) {doCrmCore}
if ($ext)  {doCrmExt}
if ($proc) {doPdCrmProcesses}
if ($pdadmin) {doAdminFrontend}
if ($restart -or $stop -or $start) {manageServers}

Set-Location $whereWasI
