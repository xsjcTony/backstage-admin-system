/* eslint '@typescript-eslint/no-explicit-any': 'off' */

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
  github?: boolean
}

interface EmailRegisterData extends BaseRegisterData {
  email: string
}

export type RegisterData = EmailRegisterData | NormalRegisterData


// Email Verification
export interface EmailInfo {
  from: string
  to: string
  subject: string
  text: string
}


// loginData
export interface LoginData {
  username: string
  password: string
  captcha: string
}


// OAuthUserData
export interface OAuthUserData {
  [key: string]: any
  id: number
  provider: string
}


// AddUserData
export interface AddUserData {
  username: string
  email: string | null
  password: string
}
