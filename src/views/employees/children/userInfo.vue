<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form ref="userForm" label-width="220px" :rules="rules" :model="userInfo">
      <!--手机 -->

      <el-form-item label="手机" prop="mobile">
        <el-input v-model="userInfo.mobile" style="width:220px" />
      </el-form-item>

      <!-- 工号 入职时间 -->

      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="userInfo.timeOfEntry"
          type="date"
          class="inputW"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <!-- 员工照片 -->

      <el-form-item label="员工头像">
        <!-- 放置上传图片 -->
        <img>
      </el-form-item>

      <!-- 保存个人信息 -->
      <el-form-item>
        <el-button type="primary" @click="UpData">保存更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employess'
export default {
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {
        mobile: '',
        timeOfEntry: ''
      },
      rules: {
        mobile: [{ required: true, message: '手机号', trigger: ['blur', 'change'] }],
        timeOfEntry: [{ required: true, message: '密码不能为空', trigger: ['blur', 'change'] }]
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
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
