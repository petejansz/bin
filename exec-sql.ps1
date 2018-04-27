<#
    Wrap DBVis command-line tool, dbviscmd, creating export wrapper file from sql file
    e.g., dbviscmd -connection $con -sqlfile $dbviscmdFile
#>
param
(
    [string]    $con,
    [string]    $sqlFile,
    [string]    $exportFile,
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
    Write-Output "USAGE: $ScriptName [option] -con <connection> -sqlfile <filename>"
    Write-Output "  option"
    Write-Output "      -exportFile <filename>"
    exit 1
}

if ($h -or $help) {showHelp}
if ( $con -and $sqlfile  ) { }else {showHelp}

$sqlCode = ""
foreach ($line in (Get-Content (resolve-path $sqlfile)))
{
    $sqlCode += $line + "`n"
}

if ($exportFile)
{
    if ((split-path $exportFile) -lt 2)
    {
        $exportFile = $pwd.ToString() + "\" + $exportFile
    }
    $contents = "@export on;`n"
    $contents += '@export set CsvColumnDelimiter=, QuoteTextData=Double'
    $contents += " filename=`"${exportFile}`";`n`n"
    $contents += $sqlCode + ";`n`n@export off;"
}
else
{
    $contents = $sqlCode + ";"
}

$dbviscmdFile = New-TemporaryFile
$contents | tee.exe $dbviscmdFile

set-jboss-version.ps1 -v 6 | out-null

dbviscmd -connection $con -stoponerror -sqlfile $dbviscmdFile.FullName