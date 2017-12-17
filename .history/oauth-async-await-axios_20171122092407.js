// 🔥 Node 7.6 has async/await! Here is a quick run down on how async/await works

const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
const lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

function getCoffee()
{
    return new Promise( resolve =>
    {
        setTimeout( () => resolve( '☕' ), 2000 ); // it takes 2 seconds to make coffee
    } );
}

/*
*   add numbers a, b return a promise with the sum
*/
function promiseAddition(a, b)
{
    return new Promise(resolve =>
        {
            setTimeout(() => resolve(a + b), 0)
        }
    )
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

async function go()
{
    try
    {
        var oauthLoginRequest =
        {
            siteId: lib1.caConstants.siteID,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: 'test50@yopmail.com', PASSWORD:  'Password123' }
        }
        var oauthAxiosInstance = createAxiosInstance('cadev1')
        var result = await oauthAxiosInstance.post( '/api/v1/oauth/login', oauthLoginRequest )
        var oauthTokenRequest =
        {
            authCode: result.data[0].authCode,
            clientId: 'SolSet2ndChancePortal',
            siteId: lib1.caConstants.siteID
        }

        result = await oauthAxiosInstance.post( '/api/v1/oauth/self/tokens', oauthTokenRequest )
        console.log(result.data[0].token)
    }
    catch ( e )
    {
        console.error( e ); // 💩
    }
}

go();