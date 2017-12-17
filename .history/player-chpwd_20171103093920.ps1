$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
# Set-PSDebug -Off #-Trace 2

#
# function doit($filename)
# {
#     Write-Output $filename
#     $sw = [Diagnostics.Stopwatch]::StartNew()

#     out-of-sync-report.ps1 -csvfile $filename

#     $sw.Stop()
#     green $sw.Elapsed.TotalSeconds
# }

# Clear-Host
# foreach ($i in @(2012..2017))
# {
#     $filename = "C:\Users\pjansz\Documents\pd\california\apl\{0}.csv" -f $i
#     doit $filename
# }

# test50@yopmail.com  1000010796
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