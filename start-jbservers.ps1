﻿$whereWasI = Get-Location

trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

<#
.SYNOPSIS
Stop, start server

.DESCRIPTION
Stop, start server

.PARAMETER serverName
Batch file JBoss server name

.EXAMPLE
jboss_init_crm-core.bat

#>
function restart-server([string]$serverName)
{
    $windowTitle = $serverName -replace "^jboss_init_|\.bat", ""
    $processes = Get-Process cmd, java -erroraction silentlycontinue

    foreach ($p in ($processes))
    {
        if ($p.MainWindowTitle -match $windowTitle)
        {
            "{0} {1} {2}" -f $p.id, $p.name, $p.MainWindowTitle
            Stop-Process -InputObject $p -Force
            Wait-Process -Id $p.Id  -erroraction silentlycontinue
        }
    }

    & $serverName
}

Set-Location $env:USERPROFILE
$jbossServerStartFiles = @("jboss_init_crm-core.bat", "jboss_init_pd2-admin-rest.bat", "jboss_init_pd-crm-processes.bat")

foreach ($server in $jbossServerStartFiles)
{
    restart-server($server)
}

Set-Location $whereWasI

