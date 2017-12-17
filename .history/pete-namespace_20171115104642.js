var PeteNamespace = ( function ()
{
    var privateMethod = function (msg)
    {
        console.log( 'privateMethod says, ' + msg )
    }

    return {
        publicMethod: function (msg)
        {
            console.log( 'publicMethod says, ' + msg )
        }
    }
} )();