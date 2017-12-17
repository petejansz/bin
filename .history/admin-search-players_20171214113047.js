/**
 * PDAdmin search for players.
 * Pete Jansz 2017-10-31
 */

var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )

program
    .version( '0.0.1' )
    .description( 'CLI to pdadmin-rest search for players' )
    .usage( ' -h <hostname> ARGS' )
    .option( '-e, --email [email]', 'Email' )
    .option( '-c, --city [City]', 'City' )
    .option( '-f, --firstname [firstname]', 'First name' )
    .option( '-l, --lastname [lastname]', 'Last name' )
    .option( '-h, --hostname [cat1|cat2|localhost|pdadmin]', 'Hostname' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.hostname )
{
    program.help()
}

var qs = {}
if ( program.email ) { qs.email = program.email }
if ( program.firstname ) { qs.firstName = ( program.firstname ? program.firstname : null ) }
if ( program.lastname ) { qs.lastName = ( program.lastname ? program.lastname : null ) }
if ( program.city ) { qs.city = ( program.city ? program.city : null ) }

var pdAdminSystem =
{
    url: null,
    qs: null,
    auth: 'ESMS null'
}

if ( program.hostname === 'cat1' )
{
    // url = 'http://10.164.172.231/california-admin-rest/api/v1/admin/players'
    // qs._ = '1511797015071'
    // auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'

    pdAdminSystem.url = 'http://10.164.172.231/california-admin-rest/api/v1/admin/players'
    //pdAdminSystem.qs._ = '1511797015071'
    pdAdminSystem.auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'
}
else if ( program.hostname === 'cat2' )
{
    url = 'https://10.164.172.245/california-admin-rest/api/v1/admin/players'
    qs._ = '1511305891634'
    auth = 'ESMS GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8'
}
else if ( program.hostname === 'localhost' )
{
    url = 'http://localhost:8380/california-admin-rest/api/v1/admin/players'
}
else if ( program.hostname === 'pdadmin' )
{
    url = 'http://pdadmin:8280/california-admin-rest/api/v1/admin/players'
}

var options =
    {
        method: 'GET',
        rejectUnauthorized: false,
        url: pdAdminSystem.url,
        qs: qs,
        headers:
            {
                'cache-control': 'no-cache',
                referer: lib1.getFirstIPv4Address(),
                dnt: '1',
                Authorization: pdAdminSystem.auth,
            }
    }

request( options, function ( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    console.log( body )
    process.exitCode = 0
} )
