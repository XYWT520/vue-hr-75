import PageTools from '@/components/pageTools'
import UploadExcel from '@/components/UploadExcel'
import UploadImg from '@/components/UploadImg'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(UploadImg.name, UploadImg)
  }
}
