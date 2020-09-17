<template>
  <div>
    <!-- :url="server_config.url+'/SingleFile'" -->
    <uploader
      browse_button="browse_button"
      
      :multi_selection="false"
      :FilesAdded="filesAdded"
      :filters="{
          mime_types : [
            //{ title : 'Image files', extensions : 'jpg,gif,png' },
            { title : 'zip,rar,7Z files', extensions : 'zip,rar,7Z' }
          ],
          max_file_size : '102400kb'
        }"
      @inputUploader="inputUploader"
    />
    <div id="main-body">
      <div id="war-text" style="margin-bottom: 10px;">
        <el-tag type="warning">注：2018届的为大三，2019届的为大二</el-tag>
      </div>
      <div class="info-option">
        <el-select @change="choise_period" v-model="period_value" placeholder="上传期次">
          <el-option
            v-for="item in options_period"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select @change="choise_grade" v-model="grade_value" placeholder="年级">
          <el-option
            v-for="item in options_grade"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select @change="choise_major" v-model="major_value" placeholder="专业">
          <el-option 
            v-for="item in options_major" 
            :key="item" 
            :label="item" 
            :value="item">
          </el-option>
        </el-select>
        <el-select @change="choise_class" v-model="class_value" placeholder="班级">
          <el-option 
            v-for="item in options_class" 
            :key="item" 
            :label="item" 
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="choise-file">
        <el-button id="browse_button" type="primary">选择文件</el-button>
        <span v-for="file in files" :key="file.name">{{file.name}}</span>
        <br />
      </div>
      <div class="start-load">
        <el-button type="danger" @click="uploadStart()">开始上传</el-button>
        <br />
      </div>

      <el-dialog title="正在上传" :visible.sync="dialogTableVisible">
        <el-progress
          v-if="files.length>0"
          :text-inside="true"
          :stroke-width="20"
          :percentage="files[0].percent"
        ></el-progress>
      </el-dialog>
      <br />
      <br />
      <div id="war-text">
        <el-tag type="warning">只允许上传ZIP，RAR，7Z文件, 最大只能上传100M的文件</el-tag>
      </div>
    </div>
    <!-- 重复上传对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>此班级已上传文件，是否覆盖之前的文件</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Uploader from "./Uploader";
import axios from "axios";
import GlobalVue from '../Global.vue';
export default {
  name: "SingleFileUpload",
  data() {
    return {
      server_config: this.global.server_config,
      files: [],
      up: {},
      dialogTableVisible: false,
      //文件重传显示
      dialogVisible: false,
      //期数数组
      options_period: [
        {
          value: "1",
          label: "第九季第十一期",
        },
        {
          value: "2",
          label: "第九季第十二期",
        },
      ],
      period_value: "",
      //年级数组
      options_grade: [
        {
          value: "大一",
        },
        {
          value: "大二",
        },
        {
          value: "大三",
        },
      ],
      grade_value: "",
      //专业数组
      options_major: [],
      major_value: "",
      //班级数组
      options_class: [],
      class_value: "",
      //班级id(需通过年级、专业、班级查询之后得出)
      class_id: "",
    };
  },
  computed: {
    status() {
      return this.files.length > 0 ? this.files[0].status : null;
    },
  },
  watch: {
    status() {
      if (this.status === 5) {
        this.$confirm("文件上传成功", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          this.dialogTableVisible = false;
        });
      }
    },
  },
  methods: {
    /**
     * setting single file limit
     * @param up
     * @param files
     */
    filesAdded(up, files) {
      if (up.files.length > 1) {
        up.removeFile(up.files[0]);
      }
    },
    //添加文件
    inputUploader(up) {
      this.up = up;
      this.files = up.files;
    },
    //上传文件
    uploadStart() {
      var than = this;
      //判断班级信息是否填入完整
      if (
        this.period_value == "" ||
        this.grade_value == "" ||
        this.major_value == "" ||
        this.class_value == ""
      ) {
        this.$alert("请输入学习期次、年级、专业、班级", "信息缺失", {
          confirmButtonText: "确定",
        });
        return;
      } else if (this.files == false) {
        //判断是否传入了文件
        this.$alert("请选择需要上传的文件", "信息缺失", {
          confirmButtonText: "确定",
        });
        return;
      }
      //查出此班级的id
      var class_id = this.get_class_id();
      //判断这个班级是否已经上传了文件
      this.$axios
        .get(this.global.server_config.url + "/judgeUpload", {
          params: {
            classId: class_id,
            fileId: than.$data.period_value,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.data != 0) {
            than.$data.dialogVisible = true;
          }
          console.log(res.data)
        });

      this.dialogTableVisible = true;
      this.up.start();
    },
    //获取班级id
    get_class_id(){
      var than = this;
      this.$axios.get(this.global.server_config.url + "/getClassId", {
          params: {
            grade: than.$data.grade_value,
            major: than.$data.major_value,
            sequence: than.$data.class_value
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          console.log("班级id: " + res.data)
          return res.data;
        });
        return 0;
    },
    //是否关闭“重复提交”框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //多选框选择交的期数
    choise_period() {},
    //多选框选择年级,展示不同的专业
    choise_grade(event) {
      var than = this;
      this.$axios
        .get(this.global.server_config.url + "/getMajor", {
          params: {
            grade: event,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          than.$data.options_major = res.data;
        });
    },
    //多选框选择专业,展示不同的班级
    choise_major(event) {
      var than = this;
      this.$axios
        .get(this.global.server_config.url + "/getAllClass", {
          params: {
            grade: than.$data.grade_value,
            major: event,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          than.$data.options_class = res.data;
        });
    },
    //多选框选择班级
    choise_class() {},
  },
  components: {
    uploader: Uploader,
  },
};
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
.choise-file {
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
