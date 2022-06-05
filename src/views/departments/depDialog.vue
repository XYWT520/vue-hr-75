<template>
  <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="部门名称" prop="name">
      <el-input v-model="form.name" style="width:90%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码" prop="code">
      <el-input v-model="form.code" style="width:90%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人" prop="manager">
      <el-select v-model="form.manager" style="width:90%" placeholder="请选择">
        <el-option v-for="item in employees" :key="item.id" :value="item.username" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍" prop="introduce">
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
    },
    origin: {
      type: Array,
      required: true
    }
  },

  data() {
    const validCode = (rule, value, callback) => {
      // console.log(value)

      let newOriginList = null

      // console.log(newOriginList)
      if (this.isEdit) {
        // 编辑部门 // filter: 过滤出「除了」正在编辑的部门以外的所有部门
        newOriginList = this.origin.filter(item => item.id !== this.id).map(({ code }) => code)
      } else {
        // 添加部门
        newOriginList = this.origin.map(({ code }) => code)
      }

      // if (newOriginList.includes(value)) {
      //   callback(new Error(value + '已存在'))
      // } else {
      //   callback()
      // }
      // 三元表达式
      newOriginList.includes(value) ? callback(new Error(value + '已存在')) : callback()
    }
    const validName = (rule, value, callback) => {
      // console.log(value)
      // 需求二:编辑时,通过 id 找扫兄弟部门.并判断是否在其中
      // this.is => 当前点击的部门
      let nameList = null
      if (this.isEdit) {
        // 进入编辑
        // 根据点击当前的部门 id 找到父部门 id
        const pid = this.origin.find(item => item.id === this.id).pid
        // 根据 pid 过滤出所有子部门
        nameList = this.origin.filter(item => item.pid === pid && item.id !== this.id).map(({ name }) => name)
      } else {
        // 进入添加
        nameList = this.origin.filter(item => item.pid === this.id).map(({ name }) => name)
      }

      // 编辑部门 // filter: 过滤出「除了」正在编辑的部门以外的所有部门

      nameList.includes(value) ? callback(new Error(value + '已存在')) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: ['change', 'blur'] },
          { min: 2, max: 10, message: '部门名称为2-10个字符', trigger: ['change', 'blur'] },
          { validator: validName, trigger: 'blur' }

        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: ['change', 'blur'] },
          { min: 2, max: 10, message: '部门编码为2-10个字符', trigger: ['change', 'blur'] },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择部门管理者', trigger: ['change', 'blur'] },
          { min: 2, max: 10, message: '请选择部门管理者', trigger: ['change', 'blur'] }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: ['change', 'blur'] },
          { min: 2, max: 300, message: '部门介绍为2-300个字符', trigger: ['change', 'blur'] }
        ]

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
      this.$refs.deptForm.validate(valid => {
        if (!valid) return
        if (this.isEdit) {
        // 编辑操作
          this.doIsEdit()
        } else {
        // 添加操作
          this.doAdd()
        }
      })
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

