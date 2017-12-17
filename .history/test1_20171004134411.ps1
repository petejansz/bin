$ErrorActionPreference = "stop"
Set-StrictMode -Version Latest
# Set-PSDebug -Off #-Trace 2

#
function doit($filename)
{
    echo $filename
    $sw = [Diagnostics.Stopwatch]::StartNew()

    out-of-sync-report.ps1 -csvfile $filename

    $sw.Stop()
    green $sw.Elapsed.TotalSeconds
}

Clear-Host
foreach ($i in @(2012..2017))
{
    $filename = "C:\Users\pjansz\Documents\pd\california\apl\{0}.csv" -f $i
    doit $filename
}