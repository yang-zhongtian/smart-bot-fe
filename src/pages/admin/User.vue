<script setup lang="ts">
import type { IUserFaceRecord, IUserFaceRecordDetail } from '@/api/user.ts'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { getUserFaceRecordDetail, getUserFaceRecords } from '@/api/user.ts'
import { Button as AButton, Image as AImage } from 'ant-design-vue/es/components'
import dayjs from 'dayjs'
import { h, onMounted, ref } from 'vue'

const userRecords = ref<IUserFaceRecord[]>([])
const detailRecord = ref<IUserFaceRecordDetail[] >([])
const detailModal = ref(false)

const columns: ColumnsType = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Face Image',
    dataIndex: 'face_image',
    key: 'face',
    customRender: ({ text }) => h(AImage, { src: text, alt: 'face', width: 100 }),
  },
  {
    title: 'Credit',
    dataIndex: 'credit',
    key: 'credit',
  },
  {
    title: 'Last Detected',
    dataIndex: 'last_detected',
    key: 'last_detected',
    customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: 'Action',
    key: 'action',
  },
]

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
    title: 'Face Image',
    dataIndex: 'face_image',
    key: 'face',
    customRender: ({ text }) => h(AImage, { src: text, alt: 'face', width: 100 }),
  },
  {
    title: 'Time',
    dataIndex: 'created_at',
    key: 'time',
    customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
]

async function showDetailModal(record: IUserFaceRecord) {
  detailRecord.value = await getUserFaceRecordDetail(record.id)
  detailModal.value = true
}

onMounted(async () => {
  userRecords.value = await getUserFaceRecords()
})
</script>

<template>
  <ATable :data-source="userRecords" :columns="columns">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <AButton @click="showDetailModal(record)">
          Detail
        </AButton>
      </template>
    </template>
  </ATable>
  <AModal v-model:open="detailModal" :footer="null" centered>
    <ATable :data-source="detailRecord" :columns="detailColumns" size="small" />
  </AModal>
</template>

<style scoped>
</style>
