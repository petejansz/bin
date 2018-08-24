/*
  NodeJS CLI to pd2-admin REST API.
  Author: Pete Jansz 2017
*/

const modulesPath = '/usr/share/node_modules/'
var path = require( 'path' )
var util = require( 'util' )
var program = require( modulesPath + 'commander' )
var str_to_stream = require( modulesPath + 'string-to-stream' )
//var stream_to_str = require( 'stream-to-string' )
var pd2admin = require( modulesPath + 'pete-lib/pd2-admin-lib' )
var peteUtil = require( modulesPath + 'pete-lib/pete-util' )

var description = 'pd2-admin CLI api syntax\n\n'
description += '  --api GET:                  \n'
description += '        playerId -u <username>\n'
description += '        enums\n'
description += '        communication-preferences --playerid <playerId>\n'
description += '        note                      --playerid <playerId>\n'
description += '        notifications             --playerid <playerId>\n'
description += '        notifications-preferences --playerid <playerId>\n'
description += '        personal-info             --playerid <playerId>\n'
description += '        player-history            --playerid <playerId>\n'
description += '        player-history-status     --playerid <playerId>\n'
description += '        profile                   --playerid <playerId>\n'
description += '        services                  --playerid <playerId>\n'
description += '  --api SEARCH/UPDATES:\n'
description += '        close account             --playerid <playerId>\n'
description += '        make note\n'
description += '        search-players (city/state/zipcode/email/firtname/lastname)\n'
description += '        services --activate | --suspend --serviceid sid,sid --playerid <playerId>\n'
description += '\n  NOTE: cat2 requires rengw tunnel to pd2 host'

program
    .version( '0.0.1' )
    .description( description )
    .usage( 'ARGS' )
    .option( '--api < name >', 'REST API path-name' )
    .option( '--host [hostname]', 'Hostname (apl|cat1|cat2|dev|localhost|prod|pdc|bdc)' )
    .option( '--port [port]', 'Port number', parseInt )
    .option( '--street [street]', 'Street' )
    .option( '--city [city]', 'City' )
    .option( '--state [state]', 'State' )
    .option( '--zipcode [zipcode]', 'ZIP Code' )
    .option( '--email [email]', 'Email' )
    .option( '--firstname [firstname]', 'First name' )
    .option( '--lastname [lastname]', 'Last name' )
    .option( '--playerid [playerid]', 'PlayerId', parseInt )
    .option( '--serviceids <number,number>', 'CSV service ids', commanderCsvList )
    .option( '--activate', 'Activate' )
    .option( '-u, --username [username]', 'Username' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.api || !supportedHosts() )
{
    program.help()
}

async function main()
{
    var pdAdminSystem = createPdAdminSystem( program )

    if ( program.api == 'close' )
    {
        pd2admin.closeAccount( pdAdminSystem, program.playerid, commonResponseHandler )
    }
    else if ( program.api === 'enums' )
    {
        pd2admin.getAdminEnums( pdAdminSystem, commonResponseHandler )
    }
    else if ( program.api === 'playerid' && program.username )
    {
        pd2admin.getPlayerId( pdAdminSystem, program.username, playerIdResponseHandler )
    }
    else if ( program.api.match( /-preferences$|note|notifications|^personal-info$|^profile$|player-history/i ) && program.playerid )
    {
        pd2admin.getPlayerThing( pdAdminSystem, program.playerid, program.api, commonResponseHandler )
    }
    else if ( program.api === 'mknote' && program.playerid )
    {
        pd2admin.createNote( pdAdminSystem, program.playerid, commonResponseHandler )
    }
    else if ( program.api === 'search' )
    {
        const promisedSearchForPlayers = util.promisify( pd2admin.searchForPlayers )
        var response = await promisedSearchForPlayers( pdAdminSystem )
        streamIt( response.body )
    }
    else if ( program.api === 'services' && program.playerid )
    {
        var services =
        {
            playerId: program.playerid,
            activate: program.activate ? 'activate' : 'suspend',
            serviceIds: ( program.serviceids && program.serviceids.length === 2 ) ? program.serviceids : null
        }

        pd2admin.services( pdAdminSystem, services, servicesResponseHandler )
    }
}

main()

function commanderCsvList( val )
{
    return val.split( ',' )
}

function supportedHosts()
{
    return program.host && program.host.match( /^apl$|^bdc$|^pdc$|^prod$|^cat1$|^cat2$|^localhost$|^dev$/i )
}

function streamIt( o )
{
    str_to_stream( peteUtil.formatJSON( o ) ).pipe( process.stdout )
    process.exitCode = 0
}

function playerIdResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    streamIt( JSON.parse( body )[0].playerId )
}

function servicesResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    if ( body )//.services )
    {
        console.log( body )//.services )
    }
}

function commonResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    streamIt( body )
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

    if ( program.host === 'apl' )
    {
        pdAdminSystem.url = 'http://10.164.172.232' + adminPlayersRestPath
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_APL_PDADMIN_TOKEN
        Cookie = 'JSESSIONIDSSO=XF3avEAYFy-BVY93k2Fqbr37'
    }
    else if ( program.host === 'bdc')
    {
        pdAdminSystem.url = 'https://10.203.3.1' + adminPlayersRestPath
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_BDC_PDADMIN_TOKEN
        pdAdminSystem.Cookie = 'JSESSIONIDSSO=aLTCk9WR7OWfhEDuJ3NDMFVy'
        pdAdminSystem.rejectUnauthorized = false
    }
    else if ( program.host.match(/^prod$|^pdc$/ ))
    {
        pdAdminSystem.url = 'https://172.25.54.46' + adminPlayersRestPath
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_PROD_PDADMIN_TOKEN
        pdAdminSystem.Cookie = 'JSESSIONIDSSO=aLTCk9WR7OWfhEDuJ3NDMFVy'
        pdAdminSystem.rejectUnauthorized = false
    }
    else if ( program.host === 'cat1' )
    {
        pdAdminSystem.url = 'http://10.164.172.231' + adminPlayersRestPath
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_CAT1_PDADMIN_TOKEN
    }
    else if ( program.host === 'cat2' )
    {
        // pdAdminSystem.url = 'http://rengw2:8280' + adminPlayersRestPath
        pdAdminSystem.url = 'http://10.164.172.245' + adminPlayersRestPath
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_CAT2_PDADMIN_TOKEN
    }
    else if ( program.host === 'localhost' )
    {
        pdAdminSystem.url = 'http://localhost:' + ( program.port ? program.port : 8380 ) + adminPlayersRestPath
    }
    else if ( program.host === 'dev' )
    {
        pdAdminSystem.url = 'http://pdadmin:8280' + adminPlayersRestPath
    }

    if ( program.email ) { pdAdminSystem.qs.email = program.email }
    if ( program.firstname ) { pdAdminSystem.qs.firstName = ( program.firstname ? program.firstname : null ) }
    if ( program.lastname ) { pdAdminSystem.qs.lastName = ( program.lastname ? program.lastname : null ) }
    if ( program.city ) { pdAdminSystem.qs.city = ( program.city ? program.city : null ) }
    if ( program.street ) { pdAdminSystem.qs.street = ( program.street ? program.street : null ) }
    if ( program.state ) { pdAdminSystem.qs.state = ( program.state ? program.state : null ) }
    if ( program.zipcode ) { pdAdminSystem.qs.zipCode = ( program.zipcode ? program.zipcode : null ) }

    return pdAdminSystem
}
