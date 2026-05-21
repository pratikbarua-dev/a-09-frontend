# Healthcare Doctor Booking Platform - Frontend

A modern Next.js-based frontend application for booking doctor appointments and managing healthcare services. This platform provides an intuitive interface for users to find specialists, book appointments, and manage their profiles.

## Overview

This is built with [Next.js](https://nextjs.org) 16.2, featuring real-time authentication, doctor discovery, and appointment management. The application uses MongoDB for backend data storage and includes advanced UI components for seamless user experience.

## Key Features

### 1. **User Authentication System**
- Secure user registration with validation
- JWT-based login/logout functionality
- Session management using better-auth
- MongoDB integration for user data persistence
- Protected routes for authenticated users only

**Location:** `src/components/Login.jsx`, `src/components/Registration.jsx`, `src/lib/auth.js`

### 2. **Doctor Discovery & Search**
- Browse comprehensive doctor listings with specialization filters
- Real-time search functionality to find doctors by name or specialty
- Advanced filtering by specialist categories
- Detailed doctor profiles with ratings and availability
- Browse categories for easy navigation

**Location:** `src/components/DoctorListing.jsx`, `src/components/DocSearchbar.jsx`, `src/components/BrowseCategory.jsx`

### 3. **Appointment Booking System**
- Multi-step booking process with guided steps
- Select preferred date and time slots
- Confirm appointment details before final booking
- Real-time availability updates
- Toast notifications for booking confirmations

**Location:** `src/components/BookSteps.jsx`, `src/app/(main)/appointments/page.jsx`

### 4. **User Profile Management**
- View and update personal information
- Manage appointment history and upcoming bookings
- Edit contact details and medical information
- Access personal dashboard

**Location:** `src/app/(main)/profile/page.jsx`

### 5. **Specialist Categories & Browsing**
- Browse doctors by medical specialization (Cardiology, Dermatology, etc.)
- Category-based filtering system
- Visual specialist section with carousel display
- Easy navigation to find specific medical expertise

**Location:** `src/components/SpecialistSection.jsx`, `src/app/(main)/doctors/page.jsx`

### 6. **Responsive Navigation & UI**
- Dynamic navigation bar with authentication state awareness
- Mobile-responsive design using Tailwind CSS & DaisyUI
- Smooth animations using Framer Motion
- Hero section with call-to-action
- Professional footer with links and information

**Location:** `src/components/Navbar.jsx`, `src/components/HeroSection.jsx`, `src/components/Footer.jsx`

## Tech Stack

- **Framework:** Next.js 16.2.6
- **UI Library:** React 19.2.4 with DaisyUI & Tailwind CSS
- **Database:** MongoDB
- **Authentication:** better-auth 1.6.11 with MongoDB adapter
- **Forms:** React Hook Form
- **Animations:** Framer Motion
- **Notifications:** React Toastify
- **Icons:** Lucide React & React Icons
- **Carousel:** Swiper

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes (login, register)
│   ├── (main)/            # Protected routes (home, appointments, doctors, profile)
│   ├── api/               # API routes for backend services
│   └── page.js            # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
│   ├── auth.js           # Authentication logic
│   ├── auth-client.js    # Client-side auth helpers
│   ├── api.js            # API client functions
│   └── mongodb.js        # MongoDB connection
└── middleware.js          # Next.js middleware for request handling
```

## API Routes

- `POST /api/auth/[...all]` - Authentication endpoints (login, register, logout)
- `GET/POST /api/user` - User profile management
- `GET /api/doctors` - Fetch doctor listings
- `POST /api/appointments` - Create new appointments

## Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

## Contributing

Contributions are welcome! Please follow the existing code structure and styling conventions.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [better-auth Documentation](https://github.com/better-auth/better-auth)
