const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosCadev1Players = axios.create({
    baseURL: 'http://cadev1/api/v1/players/available/',
    headers: {'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35'}
  })

var axiosGoogleMapsGeo = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/json'
})

function getFlorence() {return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=Florence')}
function getLondon() {return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=London')}
function getSacramento() {return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=Sacramento')}
function getChicago() {return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=Chicago')}
function isEmail1Available()
{
    return axiosCadev1Players.get( '/test27@yopmail.com' )
}

function isEmail2Available()
{
    return axiosCadev1Players.get( '/test28@yopmail.com' )
}

function writeCityGeo(cityGeo)
{
    console.log(
        `City: ${cityGeo.data.results[0].formatted_address} -`,
        `Latitude: ${cityGeo.data.results[0].geometry.location.lat} -`,
        `Longitude: ${cityGeo.data.results[0].geometry.location.lng}`
    )
}

var requests = [isEmail1Available(), isEmail2Available(), getFlorence(), getLondon(), getSacramento(), getChicago()]
axios.all( requests )
    .then( axios.spread( function ( emailAvailableOne, emailAvailableTwo, Florence, London, Sacramento, Chicago )
    {
        console.log('emailAvailableOne: ' + emailAvailableOne.data)
        console.log('emailAvailableTwo: ' + emailAvailableTwo.data)
        writeCityGeo(Florence)
        writeCityGeo(London)
        writeCityGeo(Sacramento)
        writeCityGeo(Chicago)
    } ) )

