# 🛍️ CELINA — MERN Stack Fashion E-Commerce Platform

A feature-rich, full-stack MERN (MongoDB, Express, React, Node.js) fashion e-commerce web application featuring a modern React frontend, full admin management suite, seamless checkout integration, and robust RESTful API architecture.

---

## 🌟 Key Highlights

- 📱 **Responsive Storefront**: Dynamic, high-conversion UI built with React 18, Vite, and Tailwind CSS.
- 🔐 **Dual Authentication**: Secure JWT-based registration/login alongside Google OAuth single sign-on.
- 💳 **Payment Integration**: Native Razorpay checkout support for seamless transactions.
- 📦 **Order & Inventory Tracking**: Real-time order placement, status tracking, cart management, and wishlist functionality.
- 🛠️ **Comprehensive Admin Suite**: Built-in dashboards for managing products, categories, brands, homepage banners, coupons, media library, email templates, and SEO.
- ☁️ **Media Management**: Image upload pipelines powered by Cloudinary and Multer.
- 📧 **Automated Notifications**: Order confirmations and promo updates powered by Nodemailer.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & PostCSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Auth**: `@react-oauth/google`

### Backend
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs`
- **File Storage**: Cloudinary & `multer-storage-cloudinary`
- **Payments**: Razorpay SDK
- **Mailing**: Nodemailer

---

## ✨ Features Breakdown

### 🛒 Storefront (Customer Experience)
- **Dynamic Homepage**: Announcement bars, flash sale counters, featured hero banners, and curated product collections.
- **Product Discovery**: Search, filter by category/brand, sorting, and rich detail pages with size guides and reviews.
- **Cart & Wishlist**: Persistent cart state, guest vs authenticated wishlist management, dynamic price calculation, and coupon applications.
- **Checkout & Payment**: Integrated Razorpay modal, address management, and instant order generation.
- **User Dashboard**: Order history tracking, profile updating, and password reset flows.

### 🛡️ Admin Portal
- **Business & Sales Analytics**: Revenue summaries, total orders, active customer metrics.
- **Catalog Management**: Add, update, or archive products, categories, brands, and discount coupons.
- **Homepage Builder**: Customize banners, promotional bars, exit-intent popups, and section layouts visually.
- **Media Library & SEO**: Manage Cloudinary uploads and configure site-wide meta titles and descriptions.

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:awwwwnurag/Celina.git
   cd Celina
   ```

2. **Install all dependencies**:
   You can install all root, backend, and frontend packages simultaneously using the root script:
   ```bash
   npm run install-all
   ```

---

## 🔐 Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/celina_db
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Create a `.env` file inside the `frontend/` directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 🏃 Running the Application

Run both backend API and frontend Vite dev server concurrently from the root directory:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001`

---

## 📜 License

Distributed under the MIT License.
