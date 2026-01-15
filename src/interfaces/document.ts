// Document related interfaces

export interface Document {
  id: number;
  userId: number;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lineCount: number;
  processedLines: number;
  extractedText?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export interface DocumentUploadResponse {
  id: number;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  status: string;
  createdAt: string;
}

export interface DocumentListResponse {
  items: Document[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProcessingStatus {
  id: number;
  status: string;
  lineCount: number;
  processedLines: number;
  progress: number;
  errorMessage?: string;
  completedAt?: string;
}

export interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  uploadProgress: number;
}
