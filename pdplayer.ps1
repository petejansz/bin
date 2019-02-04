<#
    Script command-line many PD player REST functions
    Author: Pete Jansz, IGT, June 2017
#>

param
(
    [string]$act,
    [switch]$resendActivationMail,
    [string]$csvfile,
    [string]$chpwd,
    [string]$newpwd,
    [string]$logintoken,
    [string]$lock,
    [switch]$mobile,
    [string]$unlock,
    [string]$username,
    [string]$password = "Password1",
    [string]$hostname,
    [int]$port = 80,
    [switch]$help,
    [switch]$h,
    [int]$close,
    [string]$reason,
    [string]$emailavailable,
    [string]$forgotpassword,
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
    Write-Host "  -act <token>   "
    Write-Host "  -chpwd <oldPassword> -newpwd <newPassword> -username <username>"
    Write-Host "  -close <contractId>                   -username <username> [-reason <reason>]"
    Write-Host "  -emailavailable  <emailname>"
    Write-Host "  -forgotpassword <emailname>"
    Write-Host "  -resendActivationMail                 -username <username>"
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
    Write-Host "  -mobile"
    Write-Host "  -password <password default=${password}>"
    Write-Host "  -port <int default=${port}>"
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
    if ($hostname -match "mobile")
    {
        $mobile = $true
    }

    if ($act)
    {
        try
        {
            $devxToken = $act
            $result = execRestActivateAccount $hostname $port $devxToken $mobile
        }
        catch
        {
            Write-Output "Activation Exception: xToken = $devxToken"
        }
    }
    elseif ($chpwd)
    {
        $oldPassword = $chpwd
        $bodyTemplate = '{"oldPassword" : "oldPassword_VALUE", "newPassword" : "newPassword_VALUE"}'
        $body = $bodyTemplate -replace 'oldPassword_VALUE', $oldPassword
        $body = $body -replace 'newPassword_VALUE', $newpwd
        $password = $oldPassword
        $token = login $hostname $port $username $password $mobile
        execRestChangePassword $hostname $port $token $body $mobile #| Out-Null
    }
    elseif ($close)
    {
        $playerId = $close
        if (-not($username)) {showHelp}
        $token = login $hostname $port $username $password $mobile
        if (-not($reason)) {$reason = $scriptName + " REASON"}
        execCaAdminRestCloseAccount "pdadmin" 8280 $token $playerId $reason $mobile
    }
    elseif ($lock)
    {
        if (-not($username)) {showHelp}
        $token = login $hostname $port $username $password $mobile
        execRestLockService $hostname $port $token $true $lock $mobile
    }
    elseif ($logintoken)
    {
        if (-not($logintoken)) {showHelp}
        $username = $logintoken
        login $hostname $port $username $password $mobile
    }
    elseif ($unlock)
    {
        if (-not($username)) {showHelp}
        $token = login $hostname $port $username $password $mobile
        execRestLockService $hostname $port $token $false $unlock $mobile
    }
    elseif ($emailavailable)
    {
        if (-not($emailavailable)) {showHelp}
        $username = $emailavailable
        isEmailnameAvailable $hostname $port $username $mobile
    }
    elseif ($forgotpassword)
    {
        if (-not($forgotpassword)) {showHelp}
        $username = $forgotpassword
        execRestForgottenPassword $hostname $port $username $mobile
    }
    elseif ($resendActivationMail)
    {
        if (-not($username)) {showHelp}
        $token = login $hostname $port $username $password $mobile
        execRestReqSendActivationMail $hostname $port $token $mobile
    }
    elseif ($getattributes)
    {
        $token = login $hostname $port $username $password $mobile
        execRestGetAttributes $hostname $port $token $mobile
    }
    elseif ($getcommprefs)
    {
        $token = login $hostname $port $username $password $mobile
        execRestGetComPrefs $hostname $port $token $mobile
    }
    elseif ($updatecommprefs)
    {
        $jsonBody = Get-Content $updatecommprefs
        $token = login $hostname $port $username $password $mobile
        execRestUpdateComPrefs $hostname $port $token $jsonBody $mobile
    }
    elseif ($getnotificationsprefs)
    {
        $token = login $hostname $port $username $password $mobile
        execRestGetNotificationsPrefs $hostname $port $token
    }
    elseif ($updatenotificationsprefs)
    {
        $jsonBody = Get-Content $updatenotificationsprefs
        $token = login $hostname $port $username $password $mobile
        execRestUpdateNotificationsPrefs $hostname $port $token $jsonBody $mobile
    }
    elseif ($getpersonalinfo)
    {
        $token = login $hostname $port $username $password $mobile
        execRestGetPersonalInfo $hostname $port $token $mobile
    }
    elseif ($updatepersonalinfo)
    {
        $jsonBody = Get-Content $updatepersonalinfo
        $token = login $hostname $port $username $password $mobile
        execRestUpdatePersonalInfo $hostname $port $token $jsonBody $mobile
    }
    elseif ($getprofile)
    {
        $token = login $hostname $port $username $password $mobile
        execRestGetProfile $hostname $port $token $mobile
    }
    elseif ($updateprofile)
    {
        $jsonBody = Get-Content $updateprofile
        $token = login $hostname $port $username $password $mobile
        execRestUpdateProfile $hostname $port $token $jsonBody $mobile
    }
    elseif ($update)
    {
        $csvfile = $update
        $player = import-csv $update | Where-Object {$_.PlayerEmail -eq $username}

        $result = update $hostname $port $player $password $mobile
        Write-Host "Updated: $username : $result"
    }
    elseif ($reg)
    {
        $available = isEmailnameAvailable $hostname $port $username $mobile
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
            $response = execRestRegisterUser $hostname $port $json $mobile
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
