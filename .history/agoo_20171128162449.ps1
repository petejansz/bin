$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

Set-Location C:\Users\pjansz\Documents\json\search-players

$city = 'l%'
$email = 'test60@yopmail.com'
$firstName = 't%'
$lastName = 'lastname'

function fileAndReport($devJson, $myJSon)
{
    $devJson | Out-File -Encoding utf8 -force 'dev-search.json'
    $myJson |  Out-File -Encoding utf8 -force 'my-search.json'

    $devCount = ($devJson | ConvertFrom-Json).Count
    $myCount = ($myJson | ConvertFrom-Json).Count

    "DevCount: {0}" -f $devCount
    "MyCount: {0}" -f $myCount

    Compare-Object (Get-Content 'dev-search.json') (Get-Content 'my-search.json')
}

function testCity()
{
    $devJson = admin-search-players.js -h   pdadmin -c $city | formatJson
    $myJson = admin-search-players.js -h localhost -c $city | formatJson

    fileAndReport $devJson $myJson
}

function testEmail()
{
    $devJson = admin-search-players.js -h   pdadmin -e $email | formatJson
    $myJson = admin-search-players.js -h localhost -e $email | formatJson
    fileAndReport $devJson $myJson
}

function testName()
{
    $devJson = admin-search-players.js -h   pdadmin -f $firstName -l $lastName | formatJson
    $myJson = admin-search-players.js -h localhost -f $firstName -l $lastName  | formatJson
    fileAndReport $devJson $myJson
}

testCity
testEmail
testName