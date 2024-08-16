@echo off

if exist "%1\bgServices\index.ts" (
    bun run --inspect=127.0.0.1:6499/debug "%1\bgServices\index.ts"
) else (
    "%1\bgServices\ctjsbg.exe"
)
