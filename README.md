# 🎅 Santa's Workshop - Digital Christmas Management System

A comprehensive, modern web application for Santa Claus to manage Christmas operations worldwide! This full-stack application helps Santa track children, manage gifts, communicate with kids, and oversee the entire North Pole workshop operations.

## ✨ Features

### 🧒 Children Management
- **Global Child Registry**: Track children worldwide with behavior scores
- **Nice/Naughty Lists**: Automated behavior scoring system
- **Wishlist Management**: Track and prioritize children's Christmas wishes
- **Geographic Distribution**: View children by country and city
- **Behavior Analytics**: Monitor and update behavior scores with reasons

### 🎁 Gift Workshop
- **Production Pipeline**: Track gifts from design to delivery
- **Elf Assignment**: Assign elves to specific gift production
- **Status Tracking**: Monitor production stages (Design → Production → Quality Check → Completed → Shipped)
- **Magic Level System**: Rate gifts by their magical complexity
- **Category Management**: Organize gifts by type (toys, books, electronics, etc.)

### 📬 Message Center
- **Real-time Messaging**: Instant communication between Santa and children
- **Letter Management**: Read and respond to children's letters
- **Auto-Reply System**: Smart Santa responses based on child behavior
- **Magic Seal**: Special authentication for Santa's messages
- **Quick Replies**: Pre-written magical responses

### 📊 Analytics Dashboard
- **Real-time Statistics**: Live workshop performance metrics
- **Behavior Distribution**: Visual charts of nice/naughty ratios
- **Production Status**: Gift manufacturing progress tracking
- **Global Reach**: Worldwide Christmas operation insights
- **Activity Feed**: Recent workshop activities and updates

### 🎄 Special Features
- **Christmas Countdown**: Live countdown to Christmas Day
- **Snow Animation**: Magical falling snow effects
- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **Real-time Updates**: Live data synchronization
- **Christmas Theme**: Festive UI with holiday colors and animations

## 🛠 Technology Stack

### Frontend (Next.js)
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Beautiful data visualization
- **Socket.io Client**: Real-time communication
- **React Hook Form**: Form management
- **React Hot Toast**: Elegant notifications

### Backend (Node.js)
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Socket.io**: Real-time bidirectional communication
- **JWT**: Secure authentication
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation
- **Helmet**: Security middleware
- **Rate Limiting**: API protection

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/santas-workshop.git
cd santas-workshop
```

2. **Install root dependencies**
```bash
npm install
```

3. **Setup Backend**
```bash
cd Backend
npm install
```

4. **Setup Frontend**
```bash
cd ../Frontend
npm install
```

5. **Configure Environment Variables**

Create `.env` file in the Backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/santas_workshop
JWT_SECRET=santa_secret_key_2024_christmas_magic
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=santa@northpole.com
EMAIL_PASS=christmas_magic_password
FRONTEND_URL=http://localhost:3000
```

6. **Start MongoDB**
Make sure MongoDB is running on your system.

7. **Run the Application**

From the root directory:
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start them separately:
# Backend (Terminal 1)
cd Backend && npm run dev

# Frontend (Terminal 2)
cd Frontend && npm run dev
```

8. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎅 Default Login Credentials

```
Email: santa@northpole.com
Password: santa123
```

## 📁 Project Structure

```
santas-workshop/
├── Backend/                 # Node.js Express API
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Express server setup
├── Frontend/               # Next.js React application
│   ├── app/                # Next.js App Router pages
│   ├── components/         # Reusable React components
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Santa login
- `GET /api/auth/me` - Get current user

### Children Management
- `GET /api/children` - Get all children (with filters)
- `POST /api/children` - Register new child
- `GET /api/children/:id` - Get child details
- `PUT /api/children/:id` - Update child information
- `PATCH /api/children/:id/behavior` - Update behavior score
- `POST /api/children/:id/wishlist` - Add to wishlist

### Gift Management
- `GET /api/gifts` - Get all gifts (with filters)
- `POST /api/gifts` - Create new gift
- `PATCH /api/gifts/:id/status` - Update gift status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userType/:userId` - Get user messages
- `GET /api/messages/conversation/:user1Type/:user1Id/:user2Type/:user2Id` - Get conversation
- `PATCH /api/messages/:id/read` - Mark message as read
- `POST /api/messages/santa-reply` - Auto-reply from Santa

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities

## 🎨 UI Components

### Layout Components
- **Layout**: Main application layout with sidebar navigation
- **Sidebar**: Navigation menu with Christmas theming
- **Header**: Top navigation bar with user info

### Feature Components
- **Dashboard**: Overview with statistics and charts
- **ChildrenGrid**: Interactive children management interface
- **MessageCenter**: Real-time chat interface
- **GiftWorkshop**: Production pipeline management
- **ChristmasCountdown**: Live countdown timer

### UI Elements
- **ChristmasCard**: Glassmorphism cards with hover effects
- **LoadingSpinner**: Christmas-themed loading animations
- **Badges**: Status indicators for behavior and gift status
- **Buttons**: Festive button styles with hover animations

## 🌟 Key Features Explained

### Behavior Scoring System
Children receive scores from 0-100 based on their behavior:
- **80-100**: Very Nice (🌟)
- **60-79**: Nice (😊)
- **40-59**: Okay (😐)
- **0-39**: Needs Improvement (😔)

### Gift Production Pipeline
1. **Design Phase**: Initial gift planning
2. **In Production**: Elves actively creating the gift
3. **Quality Check**: Ensuring gift meets North Pole standards
4. **Completed**: Ready for packaging
5. **Shipped**: On the way to the child

### Real-time Features
- Live message updates using Socket.io
- Real-time dashboard statistics
- Instant behavior score updates
- Live Christmas countdown

## 🎄 Christmas Theming

The application features a comprehensive Christmas theme:
- **Colors**: Traditional red, green, and gold palette
- **Fonts**: Festive typography (Mountains of Christmas, Fredoka One)
- **Animations**: Falling snow, twinkling stars, smooth transitions
- **Icons**: Christmas-themed icons and emojis throughout
- **Sounds**: Optional Christmas sound effects (can be added)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with collapsible navigation

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd Frontend && npm run build`
2. Deploy to your preferred platform
3. Set environment variables for API URL

### Backend (Heroku/Railway/DigitalOcean)
1. Set up MongoDB Atlas for cloud database
2. Configure environment variables
3. Deploy backend to your preferred platform

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=your_frontend_domain
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎅 About Santa's Workshop

This application represents the digital transformation of Santa's traditional workshop operations. By leveraging modern web technologies, Santa can now efficiently manage Christmas operations on a global scale while maintaining the magic and wonder of Christmas.

**Ho ho ho! Merry Christmas and happy coding! 🎄✨**

---

*Built with ❤️ and Christmas magic by the North Pole Development Team*#   S a n d a - A p p  
 