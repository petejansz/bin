$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$email = '%YOPMAIL.com'
$firstName = 't%'
$lastName = 'lastname'
$devJson = admin-search-players.js -h   pdadmin -e $email | formatJson
$myJson =  admin-search-players.js -h localhost -e $email | formatJson
$devJson | Out-File -Encoding utf8 -force 'dev-search.json'
$myJson |  Out-File -Encoding utf8 -force 'my-search.json'

$devCount = ($devJson | ConvertFrom-Json).Count
$myCount = ($myJson | ConvertFrom-Json).Count

"DevCount: {0}" -f $devCount
"MyCount: {0}" -f $myCount

Compare-Object (Get-Content 'dev-search.json') (Get-Content 'my-search.json')