<script setup lang="ts">
import UsernameRegisterForm from '../components/Register/UsernameRegisterForm.vue'
</script>

<template>
    <div class="register-container">
        <div class="register-wrapper">
            <h1>Register</h1>
            <el-tabs tab-position="left" class="register-tab">
                <el-tab-pane label="Username">
                    <UsernameRegisterForm/>
                </el-tab-pane>
                <el-tab-pane label="E-mail">Config</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style scoped lang="scss">
.register-container {
    width: 100%;
    height: 100%;
    background: url('/src/assets/images/bg.jpg') center center / cover no-repeat;

    .register-wrapper {
        width: 600px;
        height: fit-content;
        background: #fff;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        h1 {
            text-align: center;
            font-size: 30px;
        }
    }
}

.el-tabs {
    height: fit-content;

    .el-tab-pane {
        padding: 0 20px 0 10px;
    }
}
</style>
