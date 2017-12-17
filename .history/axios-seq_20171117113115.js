const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosCadev1Players = axios.create({
    baseURL: 'http://cadev1/api/v1/players/available/',
    headers: {'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35'}
  })

const url1 = '/test27@yopmail.com'

axios.get(url1).then(function(response) {console.log(response)})