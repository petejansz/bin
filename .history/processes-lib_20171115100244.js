var processes =
    {
        createNote: function ( host, playerId, noteText )
        {
            var util = require( 'util' )
            var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request-promise' )
            var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

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
                    uri: url,
                    headers: lib1.commonHeaders,
                    body: body,
                    json: true
                }

            options.headers['x-player-id'] = playerId

            function processResponse( response )
            {
                if ( response.note )
                {
                    console.log( response.note.id )
                    process.exitCode = 0
                }
                else
                {
                    console.error( response )
                }
            }

            function errorHandler( error )
            {
                console.log( error )
            }

            request( options )
                .then( function ( resp )
                {
                    processResponse( resp )
                } )
                .catch( function ( err )
                {
                    errorHandler( err )
                } )
        }
    };

module.exports = processes