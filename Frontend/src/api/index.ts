import * as Request from './request'
import type { RegisterData, LoginData, ResponseData, JwtUserResponseData, UserManagementAddUserData } from '../types'
import type { AxiosResponse } from 'axios'


/**
 * Account
 */
export const registerUser = async (data: RegisterData): Promise<ResponseData> => (await Request.post('/register', data)).data

export const sendVerificationEmail = async (data: { email: string }): Promise<ResponseData> => (await Request.get('/verify_email', data)).data

export const loginUser = async (data: LoginData): Promise<JwtUserResponseData> => (await Request.post('/login', data)).data

export const isLoggedIn = async (): Promise<ResponseData> => (await Request.get('/is_logged_in')).data


/**
 * Users - REST
 */
export const getAllUsers = async (): Promise<AxiosResponse> => Request.get('/api/v1/users')

export const createUser = async (data: UserManagementAddUserData): Promise<AxiosResponse> => Request.post('/api/v1/users', data)
