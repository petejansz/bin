$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$email = 'test5%@yopmail.com'
$firstName = 't%'
$lastName = 'lastname'
$devJson = admin-search-players.js -h   pdadmin -f $firstName -l $lastName | formatJson
$myJson =  admin-search-players.js -h localhost -f $firstName -l $lastName | formatJson
$count = ($devJson | ConvertFrom-Json).Count

"Count: {0}" -f $count

Compare-Object $devJson $myJson