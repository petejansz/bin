'use strict'

module.exports = class OAuth
{
    constructor( host, headers )
    {
        this.util = require( 'util' )
        this.axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
        this.lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

        this.proto = 'https'

        if ( host.match( /dev/ ) )
        {
            this.proto = 'http'
        }

        this.headers = headers ? headers : this.lib1.commonHeaders

        this.instance = this.axios.create(
            {
                baseURL: this.proto + '://' + host,
                headers: this.headers
            }
        )
    }

    getOauthCode( username, password, responseHandler )
    {
        var reqData =
            {
                siteId: this.headers.siteID,
                clientId: 'SolSet2ndChancePortal',
                resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
            }

        this.instance.post( '/api/v1/oauth/login', reqData ).then( function ( response )
        {
            responseHandler( response )
        } )
    }
}
