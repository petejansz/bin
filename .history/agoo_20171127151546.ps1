$file = 'C:\Users\pjansz\Documents\pd\core-log-getPlayer.txt'
foreach ($item in (cat $file))
{
    $item | ConvertFrom-Json  | formatJson
}