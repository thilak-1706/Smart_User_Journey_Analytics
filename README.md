# 🛒 TechGear Platform

Two React apps + one shared Express/MongoDB backend.

## 📂 Structure
```
techgear-platform/
├── server/        → Express + MongoDB backend  (port 5000)
├── user-app/      → User shopping store        (port 3000)
├── admin-app/     → Admin analytics panel      (port 3001)
└── START-ALL.bat  → One-click Windows launcher
```

## 🚀 QUICKEST START

**Double-click `START-ALL.bat`** in the root folder.
- Kills occupied ports automatically
- Installs all npm dependencies
- Starts all 3 services in separate windows

---

## 📋 Manual Start (3 separate terminals)

**Terminal 1 — Backend:**
```
cd server
npm install
node server.js        (or:  start.bat)
```

**Terminal 2 — User App:**
```
cd user-app
npm install           ← required first time (installs cross-env)
npm start             (or:  start.bat)
```

**Terminal 3 — Admin App:**
```
cd admin-app
npm install           ← required first time (installs cross-env)
npm start             (or:  start.bat)
```

---

## 🌐 URLs
| Service    | URL                         |
|------------|-----------------------------|
| User Store | http://localhost:3000       |
| Admin Panel| http://localhost:3001       |
| API Health | http://localhost:5000/health|

## 🔑 Admin Registration Code
```
TECHGEAR_ADMIN_2026
```

## 🗄️ MongoDB Setup
Make sure MongoDB is running before starting the server:
```
mongod
```
Default DB: `mongodb://127.0.0.1:27017/techgear_analytics`

For MongoDB Atlas, edit `server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/techgear_analytics
```

## ⚠️ Troubleshooting

**Port already in use?** Use the `start.bat` inside each folder — it kills the port first.

**Signup/Login not working?** Make sure server is running first (`node server.js`) and MongoDB is up (`mongod`).

**cross-env not found?** Run `npm install` inside `user-app` and `admin-app` folders first.
