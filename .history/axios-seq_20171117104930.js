const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var sac = 'https://maps.googleapis.com/maps/api/geocode/json?address=Sacramento'
var fres = 'https://maps.googleapis.com/maps/api/geocode/json?address=Fresno'
var bakersfield = 'https://maps.googleapis.com/maps/api/geocode/json?address=Bakersfield'

const sacRequest = axios.get(sac)
      .then(response => this.setState({ sacLocation: response.data }))

const fresRequest = axios.get(fres)
  .then(response => this.setState({ fresLocation: response.data }))

const directionsRequest = axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + this.state.sacLocation.results.place_id + '&destination=place_id:' + this.state.fresLocation.results.place_id + '&key=' + 'API-KEY-HIDDEN')
  .then(response => this.setState({ route: response.data }))


Promise.all([sacRequest, fresRequest])
       .then(() => {
           return directionsRequest
       })