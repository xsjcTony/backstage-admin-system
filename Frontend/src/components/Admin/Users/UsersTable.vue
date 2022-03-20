<script lang="ts" setup>
import {
  EditPen,
  Delete,
  Setting,
  User,
  Lock,
  Message,
  InfoFilled,
  Plus
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { defineProps, defineEmits } from 'vue'
import { $, $ref } from 'vue/macros'
import {
  deleteUser as destroyUser,
  getAllUsers,
  updateUser,
  updateUserState
} from '../../../api'
import { useStore } from '../../../stores'
import type {
  FormInstance,
  StringResponseData,
  User as UserData,
  UserManagementEditUserData
} from '../../../types'
import type { AxiosError, AxiosResponse } from 'axios'
import type { UploadFile, UploadRawFile } from 'element-plus'
import type { Awaitable } from 'element-plus/es/utils'


/**
 * Global Constants
 */
const mainStore = useStore()
let { currentUser, assetBaseUrl, apiBaseUrl } = $(storeToRefs(mainStore))
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
 * Table
 */
const tableRowClassName = ({ row }: { row: UserData }): string => {
  if (row.id === currentUser?.id) return 'current-user-row'
  return ''
}

getAllUsers()
  .then((response) => {
    const users: UserData[] = response.data.data
    const currentUserIndex = users.findIndex(user => user.id === (currentUser?.id ?? -1))
    if (currentUserIndex !== -1) {
      const user = users.splice(currentUserIndex, 1)
      users.unshift(currentUser ?? user[0])
    }

    emit('update:tableData', users)
  })
  .catch((err) => {
    ElMessage.error({
      message: (err as AxiosError).response?.data.msg || (err instanceof Error ? err.message : 'Error'),
      center: true,
      showClose: true,
      duration: 5000
    })
  })


/**
 * Pagination
 */
const currentPage4 = $ref<number>(4)
const pageSize4 = $ref<number>(100)


/**
 * Edit User
 */
let editUserDialogVisible = $ref<boolean>(false)
const editUserFormRef = $ref<FormInstance | null>(null)
const editUserData = $ref<UserManagementEditUserData>({
  id: -1,
  username: '',
  email: null,
  password: undefined,
  confirmPassword: undefined,
  avatarUrl: '/public/assets/images/avatars/avatar.jpg'
})

const showEditUserDialog = (user: UserData): void => {
  editUserDialogVisible = true
  editUserData.id = user.id
  editUserData.username = user.username ?? ''
  editUserData.email = user.email
  editUserData.password = undefined
  editUserData.confirmPassword = undefined
  editUserData.avatarUrl = user.avatarUrl
}

const editUser = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return
  if (!editUserData.id) return

  const id = editUserData.id

  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const response: AxiosResponse = await updateUser(id, editUserData)

        ElMessage.success({
          message: response.data.msg || 'Success',
          center: true,
          showClose: true,
          duration: 3000
        })

        const newUser = response.data.data
        const tableData = props.tableData
        tableData[tableData.findIndex(user => user.id === id)] = newUser
        if (id === currentUser?.id) {
          currentUser = newUser
        }

        emit('update:tableData', tableData)
        editUserDialogVisible = false
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
const validateEditUserPassword = (rule: any, value: string | undefined, callback: any): void => {
  const regex = /^((?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,.#%'+*\-:;^_`].*))[,.#%'+*\-:;^_`0-9A-Za-z]{8,20}$/
  if (value && !regex.test(value)) {
    callback(new Error('Password must include characters, numbers, symbols, and between 8 and 20 (both inclusive) characters long.'))
  } else {
    if (editUserData.confirmPassword !== '') {
      if (!editUserFormRef) return
      void editUserFormRef.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validateEditUserConfirmPassword = (rule: any, value: string | undefined, callback: any): void => {
  if (value && value !== editUserData.password) {
    callback(new Error('Password doesn\'t match'))
  } else {
    callback()
  }
}

const editUserRules = $ref({
  username: { validator: validateUsername },
  email: { validator: validateEmail },
  password: { validator: validateEditUserPassword },
  confirmPassword: { validator: validateEditUserConfirmPassword }
})

// Avatar
const handleAvatarSuccess = (response: StringResponseData, file: UploadFile): void => {
  if (response.code === 200) {
    editUserData.avatarUrl = response.data
    ElMessage.success({
      message: typeof response.msg === 'string' ? response.msg : 'Avatar has been uploaded',
      center: true,
      showClose: true,
      duration: 3000
    })
  } else {
    ElMessage.error({
      message: typeof response.msg === 'string' ? response.msg : 'Error',
      center: true,
      showClose: true,
      duration: 5000
    })
  }
}
const beforeAvatarUpload = (file: UploadRawFile): Awaitable<Blob | File | boolean | null | undefined> => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error({
      message: 'Avatar picture must be "image/jpeg" format',
      center: true,
      showClose: true,
      duration: 5000
    })
  }
  if (!isLt2M) {
    ElMessage.error({
      message: 'Avatar picture size can not exceed 2MB',
      center: true,
      showClose: true,
      duration: 5000
    })
  }

  return isJPG && isLt2M
}

// User State
const changeUserState = async (user: UserData): Promise<void> => {
  let { id, userState } = $(user)

  try {
    await updateUserState(id, userState)

    ElMessage.success({
      message: 'User state has been updated',
      center: true,
      showClose: true,
      duration: 2000
    })
  } catch (err) {
    ElMessage.error({
      message: (err as AxiosError).response?.data.msg || (err instanceof Error ? err.message : 'Error'),
      center: true,
      showClose: true,
      duration: 3000
    })

    userState = !userState
  }
}


/**
 * Delete User
 */
const deleteUser = async (id: number): Promise<void> => {
  try {
    const response: AxiosResponse = await destroyUser(id)

    ElMessage.success({
      message: response.data.msg || 'Success',
      center: true,
      showClose: true,
      duration: 3000
    })

    const tableData = props.tableData
    tableData.splice(tableData.findIndex(user => user.id === id), 1)
    emit('update:tableData', tableData)
  } catch (err) {
    ElMessage.error({
      message: (err as AxiosError).response?.data.msg || (err instanceof Error ? err.message : 'Error'),
      center: true,
      showClose: true,
      duration: 3000
    })
  }
}
</script>

<template>
    <div class="table-row-indicators">
        <el-tag color="#e1f3d8" size="large" type="success">You</el-tag>
    </div>

    <!-- S Table -->
    <el-table :data="tableData"
              :row-class-name="tableRowClassName"
              border
              stripe
    >
        <el-table-column type="index"/>
        <el-table-column label="Username" min-width="200" prop="username"/>
        <el-table-column label="E-mail" min-width="250" prop="email"/>
        <el-table-column label="Role" min-width="150" prop="role"/>
        <el-table-column label="State" width="100">
            <template #default="{ row }">
                <el-switch v-if="row.id !== currentUser.id"
                           v-model="row.userState"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           @change="changeUserState(row)"
                />
            </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
            <template #default="{ row }">
                <el-button :icon="EditPen" type="primary" @click="showEditUserDialog(row)"/>
                <el-button :icon="Setting" type="warning"/>
                <el-popconfirm v-if="row.id !== currentUser.id"
                               :icon="InfoFilled"
                               cancel-button-text="Cancel"
                               confirm-button-text="Delete"
                               confirm-button-type="danger"
                               icon-color="#f00"
                               title="Are you sure to delete this user?"
                               @confirm="deleteUser(row.id)"
                >
                    <template #reference>
                        <el-button :icon="Delete" type="danger"/>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!-- E Table -->

    <!-- S Pagination -->
    <el-pagination v-model:currentPage="currentPage4"
                   v-model:page-size="pageSize4"
                   :page-sizes="[100, 200, 300, 400]"
                   :total="400"
                   layout="->, total, sizes, prev, pager, next, jumper"
    />
    <!-- E Pagination -->

    <!-- S Edit user dialog -->
    <el-dialog v-model="editUserDialogVisible"
               custom-class="user-management-edit-user-dialog"
               title="Edit User"
    >
        <el-form ref="editUserFormRef"
                 :model="editUserData"
                 :rules="editUserRules"
                 label-position="top"
        >
            <el-form-item class="username" prop="username" required>
                <el-input v-model="editUserData.username"
                          :prefix-icon="User"
                          clearable
                          maxlength="20"
                          placeholder="Username"
                          show-word-limit
                          type="text"
                />
            </el-form-item>
            <el-form-item class="email" prop="email">
                <el-input :model-value="editUserData.email"
                          :prefix-icon="Message"
                          clearable
                          placeholder="E-mail (Optional)"
                          type="text"
                          @input="value => void (editUserData.email = value ? value : null)"
                />
            </el-form-item>
            <el-form-item class="password" prop="password">
                <el-input :model-value="editUserData.password"
                          :prefix-icon="Lock"
                          autocomplete="off"
                          clearable
                          maxlength="20"
                          placeholder="Password (Leave blank if no change)"
                          show-password
                          type="password"
                          @input="value => void (editUserData.password = value ? value : undefined)"
                />
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input :model-value="editUserData.confirmPassword"
                          :prefix-icon="Lock"
                          autocomplete="off"
                          clearable
                          maxlength="20"
                          placeholder="Confirm password (Leave blank if no change)"
                          show-password
                          type="password"
                          @input="value => void (editUserData.confirmPassword = value ? value : undefined)"
                />
            </el-form-item>
            <el-form-item label="Avatar">
                <el-upload :action="`${ apiBaseUrl }/api/v1/users/avatar`"
                           :before-upload="beforeAvatarUpload"
                           :headers="{ Authorization: jwt }"
                           :on-success="handleAvatarSuccess"
                           :show-file-list="false"
                           accept="image/jpeg"
                           class="avatar-uploader"
                >
                    <img v-if="editUserData.avatarUrl"
                         :src="`${ assetBaseUrl }${ editUserData.avatarUrl }`"
                         alt
                         class="avatar"
                    >
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus/>
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- /Add user form -->

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editUserDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="editUser(editUserFormRef)">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- E Edit user dialog -->
</template>

<style lang="scss" scoped>
.table-row-indicators {
    margin-top: 2px;
    padding-top: 20px;
    border-top: 1px solid #cccccc80;
}

.el-table {
    margin: 20px 0 30px;

    :deep(.current-user-row) {
        background: #e1f3d8;
    }
}

.avatar-uploader {
    :deep(.el-upload) {
        position: relative;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        transition: var(--el-transition-duration-fast);

        &:hover {
            border-color: var(--el-color-primary);
        }
    }

    .avatar-uploader-icon {
        width: 178px;
        height: 178px;
        color: #8c939d;
        font-size: 28px;
        text-align: center;
    }

    .avatar {
        display: block;
        width: 178px;
        height: 178px;
    }
}
</style>

<style lang="scss">
.user-management-edit-user-dialog {
    min-width: 630px;
}
</style>
