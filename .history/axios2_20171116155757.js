const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosCadev1Players = axios.create({
    baseURL: 'http://cadev1/api/v1/players/available/',
    headers: {'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35'}
  })

var axiosGoogleMapsGeo = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/json'
})

function getFlorence() {return axiosGoogleMapsGeo.get('address=Florence')}
function isEmail1Available()
{
    return axiosCadev1Players.get( '/test27@yopmail.com' )
}

function isEmail2Available()
{
    return axiosCadev1Players.get( '/test28@yopmail.com' )
}

axios.all( [isEmail1Available(), isEmail2Available(), getFlorence()] )
    .then( axios.spread( function ( emailAvailableOne, emailAvailableTwo, florence )
    {
        console.log(emailAvailableOne.data)
        console.log(emailAvailableTwo.data)
    } ) )