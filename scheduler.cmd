@echo off
setlocal

SET SERVER_NAME=SCHEDULER
cd %USERPROFILE%\Documents\Projects\igt\aurora\scheduler\scheduler-app-spring-boot
start "%SERVER_NAME%" mvn -q clean install spring-boot:run "-Desa.allow.not.from.gateway=true"

