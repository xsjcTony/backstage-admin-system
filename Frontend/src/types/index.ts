import type { ElForm } from 'element-plus'


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

// loginData
export interface LoginData {
  username: string
  password: string
  captcha: string
}
