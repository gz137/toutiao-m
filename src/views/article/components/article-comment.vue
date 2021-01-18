<template>
  <div class="article-comment">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 全部评论 -->
      <comment-item
        v-for="(comment, index) in commentList"
        :key="index"
        :comment="comment"
        @replyHandle="$emit('replyHandle', $event)"
      />
    </van-list>
    <!-- /评论列表 -->
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'ArticleComment',
  props: ['commentList', 'source', 'type'],
  components: {
    CommentItem
  },
  data () {
    return {
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 请求下一页数据的页码
      limit: 10,
      totalCount: 0 // 总数据条数
    }
  },
  methods: {
    async onLoad () {
      const { data: res } = await getComments({
        type: this.type,
        source: this.source.toString(),
        limit: this.limit,
        offset: this.offset
      })
      this.commentList.push(...res.data.results)
      this.loading = false // 关闭当前上拉效果
      if (!res.data.results.length) {
        this.finished = true // 关闭上拉组件 不再触发
      } else {
        this.offset = res.data.last_id // 获取发送请求的偏移值
      }
      this.totalCount = res.data.total_count
      this.getTotalCount()
    },
    // 获取总评论条数
    getTotalCount () {
      this.$emit('getTotalCount', this.totalCount)
    }
  }
}
</script>

<style lang="less" scoped>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
