<script setup lang="ts">
import type { IFaceRecord } from '@/api/face.ts'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { getFaceRecords } from '@/api/face.ts'
import { Image as AImage } from 'ant-design-vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { h, onMounted, ref } from 'vue'
import VChart from 'vue-echarts'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

dayjs.extend(isBetween)

use([GridComponent, LineChart, PieChart, CanvasRenderer, TooltipComponent])

const historyInfo = ref<IFaceRecord[]>([])

function groupBySecond(records: IFaceRecord[]) {
  const counts: Record<string, number> = {}

  if (records.length === 0)
    return { dates: [], counts: [] }

  const lastRecordTime = dayjs(records[0].created_at)
  const minutesAgo = lastRecordTime.subtract(20, 'minute')

  const filteredRecords = records.filter(record =>
    dayjs(record.created_at).isBetween(minutesAgo, lastRecordTime, null, '[]'),
  )

  filteredRecords.forEach((record) => {
    const second = dayjs(record.created_at).format('HH:mm')
    counts[second] = (counts[second] || 0) + 1
  })

  const result: Record<string, number> = {}
  for (let i = 0; i <= 20; i++) {
    const time = minutesAgo.add(i, 'minute').format('HH:mm')
    result[time] = counts[time] || 0
  }

  return {
    dates: Object.keys(result),
    counts: Object.values(result),
  }
}

const chartOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: '1%', right: '0%', top: '4%', bottom: '1%', containLabel: true },
  xAxis: {
    type: 'category',
    data: [] as string[],
  },
  yAxis: {
    type: 'value',
    name: 'Count',
    minInterval: 1,
  },
  series: [
    {
      name: 'Detections',
      type: 'line',
      smooth: true,
      data: [] as number[],
    },
  ],
})

const pieChartOption = ref({
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      name: 'User Distribution',
      type: 'pie',
      radius: '50%',
      data: [] as { name: string, value: number }[],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

async function getHistoryInfo() {
  const records = await getFaceRecords(props.id)
  historyInfo.value = records

  const { dates, counts } = groupBySecond(records)
  chartOption.value.xAxis.data = dates
  chartOption.value.series[0].data = counts

  pieChartOption.value.series[0].data = calculateUserDistribution(records)
}

function calculateUserDistribution(records: IFaceRecord[]) {
  const userCounts: Record<string, number> = {}
  records.forEach((record) => {
    userCounts[record.user.username] = (userCounts[record.user.username] || 0) + 1
  })

  return Object.entries(userCounts).map(([userId, count]) => ({
    name: userId,
    value: count,
  }))
}

const columns: ColumnsType = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'User',
    dataIndex: ['user', 'username'],
    key: 'user',
    align: 'center',
  },
  {
    title: 'Record',
    dataIndex: 'face_image',
    key: 'face',
    customRender: ({ text }) => h(AImage, { src: text, alt: 'face', width: 100 }),
    align: 'center',
    width: 250,
  },
  {
    title: 'Time',
    dataIndex: 'created_at',
    key: 'time',
    customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    align: 'center',
  },
]

onMounted(() => {
  getHistoryInfo()
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex gap-5">
      <ACard
        class="w-2/3" title="Face Detection per Minute" size="small"
        :body-style="{ width: '100%', height: '250px' }"
      >
        <VChart :option="chartOption" autoresize />
      </ACard>
      <ACard class="w-1/3" title="User Distribution" size="small" :body-style="{ width: '100%', height: '250px' }">
        <VChart :option="pieChartOption" autoresize />
      </ACard>
    </div>
    <div>
      <ATable
        :data-source="historyInfo" :columns="columns" size="small" :pagination="{ defaultPageSize: 5 }"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
