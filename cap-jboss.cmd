@echo off
setlocal

SET SERVER_NAME=CAP-JBOSS

SET JBOSS_CLASSPATH=%JBOSS_HOME%/server/%SERVER_NAME%/env-config;/etc/gtech/pd4
SET RUN_CONF=%JBOSS_HOME%/bin/%SERVER_NAME%/run.conf.bat

start "%SERVER_NAME%" C:\opt\jboss-eap-6.4\bin\cas.bat
