<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        审批管理
        <!-- .native 如果给一个组件添加事件,但是没有用,添加一个.native就好了 -->
        <son @click.native="btn" />
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

  methods: {
    btn() {
      console.log('冷雪瞳')
    }
  }
}
</script>
