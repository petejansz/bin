admin-search-players.js -h cat1 -c Auburn |formatJson |ConvertFrom-Json|%{$_.value.playerId}|%{admin-players-profile.js -h cat1 -m per -i $_ | formatJson} | clip