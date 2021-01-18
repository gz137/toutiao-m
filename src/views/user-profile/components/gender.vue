<template>
  <div class="gender">
    <van-picker
      title="选择性别"
      show-toolbar
      :columns="columns"
      :default-index="gender"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
  data() {
    return {
      columns: ['男', '女']
    }
  },
  props: ['gender'],
  methods: {
    async onConfirm(value, index) {
      try {
        const { data: res } = await editUserProfile({
          gender: index
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
