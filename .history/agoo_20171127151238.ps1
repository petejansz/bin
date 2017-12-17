$file = 'C:\Users\pjansz\Documents\pd\core-log-getPlayer.txt'
foreach ($item in (cat $file))
{
    $json = ConvertFrom-Json
    $json | formatJson
    exit
}