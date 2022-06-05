<template>
  <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
</template>

<script>
import { formatExcelDate } from '@/utils/index'
import { importEmployees } from '@/api/employess'
export default {
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      // console.log('这是上传的结果:', results, header)
      // console.log('这是转为英文的结果:', this.transExcel(results))
      // this.transExcel(results)
      const data = this.transExcel(results)
      try {
        // 发请求
        const res = await importEmployees(data)
        // 提醒用户
        this.$message.success(res.message)
        // 返回上一级菜单
        this.$router.back()
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    transExcel(results) {
      const mapInfo = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // zhObj 是中文对象
      return results.map(zhObj => {
        // 这是英文数组
        const enObj = {}
        // 将中文数组里面的键取出来赋值给 ZhJian
        const ZhJian = Object.keys(zhObj)
        // console.log(ZhJian) // 这是中文的 键
        ZhJian.forEach(zhKey => {
          const enKey = mapInfo[zhKey]
          console.log(enKey)
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            enObj[enKey] = new Date(formatExcelDate(zhObj[zhKey]))
          } else {
            enObj[enKey] = zhObj[zhKey]
          }
        })
        return enObj
      })

      // zhObj 是中文对象
      // return results.map(zhObj => {
      //   // 这是英文对象
      //   const enObj = {}
      //   // 将中文数组里面的键取出来赋值给 ZhJian
      //   const ZhJian = Object.keys(zhObj)
      //   // ZhJian = ['入职日期', '姓名', '工号', '手机号', '转正日期', '部门']
      //   // console.log(ZhJian) // 打印出来的是中文的键
      //   ZhJian.forEach(item => {
      //     const enKey = mapInfo[item]
      //     // const enKey = mapInfo[timeOfEntry]
      //     // const enKey = mapInfo[mobile]
      //     // const enKey = mapInfo[username]
      //     // const enKey = mapInfo[mobile]
      //     // const enKey = mapInfo[timeOfEntry]
      //     // const enKey = mapInfo[mobile]

      //     // console.log(mapInfo[zhKey]) // mapInfo[zhKey] 打印出来的是英文的键
      //     enObj[enKey] = zhObj[item]
      //     // enobj:{mobile:''}
      //     // console.log(zhObj[zhKey]) // zhObj[zhKey] 打印出来的是 results 里的值
      //     // console.log(enObj[enKey]) // enObj[enKey] 打印出来的是 results 里的值
      //   })
      //   return enObj
      // })
    }
  }
}
</script>

<style>

</style>
