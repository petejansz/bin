<#
    Author: Pete Jansz, IGT, June 2017
#>

#$mailRegex = "^[^\\s].{0,64}@.{1,200}\\..{0,55}[^\\s]$"
#$contractId = "^\\d{10}$"
#$phone = "^\\d{10,14}$"
#$PasswordRegex = '^((? = ".*\\d)(? = ".*[a-z])(? = ".*[A-Z]).{8,50})$'
#$passwordPatterns = '[A-Z],[a-z],[0-9],[&%$#@!]'
$addressLine = "^[a-zA-Z0-9 /.#-]{1,50}$"
$addressLineNotRequired = "^[a-zA-Z0-9 /.#-]{0,50}$"
#$city = "^[a-zA-Z0-9 ]{1,50}$"
#$postalCode = "^\\d{5}(\\d{4})?$"
#$isoCountryCode = "^[A-Z]{1,5}$"
#$state = "^[A-Z]{1,3}$"



$EmailRegex = "^[a-zA-Z0-9.!£#$%&'^_`{}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
$FirstnameRegEx = "^[A-Z ,.'-]{1,30}$"
$FirstnameRegEx = "^[A-Za-z\\xE1\\xE9\\xED\\xF3\\xFA\\xC1\\xC9\\xCD\\xD3\\xDA\\xF1\\xD1\\xDC\\xFC ,.'-]{1,30}$"
$LastnameRegEx = "^[A-Za-z\\xE1\\xE9\\xED\\xF3\\xFA\\xC1\\xC9\\xCD\\xD3\\xDA\\xF1\\xD1\\xDC\\xFC ,.'-]{1,30}$"
#$LastnameRegEx = $FirstnameRegEx

function get-ipv4InetAddress()
{
    return (Test-Connection -ComputerName $env:computername -count 1).IPV4Address.ipaddressTOstring
}

function hex2Dec( $hexValue )
{
    [int]$decValue = 0

    if ($hexValue -match "^0x.*")
    {
        $decValue = [int] $hexValue
    }
    else
    {
        $decValue = [int] ("0x" + $hexValue)
    }

    return $decValue
}

function hex2dec2 ($hexValue )
{
    return [Convert]::ToInt64( $hexValue, 16 )
}

function convertToBase ( [int]$numValue, [int]$base )
{
    return [Convert]::ToString($numValue, $base)
}

function convert2hex ( $numValue )
{
    return convertToBase $numValue 16
}

function strToHex( [string]$str )
{
    return $str.ToCharArray() | ForEach-Object {$hex = convert2Hex ([int][char]$_); $hex.ToUpper() }
}

function bytesToStr( $bytes )
{
   $str = ''
   foreach ($byte in $bytes)
   {
        $hex = convertToBase $byte, 16
        [char][int] $c =  $hex
        write-host $c
   }

   return $str
}
function convert2bin ( $numValue )
{
    return convertToBase $numValue 2
}

function validatePhonenumber( [string] $s )
{
    if (-not($s -match "^\d{10}$"))
    {
        throw "Invalid Phonenumber: $s"
    }
}

function fixPhoneNumber( [string]$phoneNumber )
{
    $fixedPhoneNumber = ""

    try
    {
        validatePhonenumber $phoneNumber
        $fixedPhoneNumber = $phoneNumber
    }
    catch
    {
        $fixedPhoneNumber = $phoneNumber -replace " |null", ""

        if ($fixedPhoneNumber.Length -lt 10)
        {
            $fixedPhoneNumber = "{0:D10}" -f [int]$fixedPhoneNumber
        }
    }

    return $fixedPhoneNumber
}

function validateFirstname( [string]$name )
{
    if (-not ($name  -cmatch $FirstnameRegEx ) )
    {
        throw "Invalid Firstname: $name"
    }
}

function validateLastname( [string]$name )
{
    if (-not ($name  -cmatch $LastnameRegEx ) )
    {
        throw "Invalid Lastname: $name"
    }
}

function validateEmailAddress( [string] $s )
{
    if (-not  ($s -cmatch $EmailRegex) )
    {
        throw "Invalid Email address: $s"
    }
}

function validateAddress( [string] $s )
{
    if (-not  ($s -cmatch $addressLine ) )
    {
        throw "Invalid Address: $s"
    }
}

function validateAddress2( [string] $s )
{
    if (-not  ($s -cmatch $addressLineNotRequired ) )
    {
        throw "Invalid Address2: $s"
    }
}
