import request from '@/utils/request'

// 获取频道的文章列表
export const getSuggestion = q => {
    return request({
        method: 'GET',
        url: `/v1_0/suggestion`,
        params: {
            q
        }
    })
}

// 获取频道的文章列表
export const getSearchResult = params => {
    return request({
        method: 'GET',
        url: `/v1_0/search`,
        params
    })
}
