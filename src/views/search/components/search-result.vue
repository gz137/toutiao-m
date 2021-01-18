<template>
  <div class="search-result">
    <van-cell :title="item.title" v-for="(item,index) in resultsList" :key="index" />
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: ["searchText"],
  data () {
    return {
      query: {
        page: 1,
        per_page: 10,
        q: this.searchText
      },
      resultsList: [] // 搜索结果列表
    }
  },
  created () {
    this.loadSearchResult()
  },
  methods: {
    async loadSearchResult () {
      const { data: res } = await getSearchResult(this.query)
      this.resultsList = res.data.results
    }
  }
}
</script>

<style lang="less" scoped>
.search-result{
  .van-cell__title{
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
}
</style>
