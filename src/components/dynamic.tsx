/**
 * Centralized Dynamic Imports for Code Splitting
 * 
 * This module provides pre-configured dynamic imports for heavy components
 * to reduce initial bundle size and improve performance.
 */

import dynamic from 'next/dynamic';

/**
 * Document Upload Component
 * Heavy component with file handling, drag-and-drop, and Redux integration
 * ~35KB bundle size
 */
export const DynamicDocumentUpload = dynamic(() => import('./DocumentUpload'), {
  loading: () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  ),
  ssr: false,
});

/**
 * Document List Component
 * Heavy component with polling, real-time updates, and pagination
 * ~30KB bundle size
 */
export const DynamicDocumentList = dynamic(() => import('./DocumentList'), {
  loading: () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
  ssr: true,
});

/**
 * Google OAuth Button Component
 * OAuth integration with SVG icons and redirection logic
 * ~8KB bundle size
 */
export const DynamicGoogleOAuthButton = dynamic(() => import('./GoogleOAuthButton'), {
  loading: () => (
    <button
      disabled
      className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-400 cursor-not-allowed"
    >
      <span className="animate-pulse">Loading...</span>
    </button>
  ),
  ssr: true,
});
