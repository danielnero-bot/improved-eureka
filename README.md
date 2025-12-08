# 🍽️ QuickPlate

**QuickPlate** is a modern, full-stack food delivery platform that connects hungry customers with their favorite local restaurants. Built with cutting-edge web technologies, QuickPlate offers a seamless ordering experience with real-time updates, beautiful animations, and an intuitive interface.

---

## ✨ Features

### For Customers
- 🔍 **Browse Restaurants** - Discover local restaurants with detailed menus and ratings
- 🛒 **Smart Cart System** - Add items from multiple restaurants with real-time cart management
- 📱 **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- 🌓 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- 👤 **User Profiles** - Manage personal information, delivery addresses, and preferences
- 📦 **Order Tracking** - View order history and track current orders
- ⭐ **Restaurant Reviews** - Read ratings and reviews from other customers
- 🎨 **Smooth Animations** - Scroll-triggered animations for an engaging user experience

### For Restaurant Owners
- 🏪 **Restaurant Dashboard** - Comprehensive management interface
- 📋 **Menu Management** - Easy-to-use menu item creation and editing
- 🖼️ **Image Upload** - Upload restaurant logos and menu item photos
- 📊 **Order Management** - Track and manage incoming orders
- ⚙️ **Restaurant Settings** - Update business hours, contact info, and delivery details

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework with custom theming
- **Framer Motion** - Smooth scroll-triggered animations
- **React Router** - Client-side routing
- **React Icons** - Comprehensive icon library

### Backend & Services
- **Supabase** - Backend-as-a-Service for:
  - PostgreSQL database
  - Authentication & user management
  - File storage (avatars, restaurant logos, menu images)
  - Real-time subscriptions

### Design
- **Montserrat Font** - Clean, modern typography
- **Custom Color Palette** - Primary green (#38e07b) with dark/light theme support
- **Responsive Layout** - Mobile-first design approach
- **Glassmorphism Effects** - Modern UI aesthetics

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quickplate.git
   cd quickplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
vite-project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Cart.jsx
│   │   ├── UserSidebar.jsx
│   │   └── ...
│   ├── context/            # React Context providers
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/              # Page components
│   │   ├── UserDashboard.jsx
│   │   ├── RestaurantPublicView.jsx
│   │   ├── UserProfile.jsx
│   │   ├── UserOrders.jsx
│   │   ├── Checkout.jsx
│   │   └── ...
│   ├── supabase.js         # Supabase client configuration
│   ├── index.css           # Global styles & theme
│   └── main.jsx            # App entry point
├── public/                 # Static assets
├── index.html
└── package.json
```

---

## 🎨 Key Features Explained

### Theme System
QuickPlate features a comprehensive dark/light theme system with:
- Persistent theme preference (localStorage)
- Smooth transitions between themes
- Custom color tokens for consistent styling
- Theme-aware components throughout the app

### Cart Management
The cart system includes:
- Add/remove items with quantity controls
- Multi-restaurant support
- Real-time price calculations
- Persistent cart state
- Smooth animations for cart interactions

### Animation System
Built with Framer Motion, featuring:
- Scroll-triggered fade-in animations
- Staggered list animations
- Hover effects on interactive elements
- Scale and opacity transitions
- Performance-optimized with `once: true` viewport settings

### Authentication Flow
Secure authentication powered by Supabase:
- Email/password authentication
- User role management (customer/restaurant)
- Protected routes
- Session persistence
- Secure logout

---

## 🗄️ Database Schema

### Main Tables
- **users** - User authentication data
- **user_details** - Extended user profile information
- **restaurants** - Restaurant information and settings
- **menu_items** - Restaurant menu items
- **orders** - Customer orders
- **order_items** - Individual items in orders

### Storage Buckets
- **avatars** - User profile pictures
- **restaurant-logos** - Restaurant branding
- **menu-images** - Menu item photos

---

## 🎯 Use Cases

### For Food Enthusiasts
- Discover new restaurants in your area
- Browse diverse menus with detailed descriptions
- Save favorite restaurants for quick access
- Track order history and reorder favorites
- Customize delivery preferences

### For Restaurant Owners
- Reach more customers online
- Manage menu items efficiently
- Track orders in real-time
- Build your brand with custom logos and photos
- Update business information instantly

### For Developers
- Learn modern React patterns and best practices
- Understand Supabase integration
- Explore animation techniques with Framer Motion
- Study responsive design implementation
- Reference clean code architecture

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
The project is configured for easy deployment to modern hosting platforms. Simply connect your repository and deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Built with ❤️ by Daniel Nero

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Supabase for the powerful backend platform
- TailwindCSS for the utility-first CSS framework
- Framer Motion for smooth animations
- The open-source community for inspiration and support

---

## 📞 Support

For support, email nero80311@gmail.com or open an issue in the GitHub repository.

---

**QuickPlate** - Bringing delicious food to your doorstep, one click at a time! 🍕🍔🍜
