// ============================================================================
// Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'user' | 'association' | 'analyst';
  associationId?: string;
  profileImage?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'user' | 'association';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================================================
// Grant Types
// ============================================================================

export interface Grant {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: 'SAR' | 'USD' | 'EUR';
  category: string;
  requirements: string[];
  deadlineDate: string;
  status: 'open' | 'closed' | 'ended' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface GrantRequest {
  id: string;
  grantId: string;
  grant?: Grant;
  userId: string;
  user?: User;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  submissionDate: string;
  reviewDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  attachments: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface GrantsState {
  grants: Grant[];
  grantRequests: GrantRequest[];
  selectedGrant: Grant | null;
  isLoading: boolean;
  error: string | null;
  totalGrants: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateGrantRequest {
  title: string;
  description: string;
  amount: number;
  currency: 'SAR' | 'USD' | 'EUR';
  category: string;
  requirements: string[];
  deadlineDate: string;
}

export interface SubmitGrantRequest {
  grantId: string;
  notes: string;
  attachments: File[];
}

// ============================================================================
// Association Types
// ============================================================================

export interface Association {
  id: string;
  name: string;
  arName: string;
  email: string;
  phone: string;
  website?: string;
  registrationNumber: string;
  registrationDate: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  description: string;
  logo?: string;
  certificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  certificationDate?: string;
  certifiedBy?: string;
  users: User[];
  stats: {
    totalMembers: number;
    totalGrants: number;
    totalDocuments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AssociationsState {
  associations: Association[];
  selectedAssociation: Association | null;
  isLoading: boolean;
  error: string | null;
  totalAssociations: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateAssociationRequest {
  name: string;
  arName: string;
  email: string;
  phone: string;
  website?: string;
  registrationNumber: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  description: string;
}

// ============================================================================
// Document Types
// ============================================================================

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'jpg' | 'png' | 'other';
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedDate: string;
  category: 'identification' | 'registration' | 'financial' | 'other';
  relatedTo: 'user' | 'association' | 'grant' | 'contract';
  relatedId: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  expiryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  totalDocuments: number;
  currentPage: number;
  pageSize: number;
  uploadProgress: number;
}

export interface UploadDocumentRequest {
  file: File;
  category: 'identification' | 'registration' | 'financial' | 'other';
  relatedTo: 'user' | 'association' | 'grant' | 'contract';
  relatedId: string;
  notes?: string;
}

// ============================================================================
// Contract Types
// ============================================================================

export interface Contract {
  id: string;
  title: string;
  description: string;
  contractType: 'grant' | 'partnership' | 'service' | 'other';
  associationId: string;
  association?: Association;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'ended' | 'terminated' | 'archived';
  amount: number;
  currency: 'SAR' | 'USD' | 'EUR';
  terms: string;
  documents: string[]; // Document IDs
  signedBy: string;
  signedDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractsState {
  contracts: Contract[];
  selectedContract: Contract | null;
  isLoading: boolean;
  error: string | null;
  totalContracts: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateContractRequest {
  title: string;
  description: string;
  contractType: 'grant' | 'partnership' | 'service' | 'other';
  associationId: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: 'SAR' | 'USD' | 'EUR';
  terms: string;
}

// ============================================================================
// UI/App State Types
// ============================================================================

export interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  notification: Notification | null;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: ValidationError[];
  touched: Set<string>;
}
