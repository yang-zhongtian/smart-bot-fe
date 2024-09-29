import router from '@/router'
import Antd from 'ant-design-vue'
import { createApp } from 'vue'
import App from './App.vue'

import '@/api/common'
import './style.css'

createApp(App)
  .use(router)
  .use(Antd)
  .mount('#app')
