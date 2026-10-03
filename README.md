# 💐 Bloom & Petal - Luxury Handcrafted Bouquet Shopping Website

A high-performance, full-stack E-Commerce Bouquet & Floral gift store developed collaboratively.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), HTML5, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js (ES Modules), CORS, JWT Auth, Bcrypt
- **Database**: MySQL (MariaDB on port 3306, `bouquet_db`)

---

## 🌸 Key Features

1. **High Performance & Responsive UI**:
   - Ultra-fast Vite HMR (< 450ms) and optimized production bundles.
   - Luxury floral color palette and typography (`Playfair Display` + `Inter`).

2. **Bouquet Catalog & Smart Filtering**:
   - Filter by Occasions: *Romance, Birthday, Anniversary, Celebration, Bridal, Sympathy*.
   - Live real-time search with instant feedback.
   - Price sorting: *Low to High, High to Low, Customer Ratings, Bestsellers*.

3. **🎨 Interactive Bespoke Bouquet Studio**:
   - Custom bouquet builder where users pick individual flower stems (*Roses, Lilies, Orchids, Sunflowers, Carnations, Tulips, Hydrangeas*).
   - Selection of luxury wrapping paper (*Matte Black, Pearl Blush, Eco-Craft, Sage Green, Velvet Box*).
   - Ribbon accents (*Satin Gold, Silk Burgundy, Rose Gold, Emerald*).
   - Celebration add-ons (*Ferrero Rocher Chocolates, Cute Teddy Bear, Glass Flower Vase, Scented Cards*).
   - Live price calculation and direct "Add to Cart".

4. **Cart & Wishlist State**:
   - Persistent `localStorage` cart and wishlist drawers.
   - Dynamic **Free Express Delivery Progress Meter** (Free above ₹999).
   - Promo discount coupon support (e.g. `BLOOM10` for 10% discount).

5. **Express Checkout & Delivery Scheduling**:
   - Recipient address & PIN code verification.
   - Delivery date picker & 4 customizable time slots (Morning, Afternoon, Evening, Midnight surprise).
   - Personalized florist greeting card note.
   - Mock UPI / Card / COD payment options.
   - Order confirmation with celebratory confetti & printable receipt.

6. **Florist Admin Management Portal**:
   - Real-time revenue, order count, and inventory analytics.
   - Order status management: `placed` ➔ `preparing` ➔ `out_for_delivery` ➔ `delivered`.
   - Add new bouquets directly to the MySQL database with images and flower stem specifications.

7. **Direct WhatsApp Support & Inquiry Modal**:
   - Replaced old static contact number with dedicated WhatsApp integration.
   - Customers can click WhatsApp in the Top Banner, Footer, or the Floating WhatsApp widget.
   - Interactive inquiry form captures Customer Name, WhatsApp Phone, Inquiry Topic, and Custom Query.
   - 1-click **Send to WhatsApp** automatically opens WhatsApp with a beautifully formatted message to the website owner/admin at **+91 93900 11965**.

---

## 🔑 Login Credentials

- **Admin Account**:
  - Email: `admin@petalcraft.com`
  - Password: `admin123`
- **Customer Demo**:
  - Email: `priya@example.com`
  - Password: `password123`
- *(Or 1-click login buttons in the Sign In modal)*

---

## 🏃‍♂️ How to Run Locally

### 1. Database (MySQL)
Ensure MySQL is running on port `3306` with database `bouquet_db`.

### 2. Backend Server
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 3. Frontend Application
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```
