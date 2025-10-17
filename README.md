# Flash Stock Manager

A modern, React-based web application for managing warehouse inventory, store products, and sales. Built with Vite, Firebase, and React, the app provides a smooth, mobile-first experience with intuitive navigation and real-time updates.

Demo: https://aliseid-dev.github.io/warehouse-app

Features:
- Warehouse Management: View, manage, and transfer stock
- Store Management: View store products and manage inventory
- Sales Tracking: Record sales, track paid/credit, auto-calculate totals
- Dashboard: Real-time inventory and sales charts
- Mobile-Friendly Design: Bottom navigation for easy switching
- Splash Screen: Animated splash screen on app load

Tech Stack:
- Frontend: React, Vite, CSS
- Backend / Database: Firebase Firestore
- Icons & Charts: React Icons, Recharts
- Deployment: GitHub Pages

Project Structure:
flash-stock-manager/
├─ src/
│  ├─ components/ (Header, ProductList, BottomNav, MessageBox)
│  ├─ pages/ (WarehousePage, Store, SalesPage, DashboardPage, SplashScreen)
│  ├─ styles/ (index.css, WarehousePage.css, Store.css, SalesPage.css, BottomNav.css)
│  ├─ utils/ (firebase.js)
│  └─ App.jsx
├─ package.json
└─ vite.config.js

Installation:
1. Clone the repo: git clone git@github.com:aliseid-dev/warehouse-app.git
2. cd warehouse-app
3. Install dependencies: npm install
4. Start dev server: npm run dev
5. Open at http://localhost:5173

Deployment:
- Build: npm run build
- Deploy: npm run deploy
- Ensure `homepage` in package.json: "https://aliseid-dev.github.io/warehouse-app"

Configuration:
- Firebase: Replace src/utils/firebase.js with your Firebase config
- Firestore collections needed: storeProducts, products, sales
- Optional: Customize styles in src/styles or add features in components

License:
MIT License

Author:
Ali Seid - https://github.com/aliseid-dev
