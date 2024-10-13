<script setup lang="ts">
import type { IBotInfo } from '@/api/bot.ts'
import { getBotList } from '@/api/bot.ts'
import StatusTag from '@/components/StatusTag.vue'
import { LinkOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const data = ref<IBotInfo[]>()
const isLoading = ref(true)

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Stream',
    key: 'status_cam',
  },
  {
    title: 'Command',
    key: 'status_command',
  },
  {
    title: 'Analyze',
    key: 'status_analyze',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

async function loadBotList() {
  isLoading.value = true
  data.value = await getBotList()
  isLoading.value = false
}

function remoteControl(id: string) {
  router.push(`/admin/bot-remote/${id}`)
}

onMounted(async () => {
  await loadBotList()
})
</script>

<template>
  <ATable :data-source="data" :columns="columns" :loading="isLoading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key.startsWith('status')">
        <StatusTag :status="record.status[column.key.replace('status_', '')]" />
      </template>
      <template v-else-if="column.key === 'action'">
        <ASpace wrap>
          <AButton type="primary" :icon="h(LinkOutlined)" @click="remoteControl(record.id)">
            Remote Control
          </AButton>
          <AButton type="dashed" :icon="h(ReloadOutlined)" :loading="isLoading" @click="loadBotList()">
            Refresh
          </AButton>
        </ASpace>
      </template>
    </template>
  </ATable>
</template>

<style scoped>

</style>
