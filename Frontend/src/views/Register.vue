<script setup lang="ts">

</script>

<template>
    <div class="register-container">
        <div class="register-wrapper">
            <h1>欢迎注册</h1>
            <el-tabs tab-position="left" style="height: 200px" class="demo-tabs">
                <el-tab-pane label="Username">User</el-tab-pane>
                <el-tab-pane label="E-mail">Config</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style scoped lang="scss">
.register-container {
    width: 100%;
    height: 100%;
    background: url('/src/assets/bg.jpg') center center / cover no-repeat;

    .register-wrapper {
        width: 500px;
        height: 300px;
        background: #fff;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        h1 {
            text-align: center;
        }

        .demo-tabs {
            & > .el-tabs__content {
                padding: 32px;
                background-color: #f4f5f7;
                color: #6b778c;
                font-size: 32px;
                font-weight: 600;
            }
        }

        .el-tabs--right .el-tabs__content,
        .el-tabs--left .el-tabs__content {
            height: 100%;
        }
    }
}
</style>
