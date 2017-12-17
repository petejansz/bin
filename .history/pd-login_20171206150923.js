const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
const lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

var oauthAxiosInstance = createAxiosInstance( 'cadev1' )
getOAuthCode( oauthAxiosInstance, 'test50@yopmail.com', 'Password123', getOAuthCodeResponseHandler )

async function getOAuthCode( oauthAxiosInstance, username, password )
{
    var reqData =
        {
            siteId: lib1.caConstants.siteID,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
        }

    oauthAxiosInstance.post( '/api/v1/oauth/login', reqData ).then( function ( response )
    {
        getOAuthCodeResponseHandler( response )
    } )
}

function getOAuthCodeResponseHandler( response )
{
    var oAuthCode = response.data[0].authCode
    getLoginToken( oauthAxiosInstance, oAuthCode, lib1.caConstants.clientId, lib1.caConstants.siteID )
}

function getLoginToken( oauthAxiosInstance, oAuthCode, clientId, siteId )
{
    var reqData =
        {
            authCode: oAuthCode,
            clientId: clientId,
            siteId: siteId
        }
    oauthAxiosInstance.post( '/api/v1/oauth/self/tokens', reqData ).then( function ( response )
    {
        getOAuthLoginTokenResponseHandler( response )
    } )
}

function getOAuthLoginTokenResponseHandler( response )
{
    var token = response.data[1].token
    console.log( token )
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
            headers: lib1.commonHeaders
        }
    )
}
