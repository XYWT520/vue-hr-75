<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        考勤管理
        <!-- <son @aaa="num" /> -->
        <son v-model="num" />
      </el-card>
    </div>
  </div>
</template>

<script>
import son from './son.vue'
export default {
  components: {
    son
  },
  data() {
    return {
      num: 0
    }
  }

}
</script>
