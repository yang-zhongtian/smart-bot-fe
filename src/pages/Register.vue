<script setup lang="ts">
import type { IErrorMessage } from '@/api/common.ts'
import { register } from '@/api/login.ts'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { h, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const form = reactive({
  username: '',
  password1: '',
  password2: '',
})
const isLoading = ref(false)
const router = useRouter()

async function handleRegister() {
  if (form.password1 !== form.password2) {
    message.error('Passwords do not match!')
    return
  }
  isLoading.value = true
  try {
    await register({
      username: form.username,
      password: form.password1,
    })
    message.success('Registration successful!')
    await router.push('/user')
  }
  catch (err) {
    console.error('Registration error:', err)
    message.error((err as IErrorMessage).message)
  }
  finally {
    isLoading.value = false
  }
}

function handleLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <ACard class="w-1/3 max-w-96 p-8 text-center" bordered>
      <h1>Register</h1>

      <div class="mt-5 flex justify-center">
        <AForm :model="form" @finish="handleRegister">
          <AFormItem
            name="username"
            :rules="[{ required: true, message: 'Please input your username!' }]"
          >
            <AInput
              v-model:value="form.username"
              placeholder="Enter your username"
              :prefix="h(UserOutlined)"
            />
          </AFormItem>
          <AFormItem
            name="password1"
            :rules="[{ required: true, message: 'Please input your password!' }]"
          >
            <AInputPassword
              v-model:value="form.password1"
              placeholder="Enter your password"
              :prefix="h(LockOutlined)"
            />
          </AFormItem>
          <AFormItem
            name="password2"
            :rules="[{ required: true, message: 'Please confirm your password!' }]"
          >
            <AInputPassword
              v-model:value="form.password2"
              placeholder="Confirm your password"
              :prefix="h(LockOutlined)"
            />
          </AFormItem>
          <AFormItem>
            <AButton :loading="isLoading" type="primary" html-type="submit" block>
              Login
            </AButton>
          </AFormItem>
        </AForm>
      </div>

      <div class="mt-5">
        <AButton type="link" @click="handleLogin">
          Click here to Login
        </AButton>
      </div>
    </ACard>
  </div>
</template>

<style scoped>

</style>
