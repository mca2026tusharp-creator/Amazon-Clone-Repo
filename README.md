# Assignment-II: Amazon Commerce - Modern E-Commerce Application & Seller Dashboard

> **Course:** Web Development & Modern Frontend Engineering  
> **Assignment:** Assignment-II: Create a React-based application in GitHub  
> **Topic:** E-Commerce Application (Amazon Commerce)  
> **Student Submission:** Production-Ready Single Page Application  

---

## 📌 Project Overview

**Amazon Commerce** is a responsive, feature-rich single-page React e-commerce application inspired by **Amazon**. Built with React 19, modern CSS3, and Tailwind CSS, this project implements a consumer-facing shopping storefront and a merchant-facing operations analytics preview.

### Core Sections & Architecture:
1. **Amazon Header & Navigation:**
   - Amazon brand logo with signature smile mark
   - Location delivery indicator (`Deliver to John · New York 10001`)
   - Centered department search bar with dropdown category selector
   - Interactive shopping cart button with live item counter badge
   - Responsive mobile navigation flyout
2. **Hero Section:**
   - **Subtitle:** *"One platform for your business & shopping needs"*
   - **Main Title:** *"Amazon Commerce"*
   - **Descriptive Text:** Value proposition highlighting millions of authentic products, guaranteed 1-day Prime delivery, verified buyer reviews, and merchant infrastructure.
   - **Two Working CTA Buttons:** `"Shop Featured Deals"` (smooth scroll to catalog) and `"Seller Operations Dashboard"` (smooth scroll to merchant preview).
   - **Proof Strip:** Real-world scale metrics (300M+ Prime members, 1-Day guaranteed delivery, 100% A-to-Z protection, 2M+ verified merchants).
3. **Curated Product Catalog Grid:**
   - Department filtering (`All`, `Smart Home`, `Audio`, `Wearables`, `Computing`)
   - High-fidelity product cards with ratings (★), review counts, Prime badges, discount tags, and list prices
   - Interactive `"Details"` quick view modal displaying technical specifications
   - Working `"Add to Cart"` buttons that increment the cart counter and open the slide-over cart drawer
4. **Slide-over Shopping Cart & 1-Click Checkout Drawer:**
   - Itemized product list with quantity steppers (`+` and `-`) and remove options
   - Free Prime shipping qualification banner
   - Subtotal and order total calculation
   - `"Proceed to 1-Click Checkout"` triggering a simulated order confirmation modal with tracking ID
5. **Amazon Seller Central & Logistics Dashboard Preview:**
   - Timeframe filter (`7D`, `30D`, `1Y`) that dynamically recomputes financial KPIs and chart data
   - 4 Merchant KPI Cards: Gross Revenue, Units Dispatched, Buy Box Ownership (98.5%), and Prime On-Time Rate (99.8%)
   - Interactive SVG sales trajectory and order demand curve with hover tooltips
   - FBA customer order fulfillment table with carrier tracking numbers and status indicators
   - Warehouse inventory coverage health alerts

---

## 🚀 Features Included

- ⚡ **React 19 Functional Architecture:** Clean hook-based state management (`useState`, `useMemo`) for instant responsiveness without external state library bloat.
- 🎨 **Amazon Brand Design System:** Authentic Amazon colors (dark navy `#131921`, navigation `#232f3e`, signature amber `#ff9900`, buy button yellow `#ffd814`, prime blue `#00a8e1`).
- 🛒 **Fully Interactive Cart & Checkout:** Add items, modify quantities, remove items, calculate order totals, and place test orders.
- 🔍 **Live Search & Category Filtering:** Instant client-side filtering across departments, titles, and descriptions.
- 📊 **Dynamic Seller Dashboard:** Static dataset that dynamically switches metrics, order rows, and SVG curve coordinates based on selected timeframe.
- 📱 **100% Responsive Design:** Optimized for mobile phones, tablets, laptops, and ultra-wide desktop monitors.
- 🛡️ **Zero Broken Images Policy:** Stylized, self-contained SVG graphics and clean CSS icons without fragile third-party image dependencies.

---

## 🛠️ Tech Stack

- **Frontend Library:** [React 19](https://react.dev/)
- **Language:** JavaScript (ES6+) / TypeScript
- **Styling:** Modern CSS3 & [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)

---

## 💻 Local Development Setup

To run this project locally on your machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) and `npm` installed.

Verify installation:
```bash
node -v
npm -v
```

### 1. Clone or Download the Project
```bash
git clone https://github.com/<your-username>/assignment-2-amazon-commerce.git
cd assignment-2-amazon-commerce
```

### 2. Install Dependencies
Install all packages from `package.json`:
```bash
npm install
```

### 3. Start the Local Server
Run the application using `npm start` (or `npm run dev`):
```bash
npm start
```

Open your browser and visit:
```
http://localhost:3000
```

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 🐙 Step-by-Step Guide: Push to GitHub

Follow these instructions to push this project to your GitHub account for Assignment-II submission:

### Step 1: Initialize Git
In the root directory of the project, open your terminal and run:
```bash
git init
```

### Step 2: Stage All Project Files
Ensure `node_modules` is excluded via `.gitignore`, then stage the files:
```bash
git add .
```

### Step 3: Commit the Files
Create your initial commit:
```bash
git commit -m "feat: complete Assignment-II Amazon Commerce React application"
```

### Step 4: Create a Repository on GitHub
1. Log into your [GitHub account](https://github.com/).
2. In the top-right corner, click **+** → **New repository**.
3. Name your repository: `assignment-2-amazon-commerce`.
4. Choose **Public** (or **Private** with your instructor added as a collaborator).
5. Leave "Add a README file" **unchecked** (we already have a complete README).
6. Click **Create repository**.

### Step 5: Link and Push to GitHub
Run the following commands in your terminal, replacing `<your-username>` with your GitHub username:
```bash
# Set primary branch to main
git branch -M main

# Link remote origin
git remote add origin https://github.com/<your-username>/assignment-2-amazon-commerce.git

# Push to GitHub
git push -u origin main
```

Refresh your GitHub repository page to verify all code, assets, and documentation are online.

---

## 🎓 How to Submit on Google Classroom

1. **Copy Your GitHub Link:**
   - Navigate to your repository on GitHub.
   - Copy the repository URL (e.g., `https://github.com/<your-username>/assignment-2-amazon-commerce`).

2. **Verify Access Permissions:**
   - If Public: Anyone can view.
   - If Private: Go to **Settings** → **Collaborators** and invite your teacher/TA.

3. **Turn In on Google Classroom:**
   - Open your course on [Google Classroom](https://classroom.google.com/).
   - Click on **Assignment-II: Create a react based application in github**.
   - Under the **Your work** card, click **+ Add or create** → **Link**.
   - Paste your GitHub repository URL and click **Add link**.
   - Click **Turn In** and confirm.

---

## 📁 File Structure

```text
├── README.md               # Assignment documentation, run instructions & Git guide
├── index.html              # HTML5 entry template with Plus Jakarta Sans typography
├── package.json            # Scripts (start, dev, build) & dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration with React and Tailwind
└── src/
    ├── App.tsx             # Main React storefront, cart, modals & seller dashboard
    ├── App.css             # Amazon brand tokens, buy button styling & animations
    ├── index.css           # Global Tailwind CSS directives & resets
    └── main.tsx            # React 19 application mount entry
```

---

## 📄 License & Attribution

This project is created strictly for academic and educational purposes as part of **Assignment-II**.  
Trademarks, branding elements, and visual inspiration belong to **Amazon.com, Inc.**
# Amazon-Clone-Repo
