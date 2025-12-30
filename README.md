# 🎅 Santa's Workshop - Digital Christmas Management System

A comprehensive, modern web application for Santa Claus and children worldwide! This full-stack application allows Santa to manage operations, track deliveries, and engage with kids through a magical portal.

## ✨ Features

### 🧒 Santa's Command Center (Admin)
- **Global Child Registry**: Track children worldwide with behavior scores.
- **Nice/Naughty Management**: Automated scoring with real-time updates.
- **Gift Workshop**: Monitor production stages from Design to Shipped.
- **Interactive Map**: Track Santa's journey in real-time.
- **Analytics**: Beautiful charts for behavior distribution and gift quotas.

### 🌟 Kids Portal (Public)
- **Gift Mystery Game**: Discover hidden holiday treats in magical 3D boxes.
- **Naughty/Nice Scanner**: Fun interactive check to see where you stand.
- **Elf Name Generator**: Discover your magical North Pole identity.
- **Letter to Santa**: Send your digital wishes straight to the workshop.
- **Santa Tracker**: Watch Santa's movements across the globe.

### ❄️ Magical Atmosphere
- **Global Snowfall**: A serene, slow-falling snow effect on every page.
- **Festive UI**: Christmas-themed glassmorphism cards with 3D hover effects.
- **Celebrations**: Party popper blasts and jumping animations for found gifts.

## 🛠 Technology Stack

### Frontend (Next.js)
- **Next.js 14 (App Router)**: High-performance React framework.
- **Tailwind CSS**: Custom festive design system.
- **Framer Motion**: Advanced 3D animations and celebratory effects.
- **Socket.io**: Real-time Santa tracking and messaging.

### Backend (Node.js)
- **Express / MongoDB**: Scalable API and behavioral database.
- **JWT / Bcrypt**: Secure authentication for Santa.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### 2. Installation
```bash
# Clone and enter project
cd santas-workshop

# Install Backend
cd Backend && npm install

# Install Frontend
cd ../Frontend && npm install
```

### 3. Setup
Create a `.env` file in the `Backend` folder:
```env
MONGODB_URI=mongodb://localhost:27017/santa_app
JWT_SECRET=magic_santa_secret
PORT=5000
```

### 4. Run to spread the cheer!
```bash
# In Backend folder
npm run dev

# In Frontend folder (new terminal)
npm run dev
```

Visit `http://localhost:3000` to see the magic! 🎄✨

## � Credits
Built with ❤️ by the North Pole Development Team. Merry Christmas! 🤶🛷🦌