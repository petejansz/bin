param
(
    [string]$csvfile,
    [string]$email,
    [switch]$update,
    [switch]$help,
    [switch]$h
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
$scriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Output "USAGE: [options] ${scriptName} -csvfile <csvfile> -email <email>"
    Write-Output "Options:"
    Write-Output "  -update Update csvfilename with any changed property values"
    exit 1
}

if ($h -or $help)    {showHelp}
if (-not($csvfile))  {showHelp}
if (-not($email))    {showHelp}

. lib-general.ps1

$csvfile = Resolve-Path $csvfile
$csv = import-csv $csvfile

if (-not ($update))
{
    $csv | where {$_.PlayerEmail -eq $email}
    exit
}

# Display, validate or fix fields:
foreach ($player in $csv)
{
    if ($player.PlayerEmail -eq $email )
    {
        $player

        $player.PlayerUsername = $player.PlayerEmail
        $player.PlayerPhone = "0000000000"
        validateEmailAddress $player.PlayerEmail
        validateEmailAddress $player.PlayerUsername
        validateFirstname $player.PlayerFirstName
        validateLastname $player.PlayerLastName
        validatePhonenumber $player.PlayerPhone
        validateAddress $player.PlayerAddress
        validateAddress2 $player.PlayerAddress2

        $player
    }
}

if ($update)
{
    # Save to file:
    $csv | export-csv $csvfile -notype -force
}
