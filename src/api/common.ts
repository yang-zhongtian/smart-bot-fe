import request from 'umi-request'

export interface IErrorMessage {
  message: string
}

request.interceptors.response.use(async (response) => {
  if (response.status === 200) {
    return response
  }
  const data = await response.clone().json()
  return Promise.reject(data)
})
