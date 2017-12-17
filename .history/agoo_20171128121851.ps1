$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

$email = 'test5%@yopmail.com'
$devJson = admin-search-players.js -h pdadmin -f 'z%' -l 'lastname'| formatJson
$myJson = admin-search-players.js -h localhost -f 'z%' -l 'lastname' | formatJson
$count = ($devJson | ConvertFrom-Json).Count

"Count: {0}" -f $count

Compare-Object $devJson $myJson