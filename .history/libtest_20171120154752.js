var axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
var OAuth = require( './oauth.js' )
var oAuth = new OAuth( 'cadev1' )
var authCode

OAuth.getAuthCode( oAuth, 'test50@yopmail.com', 'Password123', authCodeResponseHandler )

function authCodeResponseHandler( authCode )
{
    authCode = response.data[0].authCode
}

console.log(authCode)