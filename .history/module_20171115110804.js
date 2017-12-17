var Module = ( function ()
{
    var name = 'Pete'
    var DefaultName = name

    var privateMethod = function ( message, passedName )
    {
        console.log( message + ' ' + passedName ? passedName : DefaultName )
    }

    var publicMethod = function ( text, name )
    {
        privateMethod( text, name )
    }

    return {
        publicMethod: publicMethod,        DefaultName: DefaultName
    };

} )()

module.exports = Module