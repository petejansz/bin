<#
    Parse DLV_NOTIFICATION_REQUESTS.extra_parameters text

    1. Copy DLV_NOTIFICATION_REQUESTS.extra_parameters text to clipboard.
    2. Run this command to parse the text

    Author: Pete Jansz, IGT, Aug 2017
#>

param
(
    [switch]    $clip,
    [switch]    $ls,
    [switch]    $token
)

if ($clip)
{
    $inputText = Get-Clipboard
}
else
{   // Read stdin
    $inputText = $input
}

$map = @{}

foreach ($item in $inputText.split(';'))
{
    if ($ls)
    {
        $key = $item.split('=')[0]
        $value = $item.split('=')[1]
        $map.Add($key, $value)
    }

    if ($token)
    {
        if ($item -match "^token=")
        {
            $code = $item.split('=')[1]
            $code
            break;
        }
    }
}

if ($ls)
{
    $map | ConvertTo-Json -Depth 100
}