const axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )

var axiosInstance = axios.create({
    baseURL: 'http://cadev1/api/v1/players/available/',
    headers: {'X-EX-SYSTEM-ID': '8', 'X-CHANNEL-ID': '2', 'X-SITE-ID': '35'}
  })

function isEmail1Available()
{
    return axiosInstance.get( '/test27@yopmail.com' )
}

function isEmail2Available()
{
    return axiosInstance.get( '/test28@yopmail.com' )
}

axiosInstance.all( [isEmail1Available(), isEmail2Available()] )
    .then( axiosInstance.spread( function ( one, two )
    {
        console.log(one)
        console.log(two)
    } ) )