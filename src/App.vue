<script setup lang="ts">
import { ShopOutlined } from '@ant-design/icons-vue'
import { h, ref, type VNode, watch } from 'vue'
import { useRouter } from 'vue-router'

interface MenuItem {
  key: string
  label: string
  path: string
  icon: () => VNode
}

const router = useRouter()
const defaultSelectedKeys = ref<string[]>([])
const menuItems: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
    icon: () => h(ShopOutlined),
  },
  {
    key: 'user',
    label: 'User Center',
    path: '/user',
    icon: () => h(ShopOutlined),
  },
  {
    key: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: () => h(ShopOutlined),
  },
]

function onSelect({ item }: { item: MenuItem }) {
  router.push(item.path)
}

watch(router.currentRoute, () => {
  for (const item of menuItems) {
    if (router.currentRoute.value.path === '/') {
      defaultSelectedKeys.value = ['home']
      return
    }
    if (item.path !== '/' && router.currentRoute.value.path.startsWith(item.path)) {
      defaultSelectedKeys.value = [item.key]
      return
    }
  }
  defaultSelectedKeys.value = []
}, { immediate: true })
</script>

<template>
  <ALayout class="h-full">
    <ALayoutHeader class="flex gap-3.5 !h-12 !leading-[48px] !px-6 items-center !bg-white z-10 shadow-sm">
      <div class="flex items-center gap-1.5 text-blue-500">
        <ShopOutlined class="text-[1.5rem]" />
        <h1 class="text-base my-0">
          Smart Mall
        </h1>
      </div>
      <AMenu
        v-model:selected-keys="defaultSelectedKeys"
        mode="horizontal"
        :items="menuItems"
        @select="onSelect"
      />
    </ALayoutHeader>
    <ALayout :style="{ height: 'calc(100vh - 48px)' }">
      <RouterView />
    </ALayout>
  </ALayout>
</template>

<style scoped>

</style>
