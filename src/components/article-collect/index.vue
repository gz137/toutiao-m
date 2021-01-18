<template>
  <div class="article-collect">
    <van-icon color="#ffa500" name="star" v-if="is_collected" @click="collectHandle" />
    <van-icon color="#777" name="star-o" v-else @click="collectHandle" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addCollect, delCollect } from '@/api/article'
export default {
  name: 'ArticleCollect',
  model: {
    prop: 'is_collected',
    event: "collect"
  },
  props: ['is_collected', 'articleId'],
  methods: {
    async collectHandle () {
      try {
        // 判断是否登录
        if (this.user) {
          // 判断当前收藏状态
          if (this.is_collected) {
            await delCollect(this.articleId)
            this.$toast.success('取消收藏')
          } else {
            await addCollect(this.articleId)
            this.$toast.success('收藏成功')
          }
          this.$emit("collect", !this.is_collected)
        } else {
          this.$toast.fail('登录后才能收藏')
        }
      } catch (error) {
        this.$toast.fail('收藏失败')
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
