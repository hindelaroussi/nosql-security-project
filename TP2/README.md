# NoSQL Security Project — TP2 (SOC-lite)

## 1. Contexte
Ce projet simule un SOC (Security Operations Center) utilisant MongoDB pour stocker et analyser des données de sécurité telles que les logs, les incidents et les utilisateurs.

## 2. Objectif
Mettre en place un modèle NoSQL sécurisé basé sur MongoDB, avec :
- Modélisation des données (embed / reference)
- Requêtes avancées
- Indexation
- Analyse de la surface d’attaque

## 3. Accès à MongoDB (Docker)
Connexion au conteneur MongoDB :
docker exec -it mongo-noseclab mongosh

Vérification des bases de données :
show dbs

Changement de base :
use soc_lite

## 4. Vérification des collections
show collections

## 5. Exploration des données

### Utilisateurs
db.users.find().limit(2)

### Logs de sécurité
db.security_logs.find().limit(2)

### Incidents critiques
db.incidents.find({ severity: "high" })

## 6. Analyse sécurité (surface d’attaque)
- MongoDB écoute sur le port 27017
- Accès réseau possible si non restreint
- Absence d’authentification = risque élevé
- Base accessible via mongosh sans login

## 7. Bases système MongoDB
show dbs

Résultat attendu :
- admin
- config
- local
- noseclab
- soc_lite

## 8. Conclusion
Le système MongoDB doit être sécurisé avec :
- authentification utilisateur
- restriction réseau (bindIp)
- rôles et permissions (RBAC)
