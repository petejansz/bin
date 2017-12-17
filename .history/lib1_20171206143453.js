var CA_CONSTANTS =
    {
        CAT1_ADMIN_PORTAL_HOST: "10.164.172.231",
        siteID: 35,
        systemId: 8,
        channelId: 2
    };

var Headers =
    {
        "content-type": "application/json;charset=UTF-8",
        "Connection": "keep-alive",
        "x-site-id": CA_CONSTANTS.siteID,
        "x-channel-id": CA_CONSTANTS.channelId,
        "x-ex-system-id": CA_CONSTANTS.systemId,
        "cache-control": "no-cache"
    };

var lib1 =
    {
        caConstants: CA_CONSTANTS,
        commonHeaders: Headers,
        adminHeaders: Headers,
        adminPort: 8280,
        crmProcessesPort: 8180,

        getOAuthCode: function( hostname, username, password )
        {
            var binPath = process.env.USERPROFILE + '/Documents/bin/'
            const { spawnSync } = require( 'child_process' )

            const oauthLogin = spawnSync( 'node', [binPath + 'oauth-login', '-h', hostname, '-u', username, '-p', password],
                {
                    shell: true
                }
            )

            var authCode = null

            if ( oauthLogin.status != 0 )
            {
                throw new Error( 'OAuth login failed. ' + oauthLogin.stderr.toString() )
            }
            else
            {
                authCode = oauthLogin.stdout.toString().trim()
            }

            return authCode
        },

        generateUUID: function ()
        {
            var d = new Date().getTime()
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c )
            {
                var r = ( d + Math.random() * 16 ) % 16 | 0;
                d = Math.floor( d / 16 );
                return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
            } );

            return uuid
        },

        elapsedTime: function ( startTime )
        {
            var endTime = new Date()
            var timeDiffMilliseconds = endTime - startTime
            // strip the ms
            var timeDiffSeconds = timeDiffMilliseconds /= 1000

            // get seconds
            return Math.round( timeDiffSeconds )
        },

        getFirstIPv4Address: function ()
        {
            var os = require( 'os' );
            var ifaces = os.networkInterfaces();
            var values = Object.keys( ifaces ).map( function ( name )
            {
                return ifaces[name];
            } );
            values = [].concat.apply( [], values ).filter( function ( val )
            {
                return val.family == 'IPv4' && val.internal == false;
            } );

            return values.length ? values[0].address : '0.0.0.0';
        },

        getAdminEnums: function ( responseHandler )
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
        },

        sortUniq: function ( a )
        {
            return a.sort().filter( function ( item, pos, ary )
            {
                return !pos || item != ary[pos - 1];
            } );
        },

        convertArrayToMap: function ( a )
        {
            var seen = {};
            return a.filter( function ( item )
            {
                return seen.hasOwnProperty( item ) ? false : ( seen[item] = true );
            } );
        }
    };

module.exports = lib1;
