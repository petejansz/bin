const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var flo = 'https://maps.googleapis.com/maps/api/geocode/json?address=Florence'
var lon = 'https://maps.googleapis.com/maps/api/geocode/json?address=London'
var sac = 'https://maps.googleapis.com/maps/api/geocode/json?address=Sacramento'

axios.get( flo )
    .then( ( floRes ) =>
    {
        return axios.get( lon )
    } ).then( ( lonRes ) =>
        {
            console.log( floRes.data[0].formatted_address )
            console.log( lonRes.data[0].formatted_address )
        } )
