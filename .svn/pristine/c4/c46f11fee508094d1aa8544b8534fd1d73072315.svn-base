param
(
    [string]$csvfile,
    [int]$linecount = 10,
    [string]$prefix,
    [switch]$help,
    [switch]$h
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
#Set-PSDebug -Trace 2

$scriptName = $MyInvocation.MyCommand.Name
$scriptDir = Split-Path $MyInvocation.MyCommand.Path

function showHelp()
{
    Write-Host "USAGE: ${scriptName} [options] -csvfile <csvfile> -prefix <prefix>"
    Write-Host "options:"
    Write-Host "  -linecount <int default=10>"
    exit 1
}

if ($h -or $help)   {showHelp}
if (-not($csvfile)) {showHelp}
if (-not($prefix))  {showHelp}

. lib-register-ca-player.ps1

$outcsv = "{0}/{1}.csv" -f (resolve-path ".\"), $prefix
$csvfile = Resolve-Path $csvfile
Get-ChildItem $csvfile | ForEach-Object {Get-Content $_ -Head 1} | out-file -encoding utf8 -force $outcsv
Get-ChildItem $csvfile | ForEach-Object {Get-Content $_ -Tail $linecount} | out-file -encoding utf8 -append $outcsv

$resolvedPath = resolve-path $outcsv
$players = import-csv $resolvedPath
$count = 0
foreach ($player in $players)
{
    $count++
    $email = $player.PlayerEmail.split('@')
    $formattedEmail = ("{0}@{1}" -f ($prefix + $email[0]), $email[1]).ToLower()

    $player.PlayerID = -1
    $player.PlayerActivationStatus = 1
    $player.PlayerJackpotCaptain            = 0
    $player.PlayerPhone = '0'
    $player.PlayerFirstName = $prefix + $Player.PlayerFirstName
    $player.PlayerEmail = $formattedEmail
    $player.PlayerUsername = $player.PlayerEmail
    #"{0}: {1}  {2}  {3}" -f $count, $player.PlayerEmail, $player.PlayerFirstName, $Player.PlayerLastName
}

$players | export-csv $resolvedPath -notype -force
$players | %{$_.PlayerEmail}
Write-Host ""
$resolvedPath.ToString()