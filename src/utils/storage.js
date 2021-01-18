// 存储数据
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

// 读取数据
export const getItem = key => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (error) {
    return localStorage.getItem(key)
  }
}

// 删除数据
export const removeItem = key => {
  localStorage.removeItem(key)
}
