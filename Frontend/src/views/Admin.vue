<script lang="ts" setup>

</script>

<template>
    <el-container>
        <el-header>
            <div class="header-left"></div>
            <div class="header-right">
                <img src="/src/assets/images/avatar.jpg" alt="avatar">
                <p>Aelita</p>
                <el-button>Log out</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.el-container {
    width: 100%;
    height: 100%;
    background: #ccc;

    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: deepskyblue;

        .header-left {
            width: 136px;
            height: 100px;
            background: url('/src/assets/images/logo.png') center center / cover no-repeat;
        }

        .header-right {
            display: flex;
            align-items: center;

            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
            }

            p {
                margin: 0 20px 0 10px;
            }
        }
    }

    .el-aside {
        background: #fff;
    }
}
</style>
