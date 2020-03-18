<#
    Script command-line many PD player REST functions
    Author: Pete Jansz, IGT, June 2017
#>

param
(
    [int]$port = 80,
    [string]$activate,
    [Parameter(Mandatory = $false)]
    [ValidateSet('attributes', 'communication-preferences', 'notifications', 'notifications-preferences', 'personal-info', 'profile', IgnoreCase = $false)]
    [array] $api,
    [string]$chpwd,
    [string]$csvfile,
    [string]$emailavailable,
    [string]$forgotpassword,
    [string]$h, # hostname
    [string]$hostname,
    [string]$lock,
    [string]$logintoken,
    [string]$newpwd,
    [string]$o,     # o[oauth] token
    [string]$oauth,
    [string]$p = "Password1",
    [string]$password = "Password1",
    [string]$reason,
    [string]$reg,
    [string]$resetpwd,
    [string]$u,     # u[username] name
    [string]$unlock,
    [string]$update,
    [string]$updatecommprefs,
    [string]$updatenotificationsprefs,
    [string]$updatepersonalinfo,
    [string]$updateprofile,
    [string]$username,
    [string]$verify,
    [switch]$getattributes,
    [switch]$getcommprefs,
    [switch]$getnotifications,
    [switch]$getnotificationsprefs,
    [switch]$getpersonalinfo,
    [switch]$getprofile,
    [switch]$help,
    [switch]$logout,
    [switch]$resendActivationMail,
    [switch]$show
)

$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$scriptName = $MyInvocation.MyCommand.Name

function showHelp()
{
    Write-Host "USAGE: ${ScriptName} [options] -h[ostname] <hostname> [credentials] option"
    Write-Host "Credentials:"
    Write-Host "  -u[sername] <username> -p[assword] <password default=${password}> | -o[auth] <session-token>"
    Write-Host "Options:"
    Write-Host "  -activate <token>   "
    Write-Host "  -api '@(attributes,communication-preferences,notifications,notifications-preferences,personal-info,profile)"
    Write-Host "  -chpwd <oldPassword> -newpwd <newPassword> -u[sername] <username>"
    Write-Host "  -emailavailable <username>"
    Write-Host "  -forgotpassword <username>"
    Write-Host "  -getattributes                        credentials"

    Write-Host "  -getcommprefs                         credentials"
    Write-Host "  -updatecommprefs          <json-file> credentials"

    Write-Host "  -getnotifications                     credentials"

    Write-Host "  -getnotificationsprefs                credentials"
    Write-Host "  -updatenotificationsprefs <json-file> credentials"

    Write-Host "  -getpersonalinfo                      credentials"
    Write-Host "  -updatepersonalinfo       <json-file> credentials"

    Write-Host "  -getprofile                           credentials"
    Write-Host "  -updateprofile            <json-file> credentials"

    Write-Host "  -logout                  # Logout after operation"
    Write-Host "  -logintoken     <username> -p[assword] <password>"
    Write-Host "  -lock <reason>                        credentials"
    Write-Host "  -port <int default=${port}>"
    Write-Host "  -reg    <file.json|file.csv>          -u[sername] <username> [-show and exit]"
    Write-Host "  -resendActivationMail                 credentials"
    Write-Host "  -resetpwd <oneTimeToken> -newpwd <newPassword> "
    Write-Host "  -unlock <reason>                      credentials"
    Write-Host "  -update <csv-file>                    credentials # email pref, lock/unlock"
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

function get-sessionToken()
{
    $sessionToken = ''

    if ($oauth)
    {
        $sessionToken = $oauth
    }
    elseif ($username)
    {
        $sessionToken = login $hostname $port $username $password
    }

    return $sessionToken
}

$response = $null
try
{
    if ($h) { $hostname = $h }
    if ($p) { $password = $p }
    if ($u) { $username = $u }
    if ($o) { $oauth = $o }

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
    elseif ($api)
    {
        $token = get-sessionToken
        $contents = @()
        foreach ($apiName in $api)
        {
            $response = get-it $hostname $port $token $apiName
            $contents += $response.Content
        }

        if ($contents.Length -gt 1)
        {
            Write-Output "[`n"
            for($i=0; $i -lt $contents.Length-1; $i++)
            {
                Write-Output ($contents[$i] + ",`n")
            }
            Write-Output ($contents[$contents.Length - 1] + "`n]")
        }
        else
        {
            $contents[0]
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
        $token = get-sessionToken
        lockService $hostname $port $token $true $lock
        doLogout $hostname $port $token
    }
    elseif ($logintoken)
    {
        $username = $logintoken
        $token = get-sessionToken
        Write-Output $token
    }
    elseif ($unlock)
    {
        $token = get-sessionToken
        lockService $hostname $port $token $false $unlock
        doLogout $hostname $port $token
    }
    elseif ($emailavailable)
    {
        $username = $emailavailable
        isEmailnameAvailable $hostname $port $username
    }
    elseif ($forgotpassword)
    {
        $username = $forgotpassword
        forgottenPassword $hostname $port $username
    }
    elseif ($resendActivationMail)
    {
        $token = get-sessionToken
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
        $token = get-sessionToken
        get-it $hostname $port $token attributes
        doLogout $hostname $port $token
    }
    elseif ($getcommprefs)
    {
        $token = get-sessionToken
        get-it $hostname $port $token communication-preferences
        doLogout $hostname $port $token
    }
    elseif ($updatecommprefs)
    {
        $jsonBody = Get-Content $updatecommprefs
        $token = get-sessionToken
        execRestUpdateComPrefs $hostname $port $token $jsonBody
        doLogout $hostname $port $token
    }
    elseif ($getnotifications)
    {
        $token = get-sessionToken
        get-it $hostname $port $token notifications
        doLogout $hostname $port $token
    }
    elseif ($getnotificationsprefs)
    {
        $token = get-sessionToken
        get-it $hostname $port $token notifications-preferences
        doLogout $hostname $port $token
    }
    elseif ($updatenotificationsprefs)
    {
        $jsonBody = Get-Content $updatenotificationsprefs
        $token = get-sessionToken
        execRestUpdateNotificationsPrefs $hostname $port $token $jsonBody
        doLogout $hostname $port $token
    }
    elseif ($getpersonalinfo)
    {
        $token = get-sessionToken
        get-it $hostname $port $token personal-info
        doLogout $hostname $port $token
    }
    elseif ($updatepersonalinfo)
    {
        $jsonBody = Get-Content $updatepersonalinfo
        $token = get-sessionToken
        execRestUpdatePersonalInfo $hostname $port $token $jsonBody
        doLogout $hostname $port $token
    }
    elseif ($getprofile)
    {
        $token = get-sessionToken
        get-it $hostname $port $token profile
        doLogout $hostname $port $token
    }
    elseif ($updateprofile)
    {
        $jsonBody = Get-Content $updateprofile
        $token = get-sessionToken
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
