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

[ServerClass]$procServer = 'proc' 'jboss_init_pd-crm-processes.bat' 'pd-crm-processes:8180 - run.bat   -b 0.0.0.0 -c pd-crm-processes'
stopServer $procServer

cd $whereWasI