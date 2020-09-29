#!/usr/bin/env node

/*
  NodeJS command-line interface to pd-crm-processess account (activate or close), add-note.
  Author: Pete Jansz
*/

var path = require( 'path' )
var program = require( 'commander' )
var processes = require( 'pete-lib/processes-lib' )

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess account' )
    .usage( 'Option -i <playerid> -h <hostname>' )
    .option( '--activate', 'Activate account' )
    .option( '--close', 'Close account' )
    .option( '--dlvsync', 'DLV Sync' )
    .option( '-i, --playerid <playerid>', 'PlayerID', parseInt )
    .option( '--newpwd [newpwd]', 'New password' )
    .option( '--chpwd <oldPassword>', 'Change password' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '--note', 'Create note' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.playerid || !program.hostname || !( program.activate || program.close || program.note || program.chpwd || program.dlvsync ) )
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
        request.token = program.playerid
    }
    else
    {
        restPath += 'close-account'
        request.playerid = program.playerid
        request.reason = ': transactionTime: ' + request.transactionTime
    }
}
else if ( program.chpwd )
{
    if ( !program.newpwd ) { program.help() }

    restPath += 'password-change'
    request = processes.createProcessesRequest()
    request.playerid = program.playerid

    moreHeaders['x-tx-id'] = request.transactionIdBase
    moreHeaders['x-tx-time'] = request.transactionTime

    request.oldPassword = program.chpwd
    request.newPassword = program.newpwd
}
else if ( program.dlvsync )
{
    restPath += 'dlvsync'
    request = processes.createProcessesRequest()
    request.playerId = program.playerid
    moreHeaders['x-tx-id'] = request.transactionIdBase
    moreHeaders['x-tx-time'] = request.transactionTime
}
else if ( program.note )
{
    restPath += 'notification'
    request = processes.createProcessesRequest()
    request.playerId = program.playerid
    request.templateId = 1
    request.parameters = {"1": path.basename( __filename ) + ': Make a note @ ' + new Date().toString() }
    moreHeaders['x-tx-id'] = request.transactionIdBase
    moreHeaders['x-tx-time'] = request.transactionTime
}

processes.createAxiosInstance( program.hostname, program.playerid, moreHeaders ).
    post( restPath, request )
    .then( function ( response )
            {
                if ( response.data.errorEncountered )
                {
                    console.error( response.data )
                }
                else
                {
                    process.exitCode = 0
                }
            }
        )
    .catch( axiosErrorHandler )

// End main logic
function commanderCsvList( val )
{
    return val.split( ',' )
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
