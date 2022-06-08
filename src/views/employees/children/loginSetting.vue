<template>
  <el-form
    ref="userForm"
    :rules="rules"
    :model="userInfo"
    label-width="120px"
    style="margin-left: 120px; margin-top: 30px"
  >
    <el-form-item label="姓名:" prop="username">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:" prop="password">
      <el-input v-model="userInfo.password" type="password" style="width:300px" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="UpData">更新</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employess'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.loadgetUserDetailById()
  },

  methods: {
    // 获取用户基本信息
    async loadgetUserDetailById() {
      try {
        const res = await getUserDetailById(this.$route.params.id)
        // console.log(res)
        this.userInfo = res.data
      } catch (e) {
        console.log(e)
      }
    },

    // 更新信息 兜底校验
    async UpData() {
      const valid = await this.$refs.userForm.validate().catch(e => e)
      if (!valid) return

      try {
        await saveUserDetailById(this.userInfo)
        //   console.log(res)
        this.$message.success('修改成功')
        // 判断点击的是不是用户的id
        if (this.userId === this.$store.getters.userId) {
          this.$store.dispatch('user/getUserProfile')
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

