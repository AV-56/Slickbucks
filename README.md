# ☕ Slickbucks Coffee - Ordering App

A full-stack modern web application built for seamless coffee ordering, complete with a loyalty program and a dedicated admin dashboard.

## 🚀 1. Setup Instructions

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AV-56/Slickbucks.git
   cd coffee-ordering-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Seed the Database:**
   Start the development server and navigate to `/api/seed` in your browser to populate the database with initial products and outlets.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 🏗️ 2. Architecture and Database Overview

### Architecture
- **Frontend:** Built with **Next.js (App Router)** and **React**. Styled using **Tailwind CSS** for a responsive and premium UI.
- **Backend:** Utilizes **Next.js API Routes** to handle server-side logic securely.
- **Database:** Hosted on **MongoDB Atlas**, interacting through **Mongoose** ORM.
- **State Management:** Uses React Context API (`CartContext`) for global cart state.

### Database Overview (Collections)
1. **Users:** Stores user profiles, authentication credentials, loyalty points, and roles (`CUSTOMER` or `ADMIN`).
2. **Products:** Stores menu items (hot coffees, cold coffees, food) including pricing, images, and customisation options.
3. **Outlets:** Stores store locations, operating hours, and base preparation times.
4. **Orders:** Stores transaction history, selected outlet, customisations, payment status, and order status (Pending, Preparing, Ready).

---

## 📖 3. API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Registers a new user. |
| `/api/auth/login` | POST | Authenticates a user and returns a JWT token. |
| `/api/products` | GET | Fetches all available menu items and categories. |
| `/api/products` | PATCH | Toggles the availability of a specific product (Admin only). |
| `/api/outlets` | GET | Fetches all Slickbucks store locations. |
| `/api/orders` | POST | Creates a new customer order and calculates loyalty points. |
| `/api/orders` | GET | Fetches order history (Filters by user ID for customers, or fetches all for Admin). |
| `/api/users/[id]` | PATCH | Updates user profile (name, phone) and loyalty points. |

---

## 🔑 4. Test Credentials

You can use the following credentials to test the application:

**Test Customer:**
- **Email:** `customer@slickbucks.com`
- **Password:** `customer123`
*(Note: You can also register a new customer account directly from the UI)*

**Test Admin:**
- **Email:** `admin@slickbucks.com`
- **Password:** `admin123`
- **Accessing Admin Panel:** Log in with the admin credentials, then navigate to `/admin` to view incoming orders and manage the menu.
