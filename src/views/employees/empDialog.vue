<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option v-for="item in constant" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="loadDepartments()" />
      <el-tree v-if="departments.length" default-expand-all :data="departments" :props="{label:'name'}" @node-click="hNodeClick" />
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="hSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import constant from '@/constant/employees'
import { departmentsList } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      constant: constant.hireType,
      departments: [],
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },

      //   规则校验
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    // this.loadDepartments()
  },

  methods: {
    async hSubmit() {
      const valid = await this.$refs.addForm.validate().catch(e => e)
      if (!valid) return
    },

    // 获取组织架构部门列表
    async loadDepartments() {
      // 判断有数据就不要加载了
      if (this.departments.length) return
      const res = await departmentsList()
      //   console.log(res)
      // 删除第一个元素
      res.data.depts.shift()
      // 转成树形结构
      this.departments = tranListToTreeData(res.data.depts)
    },

    // 将获取到的值赋值给input输入框
    hNodeClick(data) {
      // 判断是否有子节点 有就不允许添加
      if (data.children.length) return
      //   console.log(data)
      this.formData.departmentName = data.name
      //   点击之后关闭 tree 树 由于显示隐藏的条件是数据的长度
      this.departments = []
    }
  }
}
</script>

<style lang="scss">
.el-tree {
  width: 240px;
  user-select: none;
}
</style>
