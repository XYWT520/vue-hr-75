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
          <el-button round size="small" type="primary">新增员工</el-button>
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
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">分配角色</el-button>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployees } from '@/api/employess'
// 导入枚举数据
import employeesCode from '@/constant/employees'

// 准备一个映射对象, 最终目标是: {1: '正式', 2: '非正式'}
const hireTypeMap = {}
employeesCode.hireType.forEach(item => {
  hireTypeMap[item.id] = item.value
})
export default {
  data() {
    return {
      employess: [],
      total: 0,
      q: {
        page: 1,
        size: 10
      }
    }
  },

  created() {
    this.loademployess()
  },

  methods: {
    // 获取员工列表
    async loademployess() {
      const res = await getEmployees(this.q)
      // console.log(res)
      this.total = res.data.total
      this.employess = res.data.rows
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
