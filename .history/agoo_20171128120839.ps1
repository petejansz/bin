$email = 'zzzz%'
$devJson = admin-search-players.js -h pdadmin -e $email| formatJson
$myJson = admin-search-players.js -h localhost -e $email | formatJson
($devJson | ConvertFrom-Json).Count
Compare-Object $devJson $myJson