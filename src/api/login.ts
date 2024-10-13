import request from 'umi-request'

interface IPasswordLogin {
  username: string
  password: string
}

export interface IUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export async function loginWithPassword({ username, password }: IPasswordLogin) {
  return await request.post<IUser>('/api/auth/login/', {
    data: {
      username,
      password,
    },
  })
}

export async function loginWithFace(faceImage: File) {
  const formData = new FormData()
  formData.append('face', faceImage)
  return await request.post<IUser>('/api/auth/login-face/', {
    data: formData,
  })
}

export async function register({ username, password }: IPasswordLogin) {
  return await request.post<IUser>('/api/auth/register/', {
    data: {
      username,
      password,
    },
  })
}
