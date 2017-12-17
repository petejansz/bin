const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
const lib1 =  require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

getOauth('cadev1', 'test50@yopmail.com', 'Password123', getOAutheResponseHandler)

function getOauth( host, username, password )
{
    var proto = 'https'

        if ( host.match( /dev/ ) )
        {
            proto = 'http'
        }

    var data =
    {
        siteId: lib1.caConstants.siteID,
        clientId: 'SolSet2ndChancePortal',
        resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
    }

    var axiosInstance = axios.create(
        {
            baseURL: proto + '://' + host,
            headers: lib1.commonHeaders
        }
    )

    axiosInstance.post( '/api/v1/oauth/login', data ).then( function ( response )
    {
        getOAutheResponseHandler(response)
    } )
}

function getOAutheResponseHandler(response)
{
    console.log(response.data[0].authCode)
}

