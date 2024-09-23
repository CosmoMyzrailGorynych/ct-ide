@echo off

if exist "%~1\bgServices\ctjsbg.exe" (
    "%~1\bgServices\ctjsbg.exe" 2> error_log.txt 1> output_log.txt
) else (
    bun run --inspect=127.0.0.1:6499/debug "%~1\bgServices\index.ts"
)
