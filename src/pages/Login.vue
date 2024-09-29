<script setup lang="ts">
import type { IErrorMessage } from '@/api/common.ts'
import { loginWithFace, loginWithPassword } from '@/api/login.ts'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { h, onUnmounted, reactive, ref, watch } from 'vue'

const activeTab = ref('usernamePassword')
const form = reactive({
  username: '',
  password: '',
})
const isLoading = ref(false)

const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)

// Function to start the face recognition (i.e., access the camera)
async function startFaceRecognition() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      videoElement.value.play()
    }
  }
  catch (err) {
    console.error('Failed to access the camera:', err)
    message.error('Failed to access the camera!')
  }
}

// Stop the face recognition by stopping the video stream
function stopFaceRecognition() {
  if (videoElement.value && videoElement.value.srcObject) {
    const stream = videoElement.value.srcObject as MediaStream
    stream.getTracks().forEach(track => track.stop())
    videoElement.value.srcObject = null
  }
}

async function handleFaceRecognition() {
  if (!videoElement.value || !canvasElement.value) {
    return
  }
  const context = canvasElement.value.getContext('2d')
  if (!context) {
    return
  }
  context.drawImage(videoElement.value, 0, 0, canvasElement.value.width, canvasElement.value.height)

  const toFile = (canvas: HTMLCanvasElement, type: string) => new Promise<File>((resolve) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'file.jpg', { type })
          resolve(file)
        }
        else {
          resolve(new File([], 'file.jpg', { type }))
        }
      }, type)
    }
    catch (err) {
      console.error('Failed to convert canvas to file:', err)
      resolve(new File([], 'file.jpg', { type }))
    }
  })

  try {
    const file = await toFile(canvasElement.value, 'image/jpeg')
    isLoading.value = true
    const res = await loginWithFace(file)
    console.log(res)
  }
  catch (err) {
    console.error('Face recognition error:', err)
    message.error((err as IErrorMessage).message)
  }
  finally {
    isLoading.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'faceRecognition') {
    startFaceRecognition()
  }
  else {
    stopFaceRecognition()
  }
})

onUnmounted(() => {
  stopFaceRecognition()
})

async function handleLogin() {
  isLoading.value = true
  try {
    const res = await loginWithPassword(form)
    alert('Login successful!')
    console.log(res)
  }
  catch (err) {
    console.error('Login error:', err)
    message.error((err as IErrorMessage).message)
  }
  finally {
    isLoading.value = false
  }
}

function handleRegister() {
  alert('Redirecting to registration...')
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <ACard class="w-1/3 max-w-96 p-8 text-center" bordered>
      <h1>Login</h1>

      <ATabs v-model:active-key="activeTab" centered>
        <ATabPane key="usernamePassword" tab="Password" />
        <ATabPane key="faceRecognition" tab="Face" />
      </ATabs>

      <div v-if="activeTab === 'usernamePassword'" class="mt-5 flex justify-center">
        <AForm :model="form" @finish="handleLogin">
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
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
          >
            <AInputPassword
              v-model:value="form.password"
              placeholder="Enter your password"
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

      <div v-if="activeTab === 'faceRecognition'" class="mt-5">
        <div class="flex justify-center">
          <video ref="videoElement" class="max-w-full h-auto rounded-lg bg-black scale-x-[-1]" />
        </div>
        <AButton :loading="isLoading" class="w-full mt-5" type="primary" @click="handleFaceRecognition">
          Login
        </AButton>
        <canvas ref="canvasElement" width="640" height="480" class="hidden" />
      </div>

      <div class="mt-5">
        <AButton type="link" class="register-button" @click="handleRegister">
          Click here to Register
        </AButton>
      </div>
    </ACard>
  </div>
</template>

<style scoped>

</style>
