/*
  NodeJS command-line interface to login with the /api/v1/oauth/login REST API and get the authCode.
  Author: Pete Jansz
*/

var axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to login with the /api/v1/oauth/login REST API and get the authCode.' )
    .usage( 'pd-oauth-login -h <hostname> -u <username> -p <password>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username <username>', 'username' )
    .option( '-p, --password <password>', 'password' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.hostname || !program.username || !program.password )
{
    program.help()
}

getLoginAuthCode( program.hostname, program.username, program.password, responseHandler, errorHandler )

function responseHandler( response )
{
    console.log( response.data[0].authCode )
    process.exitCode = 0
}

function errorHandler( error )
{
    console.error( error )
}

function getLoginAuthCode( theHost, username, password, responseHandler, errorHandler )
{
    var proto = 'https'

    if ( theHost.match( /dev/ ) )
    {
        proto = 'http'
    }

    var url = 'api/v1/oauth/login'
    var data =
        {
            siteId: lib1.caConstants.siteID,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
        }

    var completeUrl = `${proto}://${theHost}/${url}`

    var config =
    {
        method: 'POST',
        //url: completeUrl,
        headers:
            {
                'X-EX-SYSTEM-ID': lib1.caConstants.systemId,
                'X-CHANNEL-ID': lib1.caConstants.channelId,
                'X-SITE-ID': lib1.caConstants.siteID
            },
        data: data
    }

    axios.post
    (
        completeUrl, config
    )
    .then( function ( response )
    { responseHandler( response ) } )
    .catch( function ( error )
    { errorHandler( error ) } )

    // config.url = completeUrl
    // axios
    //     (
    //         config
    //     )
    //     .then( function ( response )
    //     { responseHandler( response ) } )
    //     .catch( function ( error )
    //     { errorHandler( error ) } )
}
