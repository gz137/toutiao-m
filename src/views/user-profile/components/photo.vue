<template>
  <div class="photo">
    <img class="image" :src="src" ref="photoRef" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { editUserPhoto } from '@/api/user'
export default {
  data() {
    return {
      myCropper: null
    }
  },
  props: ['src'],
  mounted() {
    this.init()
  },
  methods: {
    onConfirm() {
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        const formData = new FormData()
        formData.append('photo', blob)
        const { data: res } = await editUserPhoto(formData)
        this.$toast.success('更新成功')
        this.$emit('close')
      })
    },
    init() {
      const image = this.$refs.photoRef
      this.myCropper = new Cropper(image, {
        viewMode: 1,
        dragMode: 'none',
        initialAspectRatio: 1,
        aspectRatio: 1,
        preview: '.before',
        background: false,
        autoCropArea: 0.5, //  控制窗口大小
        zoomOnWheel: false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.image {
  display: block;
  max-width: 100%;
}
</style>
