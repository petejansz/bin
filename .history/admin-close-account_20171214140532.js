/*
  NodeJS command-line interface to pd2-admin close-account REST function.
  Author: Pete Jansz, IGT 2017-06-30
*/

var http = require( "http" )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )

program
    .version( '0.0.1' )
    .description( 'admin close player account' )
    .usage( 'admin-close-account -h <hostname> -i <playerid>' )
    .option( '-i, --playerid <playerid>', 'PlayerID', parseInt )
    .option( '-h, --host <host>', 'Hostname' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .parse( process.argv )

process.exitCode = 1

if ( !program.playerid || !program.host )
{
    program.help()
}

var pdAdminSystem = createPdAdminSystem( program )
function closeAccount( pdAdminSystem, program.playerid, responseHandler )
{
var options =
    {
        method: 'PUT',
        rejectUnauthorized: false,
        url: pdAdminSystem.url + '/' + playerId + '/closeaccount',
        headers:
            {
                'cache-control': 'no-cache',
                referer: lib1.getFirstIPv4Address(),
                dnt: '1',
                Authorization: pdAdminSystem.auth,
            },
        body:
            {
                contractId: program.playerId, reason: 'Admin, close this account!'
            },
        json: true
    }

request( options, responseHandler )
}

function createPdAdminSystem( program )
{
    var restPath = '/california-admin-rest/api/v1/admin/players'
    var pdAdminSystem =
        {
            url: null,
            qs: {},
            auth: 'ESMS null'
        }

    if ( program.host === 'cat1' )
    {
        pdAdminSystem.url = 'http://10.164.172.231' + restPath
        pdAdminSystem.auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'
    }
    else if ( program.host === 'cat2' )
    {
        pdAdminSystem.url = 'https://10.164.172.245' + restPath
        pdAdminSystem.auth = 'ESMS GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8'
    }
    else if ( program.host === 'localhost' )
    {
        pdAdminSystem.url = 'http://localhost:8380' + restPath
    }
    else if ( program.host === 'pdadmin' )
    {
        pdAdminSystem.url = 'http://pdadmin:8280' + restPath
    }

    if ( program.email ) { pdAdminSystem.qs.email = program.email }
    if ( program.firstname ) { pdAdminSystem.qs.firstName = ( program.firstname ? program.firstname : null ) }
    if ( program.lastname ) { pdAdminSystem.qs.lastName = ( program.lastname ? program.lastname : null ) }
    if ( program.city ) { pdAdminSystem.qs.city = ( program.city ? program.city : null ) }

    return pdAdminSystem
}
