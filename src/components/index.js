import PageTools from '@/components/pageTools'
import UploadExcel from '@/components/UploadExcel'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
  }
}
