'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@hooks/index';
import DocumentUpload from '@components/DocumentUpload';
import DocumentList from '@components/DocumentList';

export default function DocumentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Processing</h1>
          <p className="mt-2 text-gray-600">
            Upload documents to process them line-by-line using generators and background tasks
          </p>
        </div>

        <div className="space-y-8">
          {/* Upload Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
            <DocumentUpload />
          </div>

          {/* Documents List Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <DocumentList />
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🔬 Technical Features Demonstrated
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Backend:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>
                    <strong>Generator:</strong> Reads files line-by-line without loading entire file
                    in memory
                  </li>
                  <li>
                    <strong>Background Tasks:</strong> Async processing doesn't block the API
                    response
                  </li>
                  <li>
                    <strong>Decorator:</strong> Logs execution time for all functions
                  </li>
                  <li>
                    <strong>SQLAlchemy:</strong> Async database operations with proper type safety
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Frontend:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>
                    <strong>Redux Toolkit:</strong> State management with TypeScript
                  </li>
                  <li>
                    <strong>Real-time Updates:</strong> Polls processing status every 3 seconds
                  </li>
                  <li>
                    <strong>Drag & Drop:</strong> Modern file upload UX
                  </li>
                  <li>
                    <strong>Pagination:</strong> Load more documents as needed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
