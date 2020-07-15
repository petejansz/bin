# if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))
# {
    $IfAlias = 'Ethernet'
    $MACAddress = 'D4-81-D7-95-AB-09'

    $interface = Get-NetAdapter | Where-Object { $_.Name -eq $IfAlias -and $_.MacAddress -eq $MACAddress }
    Write-Output $interface
    # Disable-NetAdapter -Name $IfAlias

    # Start-Process Powershell -Verb runAs
    Set-DnsClientServerAddress -InterfaceIndex $interface.InterfaceIndex -ServerAddresses 10.0.0.1

    Enable-NetAdapter -Name $IfAlias

    $dns_client = Get-DNSClientServerAddress | Where-Object {$_.interfacealias -eq $IfAlias}
    foreach ($item in $dns_client.ServerAddresses)
    {
        $item
    }
    # $dns_client.ServerAddresses[0] -match "^10\."
# }