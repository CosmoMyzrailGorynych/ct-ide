@echo off

if exist "%1\backend\index.ts" (
    bun run --inspect=127.0.0.1:6499/debug "%1\backend\index.ts"
) else (
    "%1\backend\ctjsbg.exe"
)
