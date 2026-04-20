# ⚙️ TechGear Analytics Platform

A full-stack e-commerce analytics platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform consists of three separate applications — a **User Store**, an **Admin Panel**, and a shared **Backend API** — all working together to deliver real-time shopping analytics.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [How to Run](#how-to-run)
- [Admin Registration](#admin-registration)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)

---

## 🎯 Project Overview

TechGear Analytics Platform is a smart e-commerce system that:
- Allows users to browse 50+ tech products, add to cart, place orders, and cancel orders
- Tracks every user action (views, cart additions, purchases, cancellations) as real-time events
- Gives administrators a live analytics dashboard with charts, leaderboards, and event management
- Syncs admin-side deletions instantly to the user dashboard

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              TechGear Platform                  │
│                                                 │
│  ┌──────────────┐    ┌──────────────────────┐  │
│  │  User Store  │    │    Admin Panel        │  │
│  │  Port: 3000  │    │    Port: 3001         │  │
│  └──────┬───────┘    └──────────┬────────────┘  │
│         │                       │               │
│         └──────────┬────────────┘               │
│                    │                            │
│          ┌─────────▼──────────┐                │
│          │  Express.js API    │                │
│          │  Port: 5000        │                │
│          └─────────┬──────────┘                │
│                    │                            │
│          ┌─────────▼──────────┐                │
│          │  MongoDB Database  │                │
│          │  techgear_analytics│                │
│          └────────────────────┘                │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18.2 | Web framework & REST API |
| MongoDB | 6+ | NoSQL database |
| Mongoose | 8.0.3 | MongoDB ODM |
| bcryptjs | 2.4.3 | Password hashing |
| dotenv | 16.3.1 | Environment variables |
| cors | 2.8.5 | Cross-origin requests |
| uuid | 9.0.0 | Token generation |

### Frontend (Both Apps)
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.2.0 | UI framework |
| React Router DOM | 6.20.0 | Client-side routing |
| Bootstrap | 5.3.2 | CSS framework |
| Axios | 1.6.0 | HTTP requests |
| cross-env | 7.0.3 | Cross-platform PORT setting |

---

## ✨ Features

### 👤 User Store (Port 3000)
- **Authentication** — Signup, Login with session-based auth (sessionStorage)
- **Product Browsing** — 50 products across 4 categories with search, filter, and sort
- **Shopping Cart** — Add, remove, update quantity with per-user localStorage
- **Checkout** — Delivery form + Card/UPI/COD payment selection
- **My Orders** — Order history with step tracker, expand details, cancel order
- **Dashboard** — Live activity stats (views, cart adds, purchases) fetched from server
- **Mobile Responsive** — Slide-in sidebar, mobile top bar, responsive grids
- **Flipkart/Amazon UI** — Soft tinted cards, category colour system, pill badges

### ⚙️ Admin Panel (Port 3001)
- **Dashboard** — 5 chart rows: Event donut, Top products bar, Revenue donut, Status bar, Activity sparkline, Revenue bars, User purchases bar, Leaderboard table
- **All Users** — User list with stats, click to see purchase history modal
- **Product Catalog** — All 50 products with live sales overlay, grid/table toggle, sort
- **Sales Board** — Products ranked by units sold with medals, bar chart, Cancelled Orders tab
- **Purchase Tracker** — Hot/Normal/Slow/Dead product performance with delete
- **Recent Events** — Last 100 events, filter by type, row-level delete
- **Secure Delete** — All admin deletes hit the server and reset MongoDB stats, instantly updating user dashboard

### 🔗 Real-Time Sync
- Admin event deletions → reset MongoDB stats → user dashboard updates on next load
- User order cancellations → tracked as `order_cancelled` events → appear in admin Cancelled Orders tab
- User dashboard re-fetches on window focus (switching tabs auto-refreshes counts)

---

## 📁 Project Structure

```
techgear-platform/
│
├── server/                          # Express.js Backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection with retry
│   ├── controllers/
│   │   ├── authController.js       # Signup, Login (DB + in-memory fallback)
│   │   └── analyticsController.js  # Track, Summary, Admin CRUD, Delete
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT-style Bearer token auth
│   ├── models/
│   │   ├── User.js                 # User schema (name, email, password, role)
│   │   ├── Event.js                # Event schema (actionType enum, productId)
│   │   └── ProductStat.js          # Product stats (views, cart, purchases, revenue)
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   └── analyticsRoutes.js      # /api/track, /api/admin/*, DELETE routes
│   ├── store/
│   │   └── tokenStore.js           # In-memory fallback when MongoDB is offline
│   ├── .env                        # PORT, MONGO_URI
│   ├── server.js                   # App entry, port retry (5000→5001→5002→5003)
│   └── start.bat                   # Windows launcher
│
├── user-app/                        # React User Store (Port 3000)
│   └── src/
│       ├── context/
│       │   └── AuthContext.js      # Login, Signup, Logout, sessionStorage
│       ├── services/
│       │   └── api.js              # authAPI, analyticsAPI, localCart, localOrders (per-user keys)
│       ├── components/
│       │   └── Sidebar.js          # Responsive slide-in sidebar + mobile top bar
│       ├── data/
│       │   └── products.js         # 50 products with id, name, category, price, emoji, brand, specs
│       └── pages/
│           ├── LandingPage.js      # Home / hero page
│           ├── LoginPage.js        # Split layout login
│           ├── SignupPage.js       # Split layout signup
│           ├── DashboardPage.js    # Activity cards, quick links, category grid
│           ├── ProductsPage.js     # Flipkart-style product grid with modal
│           ├── CartPage.js         # Cart with qty stepper, order summary sidebar
│           ├── CheckoutPage.js     # 3-step form, payment tabs, success screen
│           ├── OrdersPage.js       # Orders with step tracker, expand, cancel
│           └── JourneyPage.js      # About the platform and tracking
│
├── admin-app/                       # React Admin Panel (Port 3001)
│   └── src/
│       ├── context/
│       │   └── AuthContext.js      # Admin login, logout, sessionStorage
│       ├── services/
│       │   └── api.js              # adminAuthAPI, adminAPI (all endpoints + deletes)
│       ├── components/
│       │   └── Sidebar.js          # Grouped nav (Overview/Products/Analytics) + mobile
│       └── pages/
│           ├── DashboardPage.js    # Charts: Bar, Donut, Sparkline (pure SVG)
│           ├── UsersPage.js        # User table + purchase history modal
│           ├── ProductsPage.js     # 50-product catalog with live sales overlay
│           ├── SalesBoardPage.js   # Ranked leaderboard + Cancelled Orders tab
│           ├── PurchaseTrackerPage.js # Performance table with delete
│           ├── EventsPage.js       # Live event feed with row delete
│           └── JourneyPage.js      # Admin guide / about page
│
├── START-ALL.bat                    # One-click Windows launcher (all 3 apps)
└── README.md
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  name:      String,         // Display name
  email:     String,         // Unique, lowercase
  password:  String,         // bcrypt hashed (10 rounds)
  token:     String,         // UUID bearer token (rotated on each login)
  role:      'user'|'admin', // Controls access level
  isActive:  Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Collection
```javascript
{
  sessionId:   String,       // Browser session ID
  userId:      String,       // Reference to User._id
  userName:    String,       // Denormalized for admin display
  userEmail:   String,       // Denormalized for admin display
  productId:   String,       // e.g. 'p1', 'l3', 'gm2'
  productName: String,
  category:    String,       // Phones | Laptops | Gadgets | Accessories
  price:       Number,
  quantity:    Number,
  emoji:       String,
  brand:       String,
  actionType:  Enum,         // product_viewed | add_to_cart | purchase | order_cancelled
  orderId:     String,       // Set for order_cancelled events
  createdAt:   Date          // Auto-indexed descending
}
// Indexes: userId+actionType, productId+actionType, createdAt
```

### ProductStat Collection
```javascript
{
  productId:       String,   // Unique — matches product id in catalog
  productName:     String,
  category:        String,
  price:           Number,
  emoji:           String,
  brand:           String,
  totalViews:      Number,   // $inc on product_viewed
  totalAddToCart:  Number,   // $inc on add_to_cart
  totalPurchases:  Number,   // $inc on purchase (by quantity)
  totalRevenue:    Number,   // $inc on purchase (price × quantity)
  conversionRate:  Number,   // totalPurchases / totalViews × 100
  status:          Enum,     // hot(≥5) | normal(≥2) | slow(≥1) | dead(0)
  lastViewedAt:    Date,
  lastPurchasedAt: Date
}
```

---

## 🔌 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/user/signup` | Register new user | None |
| POST | `/api/auth/user/login` | User login → returns token | None |
| POST | `/api/auth/admin/signup` | Register admin (requires code) | None |
| POST | `/api/auth/admin/login` | Admin login → returns token | None |
| GET | `/api/auth/profile` | Current user profile | Bearer |

### User Analytics Routes (`/api`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/track` | Track any user event | User token |
| GET | `/api/analytics/my-summary` | User's own event counts | User token |
| GET | `/api/analytics/my-events` | User's own events (last 100) | User token |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/overview` | Platform KPIs | Admin token |
| GET | `/api/admin/users` | All users with stats | Admin token |
| GET | `/api/admin/user-events/:uid` | Events for specific user | Admin token |
| GET | `/api/admin/products` | All ProductStat records | Admin token |
| GET | `/api/admin/purchase-tracker` | Product performance table | Admin token |
| GET | `/api/admin/recent-events` | Last 100 events | Admin token |
| GET | `/api/admin/sales-board` | All 50 products ranked | Admin token |
| GET | `/api/admin/cancelled-orders` | All cancellation events | Admin token |

### Admin Delete Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/api/admin/events/:id` | Delete single event |
| DELETE | `/api/admin/events/all` | Delete all events + reset stats |
| DELETE | `/api/admin/events/by-type/:actionType` | Delete all events of a type |
| DELETE | `/api/admin/events/by-user/:userId` | Delete all events for a user |
| DELETE | `/api/admin/events/by-product/:productId` | Delete all events for a product |
| DELETE | `/api/admin/product-stat/:productId` | Reset product stats to 0 |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server status + MongoDB connection state |

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **MongoDB Atlas** cluster or another reachable MongoDB connection string
- **npm** v9 or higher (comes with Node.js)

### Step 1 — Clone / Extract the project
```
techgear-platform/
├── server/
├── user-app/
├── admin-app/
└── START-ALL.bat
```

### Step 2 — Configure MongoDB
Update `server/.env` with your MongoDB Atlas connection string. Example:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/techgear_analytics?appName=Cluster0
```

### Step 3 — Install dependencies

**Server:**
```bash
cd server
npm install
```

**User App:**
```bash
cd user-app
npm install
```

**Admin App:**
```bash
cd admin-app
npm install
```

---

## ▶️ How to Run

### Option A — One Click (Windows)
Double-click `START-ALL.bat` in the project root. It will:
1. Kill any processes on ports 5000, 3000, 3001
2. Install dependencies for all three apps
3. Start server, user-app, and admin-app in separate windows

### Option B — Manual (3 terminals)

**Terminal 1 — Backend:**
```bash
cd server
node server.js
```

**Terminal 2 — User Store:**
```bash
cd user-app
npm start
```

**Terminal 3 — Admin Panel:**
```bash
cd admin-app
npm start
```

### URLs
| App | URL |
|-----|-----|
| 🛒 User Store | http://localhost:3000 |
| ⚙️ Admin Panel | http://localhost:3001 |
| 🔧 API Health | http://localhost:5000/health |

---

## 🔐 Admin Registration

To create an admin account, go to `http://localhost:3001/signup` and enter:

```
Admin Registration Code: TECHGEAR_ADMIN_2026
```

Without this code, admin signup is blocked.

---

## 🌍 Environment Variables

The server uses `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/techgear_analytics?appName=Cluster0
```

The server automatically tries ports `5000 → 5001 → 5002 → 5003 → 4000 → 4001` if a port is busy.

> ⚠️ If the server starts on a port other than 5000, update `BASE_URL` in both:
> - `user-app/src/services/api.js`
> - `admin-app/src/services/api.js`

---

## 📦 Product Catalog

The platform includes **50 products** across 4 categories:

| Category | Count | Examples |
|----------|-------|---------|
| 📱 Phones | 8 | iPhone 15 Pro Max, Samsung S24 Ultra, OnePlus 12 |
| 💻 Laptops | 10 | MacBook Pro M3, Dell XPS 15, ASUS ROG Zephyrus |
| ⌚ Gadgets | 22 | Apple Watch, AirPods Pro, DJI Mini 4, Meta Quest 3 |
| ⌨️ Accessories | 10 | Logitech MX Master, SanDisk SSD, LG UltraWide |

---

## 🔄 Key Design Decisions

| Decision | Reason |
|----------|--------|
| **Separate React apps** | Clear role separation; admin and user have completely different UX flows |
| **Per-user localStorage keys** | `u_orders_<userId>` prevents data leakage between users on shared machines |
| **sessionStorage for auth** | Tokens expire when tab closes, improving security |
| **In-memory fallback** | Server stays up and functional even if MongoDB is offline; warns loudly |
| **Port retry logic** | Server tries 6 ports automatically, no manual config needed |
| **Server-side delete** | All admin deletes hit real MongoDB, not just UI state — user counts update immediately |
| **Window focus re-fetch** | User dashboard re-fetches stats when switching back from another tab |
| **Pure SVG charts** | No Chart.js or Recharts needed — charts render with zero extra dependencies |

---

## 👥 Authors

Developed as a full-stack analytics platform project using the MERN stack.

---

## 📄 License

This project is for educational purposes.
