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

# for ($i=1; $i -le 200; $i++)
# {
#     $narg = $null
#     $oarg = $null

#     if ($i % 2)
#     {
#         $narg = "Password123"
#         $oarg = "RegTest6100"
#     }
#     else
#     {
#         $narg = "RegTest6100"
#         $oarg = "Password123"
#     }

#     $theCall = "processes-contact-verification -h rengw2 -c -n $narg -o $oarg"
#     "{0}: `t{1}" -f $i, $theCall
#     processes-contact-verification -h rengw2 -c -n $narg -o $oarg
# }