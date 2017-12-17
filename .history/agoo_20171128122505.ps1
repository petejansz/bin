$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$email = '%YOPMAIL.com'
$firstName = 't%'
$lastName = 'lastname'
$devJson = admin-search-players.js -h   pdadmin -e $email | formatJson
$myJson =  admin-search-players.js -h localhost -e $email | formatJson
$count = ($devJson | ConvertFrom-Json).Count

"Found: {0}" -f $count

Compare-Object $devJson $myJson