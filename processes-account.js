/*
  NodeJS command-line interface to pd-crm-processess account (activate or close), add-note.
  Author: Pete Jansz
*/

const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var processes = require( modulesPath + 'pete-lib/processes-lib' )

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess account (activate or close), add-note' )
    .usage( ' -<activate|close> -i <playerId> -h <hostname>' )
    .option( '-a, --activate', 'Activate account' )
    .option( '-c, --close', 'Close account' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-n, --note', 'Create note' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.playerId || !program.hostname || !( program.activate || program.close || program.note ) )
{
    program.help()
}

var restPath, request

if ( program.activate || program.close )
{
    request = processes.createProcessesRequest()

    if ( program.activate )
    {
        restPath = '/california/api/v1/processes/account-activation'
        request.token = program.playerId
    }
    else
    {
        restPath = '/california/api/v1/processes/close-account'
        request.playerId = program.playerId
        request.reason = ': transactionTime: ' + reqData.transactionTime
    }
}
else if ( program.note )
{
    restPath = '/california/api/v1/processes/player-note'
    request = processes.createProcessesRequest()
    request.playerId = program.playerId

    const note =
    {
        alert: false,
        id: null,
        playerId: request.playerId,
        status: 1,
        type: 1,
        value: 'Make a note @ ' + new Date(),
        priority: 1,
        user: 'administrator',
    }

    request.note = note
}

processes.createAxiosInstance( program.hostname, program.playerId ).
    post( restPath, request ).then( function ( response )
    {
        if ( response.data.errorEncountered )
        {
            console.error( response.data )
        }
        else
        {
            process.exitCode = 0
        }
    } )

// End main logic
