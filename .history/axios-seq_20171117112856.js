const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var sac = 'https://maps.googleapis.com/maps/api/geocode/json?address=Sacramento'
var fres = 'https://maps.googleapis.com/maps/api/geocode/json?address=Fresno'
var bakersfield = 'https://maps.googleapis.com/maps/api/geocode/json?address=Bakersfield'

axios.get(sac).then(function(response) {console.log(response)})