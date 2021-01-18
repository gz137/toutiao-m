import request from '@/utils/request.js'

// 获取频道的文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_1/articles',
    params
  })
}

// 根据 id 获取指定文章
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

// 添加收藏
export const addCollect = artId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target: artId
    }
  })
}

// 取消收藏
export const delCollect = artId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${artId}`
  })
}

// 添加点赞
export const addLike = artId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: artId
    }
  })
}

// 取消点赞
export const delLike = artId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${artId}`
  })
}
