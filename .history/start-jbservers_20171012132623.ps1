$whereWasI = Get-Location

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

function start-server([string]$serverName)
{
    foreach($p in (Get-Process cmd))
    {
        if ($p.MainWindowTitle -match $serverName)
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

Set-Location $whereWasI

