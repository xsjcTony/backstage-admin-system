<script lang="ts" setup>
import { ArrowRight, EditPen, Setting, Delete, WarningFilled } from '@element-plus/icons-vue'
import { AxiosError, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { $, $ref } from 'vue/macros'
import type {
  Role,
  RoleQueryData,
  FormInstance,
  PermissionManagementAddRoleData,
  PermissionManagementEditRoleData
} from '../../types'


/**
 * Header (Breadcrumb)
 */
const emit = defineEmits<(e: 'resetDefaultActiveMenuItem') => void>()


/**
 * Query
 */
const queryData = $ref<RoleQueryData>({
  keyword: '',
  currentPageNumber: 1,
  pageSize: parseInt(sessionStorage.getItem('roleTablePageSize') ?? '5') || 5
})

const queryRoles = async (queryData: RoleQueryData): Promise<void> => {
  /* try {
    const response = await getUsersByQuery(queryData)

    const users: UserData[] = response.data.data.rows
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totalUserCounts = response.data.data.count
    tableData = users
  } catch (err) {
    ElMessage.error({
      message: (err as AxiosError).response?.data.msg || (err instanceof Error ? err.message : 'Error'),
      center: true,
      showClose: true,
      duration: 2000
    })
  } */
}

const query = () => void undefined

const refreshRoles = async (): Promise<void> => {
  queryData.keyword = ''

  if (queryData.currentPageNumber !== 1) {
    queryData.currentPageNumber = 1
  } else {
    await queryRoles(queryData)
  }

  ElMessage.success({
    message: 'Refresh success',
    center: true,
    showClose: true,
    duration: 2000
  })
}


/**
 * Add Role
 */
let addRoleDialogVisible = $ref<boolean>(false)
const addRoleFormRef = $ref<FormInstance | null>(null)
const addRoleData = $ref<PermissionManagementAddRoleData>({
  roleName: '',
  description: ''
})

const addRole = async (formEl: FormInstance | undefined): Promise<void> => {
  /*
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
        tableData.push(response.data.data)
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
  */
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

const addRoleRules = $ref({
  username: { validator: validateUsername },
  email: { validator: validateEmail }
})

const resetForm = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.resetFields()
}


/**
 * Table
 */
const tableData = $ref<Role[]>([])


/**
 * Pagination
 */
let totalRoleCounts = $ref<number>(0)

watch(() => queryData.currentPageNumber, async (newValue, oldValue) => {
  await queryRoles(queryData)
})
watch(() => queryData.pageSize, async (newValue, oldValue) => {
  sessionStorage.setItem('roleTablePageSize', newValue?.toString() ?? '5')

  if (queryData.currentPageNumber !== 1) {
    queryData.currentPageNumber = 1
  } else {
    await queryRoles(queryData)
  }
})


/**
 * Edit Role
 */
let editRoleDialogVisible = $ref<boolean>(false)
const editRoleFormRef = $ref<FormInstance | null>(null)
const editRoleData = $ref<PermissionManagementEditRoleData>({
  id: 0,
  roleName: '',
  description: ''
})

const editRole = async (formEl: FormInstance | undefined): Promise<void> => {
  /*
  if (!formEl) return
  if (!editRoleData.id) return

  const id = editRoleData.id

  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const response: AxiosResponse = await updateUser(id, editRoleData)

        ElMessage.success({
          message: response.data.msg || 'Success',
          center: true,
          showClose: true,
          duration: 3000
        })

        const newUser = response.data.data
        tableData[tableData.findIndex(user => user.id === id)] = newUser
        if (id === currentUser?.id) {
          currentUser = newUser
        }

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
  */
}

// Validation
const editRoleRules = $ref({
  username: { validator: validateUsername },
  email: { validator: validateEmail }
})

const showEditRoleDialog = (role: Role): void => {
  editRoleDialogVisible = true
  editRoleData.id = role.id
  editRoleData.roleName = role.roleName
  editRoleData.description = role.description
}


/**
 * Change Role State
 */
const changeRoleState = async (role: Role): Promise<void> => {
  /*
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
  */
}


/**
 * Delete Role
 */
const deleteRole = async (id: number): Promise<void> => {
  /*
  try {
    const response: AxiosResponse = await destroyUser(id)

    ElMessage.success({
      message: response.data.msg || 'Success',
      center: true,
      showClose: true,
      duration: 3000
    })

    tableData.splice(tableData.findIndex(user => user.id === id), 1)
  } catch (err) {
    ElMessage.error({
      message: (err as AxiosError).response?.data.msg || (err instanceof Error ? err.message : 'Error'),
      center: true,
      showClose: true,
      duration: 3000
    })
  }
  */
}
</script>

<template>
    <!-- S Breadcrumb -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>
            <a href="/admin" @click="emit('resetDefaultActiveMenuItem')">Home Page</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>Permission Management</el-breadcrumb-item>
        <el-breadcrumb-item>Role List</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- E Breadcrumb -->

    <!-- S Main -->
    <el-card>
        <div class="query-form">
            <el-input v-model="queryData.keyword"
                      clearable
                      placeholder="Keyword"
                      type="text"
            />
            <el-button type="primary" @click="query">Query</el-button>
            <el-button type="primary" @click="addRoleDialogVisible = true">Add Role</el-button>
            <el-button color="#ffc0cb" class="refresh-button" @click="refreshRoles">Clear query conditions and Refresh</el-button>
        </div>
        <!-- /Top bar -->

        <el-table :data="tableData" border stripe>
            <el-table-column type="index"/>
            <el-table-column label="Role" min-width="150" prop="role"/>
            <el-table-column label="Description" min-width="250" prop="name"/>
            <el-table-column label="State" width="100">
                <template #default="{ row }">
                    <el-switch v-model="row.userState"
                               active-color="#13ce66"
                               inactive-color="#ff4949"
                               @change="changeRoleState(row)"
                    />
                </template>
            </el-table-column>
            <el-table-column label="Actions" width="200">
                <template #default="{ row }">
                    <el-button :icon="EditPen" type="primary" @click="showEditRoleDialog(row)"/>
                    <el-button :icon="Setting" type="warning"/>
                    <el-popconfirm :icon="WarningFilled"
                                   cancel-button-text="Cancel"
                                   confirm-button-text="Delete"
                                   confirm-button-type="danger"
                                   icon-color="#f00"
                                   title="Are you sure to delete this role?"
                                   @confirm="deleteRole(row.id)"
                    >
                        <template #reference>
                            <el-button :icon="Delete" type="danger"/>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- /Main table -->

        <el-pagination v-model:currentPage="queryData.currentPageNumber"
                       v-model:page-size="queryData.pageSize"
                       :page-sizes="[5, 10, 15, 20]"
                       :total="totalRoleCounts"
                       layout="->, total, sizes, prev, pager, next, jumper"
        />
        <!-- /Pagination -->
    </el-card>
    <!-- E Main -->

    <!-- S Add role dialog -->
    <el-dialog v-model="addRoleDialogVisible"
               custom-class="permission-management-add-role-dialog"
               title="Add User"
               @close="resetForm(addRoleFormRef)"
    >
        <el-form ref="addRoleFormRef" :model="addRoleData" :rules="addRoleRules">
            <el-form-item class="username" prop="username" required>
                <el-input v-model="addRoleData.username"
                          :prefix-icon="User"
                          clearable
                          maxlength="20"
                          placeholder="Username"
                          show-word-limit
                          type="text"
                />
            </el-form-item>
            <el-form-item class="email" prop="email">
                <el-input v-model="addRoleData.email"
                          :prefix-icon="Message"
                          clearable
                          placeholder="E-mail (Optional)"
                          type="text"
                />
            </el-form-item>
        </el-form>
        <!-- /Add user form -->

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="resetForm(addRoleFormRef)">Reset Form</el-button>
                <el-button @click="addRoleDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addRole(addRoleFormRef)">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- E Add user dialog -->

    <!-- S Edit Role dialog -->
    <el-dialog v-model="editRoleDialogVisible"
               custom-class="permission-management-edit-role-dialog"
               title="Edit User"
    >
        <el-form ref="editRoleFormRef" :model="editRoleData" :rules="editRoleRules">
            <el-form-item class="username" prop="username" required>
                <el-input v-model="editRoleData.username"
                          :prefix-icon="User"
                          clearable
                          maxlength="20"
                          placeholder="Username"
                          show-word-limit
                          type="text"
                />
            </el-form-item>
            <el-form-item class="email" prop="email">
                <el-input v-model="editRoleData.email"
                          :prefix-icon="Message"
                          clearable
                          placeholder="E-mail (Optional)"
                          type="text"
                />
            </el-form-item>
        </el-form>
        <!-- /Add user form -->

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="editRole(editRoleFormRef)">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- E Edit Role dialog -->
</template>

<style lang="scss" scoped>
.el-breadcrumb {
    margin-bottom: 20px;
}

.el-card {
    min-width: 700px;

    .query-form {
        display: flex;

        .el-input {
            margin-right: 20px;
        }

        .refresh-button {
            color: #fff;
        }
    }

    .el-table {
        margin: 30px 0;
    }
}
</style>

<style lang="scss">
.permission-management-add-role-dialog,
.permission-management-edit-role-dialog {
    min-width: 630px;
}
</style>
