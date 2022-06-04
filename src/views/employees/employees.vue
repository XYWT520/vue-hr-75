<template>
  <div class="department-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总共: xx 条</span>
        </template>
        <template #right>
          <el-button round size="small" type="warning">导入</el-button>
          <el-button round size="small" type="danger">导出</el-button>
          <el-button round size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
    </div>
  </div>
</template>
