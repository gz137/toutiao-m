<template>
  <div class="home-container">
    <!-- 搜索区域 -->
    <van-nav-bar fixed>
      <van-button
        class="searchBtn"
        slot="title"
        size="small"
        round
        icon="search"
        type="info"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 频道列表区域 -->
    <van-tabs class="channelTabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
        ><article-list :channel="channel"
      /></van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburgerBtn" @click="showPopup">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 编辑频道弹出层 -->
    <van-popup
      v-model="show"
      closeable
      close-icon="close"
      close-icon-position="top-left"
      position="top"
      :style="{ height: '100%' }"
      >
      <channel-edit :my-channels="channels" :active="active" @newActive="newActive" />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'home',
  data () {
    return {
      active: 0, // 频道默认显示第一个
      channels: getItem('my_channels') || [], // 频道列表数组
      show: false // 控制编辑频道弹出层的显示隐藏
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    async loadChannel () {
      try {
        if (this.user) {
          const { data: res } = await getUserChannels()
          this.channels = res.data.channels
        } else {
          if (this.channels.length) {
            this.channels = getItem('my_channels')
          } else {
            const { data: res } = await getUserChannels()
            this.channels = res.data.channels
          }
        }
      } catch (error) {
        this.$toast('获取频道数据失败')
      }
    },
    // 显示编辑频道弹出层
    showPopup () {
      this.show = true
    },
    // 删除后更新当前选中频道
    newActive (index) {
      this.active = index
    }
  },
  created () {
    this.loadChannel()
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .searchBtn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channelTabs {
    .van-tabs__content {
      min-height: 79vh;
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      height: 82px;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 28px;
      color: #777777;
    }
    .van-tab--active {
      font-size: 30px;
      color: #333333;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
    }
    .hamburgerBtn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.9;
      i.toutiao {
        font-size: 33px;
      }
      &::before {
        content: '';
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>
