<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { $ref } from 'vue/macros'
import UsersQuery from './Users/UsersQuery.vue'
import UsersTable from './Users/UsersTable.vue'
import type { User } from '../../types'


/**
 * Header (Breadcrumb)
 */
const resetDefaultActiveMenuItem = () => void sessionStorage.removeItem('defaultActiveMenuItem')


/**
 * Table
 */
const tableData = $ref<User[]>([])
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
        <UsersQuery v-model:table-data="tableData"/>
        <!-- /Top bar -->

        <UsersTable v-model:table-data="tableData"/>
        <!-- /Main table -->
    </el-card>
    <!-- E Main -->
</template>

<style lang="scss" scoped>
.el-breadcrumb {
    margin-bottom: 20px;
}

.el-card {
    min-width: 700px;
}
</style>
