<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <van-icon v-if="!isDel" slot="right-icon" name="delete-o" @click="delHandle" />
      <div v-else>
        <span @click="delAllHistory">全部删除 </span>
        <span @click="isDel = false"> 完成</span>
      </div>
    </van-cell>
    <!-- 搜索历史列表 -->
    <van-cell :title="item" v-for="(item,index) in historyList" :key="index" @click="search(item)">
      <van-icon slot="right-icon" name="close" v-show="isDel" @click="delHistory(index)" />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDel: false
    }
  },
  props: {
    historyList: {
      type: Array,
      required: true
    }
  },
  methods: {
    delHandle () {
      this.isDel = true
    },
    // 删除单项历史记录
    delHistory (index) {
      this.historyList.splice(index, 1)
      setItem('Search_History', this.historyList)
    },
    // 删除全部历史记录
    delAllHistory () {
      this.$emit('delAllHistory')
    },
    // 点击历史记录查询结果
    search (item) {
      if (!this.isDel) {
        this.$emit('onSearch', item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-history{
  .van-cell__title{
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
}

</style>
