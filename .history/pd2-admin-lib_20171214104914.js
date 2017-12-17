/**
 * Author: Pete Jansz
 */

var Pd2Admin = ( function ()
{
    var getPlayerId = function ( username, host, port, responseHandler, errorHandler )
    {
        var util = require( 'util' )
        var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request-promise' )
        var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
        const restPath = '/california-admin-rest/api/v1/admin/players'
        const uri = util.format( '%s://%s:%s%s', 'http', host, ( port ? port : lib1.adminPort ), restPath )
        var options =
            {
                uri: uri,
                qs: { email: encodeURI( username ) },
                headers: lib1.adminHeaders,
                json: true
            }

        request( options )
            .then( function ( resp )
            {
                responseHandler( resp )
            } )
            .catch( function ( err )
            {
                errorHandler( err )
            } )
    }

    return {
        getPlayerId: getPlayerId
    }
} )()

module.exports = Pd2Admin