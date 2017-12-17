/*
  NodeJS CLI to pd2-admin get enums, get playerId from username.
  Author: Pete Jansz
*/

var path = require( 'path' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )
var pd2admin = require( process.env.USERPROFILE + '/Documents/bin/pd2-admin-lib' )

program
    .version( '0.0.1' )
    .description( 'NodeJS CLI to pd2-admin get enums, get playerId from username, search-players' )
    .usage( ' ARGS ' )
    .option( '--api [mknote | enums | playerid | search]', 'API method' )
    .option( '--host [hostname]', 'Hostname' )
    .option( '--port [port]', 'Port number', parseInt )
    .option( '--city [City]', 'City' )
    .option( '--email [email]', 'Email' )
    .option( '--firstname [firstname]', 'First name' )
    .option( '--lastname [lastname]', 'Last name' )
    .option( '--playerid [playerid]', 'PlayerId', parseInt )
    .option( '-u, --username [username]', 'Username' )
    .parse( process.argv )

process.exitCode = 1

if ( program.api === 'enums' )
{
    pd2admin.getAdminEnums( adminEnumsResponseHandler )
}
else if ( program.api === 'playerid' && program.username && program.host )
{
    pd2admin.getPlayerId( program.username, program.host, program.port, getPlayerIdResponseHandler, errorHandler )
}
else if ( program.api === 'search' && program.host.match(/^cat1$|^cat2$|^localhost$|^pdadmin$/i) )
{
    var pdAdminSystem = createPdAdminSystem( program )
    pd2admin.searchForPlayers( pdAdminSystem, searchPlayersResponseHandler )
}
else if ( program.api === 'mknote' && program.playerid && program.host.match(/^cat1$|^cat2$|^localhost$|^pdadmin$/i) )
{
    var pdAdminSystem = createPdAdminSystem( program )
    pd2admin.createNote( pdAdminSystem, program.playerid, noteResponseHandler )
}
else if (!program.api)
{
    program.help()
}

function noteResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    str_to_stream( JSON.stringify( body ) ).pipe( process.stdout )
    process.exitCode = 0
}

function getPlayerIdResponseHandler( response )
{
    if ( response.length && response[0].playerId )
    {
        var playerId = response[0].playerId
        str_to_stream( playerId ).pipe( process.stdout )
        process.exitCode = 0
    }
    else
    {
        console.error( 'Username not found: ' + username )
    }
}

function errorHandler( error )
{
    console.error( error )
}

function adminEnumsResponseHandler( response )
{
    if ( response.statusCode == 200 )
    {
        var enumStr = response.body.toString()
        str_to_stream( enumStr ).pipe( process.stdout)
        process.exitCode = 0
    }
    else
    {
        console.error( response.statusCode + ", " + response.statusMessage )
    }
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

function searchPlayersResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    str_to_stream( body ).pipe( process.stdout)
    process.exitCode = 0
}