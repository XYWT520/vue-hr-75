<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <!-- 新增弹框 -->
            <el-dialog
              :title="isEdit?'编辑':'添加'"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              :visible.sync="showDialog"
              @close="hClose"
            >
              <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="roleForm.name" @keydown.enter.native="click(hSubmit)" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                  <el-input v-model="roleForm.description" />
                </el-form-item>
              </el-form>
              <!-- 底部 -->
              <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                  <el-button size="small" @click="cancel">取消</el-button>
                  <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
                </el-col>
              </el-row>
            </el-dialog>
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="hAdd"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="rouls">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success" @click="Assign(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="Edit(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="Del(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="q.page"
                :page-sizes="[2, 3, 5, 10]"
                :page-size="q.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="hSizeChange"
                @current-change="hCurrentChange"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog
        title="分配权限"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialogAssign"
      >
        <AssignPermission v-if="showDialogAssign" :id="cutId" @close="showDialogAssign=false" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoles, deleteRolesId, addRoules, EditRoules } from '@/api/setting'
import AssignPermission from './assignPermission.vue'
export default {
  components: {
    AssignPermission
  },
  data() {
    return {
      q: {
        page: 1,
        pagesize: 2
      },
      pageParams: {
        page: 1, // 查询第一页
        pagesize: 2 // 每页两条  --- 要与pagination中page-size一致
      },
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: ['change', 'blur'] }],
        description: [{ required: true, message: '角色描述不能为空', trigger: ['change', 'blur'] }]
      },
      showDialog: false,
      isEdit: false,
      rouls: [],
      total: 0,
      showDialogAssign: false,
      cutId: ''
    }
  },

  // 页面加载渲染
  created() {
    this.loadRouls()
  },

  methods: {
    async loadRouls() {
      try {
        const res = await getRoles(this.q)
        // console.log(res)
        this.rouls = res.data.rows
        this.total = res.data.total
      } catch (e) {
        console.log(e)
      }
    },
    hCurrentChange(page) {
      this.q.page = page
      this.loadRouls()
    },
    hSizeChange(pagesize) {
      this.q.pagesize = pagesize
      this.loadRouls()
    },

    // 弹出框的确定按钮
    async hSubmit() {
      const valid = await this.$refs.roleForm.validate()
      // 趁早返回
      if (!valid) return
      // 判断点击的是编辑还是添加
      if (this.isEdit) {
        this.doEdit()
      } else {
        this.doAdd()
      }
    },

    // 添加
    async doAdd() {
      // 发请求
      const res = await addRoules(this.roleForm).catch(e => e)
      if (res.code !== 10000) return this.$message.error('请求超时,请重试!')
      // 提醒用户
      this.$message.success(res.message)
      // 关闭弹窗
      this.showDialog = false
      // 当最后一个满了 将 total 加一
      if (this.total % this.q.pagesize === 0) {
        this.total++
      }
      // 跳到最后一页
      this.q.page = Math.ceil(this.total / this.q.pagesize)
      // 清空表单
      this.$refs.roleForm.resetFields()
      // 重新获取数据 渲染页面
      this.loadRouls()
    },

    // 编辑
    async doEdit() {
      // 发请求
      const res = await EditRoules(this.roleForm).catch(e => e)
      if (res.code !== 10000) return this.$message.error('请求超时,请重试!')
      // 提醒用户
      this.$message.success(res.message)
      // 关闭弹窗
      this.showDialog = false
      // 重新获取数据 渲染页面
      this.loadRouls()
    },

    // 弹出框的取消按钮
    // cancel() {
    //   this.showDialog = false
    //   this.$refs.roleForm.resetFields()
    // },

    // 编辑模块
    Edit(row) {
      this.isEdit = true
      this.showDialog = true
      this.roleForm = { ...row }
    },

    hAdd() {
      this.isEdit = false
      this.showDialog = true
    },

    // 删除模块
    async Del(id) {
      // this.$confirm('确实删除?', '提示', { type: 'warning' })
      //   .then(async() => {
      //     try {
      //       const res = await deleteRolesId(id)
      //       // console.log(res)
      //       this.$message.success(res.message)
      //       this.loadRouls()
      //     } catch (e) {
      //       this.$message.error(e.message)
      //     }
      //   }).catch(() => {})

      const result = await this.$confirm('确实删除?', '提示', { type: 'warning' })
        .catch(e => e)
      // console.log(result)
      // 判断 用户点的确定是 confirm 点的取消是 cancel
      if (result !== 'confirm') return
      // 删除 bug 修复
      if (this.rouls.length === 1 && this.q.page > 1) {
        this.q.page--
      }
      // 发请求
      const res = await deleteRolesId(id)
      // console.log(res)
      // 提醒用户
      this.$message.success(res.message)
      // 重新渲染
      this.loadRouls()
    },

    // 弹出框的取消按钮
    cancel() {
      this.showDialog = false
    },

    // 清空表单
    hClose() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
    },

    // 分配权限
    Assign(id) {
      this.showDialogAssign = true
      this.cutId = id
    }
  }
}
</script>
