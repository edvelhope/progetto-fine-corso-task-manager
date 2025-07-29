import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

library.add(fas, faSun, faMoon)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)


app.mount('#app')
