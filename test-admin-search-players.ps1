$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2

Set-Location "$env:USERPROFILE\Documents\json\search-players"

$refHost = "pdadmin"
$city = 'l%'
$firstName = 't%'
$lastName = 'lastname'

function fileAndReport($testName, $refJson, $myJSon)
{
    $refJson | Out-File -Encoding utf8 -force 'ref-search.json'
    $myJson  | Out-File -Encoding utf8 -force 'my-search.json'

    $refCount = ($refJson | ConvertFrom-Json).length
    $myCount = ($myJson   | ConvertFrom-Json).length

    "{0}: DevCount: {1}, MyCount: {2}" -f $testName, $refCount, $myCount

    Compare-Object (Get-Content 'ref-search.json') (Get-Content 'my-search.json')
}

function testCity()
{
    $refJson = pd2-admin.js --host $refHost --api search   --city $city
    $myJson = pd2-admin.js --host localhost --api search   --city $city
    fileAndReport 'TestCity' $refJson $myJson
}

function testEmail()
{
    $emails = @('test60@yopmail.com', 'test%', 'zz%', '%yopmail.com' )
    foreach ($email in $emails)
    {
        $refJson = pd2-admin.js --host $refHost  --api search --email $email
        $myJson = pd2-admin.js --host  localhost --api search --email $email
        fileAndReport "TestEmail [ $email ]" $refJson $myJson
    }
}

function testName()
{
    $refJson = pd2-admin.js --host $refHost --api search --firstname $firstName --lastname $lastName
    $myJson = pd2-admin.js  --host localhost --api search --firstname $firstName --lastname $lastName
    fileAndReport 'TestName' $refJson $myJson
}

testName
testCity
testEmail
