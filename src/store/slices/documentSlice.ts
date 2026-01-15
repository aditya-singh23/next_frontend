import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { documentService } from '@services/documentService';
import { DocumentState, Document, DocumentListResponse } from '@interfaces/document';

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  isLoading: false,
  isUploading: false,
  error: null,
  total: 0,
  page: 1,
  hasMore: false,
  uploadProgress: 0,
};

// Async thunks
export const uploadDocument = createAsyncThunk(
  'document/upload',
  async ({ file, token }: { file: File; token: string }, { rejectWithValue }) => {
    try {
      const response = await documentService.uploadDocument(file, token);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const fetchDocuments = createAsyncThunk(
  'document/fetchDocuments',
  async (
    { token, page, limit }: { token: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await documentService.getDocuments(token, page, limit);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  'document/fetchById',
  async ({ documentId, token }: { documentId: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await documentService.getDocumentById(documentId, token);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch document details'
      );
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'document/delete',
  async ({ documentId, token }: { documentId: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await documentService.deleteDocument(documentId, token);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return documentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDocument: (state, action: PayloadAction<Document | null>) => {
      state.currentDocument = action.payload;
    },
    updateDocumentStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const doc = state.documents.find((d) => d.id === action.payload.id);
      if (doc) {
        doc.status = action.payload.status as any;
      }
      if (state.currentDocument && state.currentDocument.id === action.payload.id) {
        state.currentDocument.status = action.payload.status as any;
      }
    },
  },
  extraReducers: (builder) => {
    // Upload document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        // Document will be added when fetching the list
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });

    // Fetch documents
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload as DocumentListResponse;
        state.documents = data.items;
        state.total = data.total;
        state.page = data.page;
        state.hasMore = data.hasMore;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch document by ID
    builder
      .addCase(fetchDocumentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDocument = action.payload as Document;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete document
    builder
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = state.documents.filter((doc) => doc.id !== action.payload);
        if (state.currentDocument && state.currentDocument.id === action.payload) {
          state.currentDocument = null;
        }
        state.total -= 1;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentDocument, updateDocumentStatus } = documentSlice.actions;
export default documentSlice.reducer;
