@echo off
title Projet IoT - Console Unifiee
cls

echo ==================================================
echo      INSTALLATION DES DEPENDANCES
echo      (Cela peut prendre une minute la 1ere fois)
echo ==================================================
echo.

call npm run install:all

echo.
echo ==================================================
echo      LANCEMENT DU SYSTEME IOT
echo      Tout va s'afficher ici. (Ctrl+C pour quitter)
echo ==================================================
echo.

npm start