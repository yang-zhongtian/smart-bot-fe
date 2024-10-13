import request from 'umi-request'

export interface IBotStatus {
  cam: boolean
  command: string
  analyze: boolean
}

export interface IBotInfo {
  id: string
  name: string
  status: IBotStatus
}

export async function getBotList() {
  return request.get<IBotInfo[]>('/api/host/')
}

export async function getBotInfo(id: string) {
  return request.get<IBotInfo>(`/api/host/${id}/`)
}
