import type { ElForm } from 'element-plus'


/**
 * Pinia
 */
// MainStore
export interface MainStore {
  loggedIn: boolean
  currentUser: User | null
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


// ResponseData
export interface ResponseData {
  code: number
  msg: unknown
  data: unknown
}

// JwtUserResponseData
export interface JwtUserResponseData {
  code: number
  msg: unknown
  data: User & {
    token: string
  }
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
