<#
    Help build, deploy various PD site EAR, WAR files and manage servers.
    Author: Pete Jansz, IGT, June 2017
#>

param
(
    [switch]    $broker,
    [switch]    $site,
    [switch]    $core,
    [switch]    $pdadmin, # default build only war
    [switch]    $ear, # also build pdadmin ear
    [switch]    $ext,
    [switch]    $proc,
    [string]    $pdSiteVersion,
    [string]    $pdSiteHome,
    [string]    $productHome,
    [switch]    $build,
    [switch]    $deploy,
    [switch]    $push,
    [switch]    $product,
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
    [Console]::Error.WriteLine($_.Exception)
    Set-Location $whereWasI
}

$ScriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Output "USAGE: $ScriptName [option] -broker | -core | -ext | -pdadmin [-ear] | -proc"
    Write-Output "  option"
    Write-Output "    -site              # Build entire SITE code"
    Write-Output '    -pdSiteVersion <version> default = $env:PD_SITE_VERSION'
    Write-Output "    -pdSiteHome    <path>"
    Write-Output "    -ear               # Also build pd-admin EAR"
    Write-Output "    -productHome   <path>"
    Write-Output "    -build             # Build EAR/WAR file"
    Write-Output "    -deploy            # Deploy to local server container"
    Write-Output "    -product           # Build entire PD product"
    Write-Output "    -push              # Push to remote dev host"
    Write-Output "    -restart           # Restart each JBoss server"
    Write-Output "    -start             # Start each JBoss server"
    Write-Output "    -stop              # Stop each JBoss server"
    exit 1
}

if ($h -or $help) { showHelp }
if ( -not($core) -and -not($pdadmin) -and -not($proc) -and -not($site) -and -not($product) -and -not($broker) -and -not($ext)) { showHelp }
if ( -not($build) -and -not($deploy) -and -not($push) -and -not($restart) -and -not($start) -and -not($stop) )
{ showHelp }

if (-not $env:JBOSS_HOME)
{
    Write-Warning 'Not defined: $env:JBOSS_HOME'
    exit 1
}

if (-not ($pdSiteHome -and (Test-Path $pdSiteHome )))
{
    $pdSiteHome = $env:PD_SITE
}

[xml]$pom = Get-Content $pdSiteHome/pom.xml
$pdSiteVersion = $pom.project.version
$artifactid = $pom.project.artifactId # e.g., california, njs, the prefix of ear, war filename.
# if ($pom.project.properties.'product.version')
# {
#     $prodVersion = $pom.project.properties.'product.version'
# }
# elseif ($pom.project.properties.'pd.version')
# {
#     $prodVersion = $pom.project.properties.'pd.version'
# }

if (-not ($productHome -and (Test-Path $productHome )))
{
    $productHome = $env:PD_PRODUCT
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
        catch { }
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
        if ($stop ) { $coreServer.stop() }
        if ($start -or $restart) { $coreServer.start() }
    }

    if ($proc)
    {
        if ($stop ) { $procServer.stop() }
        if ($start -or $restart) { $procServer.start() }
    }

    if ($pdadmin)
    {
        if ($stop ) { $pdadminServer.stop() }
        if ($start -or $restart) { $pdadminServer.start() }
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
        if (-not($?)) { exit 1 }
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
    $componentPaths = @("$pdSiteHome/components/admin/admin-frontend")
    build $componentPaths;
    $targetDir = "$pdSiteHome/components/admin/admin-frontend/target"
    deployArtifact $targetDir "${artifactid}-admin-frontend-${pdSiteVersion}.war" "pd2-admin-rest"
    $artifact = "{0}/{1}" -f $targetDir, "${artifactid}-admin-frontend-${pdSiteVersion}.war"
    $pushOutput = pushToDev $artifact "pdadmin" "/tmp/server/pd2-admnin-rest/deploy"
    $pushOutput | Out-Null

    if ($ear)
    {
        # Build california-admin-rest-app EAR:
        $componentPaths = @("$productHome/components/admin/admin-player-resources")
        $componentPaths += "$pdSiteHome/components/admin/admin-rest"
        build $componentPaths
        $targetDir = "$pdSiteHome/components/admin/admin-rest/admin-rest-application/target"
        deployArtifact $targetDir "${artifactid}-admin-rest-app-${pdSiteVersion}.ear" "pd2-admin-rest"
        $artifact = "{0}/{1}" -f $targetDir, "${artifactid}-admin-rest-app-${pdSiteVersion}.ear"
        $pushOutput = pushToDev $artifact "pdadmin" "/tmp/server/pd2-admnin-rest/deploy"
        $pushOutput | Out-Null
    }
}

function doCrmExt()
{
    Write-Host "Building crm-ext prov-action-plugins jar ..."
    Set-Location $env:PD_PRODUCT\components\prov\prov-action-plugins
    mvn -q -DskipTests clean install | out-null
    Get-ChildItem -file *.jar -r -path . | ForEach-Object { pscp -pw pilot12 $_.fullname pilot@pdext:/tmp/. }

    Write-Host "Building crm-ext dlv-plugins-essns jar ..."
    Set-Location $env:PD_PRODUCT\components\dlv\dlv-plugins-essns
    mvn -q -DskipTests clean install | out-null
    Get-ChildItem -file *.jar -r -path . | ForEach-Object { pscp -pw pilot12 $_.fullname pilot@pdext:/tmp/. }

    $targetDir = "$pdSiteHome/components/bi-adapter/bi-adapter-application/target"
    #deployArtifact $targetDir "california-pd-backend-bus-app-${pdSiteVersion}.ear" "crm-ext"
    $artifact = "{0}/{1}" -f $targetDir, "california-bi-adapter-app-${pdSiteVersion}.ear"
    pushToDev $artifact "pdext" "/tmp/server/crm-ext/deploy"
}

function doCrmBroker()
{
    $targetDir = "$pdSiteHome/components/pd-backend-bus/pd-backend-bus-application/target"
    #deployArtifact $targetDir "california-pd-backend-bus-app-${pdSiteVersion}.ear" "broker"
    $artifact = "{0}/{1}" -f $targetDir, "california-pd-backend-bus-app-${pdSiteVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/broker/deploy"
}

function doCrmCore()
{
    # Member of crm-core/deploy/california-crm-connector-app-2.0.15.0-SNAPSHOT.ear
    $componentPaths = @("$pdSiteHome/components/crm-connector/crm-connector-application")

    # Member of crm-core/deploy/california-pd-crm-adapter-app-2.0.15.0-SNAPSHOT.ear
    $componentPaths += "$productHome/components/gms4/domain-model"
    $componentPaths += "$productHome/components/connectors/crm-player-connector-api"
    $componentPaths += "$productHome/components/connectors/crm-connector/crm-connector-sms"
    $componentPaths += "$pdSiteHome/components/crm-connector"
    $componentPaths += "$pdSiteHome/components/pd-crm-adapter"

    build $componentPaths
    $targetDir = "$pdSiteHome/components/crm-connector/crm-connector-application/target"
    deployArtifact $targetDir "${artifactid}-crm-connector-app-${pdSiteVersion}.ear" "crm-core"
    $artifact = "{0}/{1}" -f $targetDir, "${artifactid}-crm-connector-app-${pdSiteVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/crm-core/deploy/."

    $targetDir = "$pdSiteHome/components/pd-crm-adapter/pd-crm-adapter-application/target"
    deployArtifact $targetDir "${artifactid}-pd-crm-adapter-app-${pdSiteVersion}.ear" "crm-core"
    $artifact = "{0}/{1}" -f $targetDir, "${artifactid}-pd-crm-adapter-app-${pdSiteVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/crm-core/deploy"
}
function doPdCrmProcesses()
{
    # Member of pd-crm-processes/deploy/california-pd-crm-processes-app-2.0.*-SNAPSHOT.ear
    # $componentPaths = @("$productHome/components/pd-crm-processes/processes-commons")
    $componentPaths = @("$productHome/components/pd-crm-processes")
    # $componentPaths += "$productHome/components/pd-crm-processes/processor-core"
    # $componentPaths += "$productHome/components/pd-crm-processes/processes/closeaccount-process"
    # $componentPaths += "$productHome/components/pd-crm-processes/processes/updateprofile-process"

    # $componentPaths += "$pdSiteHome/components/pd-crm-processes/ca-processes"
    # $componentPaths += "$pdSiteHome/components/pd-crm-processes/pd-crm-processes-camel-context"
    $componentPaths += "$pdSiteHome/components/pd-crm-processes"

    # $componentPaths += "$pdSiteHome/components/batch"

    build $componentPaths

    # california-pd-crm-processes-app-${pdSiteVersion}.ear
    $targetDir = "$pdSiteHome/components/pd-crm-processes/pd-crm-processes-application/target"
    deployArtifact $targetDir "${artifactid}-pd-crm-processes-app-${pdSiteVersion}.ear" "pd-crm-processes"
    $artifact = "{0}/{1}" -f $targetDir, "${artifactid}-pd-crm-processes-app-${pdSiteVersion}.ear"
    pushToDev $artifact "pdcore" "/tmp/server/pd-crm-processes/deploy"

    # Batch california-batch-admin-application.ear
    $targetDir = "$pdSiteHome/components/batch/batch-admin-application/target"
    deployArtifact $targetDir "${artifactid}-batch-admin-application.ear" "pd-crm-processes"
    $artifact = "{0}/{1}" -f $targetDir, "${artifactid}-batch-admin-application.ear"
    pushToDev $artifact "pdcore" "/tmp/server/pd-crm-processes/deploy"
}

Write-Output "Site version: ${pdSiteVersion}"
if ($product)
{
    Set-Location $env:PD_PRODUCT
    mvn -DskipTests clean install
}

if ($site)
{
    Set-Location $env:PD_SITE
    mvn -DskipTests clean install
}

if ($broker) { doCrmBroker }
if ($core) { doCrmCore }
if ($ext) { doCrmExt }
if ($proc) { doPdCrmProcesses }
if ($pdadmin) { doAdminFrontend }
if ($restart -or $stop -or $start) { manageServers }

Set-Location $whereWasI
