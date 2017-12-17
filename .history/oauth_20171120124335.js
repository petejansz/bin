'use strict'

module.exports = class OAuth
{
    util = require( 'util' )
    axios = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/axios' )
    lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

    constructor( host, headers )
    {
        this.instance
        this.proto = 'https'

        if ( host.match( /dev/ ) )
        {
            this.proto = 'http'
        }

        return axios.create(
            {
                baseURL: this.proto + '://' + host,
                headers: headers ? headers : lib1.commonHeaders
            }
        )
    }
}
