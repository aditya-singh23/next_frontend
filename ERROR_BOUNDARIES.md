# Error Boundaries Documentation

## Overview

Error boundaries are React components that catch JavaScript errors in their child component tree, log errors, and display a fallback UI instead of crashing the entire application.

## Implementation

### 1. Next.js 14 App Router Error Boundaries (Automatic)

Next.js 14 automatically catches errors with these special files:

#### **`app/error.tsx`** - Root Error Boundary
- Catches errors in any page or component
- Provides "Try Again" and "Go Home" buttons
- Shows error details in development mode

#### **`app/global-error.tsx`** - Critical Error Boundary  
- Catches errors in the root layout
- Last-resort fallback for catastrophic failures
- Must define its own `<html>` and `<body>` tags

#### **`app/dashboard/error.tsx`** - Dashboard-Specific
- Catches errors in dashboard route only
- Contextual error messaging for user list issues
- Provides dashboard-specific recovery options

#### **`app/documents/error.tsx`** - Documents-Specific
- Catches errors in document management route
- Handles file upload/processing errors gracefully
- Guides users on document-related troubleshooting

### 2. Reusable ErrorBoundary Component (Manual)

For custom error handling in specific components:

**Location:** `src/components/ErrorBoundary.tsx`

**Basic Usage:**
```tsx
import { ErrorBoundary } from '@components/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary>
      <SomeComponentThatMightError />
    </ErrorBoundary>
  );
}
```

**Custom Fallback UI:**
```tsx
<ErrorBoundary 
  fallback={
    <div className="p-4 bg-red-50 rounded-md">
      <p>Custom error message</p>
    </div>
  }
>
  <YourComponent />
</ErrorBoundary>
```

**With Custom Error Handler:**
```tsx
<ErrorBoundary 
  onError={(error, errorInfo) => {
    // Send to error tracking service
    console.error('Error caught:', error);
    // logErrorToService(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Error Boundary Hierarchy

```
app/
├── global-error.tsx          ← Catches everything (including layout)
├── error.tsx                 ← Catches app-wide errors
├── dashboard/
│   ├── page.tsx
│   └── error.tsx            ← Catches dashboard errors only
├── documents/
│   ├── page.tsx
│   └── error.tsx            ← Catches documents errors only
└── login/
    └── page.tsx              ← Falls back to root error.tsx
```

## When Errors Are Caught

### ✅ **Caught by Error Boundaries:**
- Rendering errors (null/undefined access)
- Component lifecycle errors
- Constructor errors in class components
- Errors in `useEffect` (if thrown during render)
- Errors thrown by child components

### ❌ **NOT Caught by Error Boundaries:**
- Event handlers (use try-catch)
- Async code (Promises, setTimeout)
- Server-side rendering errors
- Errors in the error boundary itself

## Testing Error Boundaries

### Test Component
Create a component that throws an error on button click:

```tsx
'use client';

import { useState } from 'react';

export function ErrorTest() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error for error boundary');
  }

  return (
    <button 
      onClick={() => setShouldError(true)}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Trigger Error
    </button>
  );
}
```

### Test in Development

1. Add `<ErrorTest />` to any page
2. Click "Trigger Error" button
3. Error boundary should catch it and show fallback UI
4. Check console for error logs

## Error Reporting Integration

### Recommended Services
- **Sentry:** Industry standard, great for React
- **LogRocket:** Session replay + error tracking
- **Bugsnag:** Lightweight, good free tier
- **Rollbar:** Real-time error monitoring

### Integration Example (Sentry)

```tsx
// app/error.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Send to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    // ... error UI
  );
}
```

## Production vs Development

### Development Mode
- Shows full error messages
- Displays error stack traces
- Includes error digest/ID

### Production Mode
- Hides technical error details
- Shows user-friendly messages
- Logs errors server-side only

## Best Practices

1. **Granular Boundaries:** Place error boundaries at feature level (dashboard, documents)
2. **Contextual Messages:** Tailor error messages to the feature that failed
3. **Recovery Actions:** Always provide "Try Again" and navigation options
4. **Error Logging:** Always log errors for debugging
5. **User Guidance:** Include troubleshooting tips in error UI
6. **Avoid Overuse:** Don't wrap every component - use strategically
7. **Test Regularly:** Simulate errors in development

## Common Issues

### Issue: Error boundary not catching errors
**Solution:** Make sure component is client component (`'use client'`)

### Issue: Error boundary catches too much
**Solution:** Use route-specific error.tsx files for granular control

### Issue: Infinite error loops
**Solution:** Ensure error boundary itself doesn't throw errors

## File Locations

```
src/
├── components/
│   └── ErrorBoundary.tsx        ← Reusable class component
└── app/
    ├── error.tsx                ← Root error boundary
    ├── global-error.tsx         ← Global fallback
    ├── dashboard/
    │   └── error.tsx            ← Dashboard errors
    └── documents/
        └── error.tsx            ← Document errors
```

## Further Reading

- [Next.js Error Handling Docs](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Boundary RFC](https://github.com/reactjs/rfcs/blob/main/text/0013-error-boundaries.md)
