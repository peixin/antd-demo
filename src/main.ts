import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { Button, Space } from 'ant-design-vue'

const app = createApp(App)

app.use(Button)
app.use(Space)
app.mount('#app')
