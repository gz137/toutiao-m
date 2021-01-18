<template>
  <div class="channel-edit">
    <!-- 我的频道区域 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        round
        plain
        size="mini"
        type="danger"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" gutter="12px" :border="false">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
      >
        <van-icon
          v-if="isEdit && !defaultChannels.includes(channel.id)"
          slot="icon"
          name="clear"
          @click="delChannel(channel, index)"
        />
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐区域 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" gutter="12px" :border="false">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="addChannel(channel, index)"
      >
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { delUserChannels, setUserChannels } from '@/api/user'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 是否编辑中
      defaultChannels: [0] // 默认频道，不允许删除
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 获取全部频道
    async loadAllChannels () {
      try {
        const { data: res } = await getAllChannels()
        this.allChannels = res.data.channels
      } catch (error) {
        this.$toast('获取频道数据失败')
      }
    },
    // 添加频道
    async addChannel (channel, index) {
      this.myChannels.push(channel)
      if (this.user) {
        try {
          await setUserChannels({
            id: channel.id,
            seq: index
          })
        } catch (error) {
          this.$toast.fail('添加频道失败')
        }
      } else {
        setItem('my_channels', this.myChannels)
      }
    },
    // 删除频道
    async delChannel (channel, index) {
      // 如果要删除的频道在当前高亮频道的前面,那么控制高亮的active就需要-1
      if (index <= this.active) {
        this.$emit('newActive', this.active - 1)
      }
      this.myChannels.splice(index, 1)
      if (this.user) {
        try {
          await delUserChannels(channel.id)
        } catch (error) {
          this.$toast.fail('删除频道失败')
        }
      } else {
        setItem('my_channels', this.myChannels)
      }
    }
  },
  computed: {
    ...mapState(['user']),
    // 处理推荐频道
    recommendChannels () {
      return this.allChannels.filter(
        (channel) =>
          !this.myChannels.find((myChannel) => channel.id === myChannel.id)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
  /deep/ .van-icon-clear {
    position: absolute;
    font-size: 15px;
    top: -35px;
    right: -90px;
    color: #cacaca;
  }
}
</style>
