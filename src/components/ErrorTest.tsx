'use client';

import { useState } from 'react';

/**
 * Error Test Component
 * 
 * Use this component to test error boundaries in development.
 * Click the button to trigger an intentional error.
 * 
 * Usage:
 * import { ErrorTest } from '@components/ErrorTest';
 * 
 * <ErrorBoundary>
 *   <ErrorTest />
 * </ErrorBoundary>
 */
export function ErrorTest() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    // This will be caught by the nearest error boundary
    throw new Error('🧪 Test error - This is intentional for testing error boundaries');
  }

  return (
    <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <svg
          className="w-6 h-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-yellow-900">Error Boundary Test</h3>
      </div>
      
      <p className="text-sm text-yellow-800 mb-4">
        This component is for testing error boundaries. Click the button below to trigger an intentional error
        and see how the error boundary catches it.
      </p>
      
      <button
        onClick={() => setShouldError(true)}
        className="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
      >
        🧨 Trigger Test Error
      </button>
      
      <p className="text-xs text-yellow-700 mt-3">
        ⚠️ Remove this component before production deployment
      </p>
    </div>
  );
}

export default ErrorTest;
