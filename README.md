# 🍽️ QuickPlate

**QuickPlate** is a React + Vite food delivery web app that connects customers with local restaurants, lets them browse menus and place orders, and gives restaurant owners tools to manage their business online.

The app is powered by **Supabase** for authentication, data storage, and file handling, and uses **React Router** for navigation plus **TailwindCSS** and **GSAP** for the UI and animations.

---

## ✨ What the app does

### For customers
- Browse restaurant listings and restaurant detail pages
- View menu items and restaurant information
- Add items to a cart and manage quantities
- Checkout and place orders
- View order history and current orders
- Manage favorites and notifications
- Update profile information
- Read restaurant reviews
- Switch between light and dark themes

### For restaurant owners
- Access a restaurant dashboard
- Create and manage restaurant setup details
- Add menu items
- Manage orders
- Update restaurant settings and business information

### For admins
- Access an admin dashboard page

---

## 🛠️ Tech stack

### Frontend
- **React 19**
- **Vite 7**
- **React Router 7**
- **TailwindCSS 4**
- **GSAP / @gsap/react**
- **React Icons**

### Backend / services
- **Supabase** for:
  - authentication
  - PostgreSQL data storage
  - file storage
  - session management

### Other tools
- **ESLint**
- **Vite PWA** support

---

## 📁 Project structure

```text
vite-project/
├── src/
│   ├── components/       # Reusable UI pieces and auth helpers
│   ├── context/          # Theme, cart, and notification providers
│   ├── pages/            # Page-level routes and views
│   ├── assets/           # Static images and media
│   ├── App.jsx           # Layout wrapper with Navbar/Footer
│   ├── main.jsx          # Router setup and app entry point
│   ├── index.css         # Global styles and theme variables
│   └── supabase.js       # Supabase client configuration
├── public/               # Static public assets
├── .github/workflows/    # GitHub Actions workflows
├── index.html
├── package.json
└── vite.config.js
```

---

## 🧭 Main routes

The app uses client-side routing in [src/main.jsx](src/main.jsx). Key routes include:

- `/` — home page
- `/about` — about page
- `/docs` — docs / landing page
- `/contact` — contact page
- `/getStarted` — onboarding / join flow
- `/signupUser` — customer sign up
- `/signupRestaurant` — restaurant sign up
- `/login` — login
- `/dashboard` — customer dashboard
- `/restaurantDashboard` — restaurant dashboard
- `/restaurantsetup` — restaurant setup
- `/menupage` — menu management
- `/addmenuitem` — add menu item
- `/restaurant-info` — restaurant details
- `/settings` — settings
- `/orders` — orders
- `/userOrders` — user orders
- `/favorites` — favorites
- `/notifications` — notifications
- `/userProfile` — user profile
- `/restaurantview` — restaurant directory
- `/restaurantviewed` — restaurant detail view
- `/restaurant/:id` — public restaurant page
- `/checkout` — checkout
- `/terms` — terms
- `/privacy` — privacy
- `/admin` — admin dashboard
