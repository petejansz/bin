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
        closewindow.exe $this.mainWindowTitle 2>&1 > $null | Out-Null
    }

    start()
    {
        closewindow.exe $this.mainWindowTitle
        Start-process -FilePath $this.startFilename
    }
}

function startServer([ServerClass] $server)
{
    & $server.startFilename
}
function stopServer([ServerClass] $server)
{
    closewindow.exe $server.mainWindowTitle
}
#"jboss_init_crm-core.bat", "jboss_init_pd2-admin-rest.bat", "jboss_init_pd-crm-processes.bat")

$procServer = [ServerClass]::new('proc', 'jboss_init_pd-crm-processes.bat', 'pd-crm-processes:8180 - run.bat   -b 0.0.0.0 -c pd-crm-processes')
$procServer.start()