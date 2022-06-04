<template>
  <el-card>
    <div class="page-tools">
      <!-- 左侧 -->
      <div class="left">
        <div class="tips">
          <i class="el-icon-info" />
          <!-- <span>文字区域</span> -->
          <slot name="left" />
        </div>
      </div>
      <div class="right">
        <!-- 右侧 -->
        <!-- 按钮区域 -->
        <slot name="right" />
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  // 组件 name 的作用:
  // 1. 调试工具显示名字
  // 2. 匹配缓存 keep-alive
  // 3. 访问 name 属性来做组件注册
  // 4. component 动态组件 (有路由就不需要它了)
  name: 'PageTools'
}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
