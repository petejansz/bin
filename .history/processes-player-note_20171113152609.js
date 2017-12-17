/*
  NodeJS command-line interface to pd-crm-processess processes/player-note REST function.
  Author: Pete Jansz
*/

var fs = require( "fs" )
var path = require( "path" )
var util = require( 'util' )
var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
const scriptName = path.basename( __filename )

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess processes/player-note' )
    .usage( scriptName + ' -h <hostname> -i <playerId>' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv )

var exitValue = 0

if ( !program.hostname || !program.playerId )
{
    program.help()
    process.exit( 1 )
}

const note =
    {
        alert: false,
        id: null,
        playerId: program.playerId,
        status: 1,
        type: 1,
        value: "Make a note @ " + new Date(),
        priority: 1,
        user: "administrator",
    }

const body =
    {
        callingClientId: lib1.getFirstIPv4Address(),
        transactionIdBase: lib1.generateUUID(),
        transactionTime: new Date().valueOf(),
        callerChannelId: lib1.caConstants.channelId,
        callerSystemId: lib1.caConstants.systemId,
        siteID: lib1.caConstants.siteID,
        playerId: program.playerId,
        note: note
    }

const restPath = "/california/api/v1/processes/player-note"
const format = '%s://%s:%s%s'
const url = util.format( format, 'http', program.hostname, lib1.crmProcessesPort, restPath )
var options =
    {
        method: 'POST',
        url: url,
        headers: lib1.commonHeaders,
        body: body,
        json: true
    }

options.headers['x-player-id'] = program.playerId

request( options, function ( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    console.log( body.note.id )
} )
