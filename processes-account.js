/*
  NodeJS command-line interface to pd-crm-processess activate, close account REST methods.
  Author: Pete Jansz
*/

const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )
var path = require( 'path' )

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess activate, close account REST methods' )
    .usage( ' -<activate|close> -i <playerId> -h <hostname>' )
    .option( '-a, --activate', 'Activate account' )
    .option( '-c, --close', 'Close account' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.playerId || !program.hostname )
{
    program.help()
}

var restPath = '/california/api/v1/processes/'

if ( program.activate )
{
    restPath += 'account-activation'
}
else if ( program.close )
{
    restPath += 'close-account'
}
else
{
    program.help()
}

var requestData = createRequest( program.close, program.playerId )

createAxiosInstance( program.hostname, program.playerId ).
    post( restPath, requestData ).then( function ( response )
    {
        if ( response.data.errorEncountered )
        {
            console.error( requestData.transactionIdBase )
        }
        else
        {
            process.exitCode = 0
        }
    } )

function createRequest( close, playerId )
{
    var transactionTime = new Date().valueOf()
    var reqData =
        {
            callerChannelId: lib1.caConstants.channelId,
            callingClientId: lib1.getFirstIPv4Address(),
            callerSystemId: lib1.caConstants.systemId,
            transactionIdBase: lib1.generateUUID(),
            transactionTime: transactionTime,
            siteID: lib1.caConstants.siteID,
        }

    if ( close )
    {
        reqData.playerId = playerId
        reqData.reason = path.basename( __filename ) + ': transactionTime: ' + transactionTime
    }
    else // activate
    {
        reqData.token = playerId
    }

    return reqData
}

function createAxiosInstance( host, playerId )
{
    var headers = lib1.commonHeaders
    headers['x-player-id'] = program.playerId

    return axios.create(
        {
            baseURL: 'http://' + host + ':' + lib1.crmProcessesPort,
            headers: headers,
        }
    )
}