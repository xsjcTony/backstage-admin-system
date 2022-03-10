<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'


/**
 * Header (Breadcrumb)
 */
const resetDefaultActiveMenuItem = () => void sessionStorage.removeItem('defaultActiveMenuItem')


/**
 * Main -> Top
 */
const searchData = ref({
  role: '',
  origin: '',
  type: '',
  keyword: ''
})

const query = () => void undefined
const exportQueryResult = () => void undefined
const addUser = () => void undefined
const importUsers = () => void undefined


/**
 * Main -> Table
 */
const tableData = [
  {
    username: 'jonathan',
    email: '97606813@qq.com',
    role: 'Administrator',
    avatarURL: '',
    userState: true
  },
  {
    username: 'it666',
    email: '97606814@qq.com',
    role: 'User',
    avatarURL: '',
    userState: false
  }
]
</script>

<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>
            <a href="/admin" @click="resetDefaultActiveMenuItem">Home Page</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>User Management</el-breadcrumb-item>
        <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <!-- Top bar -->
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

        <!-- Main table -->
        <el-table :data="tableData" border stripe>
            <el-table-column type="index"/>
            <el-table-column prop="username" label="Username"/>
            <el-table-column prop="email" label="E-mail"/>
            <el-table-column prop="role" label="Role"/>
            <el-table-column label="Status"/>
            <el-table-column label="Actions"/>
        </el-table>
    </el-card>
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
}
</style>
