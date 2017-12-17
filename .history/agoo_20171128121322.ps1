$email = 'test5%@yopmail.com'
$devJson = admin-search-players.js -h pdadmin -f 'test' -l '%'| formatJson
$myJson = admin-search-players.js -h localhost -f 'test' -l '%' | formatJson
$count = ($devJson | ConvertFrom-Json).Count

"Count: {0}" -f $count

Compare-Object $devJson $myJson