<template>
  <div class="user-profile">
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />
    <!-- 上传按钮 -->
    <input @change="fileChange" v-show="false" ref="fileRef" type="file" />
    <!-- /上传按钮 -->
    <van-cell title="头像" value="内容" is-link @click="photoHandle">
      <van-image round width="30" height="30" :src="userProfile.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="userProfile.name"
      is-link
      @click="isNickNameShow = true"
    />
    <van-cell
      title="性别"
      :value="userProfile.gender === 0 ? '男' : '女'"
      is-link
      @click="isSexShow = true"
    />
    <van-cell
      title="生日"
      :value="userProfile.birthday"
      is-link
      @click="isDateShow = true"
    ></van-cell>
    <!-- 头像弹出层 -->
    <van-popup
      v-model="isPhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <photo @close="close" :src="src" />
    </van-popup>
    <!-- 昵称弹出层 -->
    <van-popup
      v-model="isNickNameShow"
      position="bottom"
      :style="{ height: '100%' }"
      class="nickPopup"
    >
      <nick-name @close="close" :name="userProfile.name" />
    </van-popup>
    <!-- 性别弹出层 -->
    <van-popup v-model="isSexShow" position="bottom" :style="{ height: '40%' }">
      <gender :gender="userProfile.gender" @close="close" />
    </van-popup>
    <!-- 日期弹出层 -->
    <van-popup
      v-model="isDateShow"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <birthday :birthday="userProfile.birthday" @close="close" />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import nickName from './components/nickName'
import gender from './components/gender'
import birthday from './components/birthday'
import photo from './components/photo'
export default {
  name: 'UserProfile',
  components: {
    nickName,
    gender,
    birthday,
    photo
  },
  data() {
    return {
      isPhotoShow: false,
      isNickNameShow: false,
      isSexShow: false,
      isDateShow: false,
      userProfile: {},
      src: '' // 上传图片的路径
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    // 加载用户个性信息
    async loadUserProfile() {
      try {
        const { data: res } = await getUserProfile()
        this.userProfile = res.data
      } catch (error) {
        this.$toast.fail('获取用户信息失败')
      }
    },
    // 定义页面刷新事件
    close() {
      this.isPhotoShow = false
      this.isNickNameShow = false
      this.isSexShow = false
      this.isDateShow = false
      this.loadUserProfile()
    },
    // 头像点击事件
    photoHandle() {
      this.$refs.fileRef.click() // 触发上传按钮的点击事件
    },
    // 选中图片时触发
    fileChange() {
      const src = window.URL.createObjectURL(this.$refs.fileRef.files[0]) // 获取上传图片的临时路径
      if (!src) {
        return
      }
      this.src = src
      this.isPhotoShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.nickPopup {
  /deep/.van-nav-bar {
    background-color: white;
    .van-nav-bar__title {
      color: black;
    }
  }
}
</style>
