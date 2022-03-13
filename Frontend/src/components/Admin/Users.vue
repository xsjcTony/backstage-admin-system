<script lang="ts" setup>
import { ArrowRight, EditPen, Delete, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { $ref } from 'vue/macros'
import { getAllUsers } from '../../api'
import type { UserData } from '../../types'


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
const addUser = () => void (addUserDialogVisible = true)
const importUsers = () => void undefined


/**
 * Main -> Table
 */
let tableData = $ref<UserData[]>([])
getAllUsers()
  .then(response => void (tableData = response.data.data))
  .catch((err) => {
    ElMessage.error({
      message: err instanceof Error ? err.message : 'Error',
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
const addUserForm = $ref({
  name: ''
})
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
            <el-form inline :model="searchData" class="demo-form-inline">
                <el-form-item>
                    <el-select v-model="searchData.role" placeholder="- All roles -" clearable>
                        <el-option label="Administrator" value="administrator"/>
                        <el-option label="User" value="user"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchData.origin" placeholder="- All origins -" clearable>
                        <el-option label="Local registered" value="local"/>
                        <el-option label="GitHub OAuth" value="github"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchData.type" placeholder="- All Types -" clearable>
                        <el-option label="Username" value="username"/>
                        <el-option label="E-mail" value="email"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchData.keyword"
                              placeholder="Keyword"
                              type="text"
                              clearable
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query">Query</el-button>
                    <el-button type="primary" @click="exportQueryResult">Export query result</el-button>
                </el-form-item>
            </el-form>
            <div class="main-top-right">
                <el-button type="primary" @click="addUser">Add user</el-button>
                <el-button type="primary" @click="importUsers">Import users</el-button>
            </div>
        </div>
        <!-- /Top bar -->

        <el-table :data="tableData" border stripe>
            <el-table-column type="index"/>
            <el-table-column prop="username" label="Username"/>
            <el-table-column prop="email" label="E-mail"/>
            <el-table-column prop="role" label="Role"/>
            <el-table-column label="State">
                <template #default="{ row }">
                    <el-switch v-model="row.userState" active-color="#13ce66" inactive-color="#ff4949"/>
                </template>
            </el-table-column>
            <el-table-column label="Actions">
                <template #default="{ row }">
                    <el-button type="primary" :icon="EditPen"/>
                    <el-button type="danger" :icon="Delete"/>
                    <el-button type="warning" :icon="Setting"/>
                </template>
            </el-table-column>
        </el-table>
        <!-- /Main table -->

        <el-pagination v-model:currentPage="currentPage4"
                       v-model:page-size="pageSize4"
                       :page-sizes="[100, 200, 300, 400]"
                       layout="->, total, sizes, prev, pager, next, jumper"
                       :total="400"
        />
        <!-- /Bottom pagination -->
    </el-card>
    <!-- E Main -->

    <!-- S Add user dialog -->
    <el-dialog v-model="addUserDialogVisible" title="Shipping address">
        <el-form :model="addUserForm">
            <el-form-item label="Promotion name">
                <el-input v-model="addUserForm.name" autocomplete="off"/>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addUserDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addUserDialogVisible = false">Confirm</el-button>
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

    .el-table {
        margin: 20px 0 30px;
    }
}
</style>
