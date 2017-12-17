const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosCadev1Players = axios.create( {
    baseURL: 'http://cadev1/',
    headers: { 'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35' }
} )

function getAuthCode()
{
    var request =
        {
            siteId: 35,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: "test50@yopmail.com", PASSWORD: "Password123" }
        }

    return axiosCadev1Players.post( 'api/v1/oauth/login', request )
}

var requests = [getAuthCode()]
axios.all( requests )
    .then( axios.spread( function ( authCode )
    {
        console.log( 'authCode: ' + authCode.data[0].authCode )
    } ) )

