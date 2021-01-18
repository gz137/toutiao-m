<template>
  <div class="nick-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onClickRight"
    />
    <van-field
      v-model.trim="nickname"
      rows="2"
      autosize
      type="textarea"
      maxlength="11"
      placeholder="请输入昵称"
      show-word-limit
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
  name: 'nickName',
  props: ['name'],
  data() {
    return {
      nickname: ''
    }
  },
  created() {
    this.nickname = this.name
  },
  methods: {
    async onClickRight() {
      try {
        const { data: res } = await editUserProfile({
          name: this.nickname
        })
        this.$toast.success('更新成功')
        this.$emit('close')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
