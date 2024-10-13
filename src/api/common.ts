import Cookies from 'js-cookie'
import request from 'umi-request'

export interface IErrorMessage {
  message: string
}

request.interceptors.request.use((url, options) => {
  return {
    url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRFToken': Cookies.get('csrftoken') ?? '',
      },
    },
  }
})

request.interceptors.response.use(async (response) => {
  if (response.status === 200) {
    return response
  }
  const data = await response.clone().json()
  return Promise.reject(data)
})
