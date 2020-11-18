function Show-progress
{
    $ExampleArray = @(1..200)
    $Smile = [System.Char]::ConvertFromUtf32([System.Convert]::toInt32('1F603', 16))    # Progress bar emoji
    $Sadface = [System.Char]::ConvertFromUtf32([System.Convert]::toInt32('1F621', 16))  # Progress bar emoji
    $TotalInidicators = 5

    $ExampleArray | ForEach-Object {
        Write-Host "Processing $_" # Doing some stuff...

        # Start of relevant snippet
        $Processed = [Math]::Round(($ExampleArray.indexOf($_) + 1) / $ExampleArray.Count * $TotalInidicators, 0)
        $Remaining = $TotalInidicators - $Processed

        $WindowTitle = ($Smile * $Processed) + ($Sadface * $Remaining)
        $Host.UI.RawUI.WindowTitle = $WindowTitle
        # End of relevant snippet

        Start-Sleep -Milliseconds 50
    }
}

Show-progress