import * as Request from './request'
import type {
  RegisterData,
  LoginData,
  ResponseData,
  JwtUserResponseData,
  UserManagementAddUserData,
  UserManagementEditUserData,
  UserQueryData,
  RoleQueryData, PermissionManagementAddRoleData
} from '../types'
import type { AxiosResponse } from 'axios'


/**
 * Account
 */
export const registerUser = async (data: RegisterData): Promise<ResponseData> => (await Request.post('/register', data)).data

export const sendVerificationEmail = async (data: { email: string }): Promise<ResponseData> => (await Request.get('/verify-email', data)).data

export const loginUser = async (data: LoginData): Promise<JwtUserResponseData> => (await Request.post('/login', data)).data

export const isLoggedIn = async (): Promise<ResponseData> => (await Request.get('/is-logged-in')).data


/**
 * Users - REST
 */
export const getUsersByQuery = async (data: UserQueryData): Promise<AxiosResponse> => Request.get('/api/v1/users', data)

export const createUser = async (data: UserManagementAddUserData): Promise<AxiosResponse> => Request.post('/api/v1/users', data)

export const deleteUser = async (id: number): Promise<AxiosResponse> => Request.deleteRequest(`/api/v1/users/${ id }`)

export const updateUser = async (id: number, data: UserManagementEditUserData): Promise<AxiosResponse> => Request.put(`/api/v1/users/${ id }`, data)

export const getUserById = async (id: number): Promise<AxiosResponse> => Request.get(`/api/v1/users/${ id }`)

export const updateUserState = async (id: number, userState: boolean): Promise<AxiosResponse> => Request.put(`/api/v1/users/${ id }`, { userState })

export const exportAllUsers = async (): Promise<AxiosResponse> => Request.getFile('/api/v1/export-all-users')


/**
 * Roles - REST
 */
export const getRolesByQuery = async (data: RoleQueryData): Promise<AxiosResponse> => Request.get('api/v1/roles', data)

export const createRole = async (data: PermissionManagementAddRoleData): Promise<AxiosResponse> => Request.post('api/v1/roles', data)

export const deleteRole = async (id: number): Promise<AxiosResponse> => Request.deleteRequest(`api/v1/roles/${ id }`)
