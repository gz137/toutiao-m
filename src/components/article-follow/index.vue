<template>
  <div class="article-follow">
    <van-button class="follow-btn" round size="small" v-if="is_followed" @click="followHandle">已关注</van-button>
    <van-button
      v-else
      class="follow-btn"
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      @click="followHandle"
      >关注</van-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addFollow, delFollow } from '@/api/user'
export default {
  name: 'ArticleFollow',
  model: {
    prop: 'is_followed',
    event: "follow"
  },
  props: ['is_followed', 'userId'],
  methods: {
    // 切换关注状态
    async followHandle () {
      try {
        // 判断是否登录
        if (this.user) {
          // 判断当前关注状态
          if (this.is_followed) {
            await delFollow(this.userId)
          } else {
            await addFollow(this.userId)
          }
          this.$emit("follow", !this.is_followed)
        } else {
          this.$toast.fail('登录后才能关注')
        }
      } catch (error) {
        this.$toast.fail('关注失败')
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
