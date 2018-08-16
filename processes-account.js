/*
  NodeJS command-line interface to pd-crm-processess activate, close account REST methods.
  Author: Pete Jansz
*/

const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var processes = require(modulesPath + 'pete-lib/processes-lib')

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

if ( !program.playerId || !program.hostname || !(program.activate || program.close))
{
    program.help()
}

var restPath, request

if (program.activate || program.close)
{
    if (program.activate) { restPath = '/california/api/v1/processes/account-activation' }
    else                  { restPath = '/california/api/v1/processes/close-account'}
    request = createAccountRequest()
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
// Local functions
function createAccountRequest( )
{
    var reqData = processes.createProcessesRequest()

    if ( program.close )
    {
        reqData.playerId = program.playerId
        reqData.reason = ': transactionTime: ' + reqData.transactionTime

    }
    else // activate
    {
        reqData.token = program.playerId
    }

    return reqData
}
