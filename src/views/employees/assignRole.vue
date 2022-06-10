<template>
  <!-- // 分配角色 -->
  <div>
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roles " :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSubmit">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getRoles } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employess'
export default {
  props: {
    id: { required: true, type: String }
  },
  data() {
    return {
      roleIds: [],
      roles: []
    }
  },

  created() {
    this.loadgetRoles()
    this.loadgetRoleIds()
  },

  methods: {
    // 取消按钮 关闭 dialog
    closeDialog() {
      this.$emit('success')
    },

    // 获取角色信息
    async loadgetRoles() {
      const res = await getRoles()
      //   console.log(res)
      this.roles = res.data.rows
    },

    // 根据父组件传递过来的 id 获取   角色对应的 id
    async loadgetRoleIds() {
      const res = await getUserDetailById(this.id)
      //   console.log(res)
      this.roleIds = res.data.roleIds
    },

    // 分配角色 确定按钮
    async hSubmit() {
      const res = await assignRoles({ id: this.id, roleIds: this.roleIds })
      //   console.log(res)
      this.$message.success(res.message)
      this.$emit('success')
    },

    resetRoleIds() {
      this.roleIds = []
    }
  }
}
</script>
