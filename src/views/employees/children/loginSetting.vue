<template>
  <el-form
    ref="userForm"
    :model="userInfo"
    label-width="120px"
    style="margin-left: 120px; margin-top: 30px"
  >
    <el-form-item label="姓名:">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:">
      <el-input v-model="userInfo.password" type="password" style="width:300px" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary">更新</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserDetailById } from '@/api/user'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
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
    }
  }
}
</script>

