class MyWebException : System.Exception
{
    [string] $itsExText
    [int] $code

    MyWebException( $Message, $exception, $code ) : base( $Message )
    {
        $this.itsExText = $exception.Exception.ToString()
        $this.code = $code
    }
}

try
{
    ls "rubbish.txt"
}
catch
{
    try
    {
        $myExcep = [MyWebException]::new('Fail!', $_, 135)
        throw $myExcep
    }
    catch [MyWebException]
    {
        Write-Output $_.Exception.itsExText
    }
}