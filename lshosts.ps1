$lines = @()

foreach ($line in (Get-Content C:\Windows\System32\drivers\etc\hosts))
{
    if ($line -notmatch "^#|^$")
    {
        ($ip, $dnsname, $myalias, $rubbish) = [regex]::split($line.trim(),  '\s+')
        $lines += "{0, -20} {1, -18} {2, 15}" -f $myalias, $dnsname, $ip
    }
}

$lines | Sort-Object