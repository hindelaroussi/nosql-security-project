Sécurité des Bases de Données NoSQL  
TP3 — RBAC MongoDB : Authentification, rôles et contrôle d’accès  

Formation : 1ère année Cybersécurité  
Outils : Docker, MongoDB, mongosh  

Base de travail : soc_lite  
Collections : security_logs, incidents, users  

---

Objectif du TP  
Mettre en place une politique de sécurité basée sur RBAC (Role-Based Access Control) afin de limiter les accès aux données selon le principe du moindre privilège.

---

Partie 1 — Vérification de l’accès à la base de données  

Connexion MongoDB :

mongosh "mongodb://localhost:27017"

Affichage des bases :

show dbs

Affichage des collections :

use soc_lite
show collections

---

Partie 2 — Consultation des données sensibles  

Logs de sécurité :

db.security_logs.find().limit(2)

Incidents :

db.incidents.find()

Utilisateurs :

db.users.find()

---

Partie 3 — Création des rôles et utilisateurs  

Création d’un rôle personnalisé :

use soc_lite

db.createRole({
  role: "incidentManager",
  privileges: [
    {
      resource: { db: "soc_lite", collection: "incidents" },
      actions: ["find", "insert", "update", "remove"]
    }
  ],
  roles: []
})

---

Création des utilisateurs :

soc_app :
- readWrite sur soc_lite

soc_analyst_ro :
- read sur soc_lite

soc_manager :
- rôle incidentManager

---

Partie 4 — Tests de permissions  

Tests soc_analyst_ro :

- lecture security_logs : OK
- lecture incidents : OK
- insertion logs : REFUSÉ
- suppression incidents : REFUSÉ
- accès users : REFUSÉ

---

Tests soc_manager :

- lecture incidents : OK
- modification incidents : OK
- lecture logs : REFUSÉ
- accès users : REFUSÉ
- adminCommand : REFUSÉ

---

Tests soc_app :

- insertion logs : OK
- lecture incidents : OK
- accès users : possible (limitation rôle readWrite)
- adminCommand : REFUSÉ

---

Conclusion  

Ce TP montre que :
- MongoDB doit être sécurisé par authentification
- Les rôles RBAC limitent les accès aux données
- Le principe du moindre privilège réduit les risques
- Les accès non contrôlés exposent les données sensibles

---
