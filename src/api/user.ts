import request from 'umi-request'

export interface IUserFaceRecord {
  id: number
  username: number
  face_image?: string
  credit: number
  last_detected?: string
}

export interface IUserFaceRecordDetail {
  id: number
  bot: {
    id: string
    name: string
  }
  face_image: string
  created_at: string
}

export async function getUserFaceRecords() {
  return await request.get<IUserFaceRecord[]>('/api/auth/user/')
}

export async function getUserFaceRecordDetail(id: number) {
  return await request.get<IUserFaceRecordDetail[]>(`/api/auth/user/${id}/`)
}

export async function getCurrentUserFaceRecord() {
  return await request.get<IUserFaceRecord>('/api/auth/user/current/')
}

export async function updateCurrentUserFaceRecord(faceImage: File) {
  const formData = new FormData()
  formData.append('face', faceImage)
  return await request.post<IUserFaceRecord>('/api/auth/user/current/', {
    data: formData,
  })
}
