const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
const lib1 =  require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

// f1('cadev1', 'test50@yopmail.com')
getOauth('cadev1', 'test50@yopmail.com', 'Password123')
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

    var axiosInstance = axios.create( {
        baseURL: proto + '://' + host,
        headers: { 'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35' }
    } )


    axiosInstance.post( '/api/v1/oauth/login' ).then( function ( response1 )
    {
        console.log(response1)
    } )
}

function responseHandler(response)
{
    console.log(response)
}

function f1( host, username, password, responseHandler )
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

    var axiosInstance = axios.create( {
        baseURL: proto + '://' + host + '/api/v1/players/available/',
        headers: lib1.commonHeaders
    } )

    const url1 = '/test27@yopmail.com'
    const url2 = '/test27@yopmail.com'

    axiosInstance.get( url1 ).then( function ( response1 )
    {
        let count = response1.data
        axiosInstance.get( url2 ).then( function ( response2 )
        {
            console.log( response1.data  )
        } )
    } )
}