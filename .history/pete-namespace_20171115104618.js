var PeteNamespace = ( function ()
{
    var privateMethod = function ()
    {
        console.log( 'privateMethod' )
    }

    return {
        publicMethod: function (msg)
        {
            console.log( 'publicMethod says, ' + msg )
        }
    }
} )();