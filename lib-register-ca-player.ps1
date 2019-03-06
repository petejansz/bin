<#
    Author: Pete Jansz, IGT, June 2017
#>

. lib-general.ps1
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$CA_SITE_ID = '35'
$MOBILE_CLIENT_ID = "CAMOBILEAPP"
$PWS_CLIENT_ID = 'SolSet2ndChancePortal'
$MOBILE_CHANNEL_ID = '3'
$PWS_CHANNEL_ID = '2'

$SystemId = '8'
$SiteId = $CA_SITE_ID

function createHeader( [string]$hostname )
{
    $channel = $PWS_CHANNEL_ID
    $clientId = $PWS_CLIENT_ID

    if ($hostname -match "mobile")
    {
        $channel = $MOBILE_CHANNEL_ID
        $clientId = $MOBILE_CLIENT_ID
    }

    $header = @{                                       `
            'cache-control'  = 'no-cache'            ; `
            'content-type'   = 'application/json'    ; `
            'x-site-id'      = $SiteId               ; `
            'x-ex-system-id' = $SystemId             ; `
            'x-channel-id'   = $channel              ; `
            'x-client-id'    = $clientId             ; `
            'x-clientip'     = (get-ipv4InetAddress) ; `
            'x-esa-api-key'  = 'di9bJ9MPTXOZvEKAvd7CM8cRJ4Afo54b' ; `
            'x-device-uuid'  = ('UUID-' + (get-ipv4InetAddress) ); `
    }

    return $header
}
function createAuthHeader( [string]$oauthToken, [string]$hostname ) # @map
{
    $channel = $PWS_CHANNEL_ID
    if ($hostname -match "mobile")
    {$channel = $MOBILE_CHANNEL_ID}

    $authHeader = @{                                      `
            'cache-control'  = 'no-cache'               ; `
            'content-type'   = 'application/json'       ; `
            'authorization'  = ("OAuth " + $oauthToken) ; `
            'x-site-id'      = $SiteId                  ; `
            'x-ex-system-id' = $SystemId                ; `
            'x-channel-id'   = $channel                 ; `
            'x-clientip'     = (get-ipv4InetAddress)    ; `
            'x-esa-api-key'  = "di9bJ9MPTXOZvEKAvd7CM8cRJ4Afo54b"; `
            'x-device-uuid'  = ('UUID-' + (get-ipv4InetAddress));`
    }

    return $authHeader
}

$LOGTIME_FORMAT = "yyyy-MM-dd-HH:mm:ss.fff"
function log( [string]$text )
{
    $dt = get-date

    if (-not($ScriptName))
    {
        $ScriptName = 'ScriptName_UNDEF'
    }

    $logdir = "$env:USERPROFILE/log"
    if (-not (Test-Path "$env:USERPROFILE/log" )) {mkdir "$env:USERPROFILE/log" | Out-Null}
    $logfilename = "{0}/{1}-{2}.log" -f $logdir, $ScriptName, (get-date $dt -format "yyyy-MM-dd-HH")
    $now = get-date $dt -format $LOGTIME_FORMAT
    $msg = "{0} {1} {2}" -f $now, $ScriptName, $text
    Write-output $msg | Tee-Object -Append $logfilename
}

function logPlayer( $player, [string]$text, $response )
{
    if ($response)
    {
        $msg = "{0} {1} {2}" -f $player.PlayerEmail, $text, $response.StatusCode
    }
    else
    {
        $msg = "{0} {1}" -f $player.PlayerEmail, $text
    }

    log $msg
}
function webExceptionResponseToString( $ex )
{
    $result = $ex.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($result)
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    return $reader.ReadToEnd()
}

class MyWebException : System.Exception
{
    [string] $TotalMessage
    [int] $code

    MyWebException( $functionName, $anException, $code ) : base( $functionName )
    {
        $webRespStr = webExceptionResponseToString $anException
        $this.TotalMessage = "MyWebException [{0}] {1}" -f $functionName, $webRespStr
        $this.code = $code
    }
}

<#
.SYNOPSIS
Convert date-string "MM/DD/YYYY" to milliseconds since epoch, UTC.

.DESCRIPTION
Convert date-string "MM/DD/YYYY" to milliseconds since epoch, UTC.

.PARAMETER mmddyyyy
[string]"MM/DD/YYYY"

.EXAMPLE
"1/24/1991""

.NOTES
#>
function dateToEpochFormat( [string]$mmddyyyy ) # [int]
{
    return ([int](get-date (Get-Date -Date $mmddyyyy).ToUniversalTime() -uformat %s) * 1000)
}

function createUriBase( [string]$hostname, [int]$port )
{
    $proto = "https"

    if ($port -ne 443)
    {
        $proto = "http"
    }

    if ($hostname -notmatch "com$")
    {
        $hostname += '.gtech.com'
    }

    $uriBase = "{0}://{1}" -f $proto, $hostname

    if ($proto -eq "http" -and $port -gt 8000)
    {
        $uriBase += ":{0}" -f $port
    }

    return $uriBase
}

function isEmailnameAvailable( [string]$hostname, [int]$port, [string]$emailName ) # boolean
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/players/available/${emailName}"
    $header = createHeader $hostname
    $response = Invoke-WebRequest -uri $uri -Method GET -Headers $header
    ($response.Content -match "true")
}

function execRestOauthLogin( [string]$hostname, [int]$port, [string]$username, [string]$password )
{
    <#
    .OUTPUTS [string] $authCode
    #>

    $resourceOwnerCredentials = New-Object PsObject -Property @{
        USERNAME = $username
        PASSWORD = $password
    }

    $body = New-Object PsObject -Property @{
        siteId                   = $SiteId
        clientId                 = $PWS_CLIENT_ID
        resourceOwnerCredentials = $resourceOwnerCredentials
    }

    $header = createHeader $hostname

    if ($hostname -match "mobile")
    {
        $body.clientId = $MOBILE_CLIENT_ID
    }

    $body = $body | ConvertTo-Json -depth 3
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/oauth/login"
    $resp = Invoke-WebRequest -uri $uri -Method POST -Body $body -Headers $header
    return ($resp.content | ConvertFrom-Json).authcode
}

function execOAuthTokens ( [string]$hostname, [int]$port, [string]$authCode ) # [string] $token
{
    $body = New-Object PsObject -Property @{
        authCode = $authCode
        clientId = $PWS_CLIENT_ID
        siteId   = $SiteId
    }

    if ($hostname -match "mobile")
    {
        $body.clientId = $MOBILE_CLIENT_ID
    }

    $header = createHeader $hostname

    $body = $body | ConvertTo-Json

    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/oauth/self/tokens"
    $resp = Invoke-WebRequest -uri $uri -Method POST -Body $body -Headers $header
    $mobileToken = ($resp.content | ConvertFrom-Json).token[0]
    $pwsToken = ($resp.content | ConvertFrom-Json).token[1]

    if ($hostname -match "mobile")
    {
        $token = $mobileToken
    }
    else
    {
        $token = $pwsToken
    }

    return $token
}

function login ( [string]$hostname, [int]$port, [string]$username, [string]$password ) # [string]$sessionToken
{
    $authCode = execRestOauthLogin $hostname $port $username $password
    $sessionToken = execOAuthTokens $hostname $port $authCode
    return $sessionToken
}

function doPutPost([string]$uri, [string]$method, [string]$jsonBody, [object]$header)
{
    Invoke-WebRequest -uri $uri -Method $method -Body $jsonBody -Headers $header
}
function execRestReqSendActivationMail( [string]$hostname, [int]$port, [string]$oauthToken ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v2/players/self/activation-mail"
    $jsonBody = "{}"
    $header = createAuthHeader $oauthToken $hostname
    Invoke-WebRequest -uri $uri -Method PUT -Body $jsonBody -Headers $header
}

function execRestActivateAccount( [string]$hostname, [int]$port, [string] $devxToken ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v2/players/activate-account/$devxToken"
    $jsonBody = '{}'
    $header = createHeader $hostname
    Invoke-WebRequest -uri $uri -Method POST -Body $jsonBody -Headers $header
}

function execRestForgottenPassword( [string]$hostname, [int]$port, [string] $username ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v2/players/forgotten-password"
    $jsonBody = "{`"emailAddress`": `"$username`"}"
    $header = createHeader $hostname
    doPutPost $uri "PUT" $jsonBody $header
}

function execRestGetSelf( [string]$hostname, [int]$port, [string]$oauthToken, [string]$pathinfo  ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/players/self/${pathinfo}"
    $header = createAuthHeader $oauthToken $hostname

    Invoke-WebRequest -uri $uri -Method GET -Headers $header
}

function execRestGetPersonalInfo( [string]$hostname, [int]$port, [string]$oauthToken ) # response
{
    $pathinfo = "personal-info"
    return execRestGetSelf $hostname $port $oauthToken $pathinfo
}

function execRestChangePassword( [string]$hostname, [int]$port, [string]$oauthToken, [string]$jsonBody  ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v2/players/self/password"
    $header = createAuthHeader $oauthToken $hostname

    try
    {
        Invoke-WebRequest -uri $uri -Method PUT -Body $jsonBody -Headers $header
    }
    catch
    {
        throw
    }
}

function execRestUpdatePersonalInfo( [string]$hostname, [int]$port, [string]$oauthToken, [string]$jsonBody ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/players/self/personal-info"
    $header = createAuthHeader $oauthToken $hostname

    try
    {
        Invoke-WebRequest -uri $uri -Method PUT -Body $jsonBody -Headers $header
    }
    catch
    {
        throw
    }
}
function execRestGetAttributes( [string]$hostname, [int]$port, [string]$oauthToken ) # response
{
    $pathinfo = "attributes"
    return execRestGetSelf $hostname $port $oauthToken $pathinfo
}
function execRestGetComPrefs( [string]$hostname, [int]$port, [string]$oauthToken ) # response
{
    $pathinfo = "communication-preferences"
    return execRestGetSelf $hostname $port $oauthToken $pathinfo
}
function execRestUpdateComPrefs( [string]$hostname, [int]$port, [string] $oauthToken, [string]$jsonBody ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/players/self/communication-preferences"
    $header = createAuthHeader $oauthToken $hostname

    Invoke-WebRequest -uri $uri -Method PUT -Body $jsonBody -Headers $header
}
function execRestGetNotificationsPrefs( [string]$hostname, [int]$port, [string]$oauthToken ) # response
{
    $pathinfo = "notifications-preferences"
    return execRestGetSelf $hostname $port $oauthToken $pathinfo
}
function execRestUpdateNotificationsPrefs( [string]$hostname, [int]$port, [string] $oauthToken, [string]$jsonBody  ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/players/self/notifications-preferences"
    $header = createAuthHeader $oauthToken $hostname

    Invoke-WebRequest -uri $uri -Method PUT -Body $jsonBody -Headers $header
}

function execRestGetProfile( [string]$hostname, [int]$port, [string]$oauthToken ) # response
{
    $pathinfo = "profile"
    return execRestGetSelf $hostname $port $oauthToken $pathinfo
}
function execRestUpdateProfile( [string]$hostname, [int]$port, [string] $oauthToken, [string]$jsonBody ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/players/self/profile"
    $header = createAuthHeader $oauthToken $hostname

    Invoke-WebRequest -uri $uri -Method PUT -Body $jsonBody -Headers $header
}

function execRestLockService( [string]$hostname, [int]$port, [string]$oauthToken, [boolean]$lock, [string]$reason ) # $response
{
    $bodyTemplate = '{"lockPlayer" : "LOCK_VALUE", "reason" : "REASON_VALUE"}'

    $body = $bodyTemplate -replace 'LOCK_VALUE', ($lock.ToString().ToLower())
    $body = $body -replace 'REASON_VALUE', $reason

    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v1/players/self/lock-service"
    $header = createAuthHeader $oauthToken $hostname

    Invoke-WebRequest -uri $uri -Method PUT -Body $body -Headers $header
}
function execRestRegisterUser( [string]$hostname, [int]$port, [string] $jsonBody ) # response
{
    $baseUri = createUriBase $hostname $port
    $uri = "${baseUri}/api/v2/players"
    $header = createHeader $hostname

    try
    {
        return Invoke-WebRequest -uri $uri -Method POST -Body $jsonBody -Headers $header
    }
    catch
    {
        throw
    }
}

function activate( [string]$hostname, [int]$port, [string]$xToken ) # Boolean
{
    $result = $False
    [int] $activationToken = $xToken.Trim()

    $response = execRestActivateAccount $hostname $port $activationToken
    $result = ($response.StatusCode -match "204")
    if ($result)
    {
        logPlayer $activationToken ("ACTIVATED; PlayerID=${activationToken}")
    }

    $result
}

function update( $hostname, $port, $player, [string] $password )
{
    $token = $null
    $updatePerformed = $False

    try
    {
        $token = login $hostname $port $player.PlayerEmail $password
    }
    catch [Exception]
    {
        log ("Login failed: {0}/{1}, Exception: {2}" -f $player.PlayerEmail, $password, $_.Exception.Message)
        return $updatePerformed
    }

    # Lock account?
    if ( $player.PlayerPortalStatusID -eq 3 -or $player.PlayerSecondChanceServiceID -eq 3 )
    {
        $reason = 'PlayerPortalStatusID == 3 or PlayerSecondChanceServiceID == 3'
        $response = execRestLockService $hostname $port $token $true $reason
        logPlayer $player "ACCOUNT_LOCKED"
        $updatePerformed = $True
    }

    # Update emailFormat?
    if ( $player.PlayerPreferredEmailFormat -match "plain" )
    {
        $jsonResponse = execRestGetComPrefs $hostname $port $token
        $commPrefs = $jsonResponse.content | ConvertFrom-Json

        # Change to something else:
        $commPrefs.emailFormat = 'TEXT'
        $jsonBody = $commPrefs | ConvertTo-Json
        $jsonResponse = execRestUpdateComPrefs $hostname $port $token $jsonBody
        $jsonResponse = execRestGetComPrefs $hostname $port $token
        $commPrefs = $jsonResponse.content | ConvertFrom-Json
        logPlayer $player "EMAIL_FMT set to TEXT"

        $updatePerformed = $True
    }

    return $updatePerformed
}

function create_nonpublicPersonalInfo($player)
{
    $nonpublicPersonalInfo = New-Object PsObject -Property @{
        dateOfBirth = [string] (dateToEpochFormat $player.PlayerBirthdate)
    }

    return $nonpublicPersonalInfo
}

function create_caProfile($player)
{
    $caProfile = New-Object PsObject -Property @{
        acceptsPromotionalEmail  = [boolean]($player.PlayerPromotionalEmails -match "^1$")
        language                 = $player.PlayerLanguage.ToUpper().Substring(0, 2)
        registrationDate         = dateToEpochFormat $player.PlayerCreateDate
        acceptTermsAndConditions = [boolean]$True
        termsAndConditionsId     = dateToEpochFormat $player.PlayerCreateDate
        registrationLevel        = [int]1
        userName                 = $player.PlayerUsername
        jackpotCaptain           = [boolean]($player.PlayerJackpotCaptain -match "^1$")
    }

    return $caProfile
}

function create_addresses($player)
{
    $addressMailObject = New-Object PsObject -Property @{
        street         = [string]$player.PlayerAddress
        address1       = [string]$player.PlayerAddress
        address2       = $player.PlayerAddress2
        city           = $player.PlayerCity
        isoCountryCode = $player.PlayerCountry
        country        = $player.PlayerCountry
        postalCode     = $player.PlayerZip
        state          = $player.PlayerState
        verifyLevel    = $player.AddressVerifyLevel
    }

    $addresses = New-Object PsObject -Property @{
        MAILING = $addressMailObject
    }

    $addresses
}

function create_phones($player)
{
    $phonesHomeObject = New-Object PsObject -Property @{
        type     = "HOME"
        number   = $player.PlayerPhone
        provider = "Regular"
    }

    $phones = New-Object PsObject -Property @{
        HOME = $phonesHomeObject
    }

    return $phones
}

function create_emails($player)
{
    $PERSONALobj = New-Object PsObject -Property @{
        type           = "PERSONAL"
        address        = $player.PlayerEmail
        verified       = [boolean]$false
        certaintyLevel = $player.EmailCertaintyLevel
    }

    $emails = New-Object PsObject -Property @{
        PERSONAL = $PERSONALobj
    }

    return $emails
}

function convertToGender($v)
{
    $gender = "UNSPECIFIED"

    if ($v -match "M")
    {
        $gender = "MALE"
    }
    elseif ($v -match "F")
    {
        $gender = "FEMALE"
    }

    return $gender
}

function create_personalInfo ($player)
{
    $personalInfo = New-Object PsObject -Property @{
        firstName                       = $player.PlayerFirstName
        middleName                      = ""
        lastName                        = $player.PlayerLastName
        gender                          = convertToGender $player.PlayerGender
        addresses                       = create_addresses $player
        phones                          = create_phones $player
        emails                          = create_emails $player

        addressResultCode               = $player.AddressResultCode
        dateOfBirth                     = dateToEpochFormat $player.PlayerBirthdate
        dateOfBirthMatchCode            = $player.DateOfBirthMatchCode
        errorCode                       = $player.ErrorCode
        userIdVerified                  = $player.UserIDVerified -replace '"', ''
        ssnresultCode                   = $player.SSNResultCode
        ofacvalidationResultCode        = $player.OFACValidationResultCode -replace '"', ''
        telephoneVerificationResultCode	= $player.TelephoneVerificationResultCode
    }

    return $personalInfo
}

function create_registerUserDTO( $player, [string]$password )
{
    $DTO = New-Object PsObject -Property @{
        password              = $password
        personalInfo          = create_personalInfo $player
        nonpublicPersonalInfo = create_nonpublicPersonalInfo $player
        caProfile             = create_caProfile $player
    }

    return $DTO
}
