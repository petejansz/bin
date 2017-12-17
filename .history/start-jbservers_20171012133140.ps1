$whereWasI = Get-Location

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

function start-server([string]$serverName)
{
    $windowTitle = $serverName -replace "^jboss_init_|\.bat", ""
    foreach($p in (Get-Process cmd))
    {
        if ($p.MainWindowTitle -match $windowTitle)
        {
            Stop-Process -InputObject $p
            sleep 3
            & $serverName
        }
    }

}

Set-Location $env:USERPROFILE
foreach ($server in @("jboss_init_crm-core.bat", "jboss_init_pd2-admin-rest.bat", "jboss_init_pd-crm-processes.bat"))
{
    start-server($server)
}
Get-Process cmd|%{"{0} {1}" -f $_.ID, $_.MainWindowTitle}
Set-Location $whereWasI

