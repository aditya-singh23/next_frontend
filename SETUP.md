# Next.js Frontend Setup Guide

## Overview

This is a complete Next.js 14 authentication frontend with all features from the React frontend, plus infinite scroll user list functionality.

## Features

✅ **Complete Authentication System**
- User signup and login
- Password reset with OTP
- Google OAuth integration
- Secure token management with encryption

✅ **Dashboard with Infinite Scroll**
- View all users with infinite scroll
- Loads 20 users per scroll
- Smooth loading experience
- Real-time user data

✅ **Modern Tech Stack**
- Next.js 14 with App Router
- TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Hook Form + Yup validation
- Axios for API calls
- CryptoJS for encryption

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API running on http://localhost:5000

## Installation Steps

### 1. Install Dependencies

```bash
cd c:\PyPrograms\Basic-auth-api\next-frontend
npm install
```

### 2. Environment Configuration

The `.env` file is already created with default values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

Update these values if your backend runs on a different port.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
next-frontend/
├── locale/                      # Internationalization
│   ├── client.ts
│   ├── en.ts
│   └── server.ts
├── public/                      # Static assets
│   └── favicon.ico
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── dashboard/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── oauth/callback/
│   │   ├── reset-password/
│   │   ├── signup/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/              # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── UserCard.tsx
│   ├── config/                  # Configuration
│   │   └── api.config.ts
│   ├── constants/               # Constants
│   │   └── index.ts
│   ├── context/                 # React Context
│   │   └── ReduxProvider.tsx
│   ├── hooks/                   # Custom hooks
│   │   ├── useAppDispatch.ts
│   │   ├── useAppSelector.ts
│   │   ├── useAuth.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── index.ts
│   ├── interfaces/              # TypeScript interfaces
│   │   └── index.ts
│   ├── services/                # API services
│   │   └── api.ts
│   ├── store/                   # Redux store
│   │   ├── slices/
│   │   │   └── authSlice.ts
│   │   └── store.ts
│   ├── styles/                  # Global styles
│   │   └── globals.css
│   ├── utilities/               # Utility functions
│   │   ├── clearStorage.ts
│   │   ├── encryption.ts
│   │   └── secureStorage.ts
│   ├── validationSchemas/       # Form validation
│   │   └── index.ts
│   ├── views/                   # View components
│   │   ├── DashboardView.tsx
│   │   ├── ForgotPasswordView.tsx
│   │   ├── LoginView.tsx
│   │   ├── OAuthCallbackView.tsx
│   │   ├── ResetPasswordView.tsx
│   │   └── SignupView.tsx
│   └── middleware.ts            # Next.js middleware
├── .env
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Key Features Implementation

### 1. Infinite Scroll User List

The dashboard implements infinite scroll using a custom hook:

```typescript
// Automatically loads more users when scrolling
const { loadMoreRef } = useInfiniteScroll({
  onLoadMore: handleLoadMore,
  hasMore: usersHasMore,
  isLoading,
});
```

- Loads 20 users per scroll
- Smooth loading indicators
- Efficient pagination
- No duplicate data

### 2. Secure Storage

All sensitive data is encrypted before storage:

```typescript
// Encrypted token and user data
secureStorage.setToken(token);
secureStorage.setUser(user);
```

### 3. Form Validation

All forms use Yup schemas with React Hook Form:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(loginSchema),
});
```

### 4. Protected Routes

Middleware protects authenticated routes:

```typescript
// Redirects unauthenticated users to login
// Redirects authenticated users away from auth pages
```

## Available Routes

- `/` - Home (redirects based on auth status)
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with OTP
- `/dashboard` - User dashboard with infinite scroll
- `/oauth/callback` - OAuth callback handler

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`:

### Endpoints Used

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/users?page=1&limit=20` - Get users with pagination
- `GET /auth/profile` - Get current user
- `GET /auth/google` - Google OAuth
- `POST /auth/google/success` - OAuth success handler

## Backend Pagination Support

**IMPORTANT**: The backend needs to support pagination for the infinite scroll feature to work properly.

The frontend expects this response format:

```typescript
{
  success: true,
  message: "Users fetched successfully",
  data: {
    items: User[],      // Array of users
    total: number,      // Total count
    page: number,       // Current page
    limit: number,      // Items per page
    hasMore: boolean    // More items available
  }
}
```

If your backend doesn't support pagination yet, the frontend will still work but won't have infinite scroll functionality.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Troubleshooting

### TypeScript Errors

All TypeScript errors shown are expected until dependencies are installed. Run:

```bash
npm install
```

### Port Already in Use

If port 3000 is in use, you can change it:

```bash
PORT=3001 npm run dev
```

### Backend Connection Issues

Ensure:
1. Backend is running on http://localhost:5000
2. CORS is enabled in backend
3. `.env` file has correct API URL

### Build Errors

Clean the build and try again:

```bash
./clean-build.ps1  # Windows
npm run build
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start backend**: Ensure backend is running
3. **Start frontend**: `npm run dev`
4. **Test features**:
   - Signup/Login
   - Password reset
   - Dashboard with infinite scroll
   - OAuth (if configured)

## Notes

- All lint errors are expected before `npm install`
- The frontend uses encrypted storage for security
- Infinite scroll loads 20 users at a time
- OAuth requires backend configuration
- Middleware handles route protection

## Support

For issues or questions, refer to:
- Next.js documentation: https://nextjs.org/docs
- Redux Toolkit: https://redux-toolkit.js.org/
- Tailwind CSS: https://tailwindcss.com/docs
