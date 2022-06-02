<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="rouls">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
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
              <el-pagination layout="prev,pager,next" />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoles, deleteRolesId } from '@/api/setting'
export default {
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
      rouls: [],
      total: 0
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

    // 删除模块
    Del(id) {
      this.$confirm('确实删除?', '提示', { type: 'warning' })
        .then(async() => {
          try {
            const res = await deleteRolesId(id)
            // console.log(res)
            this.$message.success(res.message)
            this.loadRouls()
          } catch (e) {
            this.$message.error(e.message)
          }
        }).catch(() => {})
    }
  }
}
</script>
