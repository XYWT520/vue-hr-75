<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="hAdd(1, '0')">添加权限</el-button>
        </div>
        <el-table border :data="permisson" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type === 1" type="text" @click="hAdd( 2, row.id)">添加</el-button>
              <el-button type="text" @click="hEdit(row.id)">编辑</el-button>
              <el-button type="text" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :visible.sync="showDialog" title="弹层标题" @close="resetForm">
      <!-- 表单内容 -->
      <el-form ref="form" :model="formData" label-width="100px" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="hSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      permisson: [],
      showDialog: false, // 是否显示弹层
      isEdit: false,
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur'] }
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: ['blur'] }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: ['blur'] }
        ]
      }
    }
  },

  created() {
    this.loadPermissons()
  },

  methods: {
    async loadPermissons() {
      const res = await getPermissionList()
      // console.log(res)
      this.permisson = tranListToTreeData(res.data)
    },

    // 添加权限
    hAdd(type, pid) {
      this.isEdit = false
      // console.log(type, pid)
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },

    // [添加权限] 添加页面级的权限
    async hSubmit() {
      const valid = await this.$refs.form.validate().catch(e => e)
      if (!valid) return
      // 三元判断
      this.isEdit ? this.doEdit() : this.doAdd()
    },

    // [添加]按钮
    async doAdd() {
      try {
        // 发请求
        const res = await addPermission(this.formData)
        // 提醒用户
        this.$message.success(res.message)
        // 关闭弹窗
        this.showDialog = false
        // 重新获取页面
        this.loadPermissons()
      } catch (e) {
        this.$message.success(e.message)
      }
    },

    // [编辑]按钮
    async doEdit() {
      try {
        const res = await updatePermission(this.formData)
        // console.log(res)
        this.$message.success(res.message)
        this.showDialog = false
        this.loadPermissons()
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 编辑按钮 获取最新的信息
    async hEdit(id) {
      this.isEdit = true
      const res = await getPermissionDetail(id)
      // console.log(res)
      this.formData = res.data
      this.showDialog = true
    },

    // 删除权限
    async hDel(id) {
      const result = await this.$confirm('确定删除?', '提示', { type: 'warning' })
        .catch(e => e)
        // 判断 如果我点击的不是确定那就不执行任何代码
      if (result !== 'confirm') return
      try {
        const res = await delPermission(id)
        // 提醒用户
        this.$message.success(res.message)
        // 重新渲染页面
        this.loadPermissons()
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 清空表单
    resetForm() {
      this.formData = {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
      this.$refs.form.clearValidate()
    }
  }

}
</script>

<style lang="scss" scoped>
.permission-container{
  user-select: none;
}
</style>
