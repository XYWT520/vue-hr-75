<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <svg-icon icon-class="home" /><span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="hShowAdd('')">添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-tree default-expand-all :data="list">
          <template v-slot="{data}">
            <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width:100% ">
              <el-col :span="20">
                <svg-icon icon-class="home" /><span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <!-- 下拉菜单 element -->
                  <el-col>
                    <el-dropdown>
                      <span>
                        操作<i class="el-icon-arrow-down" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="hShowAdd(data.id)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hShowEdit(data.id)">编辑子部门</el-dropdown-item>
                        <el-dropdown-item v-if="data.children.length === 0 " @click.native="hShowDel(data.id)">删除部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 添加的dialog -->
    <el-dialog
      :title=" isEdit ? '编辑' : '添加'"
      :visible.sync="showVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
    >
      <!-- :pid="cutId" 父向子传值 @success="hsuccess" 子向父传值 -->
      <add-or-edit v-if="showVisible" :id="cutId" :origin="origin" :is-edit="isEdit" @success="hsuccess" @guuanbi="close" />
    </el-dialog>

    <!-- 编辑的dialog -->
    <el-dialog
      title="编辑"
      :visible.sync="showVisibleEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
    >
      <!-- :pid="cutId" 父向子传值 @success="hsuccess" 子向父传值 -->
      <!-- 当封装相同组件时,很容易碰到数据残留的 bug , 主要原因时 dialog 隐藏没有销毁 -->
      <!--
        解决方案:
        1. 使用 v-if 认为的让组件销毁
        2. 随着 dialog 显示隐藏, 手动调用子组件的方法, 数据重新加载

       -->
      <add-or-edit v-if="showVisibleEdit" :id="cutId" :origin="origin" :is-edit="isEdit" @success="hsuccess" @guuanbi="close" />
    </el-dialog>
  </div>
</template>

<script>
import { DeleteDepartDetail, departmentsList } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import addOrEdit from './depDialog.vue'
export default {
  components: {
    addOrEdit
  },
  data() {
    return {
      // 依赖一份树形数据
      // list: [{
      //   name: '财务部',
      //   manager: '刘备',
      //   children: [
      //     {
      //       name: '财务核算部',
      //       manager: '张飞'
      //     },
      //     {
      //       name: '税务核算部',
      //       manager: '关羽'
      //     }
      //   ]
      // }]
      list: [],
      showVisible: false,
      showVisibleEdit: false,
      cutId: '',
      isEdit: false,
      origin: []
    }
  },
  created() {
    this.loadDepartmentsList()
  },

  methods: {
    // 获取最新数据
    async loadDepartmentsList() {
      const res = await departmentsList()
      res.data.depts.shift()
      // console.log(res.data.depts)
      // 过滤出来所需要的数据
      // 1. 第一种写法
      // this.origin = res.data.depts.map((item) => {
      //   return { id: item.id, pid: item.pid, name: item.name, code: item.code }
      // })
      // 2.第二种写法
      // 把过滤的数据传递给子组件
      this.origin = res.data.depts.map(({ id, pid, name, code }) => ({ id, pid, name, code }))
      // console.log(this.origin)
      this.list = tranListToTreeData(res.data.depts)
    },

    // 添加按钮
    hShowAdd(id) {
      this.showVisible = true
      this.cutId = id
      this.isEdit = false
    },

    // 编辑按钮
    hShowEdit(id) {
      this.cutId = id
      this.showVisibleEdit = true
      // 点击编辑按钮, idEdit 变为 true
      this.isEdit = true
    },

    // 删除按钮
    hShowDel(id) {
      this.$confirm('确定删除?', '提示', {

      }).then(async() => {
        try {
          const res = await DeleteDepartDetail(id)
          this.$message.success(res.message)
          this.loadDepartmentsList()
        } catch (e) {
          this.$message.error(e.message)
        }
      }).catch(() => {})
    },

    // 关闭 dialog
    hsuccess() {
      this.showVisible = false
      this.showVisibleEdit = false

      this.loadDepartmentsList()
    },

    // 取消按钮 关闭 dialog
    close() {
      this.showVisible = false
      this.showVisibleEdit = false
    }
    // tset(scope) {
    //   console.log(scope)
    // }
  }
}
</script>

<style lang="scss">
body {
  user-select: none;
}
</style>
