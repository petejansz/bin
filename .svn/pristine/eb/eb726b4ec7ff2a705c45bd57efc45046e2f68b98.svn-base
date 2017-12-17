param
(
    [string]$email,
    [switch]$help,
    [switch]$h 
)

. lib-general.ps1
Set-PSDebug -Trace 2

function showHelp()
{
    echo "USAGE: $MyInvocation.MyCommand.Name -ckemail <email>"
    exit 1
}

if ($h -or $help) {showHelp}

validateEmailAddress $email

Set-PSDebug -Off #Trace 2
