/*
  NodeJS CLI to pd2-admin REST API.
  Author: Pete Jansz 2017
*/

const modulesPath = '/usr/share/node_modules/'
var fs = require( 'fs' )
var util = require( 'util' )
var program = require( 'commander' )
var str_to_stream = require( 'string-to-stream' )
var pd2admin = require( 'pete-lib/pd2-admin-axios-lib' )

var description = 'pd2-admin CLI api syntax\n\n'
description += '  --api GET:                  \n'
description += '        playerId -u <username>\n'
description += '        enums\n'
description += '        communication-preferences --playerid <pid> | -u <username>\n'
description += '        note                      --playerid <pid> | -u <username>\n'
description += '        notifications             --playerid <pid> | -u <username>\n'
description += '        notifications-preferences --playerid <pid> | -u <username>\n'
description += '        personal-info             --playerid <pid> | -u <username>\n'
description += '        player-history            --playerid <pid> | -u <username>\n'
description += '        player-history-status     --playerid <pid> | -u <username>\n'
description += '        profile                   --playerid <pid> | -u <username>\n'
description += '        services                  --playerid <pid> | -u <username>\n'
description += '  --api SEARCH/UPDATES:\n'
description += '        actacct  <pers-info-file> --playerid <pid> | -u <username> # Activate account\n'
description += '        closeacct                 --playerid <pid> | -u <username> # Close account\n'
description += '        mknote                    --playerid <pid> | -u <username>\n'
description += '        search   --<city|state|zipcode|email|firstname|lastname>\n'
description += '        services --activate | --suspend --serviceids sid,sid --playerid <pid> | -u <username>\n'

program
    .version( '1.0.0' )
    .description( description )
    .usage( 'ARGS' )
    .option( '--api < name >', 'REST API path-name' )
    .option( '--file <file>', 'Close account with admin personal-info file' )
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
    .option( '--activate', 'Activate services' )
    .option( '--suspend', 'Suspend services' )
    .option( '-u, --username [username]', 'Username' )
    .option( '-v, --verbose', 'Verbose response' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.api || !supportedHosts() )
{
    program.help()
}

async function main()
{
    var pdAdminSystem
    var axiosInstance
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    try
    {
        pdAdminSystem = createPdAdminSystem( program )
        axiosInstance = pd2admin.createAxiosInstance( pdAdminSystem )

        var playerid = null

        if ( program.playerid )
        {
            playerid = program.playerid
        }
        else if ( program.username && !program.api.match( /search/i ) )
        {
            promisedResponse = await pd2admin.getPlayerId( axiosInstance, program.username )
            playerid = promisedResponse.data[0].playerId
        }

        if ( program.api == 'actacct' && program.file )
        {
            var personalInfo = JSON.parse( fs.readFileSync( program.file ).toString().trim() )
            personalInfo.reason = 'Activate account.'
            // pd2admin.activateAccount( pdAdminSystem, personalInfo.id, personalInfo, commonResponseHandler )
        }
        else if ( program.api == 'closeacct' && playerid )
        {
            var promisedResponse = await pd2admin.closeAccount( axiosInstance, playerid )
            streamIt( promisedResponse.data )
        }
        else if ( program.api === 'enums' )
        {
            var promisedResponse = await pd2admin.getAdminEnums( axiosInstance )
            streamIt( promisedResponse.data )
        }
        else if ( program.api === 'playerid' && program.username )
        {
            var promisedResponse = await pd2admin.getPlayerId( axiosInstance, program.username )
            streamIt( promisedResponse.data )
        }
        else if ( program.api.match( /-preferences$|^note$|notifications|^personal-info$|^profile$|player-history/i ) && playerid )
        {
            var promisedResponse = await pd2admin.getPlayerThing( axiosInstance, playerid, program.api )
            streamIt( promisedResponse.data )
        }
        else if ( program.api === 'mknote' && playerid )
        {
            var promisedResponse = await pd2admin.createNote( axiosInstance, playerid )
            if ( promisedResponse.status != 204 )
            { console.error( promisedResponse.status ) }
        }
        else if ( program.api === 'search' )
        {
            var qs = {}
            if ( program.email ) { qs.email = program.email }
            if ( program.firstname ) { qs.firstName = ( program.firstname ? program.firstname : null ) }
            if ( program.lastname ) { qs.lastName = ( program.lastname ? program.lastname : null ) }
            if ( program.city ) { qs.city = ( program.city ? program.city : null ) }
            if ( program.street ) { qs.street = ( program.street ? program.street : null ) }
            if ( program.state ) { qs.state = ( program.state ? program.state : null ) }
            if ( program.zipcode ) { qs.zipcode = ( program.zipcode ? program.zipcode : null ) }

            var promisedResponse = await pd2admin.searchForPlayers( axiosInstance, qs )
            streamIt( promisedResponse.data )
        }
        else if ( program.api === 'services' && playerid )
        {
            var services = { playerId: playerid }

            if ( program.activate || program.suspend )
            {
                if ( program.serviceids && program.serviceids.length === 2 )
                {
                    services.activate = program.activate ? 'activate' : 'suspend'
                    services.serviceIds = program.serviceids
                }
                else
                {
                    program.help()
                }
            }

            var promisedResponse = await pd2admin.services( axiosInstance, services )
            streamIt( promisedResponse.data )
        }

        process.exitCode = 0
    }
    catch ( error )
    {
        axiosErrorHandler( error )
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

function formatJSON( o )
{
    return JSON.stringify( o, null, '  ' )
}

function streamIt( o )
{
    if ( !( typeof o === 'string' || o instanceof String ) )
    {
        str_to_stream( formatJSON( o ) ).pipe( process.stdout )
    }
    else if ( typeof o === 'string' || o instanceof String && o.length )
    {
        str_to_stream( o ).pipe( process.stdout )
    }

    process.exitCode = 0
}

function axiosErrorHandler( error )
{
    if ( error.response && error.response.status < 500 )
    {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        var response =
        {
            statusText: error.response.statusText,
            statusCode: error.response.status,
            data: error.response.data
        }

        console.error( response )
    }
    else if ( error.response && error.response.status >= 500 )
    {
        console.error( error.response.status )
        console.error( error.response.headers )
        console.error( error.response.data )
    }
    else if ( error.request )
    {
        // The request was made but no response was received
        // error.request is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error( error.request )
    }
    else
    {
        // Something happened in setting up the request that triggered an Error
        console.error( 'Error', error.message )
    }

    //console.error( error.config )
}

function createPdAdminSystem( program )
{
    var pdAdminSystem =
    {
        url: null,
        auth: 'ESMS null'
    }

    if ( program.host === 'apl' )
    {
        pdAdminSystem.url = 'http://10.164.172.232'
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_APL_PDADMIN_TOKEN
        Cookie = 'JSESSIONIDSSO=XF3avEAYFy-BVY93k2Fqbr37'
    }
    else if ( program.host === 'bdc' )
    {
        pdAdminSystem.url = 'https://10.203.3.1'
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_BDC_PDADMIN_TOKEN
        pdAdminSystem.Cookie = 'JSESSIONIDSSO=aLTCk9WR7OWfhEDuJ3NDMFVy'
        pdAdminSystem.rejectUnauthorized = false
    }
    else if ( program.host.match( /^prod$|^pdc$/ ) )
    {
        pdAdminSystem.url = 'https://172.25.54.46'
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_PROD_PDADMIN_TOKEN
        pdAdminSystem.Cookie = 'JSESSIONIDSSO=aLTCk9WR7OWfhEDuJ3NDMFVy'
        pdAdminSystem.rejectUnauthorized = false
    }
    else if ( program.host === 'cat1' )
    {
        pdAdminSystem.url = 'http://10.164.172.231'
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_CAT1_PDADMIN_TOKEN
    }
    else if ( program.host === 'cat2' )
    {
        pdAdminSystem.url = 'http://10.164.172.245'
        pdAdminSystem.auth = 'ESMS ' + process.env.CA_CAT2_PDADMIN_TOKEN
    }
    else if ( program.host === 'localhost' )
    {
        pdAdminSystem.url = 'http://localhost:' + ( program.port ? program.port : 8380 )
    }
    else if ( program.host === 'dev' )
    {
        pdAdminSystem.url = 'http://pdadmin:8280'
    }

    return pdAdminSystem
}
