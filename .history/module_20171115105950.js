var Module = ( function ()
{

    var privateMethod = function ( message )
    {
        console.log( message )
    }

    var publicMethod = function ( text )
    {
        privateMethod( text )
    }

    return {
        publicMethod: publicMethod
    };

} )()

module.exports = Module