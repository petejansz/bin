Write-Host 'throw'

try
{
	try
	{
		throw "My exception text..."
	}
	catch
	{
		Write-Host $_
		Write-Host $_.GetType()
		Write-Host $_.Exception
		Write-Host $_.Exception.StackTrace
		throw
	}
}
catch
{
	Write-Host $_
	Write-Host $_.GetType()
	Write-Host $_.Exception
	Write-Host $_.Exception.StackTrace
#	Write-Host $err
}

exit
Write-Host 'throw (exception)'

try
{
	try
	{
		$exception = New-Object System.Exception ("test")
		throw $exception
	}
	catch
	{
		Write-Host $_
		Write-Host $_.GetType()
		Write-Host $_.Exception
		Write-Host $_.Exception.StackTrace
		throw
	}
}
catch
{
	Write-Host $_
	Write-Host $_.GetType()
	Write-Host $_.Exception
	Write-Host $_.Exception.StackTrace
	Write-Host $err
}

Write-Host 'throw $_'

try
{
	try
	{
		$exception = New-Object System.Exception ("test")
		throw $exception
	}
	catch
	{
		Write-Host $_
		Write-Host $_.GetType()
		Write-Host $_.Exception
		Write-Host $_.Exception.StackTrace
		throw $_
	}
}
catch
{
	Write-Host $_
	Write-Host $_.GetType()
	Write-Host $_.Exception
	Write-Host $_.Exception.StackTrace
	Write-Host $err
}

Write-Host 'throw $_.Exception'

try
{
	try
	{
		$exception = New-Object System.Exception ("test")
		throw $exception
	}
	catch
	{
		Write-Host $_
		Write-Host $_.GetType()
		Write-Host $_.Exception
		Write-Host $_.Exception.StackTrace
		throw $_.Exception
	}
}
catch
{
	Write-Host $_
	Write-Host $_.GetType()
	Write-Host $_.Exception
	Write-Host $_.Exception.StackTrace
	Write-Host $err
}