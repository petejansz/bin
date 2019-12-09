@echo off
setlocal

SET SERVER_NAME=NAVIGATOR
cd %USERPROFILE%\Documents\Projects\igt\aurora\cas-ui

start "%SERVER_NAME%" /min yarn start
