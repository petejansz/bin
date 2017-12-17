<#
    Script command-line many PD player REST functions
    Author: Pete Jansz, IGT, June 2017
#>

param
(
    [int]$act,
    [string]$csvfile,
    [string]$chpwd,
    [string]$csvfile,
    [string]$logintoken,
    [string]$lock,
    [string]$unlock,
    [string]$USERNAME,
    [string]$password = "RegTest6100",
    [string]$hostname,
    [int]$port = 80,
    [switch]$help,
    [switch]$h,
    [int]$close,
    [string]$reason,
    [string]$emailavailable,
    [switch]$getattributes,
    [switch]$getcommprefs,
    [switch]$getpersonalinfo,
    [switch]$getprofile,
    [switch]$getnotificationsprefs,
    [string]$updatecommprefs,
    [string]$updatenotificationsprefs,
    [string]$updatepersonalinfo,
    [string]$updateprofile,
    [string]$update,
    [string]$reg,
    [switch]$show
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$scriptName = $MyInvocation.MyCommand.Name
$scriptDir = Split-Path $MyInvocation.MyCommand.Path

function showHelp()
{
    Write-Host "USAGE: ${ScriptName} [options] -hostname <hostname> option"
    Write-Host "Options:"
    Write-Host "  -act <token>  -csvfile <csvfile>      -username <username>"
    Write-Host "  -chpwd <oldPassword> -newpwd <newPassword> -username <username>"
    Write-Host "  -close <contractId>                   -username <username> [-reason <reason>]"
    Write-Host "  -emailavailable <emailname>"
    Write-Host "  -getattributes                        -username <username>"

    Write-Host "  -getcommprefs                         -username <username>"
    Write-Host "  -updatecommprefs          <json-file> -username <username>"

    Write-Host "  -getnotificationsprefs                -username <username>"
    Write-Host "  -updatenotificationsprefs <json-file> -username <username>"

    Write-Host "  -getpersonalinfo                      -username <username>"
    Write-Host "  -updatepersonalinfo       <json-file> -username <username>"

    Write-Host "  -getprofile                           -username <username>"
    Write-Host "  -updateprofile            <json-file> -username <username>"

    Write-Host "  -logintoken <username>"
    Write-Host "  -lock <reason>                        -username <username>"
    Write-Host "  -password <password default=RegTest6100>"
    Write-Host "  -port <int default=80>"
    Write-Host "  -reg    <csv-file>                    -username <username> [-show and exit]"
    Write-Host "  -unlock <reason>                      -username <username>"
    Write-Host "  -update <csv-file>                    -username <username> # email pref, lock/unlock"
    exit 1
}

if ($h -or $help) {showHelp}
if (-not($hostname)) {showHelp}

. lib-register-ca-player.ps1

$response = $null
try
{
    if ($act)
    {
        if (-not($csvfile)) {showHelp}
        if (-not($username)) {showHelp}

        try
        {
            $devxToken = $act
            $players = import-csv $csvfile
            $player = $players | Where-Object {$_.PlayerEmail -eq $username}
            $player.PlayerId = $devxToken
            $result = activate $hostname $port $player $devxToken
            $players | export-csv $csvfile -notype -force
        }
        catch
        {
            logPlayer $player "Activation Exception: xToken = $devxToken"
        }
    }
    elseif ($chpwd)
    {
        $oldPassword = $chpwd
        $jsonBody = New-Object PsObject -Property @{
            oldPassword = [string] $oldPassword
            newPassword = $newpwd
        }

        $token = login $hostname $port $username $oldPassword
        execRestChangePassword $hostname $port $token $jsonBody
    }
    elseif ($close)
    {
        $playerId = $close
        if (-not($username)) {showHelp}
        $token = login $hostname $port $username $password
        execCaAdminRestCloseAccount "pdadmin" 8280 $token $playerId $reason
    }
    elseif ($lock)
    {
        if (-not($username)) {showHelp}
        $token = login $hostname $port $username $password
        execRestLockService $hostname $port $token $true $lock
    }
    elseif ($logintoken)
    {
        if (-not($logintoken)) {showHelp}
        $username = $logintoken
        login $hostname $port $username $password
    }
    elseif ($unlock)
    {
        if (-not($username)) {showHelp}
        $token = login $hostname $port $username $password
        execRestLockService $hostname $port $token $false $unlock
    }
    elseif ($emailavailable)
    {
        if (-not($emailavailable)) {showHelp}
        $username = $emailavailable
        isEmailnameAvailable $hostname $port $username
    }
    elseif ($getattributes)
    {
        $token = login $hostname $port $username $password
        execRestGetAttributes $hostname $port $token
    }
    elseif ($getcommprefs)
    {
        $token = login $hostname $port $username $password
        execRestGetComPrefs $hostname $port $token
    }
    elseif ($updatecommprefs)
    {
        $jsonBody = Get-Content $updatecommprefs
        $token = login $hostname $port $username $password
        execRestUpdateComPrefs $hostname $port $token $jsonBody
    }
    elseif ($getnotificationsprefs)
    {
        $token = login $hostname $port $username $password
        execRestGetNotificationsPrefs $hostname $port $token
    }
    elseif ($updatenotificationsprefs)
    {
        $jsonBody = Get-Content $updatenotificationsprefs
        $token = login $hostname $port $username $password
        execRestUpdateNotificationsPrefs $hostname $port $token $jsonBody
    }
    elseif ($getpersonalinfo)
    {
        $token = login $hostname $port $username $password
        execRestGetPersonalInfo $hostname $port $token
    }
    elseif ($updatepersonalinfo)
    {
        $jsonBody = Get-Content $updatepersonalinfo
        $token = login $hostname $port $username $password
        execRestUpdatePersonalInfo $hostname $port $token $jsonBody
    }
    elseif ($getprofile)
    {
        $token = login $hostname $port $username $password
        execRestGetProfile $hostname $port $token
    }
    elseif ($updateprofile)
    {
        $jsonBody = Get-Content $updateprofile
        $token = login $hostname $port $username $password
        execRestUpdateProfile $hostname $port $token $jsonBody
    }
    elseif ($update)
    {
        $csvfile = $update
        $player = import-csv $update | Where-Object {$_.PlayerEmail -eq $username}

        $result = update $hostname $port $player $password
        Write-Host "Updated: $username : $result"
    }
    elseif ($reg)
    {
        $available = isEmailnameAvailable $hostname $port $username
        Write-Host ("Emailname '${username}' available: ${available}")

        if ($available -or $show)
        {
            $csvfile = resolve-path $reg
            $players = import-csv $csvfile
            $player = $players | Where-Object {$_.PlayerEmail -eq $username}
            $registerUserDTO = create_registerUserDTO $player $password

            $json = ( $registerUserDTO | ConvertTo-Json -depth 4 ) -replace 'null', ''
            if ($show)
            {
                Write-Debug "Show and quit:"
                $player
                $json
                exit
            }
            $response = execRestRegisterUser $hostname $port $json
            $xToken = [string]$response.Headers.'X-Token'
            Write-Host "xToken: $xToken"
            $xToken = $xToken.Trim()
            $player.PlayerID = $xToken
            $players | export-csv $csvfile -notype -force
            Write-Host ($username.ToLower() + " xToken: $xToken")
        }
    }
}
catch [MyWebException]
{
    log $_.Exception.TotalMessage
    exit 1
}
catch #[Exception]
{
    log $_.Exception
    exit 1
}
