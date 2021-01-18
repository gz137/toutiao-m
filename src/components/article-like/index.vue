<template>
  <div class="article-like">
    <van-icon color="#e5645f" name="good-job" v-if="attitude == 1 ? true : false" @click="likeHandle" />
    <van-icon color="#777" name="good-job-o" v-else @click="likeHandle" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addLike, delLike } from '@/api/article'
export default {
  name: 'ArticleLike',
  model: {
    prop: 'attitude',
    event: 'like'
  },
  props: ['attitude', 'articleId'],
  methods: {
    async likeHandle () {
      try {
        // 判断是否登录
        if (this.user) {
          // 判断当前点赞状态
          if (this.attitude === 1) {
            await delLike(this.articleId)
            this.$toast.success('取消点赞')
          } else {
            await addLike(this.articleId)
            this.$toast.success('点赞成功')
          }
          this.$emit("like", this.attitude === 1 ? -1 : 1)
        } else {
          this.$toast.fail('登录后才能点赞')
        }
      } catch (error) {
        this.$toast.fail('点赞失败')
      }
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
</style>
