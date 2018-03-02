/**
 * Author: Pete Jansz
 */

var Pd2Admin = ( function ()
{
    // Return a promise of personal-info or profile
    // f: "pers | pro"
    var getPersProf = function ( playerId, f, host, port )
    {
        var util = require( 'util' )
        var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request-promise' )
        var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )
        var fname = f.match( "^pers" ) ? 'personal-info' : 'profile'
        const restPath = '/california-admin-rest/api/v1/admin/players'
        const url = util.format( '%s://%s:%s%s/%s/%s', 'http', host, ( port ? port : lib1.adminPort ), restPath, playerId, fname )
        var options =
            {
                url: url,
                headers: lib1.adminHeaders,
                json: true
            }

        return request( options )
    },

        getPlayerId = function ( pdAdminSystem, username, responseHandler )
        {
            var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
            var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )

            var options =
                {
                    method: 'GET',
                    url: pdAdminSystem.url,
                    qs: { email: encodeURI( username ) },
                    headers: lib1.adminHeaders
                }

            options.headers.authorization = pdAdminSystem.auth,
            options.headers.referer = lib1.getFirstIPv4Address()
            options.headers.dnt = '1'

            request( options, responseHandler )
        },

        getAdminEnums = function ( pdAdminSystem, responseHandler )
        {
            var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
            var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )

            var options =
                {
                    method: 'GET',
                    url: pdAdminSystem.url.toString().replace( 'players', 'enums' ),
                    headers: lib1.adminHeaders
                }

            options.headers.authorization = pdAdminSystem.auth,
            options.headers.referer = lib1.getFirstIPv4Address()
            options.headers.dnt = '1'

            request( options, responseHandler )
        },

        // Return a promise when responseHandler null
        searchForPlayers = function ( pdAdminSystem, responseHandler )
        {
            var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request-promise' )
            var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )

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

            if ( responseHandler )
            {
                request( options, responseHandler )
            }
            else
            {
                return request( options )
            }
        },

        createNote = function ( pdAdminSystem, playerId, responseHandler )
        {
            var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
            var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )

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
            var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )
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
        getPersProf: getPersProf,
        searchForPlayers: searchForPlayers
    }
} )()

module.exports = Pd2Admin