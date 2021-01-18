<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  name: 'article-list',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 的状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页的时间戳
      error: false, // 控制数据加载失败的提示状态
      isLoading: false, // 控制下拉加载中的状态
      refreshSuccessText: '' // 下拉刷新的提示文本
    }
  },
  methods: {
    // 初始化或滚动到底部时会调用
    async onLoad () {
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(), // 时间戳
          with_top: 1 // 是否包含置顶
        })
        const { results } = res.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.timestamp = res.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (error) {
        this.loading = false
        this.error = true
      }
    },
    // 下拉加载
    async onRefresh () {
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 时间戳
          with_top: 1 // 是否包含置顶
        })
        const { results } = res.data
        this.list.unshift(...results)
        this.isLoading = false
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (error) {
        this.isLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
