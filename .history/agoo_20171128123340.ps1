$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$email = '%YOPMAIL.com'
$firstName = 't%'
$lastName = 'lastname'
$devJson = admin-search-players.js -h   pdadmin -e $email | formatJson
$myJson =  admin-search-players.js -h localhost -e $email | formatJson
$devJson | tee.exe 'dev-search.json'
$myJson | tee.exe 'my-search.json'

$devCount = ($devJson | ConvertFrom-Json).Count
$myCount = ($myJson | ConvertFrom-Json).Count

"DevCount: {0}" -f $devCount
"MyCount: {0}" -f $myCount

Compare-Object (cat 'dev-search.json') (cat 'my-search.json')