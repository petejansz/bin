$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-PSDebug -Off #-Trace 2
$whereWasI = $pwd
# class MyWebException : System.Exception
# {
#     [string] $itsExText
#     [int] $code

#     MyWebException( $Message, $exception, $code ) : base( $Message )
#     {
#         $this.itsExText = $exception.Exception.ToString()
#         $this.code = $code
#     }
# }

# try
# {
#     ls "rubbish.txt"
# }
# catch
# {
#     try
#     {
#         $myExcep = [MyWebException]::new('Fail!', $_, 135)
#         throw $myExcep
#     }
#     catch [MyWebException]
#     {
#         Write-Output $_.Exception.itsExText
#     }
# }

class ServerClass
{
    [string] $shortname
    [string] $startFilename
    [string] $mainWindowTitle

    ServerClass([string] $shortname, [string] $startFilename, [string] $mainWindowTitle)
    {
        $this.shortname = $shortname
        $this.startFilename = $startFilename
        $this.mainWindowTitle = $mainWindowTitle
    }

    stop()
    {
        $ foo = closewindow.exe $this.mainWindowTitle 2>&1 > $null | Out-Null
    }

    start()
    {
        closewindow.exe $this.mainWindowTitle
        Start-process -FilePath $this.startFilename
    }
}

$coreServer = [ServerClass]::new('core', 'jboss_init_crm-core.bat', 'crm-core:8280 - run.bat   -b 0.0.0.0 -c crm-core')
$procServer = [ServerClass]::new('proc', 'jboss_init_pd-crm-processes.bat', 'pd-crm-processes:8180 - run.bat   -b 0.0.0.0 -c pd-crm-processes')
$pdadminServer = [ServerClass]::new('pdadmin', 'jboss_init_pd2-admin-rest.bat', 'pd2-admin-rest:8380 - run.bat   -b 0.0.0.0 -c pd2-admin-rest')
