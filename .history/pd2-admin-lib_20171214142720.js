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

        createNote = function ( pdAdminSystem, playerId, responseHandler )
        {
            var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
            var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

            var options =
                {
                    method: 'POST',
                    rejectUnauthorized: false,
                    url: pdAdminSystem.url + '/' + playerId + '/note',
                    headers:
                        {
                            'cache-control': 'no-cache',
                            referer: lib1.getFirstIPv4Address(),
                            dnt: '1',
                            Authorization: pdAdminSystem.auth,
                        },
                    body:
                        {
                            displayAlert: false,
                            note: 'Make a note.',
                            user: 'administrator',
                            creationDate: new Date().getTime()
                        },
                    json: true
                }

            request( options, responseHandler )
        },

        closeAccount = function ( pdAdminSystem, playerId, responseHandler )
        {
            var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
            var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
            var options =
                {
                    method: 'PUT',
                    rejectUnauthorized: false,
                    url: pdAdminSystem.url + '/' + playerId + '/closeaccount',
                    headers:
                        {
                            'cache-control': 'no-cache',
                            referer: lib1.getFirstIPv4Address(),
                            dnt: '1',
                            Authorization: pdAdminSystem.auth,
                        },
                    body:
                        {
                            contractId: playerId, reason: 'Admin, close this account!'
                        },
                    json: true
                }

            request( options, responseHandler )
        }


    return {
        closeAccount: closeAccount,
        createNote: createNote,
        getPlayerId: getPlayerId,
        getAdminEnums: getAdminEnums,
        searchForPlayers: searchForPlayers
    }
} )()

module.exports = Pd2Admin