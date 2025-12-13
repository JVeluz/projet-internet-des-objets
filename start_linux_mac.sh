#!/bin/bash

echo "=================================================="
echo "     INSTALLATION DES DEPENDANCES"
echo "=================================================="

npm run install:all

echo ""
echo "=================================================="
echo "     LANCEMENT DU SYSTEME IOT"
echo "     (Ctrl+C pour tout arrêter)"
echo "=================================================="

npm start