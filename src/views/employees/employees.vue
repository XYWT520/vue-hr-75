<template>
  <div class="department-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总共: {{ total }} 条</span>
        </template>
        <template #right>
          <el-button v-remove="'import_excel'" round size="small" type="warning" @click="$router.push('/employees/import')">导入Excel</el-button>
          <el-button v-remove="'export_excel'" round size="small" type="danger" @click="handleDownload">导出Excel</el-button>
          <el-button v-remove="'assgin_roles'" round size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 20px">
        <el-table :data="employess">
          <el-table-column label="序号" prop="" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="username">
            <template v-slot="{row}">
              <!-- <img class="avatar" :src="row.staffPhoto" alt=""> -->
              <ImggeHolder :src="row.staffPhoto" />
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
          <el-table-column sortable label="入职时间" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ formatDate(row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push('/employees/detail/' + row.id)">查看</el-button>
              <!-- <el-button type="text" size="small" @click="$router.push('/employees/detail?id=' + row.id)">查看</el-button> -->
              <!-- <el-button type="text" size="small" @click="$router.push({path:'/employees/detail',query:{id:row.id} })">查看</el-button> -->
              <el-button type="text" size="small" @click="assginRole(row.id)">分配角色</el-button>
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
      @close="hCloseDialog"
    >
      <empdialog ref="AddEmployee" @close="showDialog = false" @success="hSuccess" />
    </el-dialog>

    <!-- 分配角色分配角色分配角色分配角色分配角色分配角色分配角色分配角色分配角色分配角色 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新增员工"
      width="45%"
      :visible.sync="showRoleDialog"
      @closed="$refs.assginRole.resetRoleIds()"
    >
      <assginRole :id="curId" ref="assginRole" @success="showRoleDialog = false" />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployees, delEmployee } from '@/api/employess'
// 导入枚举数据
import employeesCode from '@/constant/employees'
import empdialog from './empDialog.vue'
import dayjs from 'dayjs'
import assginRole from './assignRole.vue'

// 准备一个映射对象, 最终目标是: {1: '正式', 2: '非正式'}
const hireTypeMap = {} // {1: '正式', 2: '非正式'}
employeesCode.hireType.forEach(item => {
  hireTypeMap[item.id] = item.value
})
export default {
  components: {
    empdialog,
    assginRole
  },
  data() {
    return {
      employess: [],
      total: 0,
      showDialog: false,
      showRoleDialog: false,
      curId: '',
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

    // 导出Excel表格
    async handleDownload() {
      const mapInfo = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      // 发请求获取全部数据
      const res = await getEmployees({ page: 1, size: this.total })
      // console.log(res)
      const list = res.data.rows

      const zhlist = list.map(item => {
        const zhObj = {}
        const enkeys = Object.keys(item)
        // console.log(enkeys) // 英文的属性名
        enkeys.forEach(items => {
          const zhkeys = mapInfo[items]
          // console.log(zhkeys)  // 中文的属性名
          zhObj[zhkeys] = item[items]
        })
        return zhObj
      })

      // 取出第一个数据
      const first = zhlist[0]
      // const first = list[0]
      // 判断有没有第一个数据 没有就不让执行下面的代码
      if (!first) return

      // 取出 header
      // const header = Object.keys(first).map(item => mapInfo[item])
      const header = Object.keys(first)

      // 取出 data 里的数据
      // const data = list.map(item => {
      //   // 聘用形式
      //   const code = item['formOfEmployment']
      //   item['formOfEmployment'] = hireTypeMap[code]
      //   return Object.values(item)
      // })
      const data = zhlist.map(item => {
        // 聘用形式
        const code = item['聘用形式']
        item['聘用形式'] = hireTypeMap[code]
        return Object.values(item)
      })

      this.downloadLoading = true
      const excel = await import('@/vendor/Export2Excel')
      excel.export_json_to_excel({
        header, // 表头 必填
        data, // 具体数据 必填
        filename: 'excel-list', // 文件名称
        autoWidth: true, // 宽度是否自适应
        bookType: 'xlsx' // 生成的文件类型
      })
      this.downloadLoading = false
    },

    hSuccess() {
      // 关闭 dialog
      this.showDialog = false
      // 判断最后一页是否满了
      // if (this.total % this.q.size === 0) {
      //   this.total++
      // }
      this.total++
      // 算出最后一页赋值给 this.q.page
      this.q.page = Math.ceil(this.total / this.q.size)
      // 重新获取数据
      this.loademployess()
    },

    hCloseDialog() {
      this.$refs.AddEmployee.resetForm()
    },

    // 格式化时间
    formatDate(data) {
      return dayjs(data).format('YYYY-MM-DD')
    },

    // 枚举
    formatEmployment(code) {
      // 去 constant 中寻找常量
      // const result = employeesCode.hireType.find(item => item.id === code)
      // if (result) {
      //   return result.value
      // } else {
      //   return '未知'
      // }
      return hireTypeMap[code]
    },

    // 分配角色分配角色分配角色分配角色分配角色分配角色分配角色分配角色分配角色分配角色
    assginRole(id) {
      this.curId = id
      this.showRoleDialog = true
      this.$nextTick(() => {
        // 调用子组件的 loadgetRoleIds 方法
        this.$refs.assginRole.loadgetRoleIds()
      })
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
