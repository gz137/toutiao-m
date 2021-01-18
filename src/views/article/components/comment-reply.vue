<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar>
      <div slot="title" v-if="currentComment.reply_count">
        {{ currentComment.reply_count }}条回复
      </div>
      <div slot="title" v-else>暂无回复</div>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 内容主体区域 -->
    <div class="main-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="currentComment" />
      <!-- /当前评论项 -->

      <van-cell title="所有回复" />

      <!-- 评论的回复列表 -->
      <article-comment
        :commentList="commentList"
        type="c"
        :source="currentComment.com_id"
      />
      <!-- /评论的回复列表 -->
    </div>
    <!-- /内容主体区域 -->

    <!-- 底部 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isReplyPostShow = true"
        >写评论</van-button
      >
    </div>
    <van-popup
      v-model="isReplyPostShow"
      position="bottom"
      :style="{ height: '20%' }"
    >
      <comment-post
        @postSuccess="replySuccess"
        :target="currentComment.com_id"
        :art_id="articleId"
      />
    </van-popup>
    <!-- /底部 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import ArticleComment from './article-comment'
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  props: ['currentComment'],
  components: {
    CommentItem,
    ArticleComment,
    CommentPost
  },
  data() {
    return {
      isReplyPostShow: false,
      commentList: [] // 回复数据列表
    }
  },
  inject: ['articleId'],
  methods: {
    replySuccess(obj) {
      this.currentComment.reply_count++
      this.isReplyPostShow = false
      this.commentList.unshift(obj)
    }
  }
}
</script>

<style lang="less" scoped>
.comment-reply {
  .main-wrap{
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
  }
}
</style>
