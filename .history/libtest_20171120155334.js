const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosCadev1Players = axios.create({
    baseURL: 'http://cadev1/api/v1/oauth/login',
    headers: {'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35'}
  })

function getAuthCode()
{
    var request =
    {
        siteId: oauth.headers.siteID,
        clientId: 'SolSet2ndChancePortal',
        resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
    }

    return axiosCadev1Players.post( request )
}

var requests = [getAuthCode()]
axios.all( requests )
    .then( axios.spread( function ( authCode )
    {
        console.log('authCode: ' + authCode.data)
    } ) )

