<script lang="ts" setup>
import { Collection, Setting, Unlock, User, View } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useStore } from '../stores'
import { useAdminStore } from '../stores/admin'


/**
 * Global Constants
 */
const mainStore = useStore()
const adminStore = useAdminStore()
const router = useRouter()


/**
 * Header
 */
const logout = async (): Promise<void> => {
  localStorage.removeItem('token')
  mainStore.loggedIn = false
  await router.push('/login')
}

const toggleMenuCollapse = (): void => {
  menuCollapsed.value = !menuCollapsed.value
}


/**
 * Aside
 */
const { menuCollapsed } = storeToRefs(adminStore)


/**
 * Main
 */
</script>

<template>
    <el-container>
        <el-header>
            <div class="header-left" @click="toggleMenuCollapse"></div>
            <div class="header-right">
                <img alt="avatar" src="/src/assets/images/avatar.jpg">
                <p>Aelita</p>
                <el-button @click="logout">Log out</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="menuCollapsed ? '64px' : '250px'">
                <el-menu :collapse="menuCollapsed"
                         :collapse-transition="false"
                         class="el-menu-vertical-demo"
                         default-active="users"
                         router
                >
                    <el-sub-menu index="user-management">
                        <template #title>
                            <el-icon>
                                <Setting/>
                            </el-icon>
                            <span>User Management</span>
                        </template>
                        <el-menu-item index="users">
                            <template #title>
                                <el-icon>
                                    <User/>
                                </el-icon>
                                <span>User List</span>
                            </template>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="permission-management">
                        <template #title>
                            <el-icon>
                                <Collection/>
                            </el-icon>
                            <span>Permission Management</span>
                        </template>
                        <el-menu-item index="roles">
                            <template #title>
                                <el-icon>
                                    <View/>
                                </el-icon>
                                <span>Role List</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="permissions">
                            <template #title>
                                <el-icon>
                                    <Unlock/>
                                </el-icon>
                                <span>Permission List</span>
                            </template>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.el-container {
    width: 100%;
    height: 100%;
    background: #e9eef3;

    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: deepskyblue;

        .header-left {
            width: 136px;
            height: 100px;
            background: url('/src/assets/images/logo.png') center center / cover no-repeat;
            cursor: pointer;
        }

        .header-right {
            display: flex;
            align-items: center;

            img {
                overflow: hidden;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid #fff;
            }

            p {
                margin: 0 20px 0 10px;
                font-weight: 700;
            }
        }
    }

    .el-aside {
        background: #fff;
    }
}
</style>
