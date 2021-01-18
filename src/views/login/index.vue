<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录">
        <van-icon slot="left" name="arrow-left" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form class="login-form" @submit="onSubmit" ref="loginFormRef">
      <van-field
        v-model="user.mobile"
        type="digit"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        type="digit"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
          />
          <van-button
            v-else
            class="btn-send-yzm"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
          >
            发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="btn-login-box">
        <van-button
          class="btn-login"
          block
          type="info"
          native-type="submit"
          @click="onLogin"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendYZM } from '@/api/user.js'

export default {
  name: 'login',
  data () {
    return {
      // 登录表单数据
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 用户表单验证规则
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      // 倒计时的显示隐藏
      isCountDownShow: false
    }
  },
  methods: {
    onSubmit () {},
    async onLogin () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })
      try {
        const { data: res } = await login(this.user)
        this.$store.commit('setUser', res.data)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success('登录成功')
        this.$router.back()
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后再试')
        }
      }
    },
    async onSendSms () {
      // 验证手机号是否合法
      try {
        await this.$refs.loginFormRef.validate('mobile')
      } catch (error) {
        return console.log('验证失败', error)
      }
      // 显示倒计时
      this.isCountDownShow = true
      // 发送手机验证码
      try {
        await sendYZM(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (error) {
        // 发送失败关闭倒计时组件
        this.isCountDownShow = false
        if (error.response.status === 429) {
          this.$toast.error('发送过于频繁，请稍后再试')
        } else {
          this.$toast.error('发送失败')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .van-nav-bar, .van-icon {
    color: #fff;
  }
  .toutiao {
    font-size: 37px;
  }
  .btn-send-yzm {
    width: 156px;
    height: 46px;
    line-height: 46px;
    color: #666;
    font-size: 22px;
    background-color: #ededed;
  }
  .login-form {
    margin-top: 12px;
  }
  .btn-login-box {
    padding: 53px 33px;
    .btn-login {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
