@echo off
call setEnv.bat

if "%1" == "" (
    call adb logcat
) else (
    call adb logcat -c
    call adb logcat %1:* *:S
)

:end