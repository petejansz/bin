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

    var p = axiosCadev1Players.post( 'api/v1/oauth/login', request )
    return p
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

async function useAuthCode(username, password)
{
    var response = await getAuthCode(username, password)
    console.log(response.data[0].authCode)
    return response.data[0].authCode
}

var result = await useAuthCode("test50@yopmail.com", "Password123")
console.log(result)