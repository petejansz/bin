/**
 * Environment alias mapper. Map/search for proto://hostname
 * Pete Jansz
 * 2019-03-06
 */

const modulesPath = '/usr/share/node_modules/'
const util = require( 'util' )
var program = require( modulesPath + 'commander' )
var peteUtil = require( modulesPath + 'pete-lib/pete-util' )

const REQUIREMENTS_GRAMMER = '<state>-<envType>-<function>[-appType(default=pws)]'

program
    .version( '0.0.1' )
    .description( 'Env aliaser - lookup proto://hostname[:port] by alias' )
    .usage( '--alias <alias> | --ls' )
    .option( '-a, --alias <alias>', 'Alias format: ' + REQUIREMENTS_GRAMMER )
    .option( '-f, --envfile <envfile> default=envar ENVIRONMENTS_JSON', 'Environments json file' )
    .option( '-p, --proto', 'Returns proto://hostname[:port]' )
    .option( '-l, --list', 'List' )
    .parse( process.argv )

process.exitCode = 1
if ( !program.alias && !program.list )
{
    program.help()
}

environments = []

if ( program.envfile )
{
    environments = require( program.envfile )
}
else if ( process.env.ENVIRONMENTS_JSON )
{
    environments = require( process.env.ENVIRONMENTS_JSON )
}
else
{
    console.error( 'Environments json file not found.' )
    process.exit()
}

if ( program.list )
{
    environments.sort( peteUtil.fieldSorter( ['state', 'envType', 'function'] ) )

    for ( var i in environments )
    {
        var env = environments[i]
        var hostname = env.port ? ( env.hostname + ':' + env.port ) : env.hostname
        var formmatted = util.format( '%s %s %s %s %s',
            env.state,
            env.envType.toString().padStart( 4 ),
            env.function.toString().padStart( 4 ),
            env.proto.toString().padStart( 5 ),
            hostname,
        )
        console.log( formmatted )
    }

    process.exitCode = 0
}
else if ( Object.getPrototypeOf( program.alias ) === String.prototype )
{
    var alias = createAlias( program.alias.toString().toLowerCase() )
    var envs = matchByProperties( alias )

    for ( var i in envs )
    {
        var env = envs[i]
        if ( program.proto )
        {
            console.log( protoHost( env ) )
        }
        else
        {
            console.log( env.hostname )
        }
    }

    process.exitCode = envs.length > 0 ? 0 : 1
}
else
{
    program.help()
}

process.exit()
/////////////////////////////////////////////////////////////
function matchByProperties( alias )
{
    var matchedEnvs = []

    for ( var i in environments )
    {
        var env = environments[i]

        if ( alias.state == env.state && alias.envType == env.envType && alias.function == env.function )
        {
            if ( alias.appType.match( /mobile/i ) && env.hostname.match( /mobile/i ) )
            {
                matchedEnvs.push( env )
            }
            else if ( alias.appType.match( /pws/i ) && env.hostname.match( /pws/i ) )
            {
                matchedEnvs.push( env )
            }
            else if ( alias.appType.match( /pws/i ) && !env.hostname.match( /mobile/i ) )
            {
                matchedEnvs.push( env )
            }
        }
    }

    return matchedEnvs
}

function protoHost( env )
{
    var hostname = env.port ? ( env.hostname + ':' + env.port ) : env.hostname
    return env.proto + '://' + hostname
}

function createAlias( aliasName )
{
    var alias = {}
    var tokens = aliasName.split( '-' )

    if ( tokens && tokens.length == 4 )
    {
        alias.state = aliasName.split( '-' )[0]
        alias.envType = aliasName.split( '-' )[1]
        alias.function = aliasName.split( '-' )[2]
        alias.appType = aliasName.split( '-' )[3]
    }
    else if ( tokens && tokens.length == 3 )
    {
        alias.state = aliasName.split( '-' )[0]
        alias.envType = aliasName.split( '-' )[1]
        alias.function = aliasName.split( '-' )[2]
        alias.appType = 'pws'
    }
    else
    {
        var msg = util.format(
            'alias name \'%s\' does not meet requirements: %s', aliasName, REQUIREMENTS_GRAMMER )
        throw msg
    }

    return alias
}