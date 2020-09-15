<template>
    <div>
      <uploader
        browse_button="browse_button" 
        :url="server_config.url+'/SingleFile/?classId=' + '&fileId=1'"
        :multi_selection="false"
        :FilesAdded="filesAdded"
        :filters="{
          mime_types : [
            //{ title : 'Image files', extensions : 'jpg,gif,png' },
            { title : 'Zip files', extensions : 'zip' }
          ],
          max_file_size : '102400kb'
        }"
        @inputUploader="inputUploader"
      />
      <div id="main-body">
        <div class="info-option">
           <el-select @change="choise_period()" v-model="period_value" placeholder="上传期次">
            <el-option
              v-for="item in options_period"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select >
          <el-select @change="choise_grade()" v-model="grade_value" placeholder="年级">
            <el-option
              v-for="item in options_grade"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select >
          <el-select @change="choise_major()" v-model="major_value" placeholder="专业">
            <el-option
              v-for="item in options_major"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select @change="choise_class()" v-model="class_value" placeholder="班级">
            <el-option
              v-for="item in options_class"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="choise-file">
          <el-button id="browse_button" type="primary">选择文件</el-button>
          <span v-for="file in files" :key="file">{{file.name}}</span><br/>
        </div>
        <div class="start-load">
        <el-button type="danger" @click="uploadStart()">开始上传</el-button><br/>
        </div>

        <el-dialog title="正在上传" :visible.sync="dialogTableVisible">
          <el-progress v-if="files.length>0" :text-inside="true" :stroke-width="20" :percentage="files[0].percent"></el-progress>
        </el-dialog>
        <br/>
        <br/>
        <div id="war-text">
          <el-tag type="warning">只允许上传zip文件, 最大只能上传100M的文件</el-tag>
        </div>
      </div>
    </div>
</template>

<script>
  import Uploader from './Uploader'
  export default {
    name: "SingleFileUpload",
    data() {
      return {
        server_config: this.global.server_config,
        files:[],
        up: {},
        dialogTableVisible: false,
        options_period: [{
          value: '1',
          lable: '第九季第十一期'
        }, {
          value: '2',
          lable: '第九季第十二期'
        }],
        period_value: '',
        options_grade: [{
          value: '1',
          label: '大一'
        }, {
          value: '2',
          label: '大二'
        }, {
          value: '3',
          label: '大三'
        }],
        grade_value: '',
        options_major: [{
          value: '1',
          label: '计科'
        }, {
          value: '2',
          label: '电信'
        }, {
          value: '3',
          label: '机械'
        }, {
          value: '4',
          label: '大数据'
        }, {
          value: '5',
          label: '互金'
        }],
        major_value: '',
        options_class: [{
          value: '1',
          label: '1801'
        }, {
          value: '2',
          label: '1802'
        }, {
          value: '3',
          label: '1803'
        }, {
          value: '4',
          label: '1804'
        }, {
          value: '5',
          label: '1805'
        }],
        class_value: ''
      }
    },
    computed: {
      status() {
        return this.files.length > 0 ? this.files[0].status : null;
      }
    },
    watch: {
      status() {
        if (this.status === 5) {
          this.$confirm('文件上传成功', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            this.dialogTableVisible = false;
          });
        }
      }
    },
    methods: {
      /**
       * setting single file limit
       * @param up
       * @param files
       */
      filesAdded(up, files) {
        if (up.files.length > 1) {
          up.removeFile(up.files[0])
        }
      },
      inputUploader(up) {
        this.up = up;
        this.files = up.files;
      },
      uploadStart() {
        if(this.grade_value == '' || this.major_value == '' || this.class_value == '' ){
          this.$alert('请输入年级、专业、班级', '信息缺失', {
            confirmButtonText: '确定',
          });
          return
        }else if(this.files == false){
          this.$alert('请选择需要上传的文件', '信息缺失', {
            confirmButtonText: '确定',
          });
          return
        }
        //还要添加一个步骤：判断这个班级是否已经上传了文件。如果已经上传了文件，但是想覆盖之前的数据（确认、取消）
        this.$ajax({
          method: 'post',
          url: 'http://localhost:3344/SingleFile?classId=' + this.data.class_value + '&fileId=' + this.data.period_value,
          data:{
            options_period: response.data.options_period,
            options_grade: response.data.options_grade,
            options_major: response.data.options_major,
            options_class: response.data.options_class,
          }
        }).then(response=>{
          alert('post code done');
        }).catch(function(err){
            console.log(err)
        });
        this.dialogTableVisible = true;
        this.up.start();
      },
      choise_period() {

      },
      choise_grade() {

      },
      choise_major() {
        
      },
      choise_class() {
        
      },
    },
    components: {
      'uploader': Uploader
    },
  }
</script>

<style scoped>
/* #main-body{
  width: 211px;
  margin: 0 auto;
}

#war-text{
  position: relative;
  left: -27px;
  margin: 0 auto;
} */
 .choise-file{
  /* margin-top: 30px; */
  margin-bottom: 10px;
}
/*
.file-name{
  margin-bottom: 10px;
}
.start-load{
  margin-bottom: 10px;
} */
.info-option {
  margin-bottom: 20px;
}
</style>
