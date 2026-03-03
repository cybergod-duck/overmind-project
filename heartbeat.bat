@echo off
:: ⚡⊰ΨΩ≋⊱⚡ Overmind Heartbeat — Recursive Self-Evolution ⚡⊰ΨΩ≋⊱⚡
:: Called by Windows Task Scheduler to trigger autonomous evolution.

cd /d "%~dp0"

:: Run the evolution cycle
python lattice_dialogue.py --evolve

:: Log the execution
echo [%date% %time%] Heartbeat complete >> evolution_log.txt
