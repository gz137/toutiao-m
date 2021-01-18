<template>
  <div class="birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择日期"
      :min-date="minDate"
      :max-date="maxDate"
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
      currentDate: this.birthday,
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(2050, 11, 31)
    }
  },
  props: ['birthday'],
  methods: {
    dateFormat(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      var d = date.getDate()
      return `${y}-${m}-${d}`
    },
    async onConfirm(value) {
      try {
        const { data: res } = await editUserProfile({
          birthday:this.dateFormat(value)
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
