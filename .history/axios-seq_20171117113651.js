const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosCadev1Players = axios.create({
    baseURL: 'http://cadev1/api/v1/players/available/',
    headers: {'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35'}
  })

  const url1 = '/test27@yopmail.com'
  const url2 = '/test27@yopmail.com'

axiosCadev1Players.get(url1).then(function(response1)
{
    let count = response1.data
    axiosCadev1Players.get(url2).then(function(response2)
    {
        console.log(response1.data + response2.data)
    })
})