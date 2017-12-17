$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest

$hostname = 'player.calottery.com'
$port = 443
$username = 'test50@yopmail.com'
# pdplayer -hostname player.calottery.com -port 443 -username test50@yopmail.com -chpwd RegTest6100 -newpwd Password123

for ($i=1; $i -le 2; $i++)
{
    $newpwd = $null
    $chpwd = $null

    if ($i % 2)
    {
        $newpwd = "Password123"
        $chpwd = "RegTest6100"
    }
    else
    {
        $newpwd = "RegTest6100"
        $chpwd = "Password123"
    }

    $theCall = "pdplayer -hostname $hostname -port $port -username $username -chpwd $chpwd -newpwd $newpwd"
    "{0}: `t{1}" -f $i, $theCall
    pdplayer -hostname $hostname -port $port -username $username -chpwd $chpwd -newpwd $newpwd
}