<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loadStatus === 'loading'">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="loadStatus === 'success'">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 关注 -->
          <article-follow
            :userId="article.aut_id"
            v-model="article.is_followed"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论区域 -->
        <article-comment
          :commentList="commentList"
          :source="articelId"
          type="a"
          @getTotalCount="getTotalCount"
          @replyHandle="replyHandle"
        />
        <!-- /评论区域 -->
      </div>

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="loadStatus === '404'">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" :badge="totalCount" color="#777" />

      <!-- 收藏 -->
      <article-collect
        :articleId="article.art_id"
        v-model="article.is_collected"
      />
      <!-- /收藏 -->

      <!-- 点赞 -->
      <article-like :articleId="article.art_id" v-model="article.attitude" />
      <van-icon name="share" color="#777777"></van-icon>
      <!-- /点赞 -->
    </div>
    <!-- /底部区域 -->

    <!-- 文章评论弹出层 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post @postSuccess="postSuccess" :target="articelId" />
    </van-popup>
    <!-- /文章评论弹出层 -->

    <!-- 回复评论弹出层 -->
    <van-popup
      closeable
      v-model="isComReplyShow"
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <comment-reply :currentComment="currentComment" />
    </van-popup>
    <!-- /回复评论弹出层 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import ArticleFollow from '@/components/article-follow'
import ArticleCollect from '@/components/article-collect'
import ArticleLike from '@/components/article-like'
import ArticleComment from './components/article-comment'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
  name: 'articles',
  data() {
    return {
      article: {}, // 获取到的文章详情数据
      loadStatus: 'loading', // 加载状态
      articelId: this.$route.params.articleId,
      commentList: [], //  所有的评论数据存在文章根组件中
      totalCount: 0, // 总数据条数
      isPostShow: false, // 文章评论
      isComReplyShow: false, // 回复评论
      currentComment: {}
    }
  },
  //  依赖注入
  provide: function () {
    return {
      articleId: this.$route.params.articleId
    }
  },
  components: {
    ArticleFollow,
    ArticleCollect,
    ArticleLike,
    ArticleComment,
    CommentPost,
    CommentReply
  },
  created() {
    this.getArticleById()
  },
  methods: {
    // 根据Id获取文章详情
    async getArticleById() {
      try {
        const { data: res } = await getArticleById(this.$route.params.articleId)
        this.article = res.data
        this.loadStatus = 'success'
        setTimeout(() => {
          this.preImg()
        }, 100)
      } catch (error) {
        if (error || error.response.status) {
          this.loadStatus = '404'
        }
      }
    },
    // 图片预览
    preImg() {
      var ImagePreviewArr = []
      var content = this.$refs['article-content']
      var imgs = content.querySelectorAll('img')
      imgs.forEach((img, index) => {
        ImagePreviewArr.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: ImagePreviewArr,
            startPosition: index
          })
        }
      })
    },
    // 获取总评论条数
    getTotalCount(totalCount) {
      this.totalCount = totalCount
    },
    // 发表评论成功
    postSuccess(new_obj) {
      this.commentList.unshift(new_obj)
      this.isPostShow = false
    },
    // 评论回复
    replyHandle(comment) {
      this.isComReplyShow = true
      this.currentComment = comment
    }
  }
}
</script>

<style lang="less" scoped>
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
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
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
