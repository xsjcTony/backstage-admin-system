<script lang="ts" setup>
import { User, Lock, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { $ref } from 'vue/macros'
import { loginUser } from '../api'
import { FormInstance, LoginData, ResponseData } from '../types'


const router = useRouter()

/**
 * Register Form
 */
const loginRef = $ref<FormInstance | null>(null)

const loginData: LoginData = reactive({
  username: '',
  password: '',
  captcha: ''
})

const validateUsername = (rule: any, value: string, callback: any): void => {
  if (value === '') {
    callback(new Error('Please input the username or email'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: string, callback: any): void => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    callback()
  }
}
const validateCaptcha = (rule: any, value: string, callback: any): void => {
  const regex = /^[A-Za-z0-9]{4}$/
  if (value === '') {
    callback(new Error('Please input the captcha'))
  } else if (!regex.test(value)) {
    callback(new Error('Incorrect captcha'))
  } else {
    callback()
  }
}

const usernameRegisterRules = reactive({
  username: { validator: validateUsername },
  password: { validator: validatePassword },
  captcha: { validator: validateCaptcha }
})

const submitForm = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // login
        const data: ResponseData = await loginUser(loginData) as ResponseData

        if (data.code === 200) {
          // Succeed
          await router.push('/admin')
        } else {
          // Fail
          ElMessage.error({
            message: typeof data.msg === 'string' ? data.msg : 'Error',
            center: true,
            showClose: true,
            duration: 3000
          })
          refreshCaptcha()
        }
      } catch (err) {
        ElMessage.error({
          message: err instanceof Error ? err.message : 'Error',
          center: true,
          showClose: true,
          duration: 3000
        })
        refreshCaptcha()
      }
    } else {
      ElMessage.error({
        message: 'Invalid login data',
        center: true,
        showClose: true,
        duration: 3000
      })
    }
  })
}

const resetForm = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.resetFields()
  ElMessage.closeAll()
  refreshCaptcha()
}


/**
 * Captcha
 */
const captcha = $ref<HTMLImageElement | null>(null)

const refreshCaptcha = (): void => {
  if (!captcha) return
  captcha.src = `http://127.0.0.1:7001/captcha?t=${ new Date().getTime() }`
}
</script>

<template>
    <div class="login-container">
        <div class="login-wrapper">
            <h1>Login</h1>
            <el-form ref="loginRef" :model="loginData" :rules="usernameRegisterRules">
                <el-form-item class="username" prop="username" required>
                    <el-input v-model.number="loginData.username"
                              :prefix-icon="User"
                              autofocus
                              clearable
                              placeholder="Username / E-mail"
                              type="text"
                    />
                </el-form-item>
                <el-form-item class="password" prop="password" required>
                    <el-input v-model="loginData.password"
                              :prefix-icon="Lock"
                              autocomplete="off"
                              clearable
                              placeholder="Password"
                              show-password
                              type="password"
                    />
                </el-form-item>
                <div class="captcha-container">
                    <el-form-item class="captcha-input" prop="captcha" required>
                        <el-input v-model="loginData.captcha"
                                  :prefix-icon="Check"
                                  autocomplete="off"
                                  clearable
                                  maxlength="4"
                                  placeholder="captcha"
                                  show-word-limit
                                  type="text"
                        />
                    </el-form-item>
                    <img ref="captcha"
                         alt
                         class="captcha-image"
                         src="http://127.0.0.1:7001/captcha"
                         @click="refreshCaptcha"
                    >
                </div>
                <el-form-item class="register-buttons">
                    <el-button type="primary" @click="submitForm(loginRef)">Login</el-button>
                    <el-button @click="resetForm(loginRef)">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-container {
    width: 100%;
    height: 100%;
    background: url('/src/assets/images/bg.jpg') center center / cover no-repeat;

    .login-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 350px;
        height: fit-content;
        padding: 0 20px;
        border-radius: 10px;
        background: #fff;
        transform: translate(-50%, -50%);

        h1 {
            font-size: 30px;
            text-align: center;
        }

        .captcha-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;

            .captcha-input {
                margin-bottom: 0;
                margin-right: 20px;
            }

            .captcha-image {
                cursor: pointer;
                width: 160px;
                height: 60px;
            }
        }

        .register-buttons {
            :deep(.el-form-item__content) {
                justify-content: center;
            }
        }
    }
}
</style>
