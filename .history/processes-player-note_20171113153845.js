/*
  NodeJS command-line interface to pd-crm-processess processes/player-note REST function.
  Author: Pete Jansz
*/

var util = require( 'util' )
var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

var path = require( 'path' )
const scriptName = path.basename( __filename )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess processes/player-note' )
    .usage( scriptName + ' -h <hostname> -i <playerId>' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv )

if ( !program.hostname || !program.playerId )
{
    program.help()
    process.exit( 1 )
}

console.log(addNote(program.hostname, program.playerId))

function addNote( host, playerId, noteText )
{
    var noteId = null
    var text = noteText ? noteText : 'Make a note @ ' + new Date()
    const note =
        {
            alert: false,
            id: null,
            playerId: playerId,
            status: 1,
            type: 1,
            value: text,
            priority: 1,
            user: 'administrator',
        }

    const body =
        {
            callingClientId: lib1.getFirstIPv4Address(),
            transactionIdBase: lib1.generateUUID(),
            transactionTime: new Date().valueOf(),
            callerChannelId: lib1.caConstants.channelId,
            callerSystemId: lib1.caConstants.systemId,
            siteID: lib1.caConstants.siteID,
            playerId: playerId,
            note: note
        }

    const restPath = '/california/api/v1/processes/player-note'
    const url = util.format( '%s://%s:%s%s', 'http', host, lib1.crmProcessesPort, restPath )
    var options =
        {
            method: 'POST',
            url: url,
            headers: lib1.commonHeaders,
            body: body,
            json: true
        }

    options.headers['x-player-id'] = playerId

    request( options, function ( error, response, body )
    {
        if ( error )
        {
            throw new Error( error )
        }

        noteId = ( body.note.id )
    } )

    return noteId
}