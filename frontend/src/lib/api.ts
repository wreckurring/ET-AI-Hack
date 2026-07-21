const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('raksha_token') : null;
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`API call to ${endpoint} failed. Using frontend fallback layer:`, error);
    throw error;
  }
}

// Dedicated helper for evidence upload with FormData and SHA-256 header
export async function uploadEvidenceApi(reportId: number, file: File, clientSha256: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('client_sha256', clientSha256);

  return fetchApi(`/reports/upload-evidence/${reportId}`, {
    method: 'POST',
    body: formData,
  });
}
