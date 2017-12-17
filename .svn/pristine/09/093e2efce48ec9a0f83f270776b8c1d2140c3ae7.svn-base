param
(
    [switch]    $curversion,
    [string]    $newversion,
    [switch]    $help,
    [switch]    $h
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$ScriptName = $MyInvocation.MyCommand.Name
function showHelp()
{
    Write-Output "Maven change all pom.xml project.[version|parent.version] value to specificed <version>`n"
    Write-Output "USAGE: $ScriptName ARGS"
    Write-Output "  ARGS"
    Write-Output "    -newversion <version>"
    Write-Output '    -curversion # Get current version'
    exit 1
}

if ($h -or $help) {showHelp}
if ( -not($newversion) -and -not($curversion) ) {showHelp}

if ($curversion)
{
    $pomXml = [xml](Get-Content "./pom.xml")
    $pomXml.project.version
}

function get-ver-artifactId ($pomFile)
{
    $xmlDoc = ([xml](Get-Content $file.fullname))

    $result = @{"version" = $null; "artifactId" = $null; $parent = $false}

    try
    {
        if ($xmlDoc.project.version -match $regex)
        {
            $xmlDoc.project.version, $xmlDoc.project.artifactId
        }
    }
    catch {}
    try
    {

        if ($xmlDoc.project.parent.version -match $regex)
        {
            $xmlDoc.project.parent.version, $xmlDoc.project.parent.artifactId
        }
    }
    catch {}
}

if ($newversion)
{
    # $mvnArgs = "versions:set -DnewVersion={0}" -f $newversion
    # mvn $mvnArgs
    $pomFiles = ls pom.xml -r -path .

    $regex = "^[0-9]{1,2}`.[0-9]{1,2}`.[0-9]{1,2}`.[0-9]{1,2}`."

    foreach ($file in $pomFiles)
    {
        $xmlDoc = ([xml](Get-Content $file.fullname))

        try
        {
            if ($xmlDoc.project.version -match $regex)
            {
                "PARENT: {0} {1} {2}" -f $xmlDoc.project.version, $xmlDoc.project.artifactId, $file.FullName
            }
        }
        catch {}
        try
        {

            if ($xmlDoc.project.parent.version -match $regex)
            {
                "{0} {1} {2}" -f $xmlDoc.project.parent.version, $xmlDoc.project.parent.artifactId, $file.FullName
            }
        }
        catch {}
    }
}