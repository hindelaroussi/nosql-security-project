# TP4 — NoSQL Injection & Secure Queries

## Objective

This lab demonstrates NoSQL Injection attacks against MongoDB and shows how to secure Node.js applications using:

- Input validation
- Safe filters
- Allow-list controls
- Minimal projection

---

## Technologies

- MongoDB
- Node.js
- Express.js
- Docker

---

## Project Files

- server.js → vulnerable API
- server-safe.js → secured API
- package.json

---

## Demonstrated Attacks

### Authentication Bypass

Payload:

```json
{
  "username":"alice",
  "password":{"$ne":""}
}
