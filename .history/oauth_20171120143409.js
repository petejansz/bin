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

    getInstance() {return this.instance}

    static getAuthCode( oauth, username, password, responseHandler )
    {
        var request =
            {
                siteId: oauth.headers.siteID,
                clientId: 'SolSet2ndChancePortal',
                resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
            }

        oauth.getInstance().post( '/api/v1/oauth/login', request ).then( function ( response )
        {
            responseHandler( response.data[0].authCode )
        } )
    }

    static getToken( oauth, authCode, responseHandler )
    {
        console.log(authCode)
        var request =
            {
                authCode: authCode,
                clientId: 'SolSet2ndChancePortal',
                siteId: "35"
            }

        oauth.getInstance().post( '/api/v1/oauth/tokens', request ).then( function ( response )
        {
            console.log( response )
        } )
    }
}
