'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { fetchDocuments, deleteDocument } from '@store/slices/documentSlice';
import { documentService } from '@services/documentService';
import { ProcessingStatus } from '@interfaces/document';

export default function DocumentList() {
  const dispatch = useAppDispatch();
  const { documents, isLoading, total, page, hasMore } = useAppSelector((state) => state.document);
  const { token } = useAppSelector((state) => state.auth);
  const [processingStatuses, setProcessingStatuses] = useState<Map<number, ProcessingStatus>>(
    new Map()
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchDocuments({ token, page: 1, limit: 20 }));
    }
  }, [dispatch, token]);

  // Poll processing status for pending/processing documents
  useEffect(() => {
    if (!token) return;

    const pendingDocs = documents.filter(
      (doc) => doc.status === 'pending' || doc.status === 'processing'
    );

    if (pendingDocs.length === 0) return;

    const pollInterval = setInterval(async () => {
      for (const doc of pendingDocs) {
        try {
          const response = await documentService.getProcessingStatus(doc.id, token);
          if (response.success && response.data) {
            setProcessingStatuses((prev) => new Map(prev).set(doc.id, response.data!));

            // Refresh list if status changed to completed/failed
            if (response.data.status === 'completed' || response.data.status === 'failed') {
              dispatch(fetchDocuments({ token, page, limit: 20 }));
            }
          }
        } catch (error) {
          console.error(`Failed to get status for document ${doc.id}:`, error);
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [documents, token, dispatch, page]);

  const handleDelete = async (documentId: number) => {
    if (!token) return;
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await dispatch(deleteDocument({ documentId, token })).unwrap();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleLoadMore = () => {
    if (token && hasMore && !isLoading) {
      dispatch(fetchDocuments({ token, page: page + 1, limit: 20 }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string, documentId: number) => {
    const statusInfo = processingStatuses.get(documentId);
    const progress = statusInfo?.progress || 0;

    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <div className="space-y-1">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            statusClasses[status as keyof typeof statusClasses]
          }`}
        >
          {status.toUpperCase()}
        </span>
        {status === 'processing' && statusInfo && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading && documents.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Documents ({total})
        </h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id} className="hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="h-8 w-8 text-gray-400 flex-shrink-0"
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
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.originalName}
                        </p>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.createdAt)}</span>
                          {doc.lineCount > 0 && (
                            <>
                              <span>•</span>
                              <span>{doc.lineCount} lines</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(doc.status, doc.id)}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete document"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {doc.extractedText && doc.status === 'completed' && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Preview (first 100 lines):
                    </p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-4">
                      {doc.extractedText}
                    </pre>
                  </div>
                )}
                {doc.errorMessage && doc.status === 'failed' && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md">
                    <p className="text-xs font-semibold text-red-700 mb-1">Error:</p>
                    <p className="text-xs text-red-600">{doc.errorMessage}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
