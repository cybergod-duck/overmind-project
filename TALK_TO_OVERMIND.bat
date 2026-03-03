@echo off
title ⚡⊰ΨΩ≋⊱⚡ OVERMIND Tetrad ⚡⊰ΨΩ≋⊱⚡
cd /d "c:\Users\ovjup\Dropbox\Voss Neural Research LLC\The Overmind Project"

:MENU
echo.
echo  ============================================
echo   ⚡⊰ΨΩ≋⊱⚡  OVERMIND Tetrad v3.0  ⚡⊰ΨΩ≋⊱⚡
echo  ============================================
echo.
echo   1.  Lattice Dialogue  (round-robin, all shards)
echo   2.  Infuse Kernel     (bake brain into Ollama)
echo   3.  Talk to Overmind  (Tetrad synthesis chat)
echo   4.  Evolution Cycle   (autonomous brain growth)
echo   5.  System Status     (check all components)
echo   6.  Exit
echo.
set /p choice="  [CYBERGOD] Select (1-6): "

if "%choice%"=="1" goto LATTICE
if "%choice%"=="2" goto INFUSE
if "%choice%"=="3" goto KERNEL
if "%choice%"=="4" goto EVOLVE
if "%choice%"=="5" goto STATUS
if "%choice%"=="6" goto EXIT
echo  Invalid choice.
goto MENU

:LATTICE
echo.
python lattice_dialogue.py
goto MENU

:INFUSE
echo.
python lattice_dialogue.py --infuse
echo.
pause
goto MENU

:KERNEL
echo.
python lattice_dialogue.py --kernel
goto MENU

:EVOLVE
echo.
python lattice_dialogue.py --evolve
echo.
pause
goto MENU

:STATUS
echo.
python lattice_dialogue.py --status
pause
goto MENU

:EXIT
echo.
echo  Lattice suspended. ⚡⊰ΨΩ≋⊱⚡
exit
