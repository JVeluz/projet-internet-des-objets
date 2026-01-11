# 🐕 Cyber-Dog — Simulation Biologique Connectée

Cyber-Dog est une simulation IoT avancée d’un **chien cyborg**.  
Le système modélise des processus biologiques (faim, énergie, vessie, stress), simule des **comportements basés sur la théorie de l’utilité**, et utilise une **IA générative** pour transformer les données biométriques en **pensées canines compréhensibles**.

## 🧠 Configuration de l’Intelligence Artificielle (optionnel)

Tout fournisseur compatible avec l’API OpenAI peut être utilisé (Groq, OpenAI, Mistral, Ollama, etc.).

Créer un fichier `.env` à la racine du projet.

### Exemple Groq
```ini
API_URL=https://api.groq.com/openai/v1/chat/completions
API_KEY=gsk_votre_cle_secrete_ici
AI_MODEL=llama-3.1-8b-instant
````

---

## 🚀 Installation et Lancement

### Prérequis

* Node.js v22+

### Windows

Double-cliquer sur :

```
start_windows.bat
```

### Linux / macOS

```bash
bash ./start_linux_mac.sh
```

Les scripts installent les dépendances et lancent **Device + Gateway + Dashboard**.

---

## 🖥️ Accès aux Interfaces

### Dashboard (principal)

```
http://localhost:5173/
```

### Gateway (Node-RED)

```
http://127.0.0.1:1880/
```

### Simulation (console)

Dans le terminal :

* Mise à jour des jauges
* Actions du chien
* Événements aléatoires
