<script setup lang="ts">
import { ref, reactive } from 'vue'
import { $ref } from 'vue/macros'
import type { ElForm } from 'element-plus'
import { User, Lock, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'


/**
 * Register Form
 */
type FormInstance = InstanceType<typeof ElForm>

const usernameRegisterRef = ref<FormInstance | null>(null)

const usernameRegisterData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  registerType: 'normal',
  agreement: false
})

const validateUsername = (rule: any, value: string, callback: any): void => {
  if (value === '') {
    callback(new Error('Please input the username'))
  } else if (!(/^[A-Za-z0-9]{6,20}$/).test(value)) {
    callback(new Error('Username must be any of a-z, A-Z or 0-9, and between 6 and 20 (both inclusive) characters long'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: string, callback: any): void => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else if (!(/^((?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,.#%'+*\-:;^_`].*))[,.#%'+*\-:;^_`0-9A-Za-z]{8,20}$/).test(value)) {
    callback(new Error('Password must include characters, numbers, symbols, and between 8 and 20 (both inclusive) characters long.'))
  } else {
    if (usernameRegisterData.confirmPassword !== '') {
      if (!usernameRegisterRef.value) return
      usernameRegisterRef.value.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validateConfirmPassword = (rule: any, value: string, callback: any): void => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== usernameRegisterData.password) {
    callback(new Error('Password doesn\'t match'))
  } else {
    callback()
  }
}
const validateCaptcha = (rule: any, value: string, callback: any): void => {
  if (value === '') {
    callback(new Error('Please input the captcha'))
  } else if (!(/^[A-Za-z0-9]{4}$/).test(value)) {
    callback(new Error('Incorrect captcha'))
  } else {
    callback()
  }
}
const validateAgreement = (rule: any, value: boolean, callback: any): void => {
  if (!value) {
    callback(new Error('Please agree to the Terms and Conditions'))
  } else {
    callback()
  }
}

const usernameRegisterRules = reactive({
  username: { validator: validateUsername },
  password: { validator: validatePassword },
  confirmPassword: { validator: validateConfirmPassword },
  captcha: { validator: validateCaptcha },
  agreement: { validator: validateAgreement, trigger: 'blur' }
})

const submitForm = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      ElMessage({
        message: 'Invalid registration data',
        type: 'error',
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
    <el-form ref="usernameRegisterRef"
             :model="usernameRegisterData"
             :rules="usernameRegisterRules"
             class="username-register-form"
    >
        <el-form-item prop="username" required class="username">
            <el-input v-model.number="usernameRegisterData.username"
                      maxlength="20"
                      show-word-limit
                      placeholder="Username"
                      type="text"
                      clearable
                      autofocus
                      :prefix-icon="User"
            />
        </el-form-item>
        <el-form-item prop="password" required class="password">
            <el-input v-model="usernameRegisterData.password"
                      type="password"
                      autocomplete="off"
                      placeholder="Password"
                      maxlength="20"
                      clearable
                      show-password
                      :prefix-icon="Lock"
            />
        </el-form-item>
        <el-form-item prop="confirmPassword" required>
            <el-input v-model="usernameRegisterData.confirmPassword"
                      type="password"
                      autocomplete="off"
                      maxlength="20"
                      placeholder="Confirm password"
                      clearable
                      show-password
                      :prefix-icon="Lock"
            />
        </el-form-item>

        <el-row :gutter="20" align="middle" class="captcha-container">
            <el-col :span="15">
                <el-form-item prop="captcha" required class="captcha-input">
                    <el-input v-model="usernameRegisterData.captcha"
                              type="text"
                              autocomplete="off"
                              maxlength="4"
                              placeholder="captcha"
                              clearable
                              show-word-limit
                              :prefix-icon="Check"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <img ref="captcha"
                     src="http://127.0.0.1:7001/captcha"
                     alt
                     class="captcha-image"
                     @click="refreshCaptcha"
                >
            </el-col>
        </el-row>

        <el-form-item prop="agreement" required class="agreement">
            <el-checkbox v-model="usernameRegisterData.agreement">
                <p>I agree to the <a href="javascript:">Terms and Conditions</a></p>
            </el-checkbox>
        </el-form-item>

        <el-form-item class="register-buttons">
            <el-button type="primary" @click="submitForm(usernameRegisterRef)">Submit</el-button>
            <el-button @click="resetForm(usernameRegisterRef)">Reset</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped lang="scss">
.username,
.password,
.agreement {
    margin-bottom: 30px;
}

.captcha-container {
    margin-bottom: 18px;

    .captcha-input {
        margin-bottom: 0;
    }

    .captcha-image {
        cursor: pointer;
    }
}

.el-checkbox {
    a {
        text-decoration: underline;
        color: inherit;
    }
}

.register-buttons {
    :deep(.el-form-item__content) {
        justify-content: center;
    }
}
</style>
