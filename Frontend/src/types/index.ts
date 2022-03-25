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

// UserStore
export interface UserStore {
  tableData: User[]
  queryData: UserQueryData
  totalUserCounts: number
}


/**
 * Vue
 */


/**
 * Registration
 */
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


/**
 * Login
 */
export interface LoginData {
  username: string
  password: string
  captcha: string
}


/**
 * Users
 */
export interface UserManagementAddUserData {
  username: string
  email: string | null
  password: string
  confirmPassword: string
}

export interface UserManagementEditUserData {
  id?: number
  username: string
  email: string | null
  password: string | undefined
  confirmPassword: string | undefined
  avatarUrl: string
}

export interface User {
  id: number
  username: string | null
  email: string | null
  github: boolean
  userState: boolean
  avatarUrl: string
}

export interface UserQueryData {
  role: string
  origin: '' | 'github' | 'local'
  type: '' | 'email' | 'username'
  keyword: string
  currentPageNumber?: number
  pageSize?: number
}

export type ExcelUserData = number | string | null

export interface AssignRolesData {
  id: number
  username: string
  assignedRoles: number[]
}


/**
 * Roles
 */
export interface Role {
  id: number
  roleName: string
  roleDescription: string
  roleState: boolean
}

export interface RoleQueryData {
  keyword: string
  currentPageNumber?: number
  pageSize?: number
}

export interface PermissionManagementAddRoleData {
  roleName: string
  roleDescription: string
}

export interface PermissionManagementEditRoleData {
  id: number
  roleName: string
  roleDescription: string
}


/**
 * UserRole
 */
export interface UserRole {
  userId: number
  roleId: number
}

export interface AssignRolesRequestData {
  userId: number
  roleIds: number[]
}
