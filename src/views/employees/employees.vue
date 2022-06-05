<template>
  <div class="department-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总共: {{ total }} 条</span>
        </template>
        <template #right>
          <el-button round size="small" type="warning">导入</el-button>
          <el-button round size="small" type="danger">导出</el-button>
          <el-button round size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 20px">
        <el-table :data="employess">
          <el-table-column label="序号" prop="" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="username">
            <template v-slot="{row}">
              <img class="avatar" :src="row.staffPhoto" alt="">
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="{row}">
              <!-- {{ formatEmployment(row.formOfEmployment) }} -->
              {{ formatEmployment(row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column :sortable="true" label="入职时间" prop="timeOfEntry" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="hDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :current-page="q.page"
          :page-sizes="[5,10,20,30,50]"
          :page-size="q.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新增员工"
      width="45%"
      :visible.sync="showDialog"
    >
      <empdialog @close="showDialog = false" />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployees, delEmployee } from '@/api/employess'
// 导入枚举数据
import employeesCode from '@/constant/employees'
import empdialog from './empDialog.vue'

// 准备一个映射对象, 最终目标是: {1: '正式', 2: '非正式'}
const hireTypeMap = {}
employeesCode.hireType.forEach(item => {
  hireTypeMap[item.id] = item.value
})
export default {
  components: {
    empdialog
  },
  data() {
    return {
      employess: [],
      total: 0,
      showDialog: false,
      q: {
        page: 1,
        size: 5
      }
    }
  },

  created() {
    this.loademployess()
  },

  methods: {
    handleSizeChange(code) {
      this.q.size = code
      this.loademployess()
    },
    handleCurrentChange(size) {
      this.q.page = size
      this.loademployess()
    },

    // 获取员工列表
    async loademployess() {
      const res = await getEmployees(this.q)
      // console.log(res)
      this.total = res.data.total
      this.employess = res.data.rows
    },

    // 删除员工列表
    async hDelete(id) {
      try {
        // 提示用户是否删除
        await this.$confirm('确定取消?', '提示', { type: 'warning' })
        // 发请求
        const res = await delEmployee(id)
        // console.log(res)
        // 提示用户
        this.$message.success(res.message)
        // 判断当前页是否大于一
        if (this.employess.length === 1 && this.q.page > 1) {
          this.q.page--
        }
        // 重新获取数据 渲染页面
        this.loademployess()
      } catch (e) {
        // 精细化处理
        if (e === 'cancel') return
        this.$message.error(e.message)
      }
    },

    formatEmployment(code) {
      // 去 constant 中寻找常量
      // const result = employeesCode.hireType.find(item => item.id === code)
      // if (result) {
      //   return result.value
      // } else {
      //   return '未知'
      // }

      return hireTypeMap[code]
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
