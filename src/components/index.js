import PageTools from '@/components/pageTools'
import UploadExcel from '@/components/UploadExcel'
import UploadImg from '@/components/UploadImg'
import ImggeHolder from '@/components/ImggeHolder'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(UploadImg.name, UploadImg)
    Vue.component(ImggeHolder.name, ImggeHolder)
  }
}
