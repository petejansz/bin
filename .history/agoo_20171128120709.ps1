$email = 'test60@yopmail.com'
$devJson = admin-search-players.js -h pdadmin -e $email| formatJson
$myJson = admin-search-players.js -h localhost -e $email | formatJson

Compare-Object $devJson $myJson