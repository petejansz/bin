$devJson = admin-search-players.js -h pdadmin -e test%@yopmail.com | formatJson
$myJson = admin-search-players.js -h localhost -e test%@yopmail.com | formatJson

Compare-Object $devJson $myJson