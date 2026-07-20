// ============================================
// Tipos Base da API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId?: string;
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
  meta: {
    requestId?: string;
    timestamp: string;
  };
}

export interface FieldError {
  field: string;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface PaginatedResponse<T> {
  users?: T[];
  total: number;
  page: number;
  pageSize: number;
}