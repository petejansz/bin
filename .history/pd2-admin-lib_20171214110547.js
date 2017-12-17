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
    },

    getAdminEnums = function ( responseHandler )
    {
        var http = require( "http" );

        var options =
            {
                "method": "GET",
                "hostname": CA_CONSTANTS.CAT1_ADMIN_PORTAL_HOST,
                "path": "/california-admin-rest/api/v1/admin/enums",
                "headers": Headers
            };

        options.headers.authorization = "ESMS 6JCYV4DO0H7O7BA3OSPAHU0OND4PN0";

        var req = http.request( options, function ( res )
        {
            var chunks = [];

            res.on( "data", function ( chunk )
            {
                chunks.push( chunk );
            } );

            res.on( "end", function ()
            {
                var body = Buffer.concat( chunks );
                var responseObj =
                    {
                        headers: this.headers,
                        statusCode: this.statusCode,
                        statusMessage: this.statusMessage,
                        body: body
                    };
                responseHandler( responseObj );
            } );
        } );

        req.end();
    }

    return {
        getPlayerId: getPlayerId
    }
} )()

module.exports = Pd2Admin