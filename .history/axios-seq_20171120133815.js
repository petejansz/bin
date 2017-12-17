const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
f1('cadev1')
function f1( host )
{
    var axiosCadev1Players = axios.create( {
        baseURL: 'http://' + host + '/api/v1/players/available/',
        headers: { 'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35' }
    } )

    const url1 = '/test27@yopmail.com'
    const url2 = '/test50@yopmail.com'

    axiosCadev1Players.get( url1 ).then( function ( response1 )
    {
        let count = response1.data
        axiosCadev1Players.get( url2 ).then( function ( response2 )
        {
            console.log( response1)// + response2.data )
            console.log( response2.request)// + response2.data )
        } )
    } )
}