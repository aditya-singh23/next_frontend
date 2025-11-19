# Next.js Authentication Frontend

A modern authentication frontend built with Next.js 14, featuring user authentication, OAuth integration, and infinite scroll user management.

## Features

- 🔐 **Complete Authentication System**
  - User signup and login
  - Password reset with OTP
  - Google OAuth integration
  - Secure token management

- 👥 **User Management Dashboard**
  - View all users with infinite scroll
  - Load 20 users per scroll
  - Real-time user data

- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Form validation with Yup
  - Loading states and error handling

- 🔒 **Security Features**
  - Encrypted local storage
  - Secure token handling
  - Protected routes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Encryption**: CryptoJS

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
next-frontend/
├── src/
│   ├── app/                     # Next.js App Router pages
│   ├── components/              # Reusable React components
│   ├── config/                  # Configuration files
│   ├── constants/               # Application constants
│   ├── context/                 # React Context providers
│   ├── hooks/                   # Custom React hooks
│   ├── interfaces/              # TypeScript interfaces
│   ├── services/                # API service layers
│   ├── store/                   # Redux store configuration
│   ├── styles/                  # Global styles
│   ├── utilities/               # Utility functions
│   ├── validationSchemas/       # Form validation schemas
│   └── views/                   # Feature-based view components
├── public/                      # Static assets
└── locale/                      # Internationalization (i18n)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Integration

This frontend connects to the Basic Auth API backend. Ensure the backend is running before starting the frontend.

### API Endpoints Used

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/users` - Get users with pagination
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/google/success` - Google OAuth callback

## Features in Detail

### Infinite Scroll User List

The dashboard implements infinite scroll to efficiently load and display users:
- Loads 20 users per scroll
- Smooth scrolling experience
- Loading indicators
- Error handling

### Security

- Encrypted local storage using CryptoJS
- Secure token management
- Protected routes with middleware
- XSS protection

## License

MIT
