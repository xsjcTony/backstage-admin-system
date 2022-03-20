<script lang="ts" setup>
import {
  User,
  Message,
  Lock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Awaitable } from 'element-plus/es/utils'
import { storeToRefs } from 'pinia'
import { defineProps, defineEmits } from 'vue'
import { $, $ref } from 'vue/macros'
import { createUser } from '../../../api'
import { useStore } from '../../../stores'
import type {
  FormInstance,
  UserManagementAddUserData,
  User as UserData,
  ImportUsersResponseData
} from '../../../types'
import type { AxiosError, AxiosResponse } from 'axios'
import type { UploadFile, UploadRawFile } from 'element-plus'


/**
 * Global Constants
 */
const mainStore = useStore()
const { apiBaseUrl } = $(storeToRefs(mainStore))
const jwt = localStorage.getItem('token') ?? ''


/**
 * Props
 */
const props = defineProps<{ tableData: UserData[] }>()


/**
 * Emits
 */
const emit = defineEmits<(e: 'update:tableData', value: UserData[]) => void>()


/**
 * Query
 */
const searchData = $ref({
  role: '',
  origin: '',
  type: '',
  keyword: ''
})

const query = () => void undefined
const exportQueryResult = () => void undefined


/**
 * Add User
 */
let addUserDialogVisible = $ref<boolean>(false)
const addUserFormRef = $ref<FormInstance | null>(null)
const addUserData = $ref<UserManagementAddUserData>({
  username: '',
  email: null,
  password: '',
  confirmPassword: ''
})

const addUser = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const response: AxiosResponse = await createUser(addUserData)

        ElMessage.success({
          message: response.data.msg || 'Success',
          center: true,
          showClose: true,
          duration: 3000
        })

        addUserDialogVisible = false
        emit('update:tableData', [...props.tableData, response.data.data])
      } catch (err) {
        ElMessage.error({
          message: (err as AxiosError).response?.data.msg || (err instanceof Error ? err.message : 'Error'),
          center: true,
          showClose: true,
          duration: 3000
        })
      }
    } else {
      ElMessage.error({
        message: 'Invalid user data',
        center: true,
        showClose: true,
        duration: 3000
      })
    }
  })
}

// Validation
const validateUsername = (rule: any, value: string, callback: any): void => {
  const regex = /^[A-Za-z0-9]{6,20}$/
  if (value === '') {
    callback(new Error('Please input the username'))
  } else if (!regex.test(value)) {
    callback(new Error('Username must be any of a-z, A-Z or 0-9, and between 6 and 20 (both inclusive) characters long'))
  } else {
    callback()
  }
}
const validateEmail = (rule: any, value: string | null, callback: any): void => {
  const regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (value && !regex.test(value)) {
    callback(new Error('Invalid email address'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: string, callback: any): void => {
  const regex = /^((?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,.#%'+*\-:;^_`].*))[,.#%'+*\-:;^_`0-9A-Za-z]{8,20}$/
  if (value === '') {
    callback(new Error('Please input the password'))
  } else if (!regex.test(value)) {
    callback(new Error('Password must include characters, numbers, symbols, and between 8 and 20 (both inclusive) characters long.'))
  } else {
    if (addUserData.confirmPassword !== '') {
      if (!addUserFormRef) return
      void addUserFormRef.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validateConfirmPassword = (rule: any, value: string, callback: any): void => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== addUserData.password) {
    callback(new Error('Password doesn\'t match'))
  } else {
    callback()
  }
}

const addUserRules = $ref({
  username: { validator: validateUsername },
  email: { validator: validateEmail },
  password: { validator: validatePassword },
  confirmPassword: { validator: validateConfirmPassword }
})

const resetForm = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.resetFields()
}


/**
 * Import Users
 */
const importUsersSuccess = (response: ImportUsersResponseData, file: UploadFile): void => {
  if (response.code === 200) {
    emit('update:tableData', [...props.tableData, ...response.data])

    ElMessage.success({
      message: typeof response.msg === 'string' ? response.msg : 'Users have been imported',
      center: true,
      showClose: true,
      duration: 3000
    })
  }
}
const beforeSheetUpload = (file: UploadRawFile): Awaitable<Blob | File | boolean | null | undefined> => {
  const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  const isLt500KB = file.size / 1024 <= 500 // <= 500kb

  if (!isXLSX) {
    ElMessage.error({
      message: 'User data must be ".xlsx" file',
      center: true,
      showClose: true,
      duration: 5000
    })
  }
  if (!isLt500KB) {
    ElMessage.error({
      message: 'File size can not exceed 500kb',
      center: true,
      showClose: true,
      duration: 5000
    })
  }

  return isXLSX && isLt500KB
}
const importUsersFailed = (err: string): void => {
  ElMessage.error({
    message: err,
    center: true,
    showClose: true,
    duration: 5000
  })
}
</script>

<template>
    <div class="main-top">
        <el-form :model="searchData" class="demo-form-inline" inline>
            <el-form-item>
                <el-select v-model="searchData.role" clearable placeholder="- All roles -">
                    <el-option label="Administrator" value="administrator"/>
                    <el-option label="User" value="user"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchData.origin" clearable placeholder="- All origins -">
                    <el-option label="Local registered" value="local"/>
                    <el-option label="GitHub OAuth" value="github"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchData.type" clearable placeholder="- All Types -">
                    <el-option label="Username" value="username"/>
                    <el-option label="E-mail" value="email"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchData.keyword"
                          clearable
                          placeholder="Keyword"
                          type="text"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">Query</el-button>
                <el-button type="primary" @click="exportQueryResult">Export query result</el-button>
            </el-form-item>
        </el-form>
        <div class="main-top-right">
            <el-button type="primary" @click="addUserDialogVisible = true">Add user</el-button>
            <el-upload :action="`${ apiBaseUrl }/api/v1/users/import`"
                       :before-upload="beforeSheetUpload"
                       :headers="{ Authorization: jwt }"
                       :on-error="importUsersFailed"
                       :on-success="importUsersSuccess"
                       :show-file-list="false"
                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                       class="import-user-upload"
            >
                <el-tooltip content="&quot;.xlsx&quot; file no larger than 500kb"
                            placement="top-end"
                            trigger="hover"
                >
                    <el-button type="primary">Import users</el-button>
                </el-tooltip>
            </el-upload>
        </div>
    </div>

    <!-- S Add user dialog -->
    <el-dialog v-model="addUserDialogVisible"
               custom-class="user-management-add-user-dialog"
               title="Add User"
               @close="resetForm(addUserFormRef)"
    >
        <el-form ref="addUserFormRef" :model="addUserData" :rules="addUserRules">
            <el-form-item class="username" prop="username" required>
                <el-input v-model="addUserData.username"
                          :prefix-icon="User"
                          clearable
                          maxlength="20"
                          placeholder="Username"
                          show-word-limit
                          type="text"
                />
            </el-form-item>
            <el-form-item class="email" prop="email">
                <el-input :model-value="addUserData.email"
                          :prefix-icon="Message"
                          clearable
                          placeholder="E-mail (Optional)"
                          type="text"
                          @input="value => void (addUserData.email = value ? value : null)"
                />
            </el-form-item>
            <el-form-item class="password" prop="password" required>
                <el-input v-model="addUserData.password"
                          :prefix-icon="Lock"
                          autocomplete="off"
                          clearable
                          maxlength="20"
                          placeholder="Password"
                          show-password
                          type="password"
                />
            </el-form-item>
            <el-form-item prop="confirmPassword" required>
                <el-input v-model="addUserData.confirmPassword"
                          :prefix-icon="Lock"
                          autocomplete="off"
                          clearable
                          maxlength="20"
                          placeholder="Confirm password"
                          show-password
                          type="password"
                />
            </el-form-item>
        </el-form>
        <!-- /Add user form -->

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="resetForm(addUserFormRef)">Reset Form</el-button>
                <el-button @click="addUserDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addUser(addUserFormRef)">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- E Add user dialog -->
</template>

<style lang="scss" scoped>
.main-top {
    display: flex;
    justify-content: space-between;

    .main-top-right {
        display: flex;

        .import-user-upload {
            margin-left: 12px;
        }
    }
}
</style>

<style lang="scss">
.user-management-add-user-dialog {
    min-width: 630px;
}
</style>
