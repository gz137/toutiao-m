<template>
  <div class="my-container">
    <!-- 未登录 -->
    <div v-if="!user" class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 已登录 -->
    <div v-else class="header login">
      <div class="base-info">
        <div class="left">
          <van-image round :src="userInfo.photo" />
          <span class="text">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button round size="mini" type="default" @click="$router.push('/user/profile')">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 宫格区域 -->
    <van-grid :column-num="2">
      <van-grid-item>
        <i class="toutiao toutiao-shoucang"></i>
        <span class="text">收藏</span>
      </van-grid-item>
      <van-grid-item>
        <i class="toutiao toutiao-lishi"></i>
        <span class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 单元格区域 -->
    <van-cell title="消息通知" border is-link />
    <van-cell title="小智同学" border is-link />
    <van-cell v-if="user" class="logout" title="退出登录" clickable @click="userLogout" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'

export default {
  name: 'my',
  data () {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  created () {
    // 展示用户信息
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    // 退出登录
    userLogout () {
      this.$dialog.confirm({
        title: '消息',
        message: '确定要退出吗?'
      })
        .then(() => {
          this.$store.commit('setUser', null)
          this.$router.push('/login')
        })
        .catch(() => {
          this.$toast('已取消退出')
        })
    },
    // 加载用户信息
    async loadUserInfo () {
      try {
        const { data: res } = await getUserInfo()
        this.userInfo = res.data
      } catch (error) {
        this.$toast('获取用户信息失败')
      }
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png') no-repeat;
    background-size: cover;
  }
  // 未登录
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  // 已登录
  .login {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px 32px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .van-image {
          height: 132px;
          width: 132px;
        }
        .text {
          margin-left: 23px;
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      height: 130px;
      display: flex;
      justify-content: space-around;
      .data-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 32px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  // 宫格区域
  .van-grid {
    .van-grid-item {
      .toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
      }
    }
  }
  // 单元格区域
  .logout {
    margin-top: 9px;
    color: #d86262;
    text-align: center;
  }
}
</style>
