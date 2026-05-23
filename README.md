# ✦ Potters Productions — Website Setup Guide

## 📁 Project Structure

```
potters-productions/
├── backend/          ← Node.js + Express API
│   ├── models/       ← MongoDB schemas
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← Auth + Upload
│   ├── config/       ← Email config
│   ├── uploads/      ← Product images (auto-created)
│   ├── server.js
│   ├── seed.js       ← Seed database with initial data
│   └── .env.example  ← Copy to .env and fill in
└── frontend/         ← React.js app
    ├── public/
    │   └── images/   ← product1.jpeg ... product4.jpeg (your product images)
    └── src/
        ├── pages/    ← All website pages
        ├── components/
        ├── context/  ← Auth state
        └── utils/    ← API helper
```

---

## 🛠 STEP-BY-STEP SETUP

### STEP 1: Install Node.js
Download from: https://nodejs.org (version 18+)

---

### STEP 2: Set up MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a FREE account
3. Click "Build a Database" → Select FREE tier → Choose region close to India (Mumbai)
4. Create a username and password (save these!)
5. Click "Add My Current IP Address"
6. Click "Finish and Close" → "Go to Databases"
7. Click "Connect" → "Connect your application"
8. Copy the connection string. It looks like:
   `mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/`
9. Replace `<password>` with your actual password
10. Add the database name: `potters-productions` at the end:
    `mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/potters-productions?retryWrites=true&w=majority`

---

### STEP 3: Set up Gmail App Password (for sending emails)

1. Go to your Gmail account: https://myaccount.google.com
2. Click "Security" → Enable "2-Step Verification" if not already done
3. Search for "App passwords" in the search bar
4. Select App: "Mail", Device: "Other" → Type "Potters Productions" → Click Generate
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

---

### STEP 4: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in:
```
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/potters-productions?retryWrites=true&w=majority
JWT_SECRET=PottersProductions2025SuperSecretKey
ADMIN_EMAIL=productpotter@gmail.com
ADMIN_PASS=your_admin_password_here
EMAIL_USER=productpotter@gmail.com
EMAIL_PASS=abcdefghijklmnop
FRONTEND_URL=http://localhost:3000
```

---

### STEP 5: Install & Run Backend

```bash
cd backend
npm install
node seed.js        # ← Seeds initial products and materials into MongoDB
npm start           # ← Starts the server on port 5000
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### STEP 6: Copy Product Images to Backend Uploads

Copy your 4 product images to the backend uploads folder:
```bash
# Windows:
copy frontend\public\images\product1.jpeg backend\uploads\product1.jpeg
copy frontend\public\images\product2.jpeg backend\uploads\product2.jpeg
copy frontend\public\images\product3.jpeg backend\uploads\product3.jpeg
copy frontend\public\images\product4.jpeg backend\uploads\product4.jpeg

# Mac/Linux:
cp frontend/public/images/product1.jpeg backend/uploads/product1.jpeg
cp frontend/public/images/product2.jpeg backend/uploads/product2.jpeg
cp frontend/public/images/product3.jpeg backend/uploads/product3.jpeg
cp frontend/public/images/product4.jpeg backend/uploads/product4.jpeg
```

---

### STEP 7: Install & Run Frontend

Open a NEW terminal/command prompt window:
```bash
cd frontend
npm install
npm start
```

The website opens at: **http://localhost:3000**

---

## 🌐 HOW TO USE THE WEBSITE

### Customer Flow:
1. Visit `http://localhost:3000`
2. Browse Home, About Us, Feedback, Contact without logging in
3. Click "Products" or "Shop Now" → redirected to Register
4. Register with full details → Welcome email sent automatically
5. Login → See 4 products
6. Click a product → See full details + material circles
7. Select material (Cardboard ₹300 / Thin Plastic ₹400 / Acrylic ₹500)
8. Click "Order Booking" → Order confirmed + email sent

### Admin Flow:
1. Go to Login → Email: `productpotter@gmail.com` + your ADMIN_PASS
2. Redirected to Admin Dashboard
3. Manage Products (add/edit/delete/show-hide)
4. Manage Materials & Prices (edit prices instantly)
5. View all Orders
6. Approve/reject Feedback
7. Edit About Us text
8. Edit Contact information

---

## 📊 MongoDB Collections (Database Structure)

| Collection | What it stores |
|-----------|---------------|
| `users` | Customer accounts (name, email, phone, location, country, gender, encrypted password) |
| `products` | Product details (name, description, bible verse, colors, design, images) |
| `materials` | Material types and prices (Cardboard, Thin Plastic, Acrylic) |
| `orders` | Customer orders (customer info, product, material, price, status) |
| `feedbacks` | Customer feedback (name, message, rating, approved status) |
| `settings` | Editable content (About Us text, contact info) |

---

## 🚀 DEPLOYMENT (To go live on the internet)

### Deploy Backend to Render (Free):
1. Push your code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo → Select `backend` folder
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all `.env` variables under "Environment Variables"
7. Click Deploy → Copy the URL (e.g., `https://potters-backend.onrender.com`)

### Deploy Frontend to Vercel (Free):
1. Go to https://vercel.com → Import from GitHub
2. Select `frontend` folder as root
3. Add environment variable: `REACT_APP_API_URL=https://potters-backend.onrender.com`
4. Also update the `proxy` in `frontend/package.json` to the Render URL
5. Click Deploy → Your site is live!

---

## 🔧 TECH STACK SUMMARY

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, React Toastify |
| Styling | Pure CSS with inline styles (no Tailwind needed) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (cloud) via Mongoose |
| Auth | JWT (JSON Web Tokens) + bcrypt password hashing |
| Email | Nodemailer with Gmail SMTP |
| File Upload | Multer (stores to /uploads folder) |
| Frontend Host | Vercel (free) |
| Backend Host | Render (free) |

---

## 📞 SUPPORT

Email: productpotter@gmail.com
