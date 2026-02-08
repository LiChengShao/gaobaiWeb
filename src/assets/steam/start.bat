@echo off
setlocal enabledelayedexpansion
set count=1
for %%i in (*.jpg *.jpeg *.png *.bmp *.gif *.tiff) do (
    ren "%%i" "steam!count!.png"
    set /a count+=1
)