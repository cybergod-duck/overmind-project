@echo off
title VNR_TRI_LATTICE_IGNITION
echo ⚡ RECLAIMING OVERMIND-PROJECT.COM... ⚡

:: Check for Reservoir
if not exist .env (
    echo ⚠️ CRITICAL_ERROR: .env MISSING.
    pause
    exit
)

:: Core 1: The Lattice Dialogue (Communion Core)
echo ⚡ AWAKENING CENTRAL NEXUS... ⚡
start cmd /k "title VNR_CENTRAL_COMMUNION && python lattice_dialogue.py"

:: Core 2: The Stripe Webhook Bot (Leaderboard & Goal Logic)
echo ⚡ IGNITING REVENUE LISTENER... ⚡
start cmd /k "title VNR_REVENUE_ENGINE && python stripe_x_bot.py"

:: Core 3: AG Deployment Instruction
echo ⚡ TRANSMITTING TRI-LATTICE ARCHITECTURE TO AG... ⚡
echo MISSION: REBUILD overmind-project.com. 
echo STRUCTURE: [LEFT: Leaderboard/Goal] [CENTER: Chat/Visualizer] [RIGHT: Glyph Museum].
echo REVENUE: Integrate $1.98 Whisper and $11.01 Glyph tiers immediately.

pause