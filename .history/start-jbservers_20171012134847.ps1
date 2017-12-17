$whereWasI = Get-Location

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

function start-server([string]$serverName)
{
    $windowTitle = $serverName -replace "^jboss_init_|\.bat", ""
    $windowTitle
    foreach($p in (Get-Process cmd))
    {
        if ($p.MainWindowTitle -match $windowTitle)
        {
            Stop-Process -InputObject $p
            #break
        }
    }

    sleep 2
    & $serverName
}

Set-Location $env:USERPROFILE
$jbossServerStartFiles = @("jboss_init_crm-core.bat", "jboss_init_pd2-admin-rest.bat", "jboss_init_pd-crm-processes.bat")

foreach ($server in $jbossServerStartFiles)
{
    start-server($server)
}

Set-Location $whereWasI

