/*
  NodeJS CLI to pd2-admin REST API.
  Author: Pete Jansz 2017
*/

var path = require( 'path' )
var util = require( 'util' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )
var pd2admin = require( process.env.USERPROFILE + '/Documents/bin/pd2-admin-lib' )
var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )

program
    .version( '0.0.1' )
    .description( 'pd2-admin CLI\n\n    close account\n\n    get enums\n\n    get playerId\n\n    make note\n\n    search-players' )
    .usage( ' ARGS ' )
    .option( '--api <close | mknote | enums | playerid | search>', 'API method' )
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

async function main()
{
    if ( program.api == 'close' )
    {
        var pdAdminSystem = createPdAdminSystem( program )
        pd2admin.closeAccount( pdAdminSystem, program.playerid, closeAccountResponseHandler )
    }
    else if ( program.api === 'enums' )
    {
        pd2admin.getAdminEnums( adminEnumsResponseHandler )
    }
    else if ( program.api === 'playerid' && program.username && program.host )
    {
        const promisedGetPlayerId = util.promisify( pd2admin.getPlayerId )
        var response = await pd2admin.getPlayerId( program.username, program.host, program.port )
        if ( response && response[0] && response[0].playerId )
            streamIt( response[0].playerId )
    }
    else if ( program.api === 'search' && program.host.match( /^cat1$|^cat2$|^localhost$|^pdadmin$/i ) )
    {
        var pdAdminSystem = createPdAdminSystem( program )
        const promisedSearchForPlayers = util.promisify( pd2admin.searchForPlayers )
        var response = await promisedSearchForPlayers( pdAdminSystem )
        streamIt( response.body )
    }
    else if ( program.api === 'mknote' && program.playerid && program.host.match( /^cat1$|^cat2$|^localhost$|^pdadmin$/i ) )
    {
        var pdAdminSystem = createPdAdminSystem( program )
        pd2admin.createNote( pdAdminSystem, program.playerid, noteResponseHandler )
    }
    else if ( !program.api )
    {
        program.help()
    }
}

main()

function streamIt( o )
{
    str_to_stream( lib1.formatJSON( o ) ).pipe( process.stdout )
    process.exitCode = 0
}

function closeAccountResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    str_to_stream( JSON.stringify( body ) ).pipe( process.stdout )
    process.exitCode = 0
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

function getPlayerIdErrorHandler( error )
{
    console.error( error )
}

function adminEnumsResponseHandler( response )
{
    if ( response.statusCode == 200 )
    {
        var enumStr = response.body.toString()
        str_to_stream( enumStr ).pipe( process.stdout )
        process.exitCode = 0
    }
    else
    {
        console.error( response.statusCode + ", " + response.statusMessage )
    }
}

function createPdAdminSystem( program )
{
    var adminPlayersRestPath = '/california-admin-rest/api/v1/admin/players'
    var pdAdminSystem =
        {
            url: null,
            qs: {},
            auth: 'ESMS null'
        }

    if ( program.host === 'cat1' )
    {
        pdAdminSystem.url = 'http://10.164.172.231' + adminPlayersRestPath
        pdAdminSystem.auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'
    }
    else if ( program.host === 'cat2' )
    {
        pdAdminSystem.url = 'https://10.164.172.245' + adminPlayersRestPath
        pdAdminSystem.auth = 'ESMS GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8'
    }
    else if ( program.host === 'localhost' )
    {
        pdAdminSystem.url = 'http://localhost:8380' + adminPlayersRestPath
    }
    else if ( program.host === 'pdadmin' )
    {
        pdAdminSystem.url = 'http://pdadmin:8280' + adminPlayersRestPath
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

    str_to_stream( body ).pipe( process.stdout )
    process.exitCode = 0
}