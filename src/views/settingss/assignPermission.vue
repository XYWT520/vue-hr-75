<template>
  <div>
    <el-tree ref="tree" :data="PermissionList" :props="{label:'name'}" default-expand-all show-checkbox node-key="id" check-strictly />
    <div class="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="hSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import { getRoleDetail, assignPermission } from '@/api/setting'
export default {
  props: {
    id: { required: true, type: String }
  },
  data() {
    return {
      PermissionList: []
    }
  },

  created() {
    // 获取所有的权限列表
    this.loadgetPermissionList()
    // 获取当前角色拥有的权限
    this.loadRoleDetail()
  },

  methods: {
    // 获取所有的权限列表
    async loadgetPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.PermissionList = tranListToTreeData(res.data)
    },
    // 获取当前角色拥有的权限
    async loadRoleDetail() {
      const res = await getRoleDetail(this.id)
      // console.log(res)
      this.$refs.tree.setCheckedKeys(res.data.permIds)
    },

    // 确定按钮
    async hSubmit() {
      const ids = this.$refs.tree.getCheckedKeys()
      // console.log(ids)
      // 发请求 保存数据
      const res = await assignPermission({ id: this.id, permIds: ids })
      this.$message.success(res.message)
      this.$emit('close')
      // console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer{
  display:flex;
  justify-content: end;
}

</style>
