// var mod = require('./module')
var OAuth = require( './oauth.js' )
var oAuth = new OAuth( 'cadev1' )
// OAuth.getAuthCode( oAuth, 'test50@yopmail.com', 'Password123', authCodeResponseHandler )

// function authCodeResponseHandler( response )
// {
//     var authCode = response
//     OAuth.getToken( oAuth, authCode, tokenHandler )
// }

// function tokenHandler( response )
// {
//     console.log( response )
// }

const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

f1( 'cadev1', 'test50@yopmail.com', 'Password123' )

function f1( host, username, password )
{
    var headers = lib1.commonHeaders

    var instance = axios.create(
        {
            baseURL: 'http://' + host,
            headers: headers
        }
    )

    var path = '/api/v1/oauth/login'

    var request =
        {
            siteId: headers.siteID,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
        }

    instance.post( path, request ).then( function ( response )
    {
        let authCode = response.data[0].authCode
        var path = '/api/v1/oauth/login'

        var request =
            {
                authCode: authCode,
                clientId: 'SolSet2ndChancePortal',
                siteId: oauth.headers.siteID
            }
        instance.post( path, request ).then( function ( response )
        {
                console.log(response)
        } )
    } )
}