// var mod = require('./module')
var OAuth = require( './oauth.js' )
var oAuth = new OAuth( 'cadev1' )
OAuth.getAuthCode( oAuth, 'test50@yopmail.com', 'Password123', authCodeResponseHandler )

function authCodeResponseHandler( response )
{
    var authCode = response
    OAuth.getToken( oAuth, authCode, tokenHandler )
}

function tokenHandler( response )
{
    return( response )
}

requests = [tokenHandler()]
oAuth.getInstance().all( requests )
.then( axios.spread( function ( something )
{
}))