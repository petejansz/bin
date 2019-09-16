#!/usr/bin/env node

/*
  NodeJS command-line interface to OAuth login, return an oauth token, using axios, output stream
  Author: Pete Jansz
*/

const axios = require( 'axios' )
var str_to_stream = require( 'string-to-stream' )
var program = require( 'commander' )
var igtCas = require( 'pete-lib/igt-cas' )

program
    .version( '0.0.1' )
    .description( 'NodeJS CLI to login, return an oauth token.' )
    .usage( '-h <host> -u <username> -p <password>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username <username>', 'Username' )
    .option( '-p, --password <password>', 'Password' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.hostname && !program.username || !program.password )
{
    program.help()
}

var qualifiedHostname = program.hostname
if ( qualifiedHostname.match( /cadev1$/i ) )
{
    qualifiedHostname += '.gtech.com'
}

var oauthAxiosInstance = createAxiosInstance( qualifiedHostname )
loginForOAuthToken( oauthAxiosInstance, qualifiedHostname, program.username, program.password, getOAuthCodeResponseHandler )

async function loginForOAuthToken( oauthAxiosInstance, host, username, password )
{
    var reqData = igtCas.createLoginRequest( host )
    reqData.resourceOwnerCredentials = { USERNAME: username, PASSWORD: password }

    // Get OAuth authCode
    oauthAxiosInstance.post( '/api/v1/oauth/login', reqData ).then( function ( response )
    {
        getOAuthCodeResponseHandler( response )
    } )
}

// Get OAuth token:
function getOAuthCodeResponseHandler( response )
{
    var oAuthCode = response.data[0].authCode
    getLoginToken( oauthAxiosInstance, oAuthCode, qualifiedHostname )
}

function getLoginToken( oauthAxiosInstance, oAuthCode, hostname )
{
    var reqData = igtCas.createLoginRequest( hostname )
    reqData.authCode = oAuthCode

    oauthAxiosInstance.post( '/api/v1/oauth/self/tokens', reqData ).then( function ( response )
    {
        getOAuthLoginTokenResponseHandler( response )
    } )
}

function getOAuthLoginTokenResponseHandler( response )
{
    var index

    if ( response.config.baseURL.match( /mobile/i ) )
    {
        index = 0
    }
    else
    {
        index = 1
    }

    str_to_stream( response.data[index].token ).pipe( process.stdout )
    process.exitCode = 0
}

function createAxiosInstance( host )
{
    var proto = 'https'

    if ( host.match( /dev/ ) )
    {
        proto = 'http'
    }

    return axios.create(
        {
            baseURL: proto + '://' + host,
            headers: igtCas.createHeaders( host )
        }
    )
}
