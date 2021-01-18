import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 导入全局样式与图标
import './styles/index.less'
import './assets/fonts/iconfont.css'

// 引入flexible
import 'amfe-flexible'

// 加载 dayjs 初始化配置
import './utils/dayjs'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
