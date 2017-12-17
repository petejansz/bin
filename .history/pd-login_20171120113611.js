const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
const lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

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

var oauthAxiosInstance = createAxiosInstance('cadev1')
getOauth( oauthAxiosInstance, 'test50@yopmail.com', 'Password123', getOAutheResponseHandler )

function getOauth( oauthAxiosInstance, username, password )
{
    var data =
        {
            siteId: lib1.caConstants.siteID,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
        }

        oauthAxiosInstance.post( '/api/v1/oauth/login', data ).then( function ( response )
    {
        getOAutheResponseHandler( response )
    } )
}

function getOAutheResponseHandler( response )
{
    console.log( response.data[0].authCode )
}

