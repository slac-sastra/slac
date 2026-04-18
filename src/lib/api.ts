export interface CaseFormData {
  name: string; age: number; phone: string;
  village: string; taluk: string; district: string; issue: string;
}

export interface CaseResult {
  id: string; petitionNumber?: string; name: string; age: number; phone: string;
  village: string; taluk: string; district: string; issue: string;
  guidance: string; petition: string; summary: string;
  pdfFileName: string; pdfUrl: string; createdAt: string;
  notificationSent: boolean;
}

export interface CasesResponse { cases: CaseResult[]; total: number }
export interface SubmitCaseResponse { success: boolean; caseId: string; petitionNumber: string; message: string }
export interface AdminLoginResponse { success: boolean; message: string }

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(err.error || 'API error'), { status: res.status });
  }
  return res.json() as Promise<T>;
}

export function submitCase(data: CaseFormData): Promise<SubmitCaseResponse> {
  return apiRequest<SubmitCaseResponse>('/api/cases', { method: 'POST', body: JSON.stringify(data) });
}

export function adminLogin(password: string): Promise<AdminLoginResponse> {
  return apiRequest<AdminLoginResponse>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
}

export function getCases(password: string, search?: string): Promise<CasesResponse> {
  const q = new URLSearchParams({ password, ...(search ? { search } : {}) });
  return apiRequest<CasesResponse>(`/api/admin/cases?${q}`);
}

export function getPdfDownloadUrl(caseId: string): string {
  return `${API_BASE}/api/cases/${caseId}/pdf`;
}

export function downloadCsvUrl(password: string): string {
  return `${API_BASE}/api/admin/cases/export-csv?password=${encodeURIComponent(password)}`;
}
