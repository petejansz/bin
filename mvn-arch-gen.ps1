# PowerShell wrapper script to Maven generate J2EE structured Java application with Junit and pom.xml
# Example install a jar to my Maven m2.
param
(
    [string]$groupId,       # e.g., 'com.ibm.db2'
    [string]$artifactId,    # e.g. ,'consumerBanking'
    [switch]$help,
    [switch]$h
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
#Set-PSDebug -Trace 2

$archetypeArtifactId = "maven-archetype-quickstart"
$interactiveMode = $false

mvn archetype:generate `
    "-DgroupId=$groupId" `
    "-DartifactId=$artifactId" `
    "-DarchetypeArtifactId=$archetypeArtifactId" `
    "-DinteractiveMode=$interactiveMode"
