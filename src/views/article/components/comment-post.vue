<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="postContent"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <van-button class="post-btn" @click="post">发布</van-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addComments } from '@/api/comment'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    art_id: {
      type: [Number, String, Object],
      default: () => null
    }
  },
  data () {
    return {
      postContent: '' // 评论内容
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async post () {
      if (!this.postContent.length) {
        this.$toast.fail('评论不能为空')
        return
      }
      if (this.user) {
        const { data: res } = await addComments({
          target: this.target,
          content: this.postContent,
          art_id:this.art_id
        })
        this.$emit('postSuccess', res.data.new_obj)
        this.postContent = ''
      } else {
        this.$toast.fail('登录后才能发表评论')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
