import type { IUser } from '@/api/login.ts'
import request from 'umi-request'

export interface IFaceRecord {
  id: number
  user: IUser
  face_image: string
  created_at: string
}

export async function getFaceRecords(id: string) {
  return await request.get<IFaceRecord[]>(`/api/host/${id}/history/`)
}

export async function getFaceRecordLatest(id: string) {
  return await request.get<IFaceRecord>(`/api/host/${id}/history/latest/`)
}
