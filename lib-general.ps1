<#
    Author: Pete Jansz, IGT, June 2017
#>

$addressLine = "^[a-zA-Z0-9 /.#-]{1,50}$"
$addressLineNotRequired = "^[a-zA-Z0-9 /.#-]{0,50}$"
$EmailRegex = "^[a-zA-Z0-9.!£#$%&'^_`{}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
$FirstnameRegEx = "^[A-Z ,.'-]{1,30}$"
$FirstnameRegEx = "^[A-Za-z\\xE1\\xE9\\xED\\xF3\\xFA\\xC1\\xC9\\xCD\\xD3\\xDA\\xF1\\xD1\\xDC\\xFC ,.'-]{1,30}$"
$LastnameRegEx = "^[A-Za-z\\xE1\\xE9\\xED\\xF3\\xFA\\xC1\\xC9\\xCD\\xD3\\xDA\\xF1\\xD1\\xDC\\xFC ,.'-]{1,30}$"

function rmXmlDeclaration ([string]$filename)
{
    $absFilename = resolve-path $filename
    [xml] $xmlDoc = Get-Content ($absFilename)
    if ($xmlDoc.xml -match 'version=')
    {
        $xmlDoc.RemoveChild($xmlDoc.FirstChild) | out-null
        $xmlDoc.save($absFilename)
    }
}
function Format-XML ([string]$xmlfilename, [bool]$indent = $true, [int]$indentCount = 4)
{
    [xml]$xml = Get-Content $xmlfilename
    $StringWriter = New-Object System.IO.StringWriter
    $XmlWriter = New-Object System.XMl.XmlTextWriter $StringWriter
    if ($indent)
    {
        $xmlWriter.Formatting = "Indented"
        $xmlWriter.Indentation = $indentCount
    }
    else
    {
        $xmlWriter.Formatting = "None"
    }

    $xml.WriteContentTo($XmlWriter)
    $XmlWriter.Flush()
    $StringWriter.Flush()
    Write-Output $StringWriter.ToString()
}
function prettyXml ([string]$filename, $indentCount = 4)
{
    $absFilename = resolve-path $filename
    $xmlstr = Format-XML $absFilename $true $indentCount
    $xmlstr | out-file -encoding UTF8 -force $absFilename
}

function compressXml ([string]$filename)
{
    $absFilename = resolve-path $filename
    $xmlstr = Format-XML $absFilename $false
    $xmlstr | out-file -encoding UTF8 -force $absFilename
}

function squeezeXml ([string]$filename) {compressXml $filename }
function shrinkXml  ([string]$filename) {compressXml $filename }
function get-ipv4InetAddress()
{
    return (Test-Connection -ComputerName $env:computername -count 1).IPV4Address.ipaddressTOstring
}

function dateToLong([string]$yyyymmdd)
{
    <#
    .DESCRIPTION
    Convert date of form, YYYYMMDD to long number

    .OUTPUTS
    [long]
    #>

    "new Date(`"${yyyymmdd}`").getTime()" | node -p
}
function longToDate([long] $long)
{
    "new Date(${long}).toString()" | node -p
}
function dateToTime([string] $yyyymmdd)
{
    <#
    .DESCRIPTION
    Convert date of form, YYYYMMDD to long number

    .OUTPUTS
    [long]
    #>

    dateToLong $yyyymmdd
}
function timeToDate($long)
{
    longToDate $long
}
function myip()
{
    return (get-ipv4InetAddress)
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
        [char][int] $c = $hex
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
    if (-not ($name -cmatch $FirstnameRegEx ) )
    {
        throw "Invalid Firstname: $name"
    }
}

function validateLastname( [string]$name )
{
    if (-not ($name -cmatch $LastnameRegEx ) )
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
