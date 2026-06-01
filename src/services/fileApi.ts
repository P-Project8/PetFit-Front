import { apiClient } from './client';
import type { ApiResponse } from './client';

export interface FileUploadResponse {
  fileUrl: string;
  folder: string;
  fileSize: number;
  contentType: string;
}

export async function uploadFile(file: File, folder: string): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<ApiResponse<FileUploadResponse>>(
    '/api/files/upload',
    formData,
    {
      params: { folder },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return data.result;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  await apiClient.delete('/api/files', { params: { fileUrl } });
}
