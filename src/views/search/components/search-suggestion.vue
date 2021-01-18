<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestionList"
      :key="index"
      @click="$emit('onSearch',item)"
    >
      <div slot="title" v-html="highLight(item, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    },
    suggestionList: {
      type: Array,
      required: true
    }
  },
  methods: {
    highLight (source, keyword) {
      const reg = new RegExp(keyword, 'gi')
      return source.replace(
        reg,
        `<span style='color: #3296fa'>${keyword}</span>`
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion{
  .van-cell__title,.van-cell__title div{
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
}
</style>
