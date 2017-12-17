$email = 'zzzz%'
$devJson = admin-search-players.js -h pdadmin -e $email| formatJson
$myJson = admin-search-players.js -h localhost -e $email | formatJson
$count = ($devJson | ConvertFrom-Json).Count

"Count: {0}" -f $count

Compare-Object $devJson $myJson