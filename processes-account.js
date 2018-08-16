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
    .option( '--activate', 'Activate account' )
    .option( '--close', 'Close account' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '--newpwd [newpwd]', 'New password' )
    .option( '--chpwd <oldPassword>', 'Change password' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '--note', 'Create note' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.playerId || !program.hostname || !( program.activate || program.close || program.note || program.chpwd ) )
{
    program.help()
}

var restPath = '/california/api/v1/processes/', request
var moreHeaders = {}

if ( program.activate || program.close )
{
    request = processes.createProcessesRequest()

    if ( program.activate )
    {
        restPath += 'account-activation'
        request.token = program.playerId
    }
    else
    {
        restPath += 'close-account'
        request.playerId = program.playerId
        request.reason = ': transactionTime: ' + reqData.transactionTime
    }
}
else if ( program.chpwd )
{
    if ( !program.newpwd ) { program.help() }

    restPath += 'password-change'
    request = processes.createProcessesRequest()
    request.playerId = program.playerId

    moreHeaders['x-tx-id'] = request.transactionIdBase
    moreHeaders['x-tx-time'] = request.transactionTime

    request.oldPassword = program.chpwd
    request.newPassword = program.newpwd
}
else if ( program.note )
{
    restPath += 'player-note'
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

processes.createAxiosInstance( program.hostname, program.playerId, moreHeaders ).
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
function commanderCsvList( val )
{
    return val.split( ',' )
}