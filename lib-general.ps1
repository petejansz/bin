<#
    Author: Pete Jansz, IGT, June 2017
#>
$AddressLineRegEx = "^[a-zA-Z0-9 /.#-]{1,50}$"
$AddressLineNotRequiredRegEx = "^[a-zA-Z0-9 /.#-]{0,50}$"
$EmailRegex = "^[a-zA-Z0-9.!£#$%&'^_`{}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
$LastnameRegEx = "^[A-Za-z\\xE1\\xE9\\xED\\xF3\\xFA\\xC1\\xC9\\xCD\\xD3\\xDA\\xF1\\xD1\\xDC\\xFC ,.'-]{1,30}$"
$FirstnameRegEx = "^[A-Z ,.'-]{1,30}$"
$FirstnameRegEx = "^[A-Za-z\\xE1\\xE9\\xED\\xF3\\xFA\\xC1\\xC9\\xCD\\xD3\\xDA\\xF1\\xD1\\xDC\\xFC ,.'-]{1,30}$"

filter my-cat( $file )
{
    if ( $file -and ($file.GetType().Name -eq 'String' -or $file.GetType().Name -eq 'FileInfo') )
    {
        $output = Get-Content $file
    }
    else # stdin
    {
        $tmpFile = New-TemporaryFile

        foreach ($item in $input)
        {
            $item | Out-File $tmpFile -Encoding UTF8 -Append
        }

        $output = Get-Content $tmpFile #| format-json.js

        Remove-Item $tmpFile
    }

    return $output
}
filter lowercase
{
    if ($_.GetType().Name -eq "String")
    {
        return $_.ToLower()
    }
    else
    {
        throw "Not a String."
    }
}
function Format-XML( [string]$xmlfilename, [bool]$indent = $true, [int]$indentCount = 4 )
{
    <#
    .SYNOPSIS
    Format XML file

    .DESCRIPTION
    Format XML file

    .INPUTS
    [string] xmlfilename
    [bool] indent
    [int] indentCount

    .OUTPUTS
    String of XML content

    #>

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
function prettyXml( $file, [bool]$overwrite = $false, [int]$indentCount = 4 )
{
    <#
    .SYNOPSIS
    Format XML as human-readable

    .DESCRIPTION
    Format XML as human-readable

    .INPUTS
    stdin or FileInfo or String filename
    [bool] overwrite file
    [int] indentCount

    .OUTPUTS
    String of XML content

    #>

    $tempFile = $null

    if ( $file -and ($file.GetType().Name -eq 'String' -or $file.GetType().Name -eq 'FileInfo') )
    {
        $absFilename = (resolve-path $file).Path
    }
    else # stdin
    {
        $tempFile = New-TemporaryFile
        $absFilename = (resolve-path $tempFile).Path

        foreach ($item in $input)
        {
            $item | Out-File $absFilename -Encoding UTF8 -Append
        }
    }

    $xmlstr = Format-XML $absFilename $true $indentCount

    if ($overwrite)
    {
        $xmlstr | out-file -encoding UTF8 -force $absFilename
    }

    if ($tempFile) { Remove-Item $tempFile }

    return $xmlstr
}

function compressXml( $file, [bool]$overwrite = $false )
{
    <#
    .SYNOPSIS
    Compress XML, remove white-space between elements

    .DESCRIPTION
    Compress XML, remove white-space between elements

    .INPUTS
    stdin or FileInfo or String filename
    [bool] overwrite file

    .OUTPUTS
    String of XML content

    #>

    $tempFile = $null

    if ( $file -and ($file.GetType().Name -eq 'String' -or $file.GetType().Name -eq 'FileInfo') )
    {
        $absFilename = (resolve-path $file).Path
    }
    else # stdin
    {
        $tempFile = New-TemporaryFile
        $absFilename = (resolve-path $tempFile).Path

        foreach ($item in $input)
        {
            $item | Out-File $absFilename -Encoding UTF8 -Append
        }
    }

    $xmlstr = Format-XML $absFilename $false

    if ($overwrite)
    {
        $xmlstr | out-file -encoding UTF8 -force $absFilename
    }

    if ($tempFile) { Remove-Item $tempFile }

    return $xmlstr
}

function rmXmlDeclaration( $file )
{
    <#
    .SYNOPSIS
    Remove xml declaration from XML file

    .DESCRIPTION
    Remove xml declaration from XML file

    .INPUTS
    stdin or FileInfo or file name

    .OUTPUTS
    String of XML content

    #>

    $tempFile = $null

    if ( $file -and ($file.GetType().Name -eq 'String' -or $file.GetType().Name -eq 'FileInfo') )
    {
        $absFilename = (resolve-path $file).Path
    }
    else # stdin
    {
        $tempFile = New-TemporaryFile
        $absFilename = (resolve-path $tempFile).Path

        foreach ($item in $input)
        {
            $item | Out-File $absFilename -Encoding UTF8 -Append
        }
    }

    [xml] $xmlDoc = Get-Content $absFilename
    if ($xmlDoc.FirstChild.Value -match 'version=')
    {
        $xmlDoc.RemoveChild($xmlDoc.FirstChild) | out-null
        $xmlDoc.save($absFilename)
    }

    $xmlStr = Get-Content $absFilename
    if ($tempFile) { Remove-Item $tempFile }

    return $xmlstr
}

function get-ipv4InetAddress()
{
    return (Test-Connection -ComputerName $env:computername -count 1).IPV4Address.ipaddressTOstring
}

function db2ExportDate( [string]$exportDate )
{
    $yr, $mo, $dom = $exportDate.split('-')[0, 1, 2]
    return "${yr}-${mo}-${dom}"
}

function dateToLong( [string]$yyyymmdd )
{
    <#
    .DESCRIPTION
    Convert date of form, YYYYMMDD to long number

    .OUTPUTS
    [long]
    #>

    "new Date(`"${yyyymmdd}`").getTime()" | node -p
}

function longToJSON( [long] $long )
{
    <#
    .DESCRIPTION
    Convert long UnixTimeMilliseconds to JSON passable to .NET DateTime

    .INPUTS
    [long] $long UnixTimeMilliseconds

    .OUTPUTS
    [string]

    .Example
    1565040240000 == 'Monday, August 5, 2019 2:24:00 PM'
    returns '2019-08-05T21:24:00.000Z'
    #>

    "new Date( ${long} ).toJSON()" | node -p
}

function longToDateTime( [long] $long )
{
    <#
    .SYNOPSIS
    Convert long UnixTimeMilliseconds to .NET DateTime

    .DESCRIPTION
    Convert long UnixTimeMilliseconds to .NET DateTime

    .INPUTS
    [long] long UnixTimeMilliseconds

    .OUTPUTS
    [DateTime]

    .EXAMPLE
    1565040240000 == 'Monday, August 5, 2019 2:24:00 PM' == 637006118400000000 ticks
    #>

    $jsDate = longToJSON $long
    return [DateTime]::Parse( $jsDate )
}

function longToDateTimeOffset( [long] $long )
{
    <#
    .SYNOPSIS
    Convert long UnixTimeMilliseconds to .NET DateTimeOffset

    .DESCRIPTION
    Convert long UnixTimeMilliseconds to .NET DateTimeOffset

    .INPUTS
    [long] long UnixTimeMilliseconds

    .OUTPUTS
    [DateTimeOffset]

    .EXAMPLE
    1565040240000 == 'Monday, August 5, 2019 2:24:00 PM' == 637006118400000000 ticks
    #>

    [DateTimeOffset]::FromUnixTimeMilliseconds( $long ).ToLocalTime()
}

function longToDate( [long] $long )
{
    <#
    .SYNOPSIS
    Convert long UnixTimeMilliseconds to local date-time string

    .DESCRIPTION
    Convert long UnixTimeMilliseconds to local date-time string

    .INPUTS
    [long] long UnixTimeMilliseconds

    .OUTPUTS
    [string] localized date-time

    .EXAMPLE
    1565040240000 == 'Mon Aug 05 2019 14:24:00 GMT-0700 (Pacific Daylight Time)'
    #>

    "new Date(${long}).toString()" | node -p
}

<#
    .DESCRIPTION
    Convert long UnixTimeMilliseconds to local date-time string, e.g.,
    1565040240000 == 'Mon Aug 05 2019 14:24:00 GMT-0700 (Pacific Daylight Time)'
#>
function timeToDate( $long )
{
    <#
    .SYNOPSIS
    Convert long UnixTimeMilliseconds to local date-time string

    .DESCRIPTION
    Convert long UnixTimeMilliseconds to local date-time string

    .INPUTS
    [long] long UnixTimeMilliseconds

    .OUTPUTS
    [string] localized date-time

    .EXAMPLE
    1565040240000 == 'Mon Aug 05 2019 14:24:00 GMT-0700 (Pacific Daylight Time)'
    #>

    longToDate $long
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

function convertLog4JDateToDateTime( [String] $logDate )
{
    <#
        .DESCRIPTION
        Convert dates of formats ('yyyy-MM-dd hh:mm:ss', 'yyyy-MM-dd:hh:mm:ss')
        to System.DateTime

        .OUTPUTS
        [DateTime]
    #>

    New-Variable -Name DateRegEx -Option ReadOnly -Value '^20[0-9]{2}-[0-9]{2}-[0-9]{2}'
    New-Variable -Name TimeRegEx -Option ReadOnly -Value '[0-9]{2}:[0-9]{2}:[0-9]{2}'
    New-Variable -Name DateFormat -Option ReadOnly -Value 'yyyy-MM-dd hh:mm:ss'

    if ($logDate -match "${DateRegEx}:${TimeRegEx}") # login-archiver
    {
        $dateTime = $logDate.split()[0]
        $datePart = $dateTime.split(':', 2)[0]
        $timePart = $dateTime.split(':', 2)[1]
        [DateTime] $dtTime = Get-Date ($datePart + ' ' + $timePart) -Format $DateFormat
    }
    elseif ($logDate -match "${DateRegEx} ${TimeRegEx}") # Standard log4j
    {
        $dateTime = $logDate.split(',')[0]
        [DateTime] $dtTime = Get-Date $dateTime -Format $DateFormat
    }

    return $dtTime
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

function hex2dec2( $hexValue )
{
    return [Convert]::ToInt64( $hexValue, 16 )
}

function convertToBase( [int]$numValue, [int]$base )
{
    return [Convert]::ToString($numValue, $base)
}

function convert2hex( $numValue )
{
    return convertToBase $numValue 16
}

function strToHex( [string]$str )
{
    return $str.ToCharArray() | ForEach-Object { $hex = convert2Hex ([int][char]$_); $hex.ToUpper() }
}

function bytesToStr( $bytes )
{
    $str = ''
    foreach ($byte in $bytes)
    {
        $hex = convertToBase $byte, 16
        [char][int] $c = $hex
        $str += $c
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
    if (-not  ($s -cmatch $AddressLineRegEx ) )
    {
        throw "Invalid Address: $s"
    }
}
function validateAddress2( [string] $s )
{
    if (-not  ($s -cmatch $AddressLineNotRequiredRegEx ) )
    {
        throw "Invalid Address2: $s"
    }
}
