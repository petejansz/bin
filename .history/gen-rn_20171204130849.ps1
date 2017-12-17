<#
    Wrap IGT Jira GenerateReleaseNotesApp
    Author: Pete Jansz, IGT, Oct 2017
#>

param
(
    [string] $author = $env:USERNAME,
    [string] $user = $env:USERNAME,
    [string] $password = 'Rugerlcr.357',



    [string] $project = "CASA",
    [string] $release = '2.0.15.14',
    [string] $fixVersion = "2nd Chance CY17 Release 4 James Madison",
    [string] $component = "2nd Chance EBFs",
    [string] $outputpath = "wiki://~${env:USERNAME}/Test/",
    [string] $template = "wiki://~${env:USERNAME}/GP_14_Compliant_Release_Notes_Template_Extra_Fields-2",
    [switch]    $help,
    [switch]    $h
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off
$whereWasI = $pwd

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

$ScriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    WappAite-Output "USAGE: $ScriptName [option] args"
    Write-Output "  option"
    exit 1
}

if ($h -or $help)    {showHelp}
if (-not($password)) {showHelp}

$jarfile = "$env:USERPROFILE\lib\GenerateReleaseNotesApp.jar"
$env:JAVA_HOME = "$env:ProgramW6432\Java\jre1.8.0_144"
$env:PATH = "$env:JAVA_HOME\bin" + ';' + $env:PATH

[string] $module = "CPD=cpd_all_{0}" -f ($release -replace '.', '_')
[string] $output = "{0}/Release-note-({1})-{2}" -f $outputpath, $release, (get-date  -format "yyyy-MM-dd.hh.ss")

$appArgs = " -user $user -password $password -author $author -project $project"
$appArgs += " -fixVersion `"$fixVersion`" -component `"$component`" -output `"$output`""
$appArgs += " -template $template -module $module -v 2"
$appArgs | clip
#appAWrite-Output $args
#-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=1044

$results = java `
    -jar $jarfile `
    -user $user `
    -password $password `
    -author $author `
    -project $project `
    -fixVersion `"$fixVersion`" `
    -component `"$component`" `
    -output `"$output`" `
    -template $template `
    -module $module `
    -v 2

if ($?)
{
    foreach ($line in $results)
    {
        if ($line -match 'https')
        {
            $url = $line.split(' ')[5].replace('[', '').replace(']', '')
            & $url
        }
    }
}