'use client';

import dynamic from 'next/dynamic';

const OAuthCallbackView = dynamic(() => import('@views/OAuthCallbackView'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function OAuthCallbackPage() {
  return <OAuthCallbackView />;
}
