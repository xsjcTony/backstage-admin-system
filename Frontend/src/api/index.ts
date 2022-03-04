import * as Request from './request'
import type { RegisterData, LoginData } from '../types'


export const registerUser = async (data: RegisterData): Promise<unknown> => Request.post('/register', data)
export const sendVerificationEmail = async (data: { email: string }): Promise<unknown> => Request.get('/verify_email', data)
export const loginUser = async (data: LoginData): Promise<unknown> => Request.post('/login', data)
