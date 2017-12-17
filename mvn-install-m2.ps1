# Example install a jar to my Maven m2.
param
(
    [string]$sourcefile,    # e.g., ,"C:\Program Files\DbVisualizer\jdbc\db2\db2jcc4.jar"
    [string]$groupId,       # e.g., 'com.ibm.db2'
    [string]$artifactId,    # e.g. ,'db2jcc4'
    [string]$version,       # e.g., '10.1'
    [string]$packaging,     # e.g., 'jar'
    [switch]$help,
    [switch]$h
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
#Set-PSDebug -Trace 2

$ScriptName = $MyInvocation.MyCommand.Name

mvn install:install-file `
    -Dfile=$sourcefile `
    "-DgroupId=$groupId" `
    "-DartifactId=$artifactId" `
    "-Dversion=$version" `
    -Dpackaging=$packaging