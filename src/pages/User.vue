<script setup lang="ts">
import type { IErrorMessage } from '@/api/common.ts'
import type { IUserFaceRecord, IUserFaceRecordDetail } from '@/api/user.ts'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { getCurrentUserFaceRecord, getUserFaceRecordDetail, updateCurrentUserFaceRecord } from '@/api/user.ts'
import { CreditCardOutlined, EditOutlined, RollbackOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { Image as AImage } from 'ant-design-vue/es/components'
import dayjs from 'dayjs'
import { h, onMounted, ref, watch } from 'vue'

const userInfo = ref<IUserFaceRecord | null>(null)
const detailRecord = ref<IUserFaceRecordDetail[] | null>(null)
const isModifyFace = ref(false)
const isUploadingFace = ref(false)

const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)

const detailColumns: ColumnsType = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Bot',
    dataIndex: ['bot', 'name'],
    key: 'bot',
  },
  {
    title: 'Time',
    dataIndex: 'created_at',
    key: 'time',
    customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
]

async function loadUserInfo() {
  userInfo.value = await getCurrentUserFaceRecord()
}

async function loadDetailRecord() {
  if (!userInfo.value)
    return
  detailRecord.value = await getUserFaceRecordDetail(userInfo.value.id)
}

async function handleFaceUpload() {
  if (!videoElement.value || !canvasElement.value) {
    return
  }
  const context = canvasElement.value.getContext('2d')
  if (!context) {
    return
  }
  isUploadingFace.value = true
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
    isUploadingFace.value = true
    await updateCurrentUserFaceRecord(file)
    message.success('Face updated successfully!')
    await loadUserInfo()
    isModifyFace.value = false
  }
  catch (err) {
    console.error('Face recognition error:', err)
    message.error((err as IErrorMessage).message)
  }
  finally {
    isUploadingFace.value = false
  }
}

onMounted(async () => {
  await loadUserInfo()
  await loadDetailRecord()
})

watch(isModifyFace, async (newValue) => {
  if (newValue) {
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
  else {
    if (videoElement.value && videoElement.value.srcObject) {
      const stream = videoElement.value.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoElement.value.srcObject = null
    }
  }
})
</script>

<template>
  <div class="flex px-[20%] py-[5%] gap-6">
    <div class="flex flex-col w-3/4 gap-3.5">
      <ACard title="User Credit">
        <span class="text-2xl">
          <CreditCardOutlined />
          {{ userInfo?.credit }}
        </span>
      </ACard>
      <ACard v-if="!isModifyFace" title="Current Face">
        <AImage :src="userInfo?.face_image" />
        <template #actions>
          <AButton type="link" :icon="h(EditOutlined)" @click="isModifyFace = !isModifyFace">
            Modify
          </AButton>
        </template>
      </ACard>
      <ACard v-else title="Modify Face">
        <div class="flex justify-center">
          <video ref="videoElement" class="max-w-full h-auto rounded-lg bg-black scale-x-[-1]" />
        </div>
        <canvas ref="canvasElement" width="640" height="480" class="hidden" />
        <template #actions>
          <AButton type="link" :icon="h(UploadOutlined)" :loading="isUploadingFace" @click="handleFaceUpload()">
            Upload
          </AButton>
          <AButton type="link" :icon="h(RollbackOutlined)" @click="isModifyFace = !isModifyFace">
            Discard
          </AButton>
        </template>
      </ACard>
    </div>
    <div class="w-full">
      <ATable :data-source="detailRecord" :columns="detailColumns" />
    </div>
  </div>
</template>

<style scoped>

</style>
