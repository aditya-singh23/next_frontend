'use client';

import { useEffect } from 'react';

/**
 * Dashboard Route Error Boundary
 * 
 * Catches errors specific to the dashboard page (user list, infinite scroll, etc.)
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
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
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Dashboard Error
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          We couldn't load your dashboard. This might be due to a temporary network issue or data loading problem.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm font-semibold text-yellow-800 mb-2">Debug Info:</p>
            <p className="text-xs text-yellow-700 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Reload Dashboard
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-800 py-2.5 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Go to Home
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Common issues:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Network connection lost</li>
            <li>• Session expired (try logging in again)</li>
            <li>• API server temporarily unavailable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
