<template>
  <el-form ref="deptForm" label-width="120px">
    <el-form-item label="部门名称">
      <el-input v-model="form.name" style="width:90%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码">
      <el-input v-model="form.code" style="width:90%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人">
      <el-select v-model="form.manager" style="width:90%" placeholder="请选择">
        <el-option v-for="item in employees" :key="item.id" :value="item.username" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍">
      <el-input v-model="form.introduce" style="width:90%" placeholder="1-300个字符" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
      <el-button size="small" @click="hCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getEmployeeSimple } from '@/api/employess'
import { addDepartment, getDepartDetail, updateDepartDetail } from '@/api/departments'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      employees: []
    }
  },

  // 封装,调用 methods 里面的 ajax 请求
  created() {
    this.loadEmployee()
    this.loadDetail()
  },

  methods: {
    // 获取当前部门详情 数据回填
    async loadDetail() {
      if (!this.isEdit) return
      const res = await getDepartDetail(this.id)
      // console.log(res)
      this.form = res.data
    },

    // 确定按钮
    async hSubmit() {
      if (this.isEdit) {
        // 编辑操作
        this.doIsEdit()
      } else {
        // 添加操作
        this.doAdd()
      }
    },

    // 编辑操作
    async doIsEdit() {
      try {
        // 把从父组件获取过来的 id 合并在一起
        const res = await updateDepartDetail(this.form)
        // console.log(res)
        // 提醒用户
        this.$message.success(res.message)
        // 子向父传值 关闭弹出框
        this.$emit('success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    // 添加操作
    async doAdd() {
      try {
        // 把从父组件获取过来的 id 合并在一起
        this.form.pid = this.id
        const res = await addDepartment(this.form)
        // console.log(res)
        // 提醒用户
        this.$message.success(res.message)
        // 子向父传值
        this.$emit('success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 取消按钮
    hCancel() {
      // 关闭 dialog
      this.$emit('guuanbi')
    },

    // 获取员工简单列表
    async loadEmployee() {
      try {
        const res = await getEmployeeSimple()
        // console.log(res)
        this.employees = res.data
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
