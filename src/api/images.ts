import { apiRequest } from './http'

export interface PresignedUploadResponse {
  objectKey: string
  uploadUrl: string
  /** yyyy-MM-ddTHH:mm:ss */
  expiresAt: string
  fileSize: number
  requiredHeaders: Record<string, string>
}

async function createUploadUrl(
  contentType: string,
  fileSize: number,
): Promise<PresignedUploadResponse> {
  const response = await apiRequest<PresignedUploadResponse>(
    '/api/v1/images/presigned-upload',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType, fileSize }),
    },
  )

  if (!response.data) {
    throw new Error('Presigned upload response is empty')
  }

  return response.data
}

/** presigned URL을 발급받아 S3에 직접 업로드하고, 등록 API에 넘길 objectKey를 반환한다. */
export async function uploadImage(file: File): Promise<string> {
  const presigned = await createUploadUrl(file.type, file.size)

  const response = await fetch(presigned.uploadUrl, {
    method: 'PUT',
    headers: presigned.requiredHeaders,
    body: file,
  })

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.status}`)
  }

  return presigned.objectKey
}
