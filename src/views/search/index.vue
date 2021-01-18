<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @input="onInput"
        @focus="onFocus"
      />
    </form>
    <!-- 搜索结果(确定搜索时显示) -->
    <search-result :searchText="searchText" v-if="isSearch" />
    <!-- 联想建议(搜索框中有内容时显示) -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      :suggestionList="suggestionList"
      @onSearch="onSearch"
    />
    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :historyList="historyList"
      @onSearch="onSearch"
      @delAllHistory="delAllHistory"
    />
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'search',
  data () {
    return {
      searchText: '', // 搜索框的内容
      isSearch: false, // 是否确定搜索
      suggestionList: [], // 搜索联想的数据
      query: {
        page: 1,
        per_page: 10,
        q: this.searchText
      },
      historyList: getItem('Search_History') || [] // 搜索历史
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  methods: {
    // 确定搜索时调用
    async onSearch (val) {
      if (val) {
        this.searchText = val
      }
      if (this.searchText) {
        this.isSearch = true
        // 只显示10条历史记录
        if (this.historyList.length === 10) {
          this.historyList.shift()
        }
        // 不存储重复的历史记录
        if (this.historyList.includes(this.searchText)) {
          return
        }
        this.historyList.push(this.searchText)
      }
    },
    // 点击取消时调用
    onCancel () {
      this.$router.back()
    },
    // 搜索框值改变时调用(防抖)
    onInput: debounce(async function () {
      if (!this.searchText) {
        return
      }
      const { data: res } = await getSuggestion(this.searchText)
      this.suggestionList = res.data.options
    }, 500),
    // 搜索框获得焦点时调用
    onFocus () {
      this.isSearch = false
    },
    // 删除全部历史记录
    delAllHistory () {
      this.historyList = []
    }
  },
  watch: {
    historyList (newVal) {
      setItem('Search_History', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
