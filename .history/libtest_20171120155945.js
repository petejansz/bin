const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosCadev1Players = axios.create( {
    baseURL: 'http://cadev1/',
    headers: { 'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35' }
} )

function getAuthCode( username, password )
{
    var request =
        {
            siteId: 35,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
        }

    return axiosCadev1Players.post( 'api/v1/oauth/login', request )
}

function getToken( authCode )
{
    var request =
        {
            siteId: 35,
            clientId: 'SolSet2ndChancePortal',
            authCode: authCode
        }

    return axiosCadev1Players.post( 'api/v1/oauth/tokens', request )
}

var requests = [getAuthCode( "test50@yopmail.com", "Password123" )]
axios.all( requests )
    .then( axios.spread( function ( authCode )
    {
        console.log( 'authCode: ' + authCode.data[0].authCode )
    } ) )

console.log('hello')