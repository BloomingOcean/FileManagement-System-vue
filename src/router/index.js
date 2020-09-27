import Vue from 'vue'
import Router from 'vue-router'
import YouthLearningUpload from '../components/YouthLearningUpload'
import MmaterialUpload from '../components/MmaterialUpload'
import FileUploadSituation from '../components/FileUploadSituation'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/YouthLearningUpload',component:YouthLearningUpload,name:'YouthLearningUpload'},
    {path:'/MmaterialUpload',component:MmaterialUpload,name:'MmaterialUpload'},
    {path:'/FileUploadSituation',component:FileUploadSituation,name:'FileUploadSituation'},
  ]
})
