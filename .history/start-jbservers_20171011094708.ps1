trap [Exception]
{
    [Console]::Error.WriteLine($_.Exception);
    Set-Location $whereWasI
}

Set-Location $env:USERPROFILE
jboss_init_crm-core.bat
jboss_init_pd2-admin-rest.bat
jboss_init_pd-crm-processes.bat
Set-Location $whereWasI

