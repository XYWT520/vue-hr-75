<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <LoginSetting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import LoginSetting from './children/loginSetting.vue'
import UserInfo from './children/userInfo.vue'
import JobInfo from './children/jobInfo.vue'
export default {
  components: {
    LoginSetting,
    UserInfo,
    JobInfo
  }
}
</script>
