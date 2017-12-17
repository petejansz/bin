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
        var http = require( "http" )
        var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

        var options =
            {
                "method": "GET",
                "hostname": lib1.caConstants.CAT1_ADMIN_PORTAL_HOST,
                "path": "/california-admin-rest/api/v1/admin/enums",
                "headers": lib1.adminHeaders
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
    },

    searchForPlayers = function ( pdAdminSystem, responseHandler )
    {
        var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
        var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

        var options =
            {
                method: 'GET',
                rejectUnauthorized: false,
                url: pdAdminSystem.url,
                qs: pdAdminSystem.qs,
                headers:
                    {
                        'cache-control': 'no-cache',
                        referer: lib1.getFirstIPv4Address(),
                        dnt: '1',
                        Authorization: pdAdminSystem.auth,
                    }
            }

        request( options, responseHandler )
    },

    createNote = function( hostname, port, playerId, responseHandler )
    {
        var util = require( 'util' )
        var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
        var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
        var urlFormat = 'http://%s:%s/california-admin-rest/api/v1/admin/players/%s/note'
        var url = util.format( urlFormat, hostname, ( port ? port : lib1.adminPort ), playerId )
        var options =
            {
                method: 'POST',
                url: url,
                headers: lib1.adminHeaders,
                referer: lib1.getFirstIPv4Address(),
                dnt: '1',
                body:
                    {
                        displayAlert: false,
                        note: 'Make a note.',
                        user: 'administrator',
                        creationDate: new Date().getTime()
                    },
                json: true
            }

        options.headers.authorization = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'

        request( options, responseHandler )
    }

    return {
        createNote: createNote,
        getPlayerId: getPlayerId,
        getAdminEnums: getAdminEnums,
        searchForPlayers: searchForPlayers
    }
} )()

module.exports = Pd2Admin