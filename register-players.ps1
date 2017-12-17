<#
    Script read Lottery CSV file, register, activate, update bulk PD player

    Author: Pete Jansz, IGT, June 2017
#>

param
(
    [string]    $csvfile,
    [string]    $hostname,
    [int]       $port,
    [switch]    $reg,
    [switch]    $act,
    [switch]    $update,
    [string]    $password = "RegTest6100",
    [switch]    $go,
    [switch]    $errorcont,
    [switch]    $help,
    [switch]    $h
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

if ($errorcont) {$ErrorActionPreference = "Continue"}
$ScriptName = $MyInvocation.MyCommand.Name
$scriptDir = Split-Path $MyInvocation.MyCommand.Path

function showHelp()
{
    Write-Output "USAGE: $ScriptName -csvfile <csvfile> -hostname <hostname> -port <port>"
    Write-Output "Options:"
    Write-Output "  -reg        Register users"
    Write-Output "  -act        Activate accounts"
    Write-Output "  -update     Update account settings"
    Write-Output "  -password   <password> (dwfault = $password)"
    Write-Output "  -go         Go - really make API calls!"
    Write-Output "  -errorcont  Continue on errors (default=stop)"
    exit 1
}

. lib-register-ca-player.ps1

function register( $player )
{
    $available = $True

    if ($go)
    {
        $available = isEmailnameAvailable $hostname $port $player.PlayerEmail
    }

    if ( $available )
    {
        logPlayer $player "Go=$go - Registering..."
        $registerUserDTO = create_registerUserDTO $player $password
        $json = ( $registerUserDTO | ConvertTo-Json -depth 4 ) -replace 'null', ''

        if ( $go )
        {
            for ($i = 1; $i -le 1; $i++)
            {
                try
                {
                    $response = execRestRegisterUser $hostname $port $json
                    $xToken = [string]$response.Headers.'X-Token'
                    $xToken = $xToken.Trim()
                    $player.PlayerID = $xToken
                    logPlayer $player ("REGISTERED: PlayerID=${xToken} response.StatusCode") $response
                    break
                }
                catch
                {
                    $myExcep = [MyWebException]::new("execRestRegisterUser", $_, -1)
                    throw $myExcep
                }
            }
        }
    }

    return $player.PlayerID
}

if ($h -or $help) {showHelp}
if (-not($csvfile)) {showHelp}
if (-not($hostname)) {showHelp}
if (-not($port)) {showHelp}
if ( -not($reg) -and -not($act) -and -not($update) ) {showHelp}

$csvfile = (resolve-path $csvfile).path.toString()
log "Starting: $scriptName $hostname $port $csvfile"

if ( $reg )
{
    $players = import-csv $csvfile

    foreach ( $player in $players )
    {
        try
        {
            "{0}" -f $player.PlayerEmail
            $result = register $player
            $players | export-csv $csvfile -notype -force
        }
        catch [MyWebException]
        {
            logPlayer $player $_.Exception.TotalMessage

            if (-not ($errorcont) )
            {
                exit 1
            }
        }
        catch [Exception]
        {
            logPlayer $player $_.Exception

            if (-not ($errorcont) )
            {
                exit 1
            }
        }
    }
}

if ($act -or $update)
{
    $players = import-csv  $csvfile

    foreach ( $player in $players )
    {
        if ($player.PlayerID -lt 0)
        {
            #continue
        }

        try
        {
            if ( $act )
            {
                "{0} PlayerActivationStatus: {1} {2}" -f $player.PlayerID, $player.PlayerActivationStatus, $player.PlayerEmail
                $result = activate $hostname $port $player $player.PlayerID
            }

            if ( $update )
            {
                $result = update $hostname $port $player $password
            }
        }
        catch [MyWebException]
        {
            logPlayer $player $_.Exception.TotalMessage

            if (-not ($errorcont) )
            {
                exit 1
            }
        }
        catch [Exception]
        {
            logPlayer $player $_.Exception

            if (-not ($errorcont) )
            {
                exit 1
            }
        }
    }
}

log "Ending: $scriptName $hostname $port $csvfile"
