<script lang="ts" setup>
import { ArrowRight, EditPen, Delete, Setting, User, Lock, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { $, $ref } from 'vue/macros'
import { createUser, getAllUsers } from '../../api'
import { useStore } from '../../stores'
import type { User as UserData, FormInstance, UserManagementAddUserData } from '../../types'
import type { AxiosResponse, AxiosError } from 'axios'


/**
 * Global Constants
 */
const mainStore = useStore()
const { currentUser } = $(storeToRefs(mainStore))
if (!currentUser) throw new Error('Please log in first')


/**
 * Header (Breadcrumb)
 */
const resetDefaultActiveMenuItem = () => void sessionStorage.removeItem('defaultActiveMenuItem')


/**
 * Main -> Top Query Form
 */
const searchData = $ref({
  role: '',
  origin: '',
  type: '',
  keyword: ''
})

const query = () => void undefined
const exportQueryResult = () => void undefined
const importUsers = () => void undefined


/**
 * Main -> Table
 */
let tableData = $ref<UserData[]>([])
const tableRowClassName = ({ row }: { row: UserData }): string => {
  if (row.id === currentUser.id) return 'current-user-row'
  return ''
}

getAllUsers()
  .then((response) => {
    tableData = response.data.data
    const currentUserIndex = tableData.findIndex(user => user.id === currentUser.id)
    const user = tableData.splice(currentUserIndex, 1)
    tableData.unshift(...user)
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
 * Main -> Bottom Pagination
 */
const currentPage4 = $ref<number>(4)
const pageSize4 = $ref<number>(100)


/**
 * Main -> Add User Dialog
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
          message: response.data.message || 'Success',
          center: true,
          showClose: true,
          duration: 3000
        })
        tableData.push(response.data.data)
        addUserDialogVisible = false
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
  if (value === null) {
    callback()
  } else if (!regex.test(value)) {
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

const usernameRegisterRules = $ref({
  username: { validator: validateUsername },
  email: { validator: validateEmail },
  password: { validator: validatePassword },
  confirmPassword: { validator: validateConfirmPassword }
})

const resetForm = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.resetFields()
  ElMessage.closeAll()
}
</script>

<template>
    <!-- S Breadcrumb -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>
            <a href="/admin" @click="resetDefaultActiveMenuItem">Home Page</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>User Management</el-breadcrumb-item>
        <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- E Breadcrumb -->

    <!-- S Main -->
    <el-card>
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
                <el-button type="primary" @click="importUsers">Import users</el-button>
            </div>
        </div>
        <!-- /Top bar -->

        <div class="table-row-indicators">
            <el-tag color="#e1f3d8" size="large" type="success">Current User (You)</el-tag>
        </div>

        <el-table :data="tableData"
                  :row-class-name="tableRowClassName"
                  border
                  stripe
        >
            <el-table-column type="index"/>
            <el-table-column label="Username" prop="username"/>
            <el-table-column label="E-mail" prop="email"/>
            <el-table-column label="Role" prop="role"/>
            <el-table-column label="State">
                <template #default="{ row }">
                    <el-switch v-model="row.userState" active-color="#13ce66" inactive-color="#ff4949"/>
                </template>
            </el-table-column>
            <el-table-column label="Actions">
                <template #default="{ row }">
                    <el-button :icon="EditPen" type="primary"/>
                    <el-button :icon="Setting" type="warning"/>
                    <el-button v-if="row.id !== currentUser.id" :icon="Delete" type="danger"/>
                </template>
            </el-table-column>
        </el-table>
        <!-- /Main table -->

        <el-pagination v-model:currentPage="currentPage4"
                       v-model:page-size="pageSize4"
                       :page-sizes="[100, 200, 300, 400]"
                       :total="400"
                       layout="->, total, sizes, prev, pager, next, jumper"
        />
        <!-- /Bottom pagination -->
    </el-card>
    <!-- E Main -->

    <!-- S Add user dialog -->
    <el-dialog v-model="addUserDialogVisible"
               custom-class="user-management-add-user-dialog"
               title="Add User"
               @close="resetForm(addUserFormRef)"
    >
        <el-form ref="addUserFormRef"
                 :model="addUserData"
                 :rules="usernameRegisterRules"
                 class="username-register-form"
        >
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
.el-breadcrumb {
    margin-bottom: 20px;
}

.el-card {
    min-width: 520px;

    .main-top {
        display: flex;
        justify-content: space-between;

        .main-top-right {
            display: flex;
        }
    }

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
}
</style>

<style lang="scss">
.user-management-add-user-dialog {
    min-width: 630px;
}
</style>
