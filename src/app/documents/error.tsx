'use client';

import { useEffect } from 'react';

/**
 * Documents Route Error Boundary
 * 
 * Catches errors specific to document upload/management (file processing, polling, etc.)
 */
export default function DocumentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Documents page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Document Processing Error
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          We encountered an issue with document management. Your uploaded files are safe, but we can't display them right now.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm font-semibold text-orange-800 mb-2">Debug Info:</p>
            <p className="text-xs text-orange-700 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Retry Loading Documents
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-gray-100 text-gray-800 py-2.5 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm font-semibold text-blue-800 mb-2">💡 What you can try:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Refresh the page (Ctrl/Cmd + R)</li>
            <li>• Check if file uploads are still in progress</li>
            <li>• Clear browser cache and reload</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
