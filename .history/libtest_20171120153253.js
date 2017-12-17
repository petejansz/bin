var axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
var OAuth = require( './oauth.js' )
var oAuth = new OAuth( 'cadev1' )
OAuth.getAuthCode( oAuth, 'test50@yopmail.com', 'Password123', authCodeResponseHandler )

function authCodeResponseHandler( response )
{
    var authCode = response
    var getTokenPromise = OAuth.getToken( oAuth, authCode )
    return (getTokenPromise)
}
