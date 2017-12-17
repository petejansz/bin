const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

const url =
    'https://maps.googleapis.com/maps/api/geocode/json?address=Florence'

function getLocation (url)//= async url =>
{
    try
    {
        const response = /*await*/ axios.get( url )
        const data = response.data
        console.log(
            `City: ${data.results[0].formatted_address} -`,
            `Latitude: ${data.results[0].geometry.location.lat} -`,
            `Longitude: ${data.results[0].geometry.location.lng}`
        )
    }
    catch ( error )
    {
        console.log( error )
    }
};

getLocation( url )