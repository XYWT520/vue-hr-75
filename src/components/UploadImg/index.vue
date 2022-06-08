<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <!-- 如果我有进度条并且进度条小于100就显示 -->
      <el-progress v-if="progress && progress < 100" type="circle" :percentage="progress" />
      <!-- 如果我有照片我就显示 -->
      <img v-if="value && progress === 0" :src="value" class="avatar">
      <!-- 反之 icon 图标就不显示 -->
      <i v-show="!progress" v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
// 下面的代码是固定写法
const COS = require('cos-js-sdk-v5')
// 填写自己腾讯云cos中的key和id (密钥)
const cos = new COS({
  SecretId: 'AKIDQfeR3SaRSDhurXWKtDH6fz3rPimb9SWJ', // 身份识别ID
  SecretKey: 'ZswlKfmdFbiaCYeV6RWMwGJ6duvgDUVG' // 身份秘钥
})

export default {
  name: 'UploadImg',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // imageUrl: '',
      progress: 0
    }
  },
  methods: {
    upload(res) {
      // console.log(file)
      if (!res.file) return
      // 执行上传操作
      cos.putObject({
        Bucket: 'web75-1312367921', /* 存储桶 */
        Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
        Key: res.file.name, /* 文件名 */
        StorageClass: 'STANDARD', // 上传模式, 标准模式
        Body: res.file, // 上传文件对象
        onProgress: (progressData) => {
          // console.log(progressData)
          // console.log(JSON.stringify(progressData))
          this.progress = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        console.log(err || data)
        // 上传成功之后
        if (data.statusCode === 200) {
          // 进度复位
          this.progress = 0
          // this.imageUrl = `https:${data.Location}`
          this.$emit('input', `https:${data.Location}`)
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      // const isPNG = file.type === 'image/png'
      // startsWith 以什么什么开头
      const isPNG = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPNG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return isPNG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
.el-progress-circle {
  width: 160px !important;
  height: 160px !important;
}

</style>
