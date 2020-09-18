import Vue from 'vue'
import Router from 'vue-router'
import YouthLearningUpload from '../components/YouthLearningUpload'
import MmaterialUpload from '../components/MmaterialUpload'
import FileUploadSituation from '../components/FileUploadSituation'
// import BigFileUpload from '../components/BigFileUpload'
// import StopUpload from '../components/StopUpload'
// import QuickUpload from '../components/QuickUpload'
// import SingleFileUpload from '../components/SingleFileUpload'
// import MultiFileUpload from  '../components/MultiFileUpload'
// import PictureUpload from '../components/PictureUpload'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/YouthLearningUpload',component:YouthLearningUpload,name:'YouthLearningUpload'},
    {path:'/MmaterialUpload',component:MmaterialUpload,name:'MmaterialUpload'},
    {path:'/FileUploadSituation',component:FileUploadSituation,name:'FileUploadSituation'},
    // {path:'/bigFileUpload',component:BigFileUpload,name:'bigFileUpload'},
    // {path:'/stopUpload',component:StopUpload,name:'stopUpload'},
    // {path:'/quickUpload',component:QuickUpload,name:'quickUpload'},
    // {path:'/multiFileUpload',component:MultiFileUpload,name:'multiFileUpload'},
    // {path:'/pictureUpload',component:PictureUpload,name:'pictureUpload'},
    // {path:'/',component:SingleFileUpload,name:'singleFileUpload'}
  ]
})
