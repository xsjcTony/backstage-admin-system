<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'


/**
 * Header (Breadcrumb)
 */
const resetDefaultActiveMenuItem = (): void => {
  sessionStorage.removeItem('defaultActiveMenuItem')
}
</script>

<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>
            <a href="/admin" @click="resetDefaultActiveMenuItem">Home Page</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>User Management</el-breadcrumb-item>
        <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        card
    </el-card>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
    margin-bottom: 20px;
}
</style>
