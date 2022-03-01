import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'


/**
 * Global configs
 */
axios.defaults.baseURL = 'http://127.0.0.1:7001'
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true // cookie


/**
 * Interceptor
 */
axios.interceptors.request.use((config: AxiosRequestConfig) => config, async err => Promise.reject(err))

axios.interceptors.response.use((config: AxiosResponse) => config, async err => Promise.reject(err))

// 封装 get / post
export async function get(path = '', data = {}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    axios.get(path, {
      params: data
    })
      .then(response => void resolve(response.data))
      .catch(err => void reject(err))
  })
}

export async function post(path = '', data = {}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    axios.post(path, data)
      .then(response => void resolve(response.data))
      .catch(err => void reject(err))
  })
}

export async function all(requests: Iterable<Promise<unknown>>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    Promise.all(requests)
      .then(res => void resolve(res))
      .catch(err => void reject(err))
  })
}
