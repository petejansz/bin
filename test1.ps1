$email = 'test60@yopmail.com'
$playerId = pd2-admin --host cat2 --api playerid  --username $email
$jsonfile = "C:/Users/pjansz/Documents/json/notif-prefs/$email" + '.json'

processes-account.js -h rengw2 -ai $playerId
sleep 5
(pdplayer.ps1 -hostname ca-cat2-pws.lotteryservices.com -username $email -getnotificationsprefs).Content| formatjson | tee.exe $jsonfile | out-null
test-player-notifprefs -f $jsonfile
