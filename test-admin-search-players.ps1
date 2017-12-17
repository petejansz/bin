$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

Set-Location C:\Users\pjansz\Documents\json\search-players

$refHost = "cat1"
$city = 'l%'
$firstName = 't%'
$lastName = 'lastname'

function fileAndReport($testName, $refJson, $myJSon)
{
    $refJson | Out-File -Encoding utf8 -force 'ref-search.json'
    $myJson |  Out-File -Encoding utf8 -force 'my-search.json'

    $refCount = ($refJson | ConvertFrom-Json).Count
    $myCount = ($myJson | ConvertFrom-Json).Count

    "{0}: DevCount: {1}, MyCount: {2}" -f $testName, $refCount, $myCount

    Compare-Object (Get-Content '$ref-search.json') (Get-Content 'my-search.json')
}

function testCity()
{
    $refJson = admin-search-players.js -h   $refHost -c $city | formatJson
    $myJson = admin-search-players.js -h localhost -c $city | formatJson

    fileAndReport 'TestCity' $refJson $myJson
}

function testEmail()
{
    $emails = @('test60@yopmail.com', 'test%', 'zz%', '%yopmail.com' )
    foreach ($email in $emails)
    {
        $refJson = admin-search-players.js -h   $refHost -e $email | formatJson
        $myJson = admin-search-players.js -h localhost -e $email | formatJson
        fileAndReport "TestEmail [ $email ]" $refJson $myJson
    }
}

function testName()
{
    $refJson = admin-search-players.js -h   $refHost -f $firstName -l $lastName | formatJson
    $myJson = admin-search-players.js -h localhost -f $firstName -l $lastName  | formatJson
    fileAndReport 'TestName' $refJson $myJson
}

testCity
testEmail
testName