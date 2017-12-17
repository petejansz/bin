$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest

$playerId = 1000010796
pdplayer -hostname player.calottery.com -port 443 -username test50@yopmail.com -chpwd RegTest6100 -newpwd Password123

for ($i=1; $i -le 1; $i++)
{
    $narg = $null
    $oarg = $null

    if ($i % 2)
    {
        $narg = "Password123"
        $oarg = "RegTest6100"
    }
    else
    {
        $narg = "RegTest6100"
        $oarg = "Password123"
    }

    $theCall = "processes-contact-verification -h rengw2 -c -i $playerId -n $narg -o $oarg"
    "{0}: `t{1}" -f $i, $theCall
    processes-contact-verification -h rengw2 -c -i $playerId -n $narg -o $oarg
}