import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'


/**
 * Global configs
 */
axios.defaults.baseURL = 'http://127.0.0.1:7001'
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true // cookie


/**
 * Interceptor
 */
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.headers) {
    config.headers.Authorization = localStorage.getItem('token') ?? '' // JWT Token
  }
  return config
}, async err => Promise.reject(err))

axios.interceptors.response.use((config: AxiosResponse) => config, async err => Promise.reject(err))


/**
 * GET
 */
export const get = async (path = '', data = {}): Promise<AxiosResponse> => axios.get(path, {
  params: data
})


/**
 * POST
 */
export const post = async (path = '', data = {}): Promise<AxiosResponse> => axios.post(path, data)


/**
 * DELETE
 * @param {string} path
 * @param {{}} data
 * @return {Promise<AxiosResponse>}
 */
export const deleteRequest = async (path = '', data = {}): Promise<AxiosResponse> => axios.delete(path, {
  params: data
})


/**
 * ALL
 */
export const all = async (requests: Iterable<Promise<AxiosResponse>>): Promise<Awaited<AxiosResponse>[]> => Promise.all(requests)
