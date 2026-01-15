import axios from 'axios';
import {
  DocumentUploadResponse,
  DocumentListResponse,
  Document,
  ProcessingStatus,
} from '@interfaces/document';
import { ApiResponse } from '@interfaces/index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const documentService = {
  /**
   * Upload a document file
   */
  uploadDocument: async (
    file: File,
    token: string
  ): Promise<ApiResponse<DocumentUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<ApiResponse<DocumentUploadResponse>>(
      `${API_URL}/documents/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Get user's documents with pagination
   */
  getDocuments: async (
    token: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<DocumentListResponse>> => {
    const response = await axios.get<ApiResponse<DocumentListResponse>>(
      `${API_URL}/documents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      }
    );

    return response.data;
  },

  /**
   * Get document by ID
   */
  getDocumentById: async (
    documentId: number,
    token: string
  ): Promise<ApiResponse<Document>> => {
    const response = await axios.get<ApiResponse<Document>>(
      `${API_URL}/documents/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  /**
   * Get document processing status
   */
  getProcessingStatus: async (
    documentId: number,
    token: string
  ): Promise<ApiResponse<ProcessingStatus>> => {
    const response = await axios.get<ApiResponse<ProcessingStatus>>(
      `${API_URL}/documents/${documentId}/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  /**
   * Delete document
   */
  deleteDocument: async (
    documentId: number,
    token: string
  ): Promise<ApiResponse> => {
    const response = await axios.delete<ApiResponse>(
      `${API_URL}/documents/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};
