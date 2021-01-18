import Vue from 'vue'

import dayjs from 'dayjs'

// 加载中午语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 全局使用
dayjs.locale('zh-cn')

// 定义一个全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
