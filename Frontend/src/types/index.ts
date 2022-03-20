import type { ElForm } from 'element-plus'


/**
 * Pinia
 */
// MainStore
export interface MainStore {
  loggedIn: boolean
  currentUser: User | null
  assetBaseUrl: string
  apiBaseUrl: string
}


// RegisterData
export const enum RegisterType {
  Normal = 'normal',
  Email = 'email'
}

interface BaseRegisterData {
  password: string
  captcha: string
  registerType: RegisterType
}

interface NormalRegisterData extends BaseRegisterData {
  username: string
}

interface EmailRegisterData extends BaseRegisterData {
  email: string
}

export type RegisterData = EmailRegisterData | NormalRegisterData


// ElForm
export type FormInstance = InstanceType<typeof ElForm>


/**
 * Response Data
 */

interface BaseResponseData {
  code: number
  msg: unknown
}

export interface ResponseData extends BaseResponseData {
  data: unknown
}

export interface JwtUserResponseData extends BaseResponseData {
  data: User & { token: string }
}

export interface StringResponseData extends BaseResponseData {
  data: string
}

export interface ImportUsersResponseData extends BaseResponseData {
  data: User[]
}


// loginData
export interface LoginData {
  username: string
  password: string
  captcha: string
}

// UserManagementAddUserData
export interface UserManagementAddUserData {
  username: string
  email: string | null
  password: string
  confirmPassword: string
}

// UserManagementEditUserData
export interface UserManagementEditUserData {
  id?: number
  username: string
  email: string | null
  password: string | undefined
  confirmPassword: string | undefined
  avatarUrl: string
}

// User
export interface User {
  id: number
  username: string | null
  email: string | null
  github: boolean
  userState: boolean
  avatarUrl: string
}
