<script setup lang="ts">
import type { VNode } from 'vue'
import { RobotOutlined, UserOutlined } from '@ant-design/icons-vue'
import { h, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface MenuItem {
  key: string
  label: string
  path: string
  icon: () => VNode
}

const menu: MenuItem[] = [
  {
    key: 'user',
    label: 'User',
    path: '/admin/user',
    icon: () => h(UserOutlined),
  },
  {
    key: 'bot',
    label: 'Bot',
    path: '/admin/bot-list',
    icon: () => h(RobotOutlined),
  },
]

const defaultSelectedKeys = ref<string[]>([])
const router = useRouter()

function onSelect({ item }: { item: MenuItem }) {
  router.push(item.path)
}

watch(router.currentRoute, () => {
  for (const item of menu) {
    if (router.currentRoute.value.path === item.path) {
      defaultSelectedKeys.value = [item.key]
      return
    }
  }
  defaultSelectedKeys.value = []
}, { immediate: true })
</script>

<template>
  <ALayout>
    <ALayoutSider theme="light">
      <AMenu
        v-model:selected-keys="defaultSelectedKeys"
        :items="menu"
        theme="light"
        mode="inline"
        class="h-full"
        @select="onSelect"
      />
    </ALayoutSider>
    <ALayout class="p-6">
      <RouterView />
    </ALayout>
  </ALayout>
</template>

<style scoped>

</style>
