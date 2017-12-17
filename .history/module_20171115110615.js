var Module = ( function ()
{
    var name = 'Pete'
    var DefaultName = name

    var privateMethod = function ( message )
    {
        console.log( message + ' ' + name )
    }

    var publicMethod = function ( text )
    {
        privateMethod( text )
    }

    return {
        publicMethod: publicMethod,        DefaultName: DefaultName
    };

} )()

module.exports = Module