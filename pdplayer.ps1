<#
    Script command-line many PD player REST functions
    Author: Pete Jansz, IGT, June 2017
#>

param
(
    [string]$activate,
    [string]$csvfile,
    [string]$chpwd,
    [string]$newpwd,
    [string]$logintoken,
    [string]$lock,
    [switch]$logout,
    [string]$username,
    [string]$u,
    [string]$password = "Password1",
    [string]$p = "Password1",
    [string]$hostname,
    [string]$h, # hostname
    [int]$port = 80,
    [switch]$help,
    [string]$reason,
    [string]$emailavailable,
    [string]$forgotpassword,
    [switch]$getattributes,
    [switch]$getcommprefs,
    [switch]$getpersonalinfo,
    [switch]$getprofile,
    [switch]$getnotificationsprefs,
    [switch]$resendActivationMail,
    [string]$resetpwd,
    [string]$unlock,
    [string]$updatecommprefs,
    [string]$updatenotificationsprefs,
    [string]$updatepersonalinfo,
    [string]$updateprofile,
    [string]$update,
    [string]$verify,
    [string]$reg,
    [switch]$show
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$scriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Host "USAGE: ${ScriptName} [options] -h[ostname] <hostname> option"
    Write-Host "Options:"
    Write-Host "  -activate <token>   "
    Write-Host "  -chpwd <oldPassword> -newpwd <newPassword> -u[sername] <username>"
    Write-Host "  -emailavailable <emailname>"
    Write-Host "  -forgotpassword <emailname>"
    Write-Host "  -getattributes                        -u[sername] <username>"

    Write-Host "  -getcommprefs                         -u[sername] <username>"
    Write-Host "  -updatecommprefs          <json-file> -u[sername] <username>"

    Write-Host "  -getnotificationsprefs                -u[sername] <username>"
    Write-Host "  -updatenotificationsprefs <json-file> -u[sername] <username>"

    Write-Host "  -getpersonalinfo                      -u[sername] <username>"
    Write-Host "  -updatepersonalinfo       <json-file> -u[sername] <username>"

    Write-Host "  -getprofile                           -u[sername] <username>"
    Write-Host "  -updateprofile            <json-file> -u[sername] <username>"

    Write-Host "  -logout           # Logout after operation"
    Write-Host "  -logintoken <username>"
    Write-Host "  -lock <reason>                        -u[sername] <username>"
    Write-Host "  -p[assword] <password default=${password}>"
    Write-Host "  -port <int default=${port}>"
    Write-Host "  -reg    <file.json|file.csv>          -u[sername] <username> [-show and exit]"
    Write-Host "  -resendActivationMail                 -u[sername] <username>"
    Write-Host "  -resetpwd <oneTimeToken> -newpwd <newPassword> "
    Write-Host "  -unlock <reason>                      -u[sername] <username>"
    Write-Host "  -update <csv-file>                    -u[sername] <username> # email pref, lock/unlock"
    Write-Host "  -verify <code>"
    exit 1
}

if ($help) { showHelp }
if (-not ($h -or $hostname)) { showHelp }

. lib-register-ca-player.ps1

function doLogout( [string]$hostname, [int]$port, [string]$oauthToken )
{
    if ( $logout -and $oauthToken )
    {
        logout $hostname $port $oauthToken | Out-Null
    }
}

$response = $null
try
{
    if ($h) { $hostname = $h }
    if ($p) { $password = $p }
    if ($u) { $username = $u }

    if ($activate)
    {
        try
        {
            $devxToken = $activate
            $result = activateAccount $hostname $port $devxToken
        }
        catch
        {
            Write-Output "Activation Exception: xToken = $devxToken"
        }
    }
    elseif ($chpwd)
    {

        $token = login $hostname $port $username $chpwd
        changePassword $hostname $port $token $chpwd $newpwd
        doLogout $hostname $port $token
    }
    elseif ($lock)
    {
        if (-not($username)) { showHelp }
        $token = login $hostname $port $username $password
        lockService $hostname $port $token $true $lock
        doLogout $hostname $port $token
    }
    elseif ($logintoken)
    {
        if (-not($logintoken)) { showHelp }
        $username = $logintoken
        $token = login $hostname $port $username $password
    }
    elseif ($unlock)
    {
        if (-not($username)) { showHelp }
        $token = login $hostname $port $username $password
        lockService $hostname $port $token $false $unlock
        doLogout $hostname $port $token
    }
    elseif ($emailavailable)
    {
        if (-not($emailavailable)) { showHelp }
        $username = $emailavailable
        isEmailnameAvailable $hostname $port $username
    }
    elseif ($forgotpassword)
    {
        if (-not($forgotpassword)) { showHelp }
        $username = $forgotpassword
        forgottenPassword $hostname $port $username
    }
    elseif ($resendActivationMail)
    {
        if (-not($username)) { showHelp }
        $token = login $hostname $port $username $password
        reqSendActivationMail $hostname $port $token
        doLogout $hostname $port $token
    }
    elseif ($resetpwd)
    {
        if (-not($newpwd)) { showHelp }
        $oneTimeToken = $resetpwd
        resetPassword $hostname $port $newpwd $oneTimeToken
    }
    elseif ($getattributes)
    {
        $token = login $hostname $port $username $password
        getAttributes $hostname $port $token
        doLogout $hostname $port $token
    }
    elseif ($getcommprefs)
    {
        $token = login $hostname $port $username $password
        execRestGetComPrefs $hostname $port $token
        doLogout $hostname $port $token
    }
    elseif ($updatecommprefs)
    {
        $jsonBody = Get-Content $updatecommprefs
        $token = login $hostname $port $username $password
        execRestUpdateComPrefs $hostname $port $token $jsonBody
        doLogout $hostname $port $token
    }
    elseif ($getnotificationsprefs)
    {
        $token = login $hostname $port $username $password
        execRestGetNotificationsPrefs $hostname $port $token
        doLogout $hostname $port $token
    }
    elseif ($updatenotificationsprefs)
    {
        $jsonBody = Get-Content $updatenotificationsprefs
        $token = login $hostname $port $username $password
        execRestUpdateNotificationsPrefs $hostname $port $token $jsonBody
        doLogout $hostname $port $token
    }
    elseif ($getpersonalinfo)
    {
        $token = login $hostname $port $username $password
        getPersonalInfo $hostname $port $token
        doLogout $hostname $port $token
    }
    elseif ($updatepersonalinfo)
    {
        $jsonBody = Get-Content $updatepersonalinfo
        $token = login $hostname $port $username $password
        execRestUpdatePersonalInfo $hostname $port $token $jsonBody
        doLogout $hostname $port $token
    }
    elseif ($getprofile)
    {
        $token = login $hostname $port $username $password
        execRestGetProfile $hostname $port $token
        doLogout $hostname $port $token
    }
    elseif ($updateprofile)
    {
        $jsonBody = Get-Content $updateprofile
        $token = login $hostname $port $username $password
        execRestUpdateProfile $hostname $port $token $jsonBody
        doLogout $hostname $port $token
    }
    elseif ($update)
    {
        $csvfile = $update
        $player = Import-Csv $update | Where-Object { $_.PlayerEmail -eq $username }

        $result = update $hostname $port $player $password
        Write-Host "Updated: $username : $result"
    }
    elseif ($verify)
    {
        $code = $verify
        verifyCode $hostname $port $code
    }
    elseif ($reg)
    {
        $available = isEmailnameAvailable $hostname $port $username
        Write-Host ("Emailname '${username}' available: ${available}")

        if ($available -or $show)
        {
            $json = $null
            $player = $null

            if ( $reg -match "\.csv$" )
            {
                $csvfile = Resolve-Path $reg
                $players = Import-Csv $csvfile
                $player = $players | Where-Object { $_.PlayerEmail -eq $username }
                $registerUserDTO = create_registerUserDTO $player $password
                $json = ( $registerUserDTO | ConvertTo-Json -depth 4 ) -replace 'null', ''
            }
            elseif ( $reg -match "\.json$" )
            {
                $json = Get-Content $reg
            }
            else
            {
                Write-Host "Unknown file type. Supported file types: json, csv"
                exit 1
            }

            if ($show)
            {
                Write-Debug "Show and quit:"
                $player
                $json
                exit
            }

            $response = execRestRegisterUser $hostname $port $json
            $xToken = [string]$response.Headers.'X-Token'
            if ($null -ne $xToken -and $xToken.Length -gt 0)
            {
                Write-Host "xToken: $xToken"
                $xToken = $xToken.Trim()
                if ($null -ne $player)
                {
                    $player.PlayerID = $xToken
                    $players | Export-Csv $csvfile -notype -force
                    Write-Host ($username.ToLower() + " xToken: $xToken")
                }
            }
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
