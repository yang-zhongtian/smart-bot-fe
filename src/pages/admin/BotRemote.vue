<script setup lang="ts">
import type { IBotInfo } from '@/api/bot.ts'
import type { IFaceRecord } from '@/api/face.ts'
import { getBotInfo } from '@/api/bot.ts'
import { getFaceRecordLatest } from '@/api/face.ts'
import BotUnityScene from '@/components/BotUnityScene.vue'
import FaceHistory from '@/components/FaceHistory.vue'
import { CompressOutlined, DownOutlined, LeftOutlined, RightOutlined, UpOutlined } from '@ant-design/icons-vue'
import { h, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const ws = ref<WebSocket>()
const videoCanvas = ref<HTMLCanvasElement>()
const unity = ref<InstanceType<typeof BotUnityScene>>()

const isLoading = ref(true)
const botInfo = ref<IBotInfo | null>(null)
const latestInfo = ref<IFaceRecord | null>(null)
let frameCount = 0
const fpsValue = ref(0)
let fpsRenderInterval: number
const generalSettings = reactive({
  videoStream: false,
  led: false,
  monitor: false,
})
const autoMode = ref(false)
const historyModal = ref(false)
let interval: number

function toggleVideoStream() {
  ws.value?.send(JSON.stringify(['videoStream', generalSettings.videoStream]))
  if (generalSettings.videoStream) {
    fpsRenderInterval = setInterval(() => {
      fpsValue.value = frameCount
      frameCount = 0
    }, 1000)
  }
  else {
    clearInterval(fpsRenderInterval)
  }
}

function toggleLED() {
  ws.value?.send(JSON.stringify(['led', generalSettings.led]))
}

function toggleMonitor() {
  ws.value?.send(JSON.stringify(['monitor', generalSettings.monitor]))
}

function toggleAutoMode() {
  ws.value?.send(JSON.stringify(['autoAvoidance', autoMode.value]))
}

function forward(step = 1) {
  ws.value?.send(JSON.stringify(['forward', step]))
}

function backward(step = 1) {
  ws.value?.send(JSON.stringify(['backward', step]))
}

function turnLeft(step = 1) {
  ws.value?.send(JSON.stringify(['turnLeft', step]))
}

function turnRight(step = 1) {
  ws.value?.send(JSON.stringify(['turnRight', step]))
}

function stand() {
  ws.value?.send(JSON.stringify(['stand']))
}

// function capture() {
//   ws.value?.send(JSON.stringify(['capture']))
// }

async function createWebSocket() {
  ws.value = new WebSocket(`ws://${window.location.host}/ws/host/${route.params.id}/`)
  ws.value.onopen = () => {
    isLoading.value = false
  }
  ws.value.onmessage = ({ data }) => {
    if (data instanceof Blob) {
      if (!generalSettings.videoStream)
        return
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const ctx = videoCanvas.value?.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, videoCanvas.value!.width, videoCanvas.value!.height)
            frameCount++
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(data)
    }
    else {
      const res = JSON.parse(data)
      if (res[0] === 'servo') {
        unity.value?.setAngle(res[1])
      }
      else if (res[0] === 'obstacle') {
        console.log('Obstacle detected')
      }
    }
  }
  ws.value.onclose = () => {
    isLoading.value = true
    setTimeout(createWebSocket, 1000)
  }
  ws.value.onerror = () => {
    isLoading.value = true
    setTimeout(createWebSocket, 1000)
  }
}

async function getLatestInfo() {
  latestInfo.value = await getFaceRecordLatest(route.params.id as string)
}
async function showHistoryModal() {
  historyModal.value = true
}

onMounted(async () => {
  botInfo.value = await getBotInfo(route.params.id as string)
  await createWebSocket()
  await getLatestInfo()
  interval = setInterval(getLatestInfo, 1000)
})

onUnmounted(() => {
  ws.value?.close()
  clearInterval(interval)
})
</script>

<template>
  <div class="flex flex-col">
    <ASpin wrapper-class-name="flex-auto" :spinning="isLoading">
      <h2>Dashboard - {{ botInfo?.name }}</h2>
      <div class="flex flex-auto gap-8">
        <div class="flex flex-col gap-4 w-[481px]">
          <ACard
            title="Video Stream"
            :body-style="{
              padding: 0,
              width: '480px',
              height: '320px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }"
            size="small"
          >
            <div v-if="generalSettings.videoStream" class="w-full h-full">
              <div class="text-white absolute right-1">
                {{ fpsValue }} FPS
              </div>
              <canvas ref="videoCanvas" width="480" height="320" />
            </div>
            <AEmpty v-else />
          </ACard>
          <ACard title="General Settings" size="small">
            <AForm :model="generalSettings" layout="inline">
              <AFormItem label="Video Stream" name="videoStream">
                <ASwitch v-model:checked="generalSettings.videoStream" @change="toggleVideoStream()" />
              </AFormItem>
              <AFormItem label="LED" name="led">
                <ASwitch v-model:checked="generalSettings.led" @change="toggleLED()" />
              </AFormItem>
              <AFormItem label="Monitor" name="monitor">
                <ASwitch v-model:checked="generalSettings.monitor" @change="toggleMonitor()" />
              </AFormItem>
            </AForm>
          </ACard>
          <ACard title="Control" size="small" class="h-full" :body-style="{ height: 'calc(100% - 38px)', padding: 0 }">
            <div class="flex h-full">
              <div class="h-[250px] aspect-square p-5">
                <ARow>
                  <ACol :span="8" />
                  <ACol :span="8">
                    <AButton type="primary" shape="circle" size="large" :icon="h(UpOutlined)" @click="forward()" />
                  </ACol>
                  <ACol :span="8" />
                </ARow>
                <ARow>
                  <ACol :span="8">
                    <AButton type="primary" shape="circle" size="large" :icon="h(LeftOutlined)" @click="turnLeft()" />
                  </ACol>
                  <ACol :span="8">
                    <AButton type="primary" shape="circle" size="large" :icon="h(CompressOutlined)" @click="stand()" />
                  </ACol>
                  <ACol :span="8">
                    <AButton type="primary" shape="circle" size="large" :icon="h(RightOutlined)" @click="turnRight()" />
                  </ACol>
                </ARow>
                <ARow>
                  <ACol :span="8" />
                  <ACol :span="8">
                    <AButton type="primary" shape="circle" size="large" :icon="h(DownOutlined)" @click="backward()" />
                  </ACol>
                  <ACol :span="8" />
                </ARow>
              </div>
              <div class="h-full w-[1px] bg-[#f0f0f0] mr-1.5" />
              <div class="flex flex-grow flex-col justify-between p-3">
                <AForm layout="inline">
                  <AFormItem label="Auto Mode" name="videoStream">
                    <ASwitch v-model:checked="autoMode" @change="toggleAutoMode()" />
                  </AFormItem>
                </AForm>
                <div class="flex flex-col gap-1">
                  <span>Latest Face:</span>
                  <AImage :src="latestInfo?.face_image" />
                  <AButton type="primary" size="small" class="mt-1" @click="showHistoryModal()">
                    History
                  </AButton>
                </div>
              </div>
            </div>
          </ACard>
        </div>
        <div class="flex flex-auto flex-col gap-4">
          <ACard
            class="flex flex-col flex-auto" title="Monitor"
            :body-style="{ padding: 0, flexGrow: 1, overflow: 'hidden' }" size="small"
          >
            <div class="flex justify-center items-center w-full h-full overflow-hidden mb-[-6px]">
              <BotUnityScene v-if="generalSettings.monitor" ref="unity" />
              <AEmpty v-else />
            </div>
          </ACard>
        </div>
      </div>
      <AModal
        v-model:open="historyModal"
        width="70%"
        centered
        :footer="null"
        :closable="false"
      >
        <FaceHistory :id="route.params.id as string" class="mx-2 mt-2" />
      </AModal>
    </ASpin>
  </div>
</template>

<style scoped>
:deep(.ant-spin-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.ant-row) {
  height: 33%;
}

:deep(.ant-col) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
