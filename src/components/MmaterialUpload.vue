<template>
  <div>
    <div id="main-body">

      <div id="war-text" style="margin-bottom: 10px;">
        <el-tag type="warning">2018届的为大三，2019届的为大二</el-tag>
      </div>

      <div class="info-option">
        <el-select v-model="period_value" placeholder="上传期次">
          <el-option
            v-for="item in options_period"
            :key="item"
            :label="item"
            :value="item"
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

      <!-- 文件上传拖拽框 -->
      <el-upload
        class="upload-demo"
        drag
        show-file-list
        :limit="limit"
        accept=".zip,.7z,.rar"
        :before-upload="onBeforeUpload"
        :before-remove="onBeforeRemove"
        :on-remove="onRemove"
        :on-success="onLoadSuccess"
        :on-error="onLoadError"
        :action="syntheticUploadUrl()"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>

      <br />
      <div id="war-text">
        <el-tag type="warning">只允许上传ZIP，RAR，7Z文件、每次只能上传一个文件、最大只能上传100M的文件</el-tag>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import GlobalVue from '../Global.vue';
export default {
  name: "MmaterialUpload",
  data() {
    return {
      server_config: this.global.server_config,
      files: [],
      up: {},
      // 最大上传个数
      limit: 1,
      options_period: [],
      period_value: "",
      // 年级数组
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
      // 专业数组
      options_major: [],
      major_value: "",
      // 班级数组
      options_class: [],
      class_value: "",
      // 班级id(需通过年级、专业、班级查询之后得出)
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
  //页面初始化
  mounted:function(){
    var than = this;
    this.$axios
      .get(this.global.server_config.url + "/getPeriod", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        than.$data.options_period = res.data;
      })     
  },
  methods: {
    // 上传文件之间的判断操作(异步)
    // async 
    onBeforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      // console.log(testmsg)
      const extension = testmsg === 'zip'
      const extension2 = testmsg === '7z'
      const extension3 = testmsg === 'rar'
      const isLt100M = file.size / 1024 / 1024 < 100
      // 判断班级信息是否填入完整
      if (
        this.period_value == "" ||
        this.grade_value == "" ||
        this.major_value == "" ||
        this.class_value == ""
      ) {
        console.log(this.period_value)
        this.$alert("请填写学习期次、年级、专业、班级", "信息缺失", {
          confirmButtonText: "确定",
        });
        return false;
      }
      // 判断格式正确
      if(!extension && !extension2 && !extension3) {
        this.$message.error('上传文件只能是zip、7z、rar格式!');
        return false;
      }
      // 判断大小正确
      if (!isLt100M) {
        this.$message.error('上传文件大小不能超过 100MB!');
        return false;
      }
    },
    // 查出此班级的id，并判断这个班级是否已经上传了文件
    async judgeRepeat(){
      var class_id;
      await this.$axios.get(this.global.server_config.url + "/getClassId", {
          params: {
            grade: this.$data.grade_value,
            major: this.$data.major_value,
            sequence: this.$data.class_value
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res1) => {
          console.log("班级id: " + res1.data)
          class_id = res1.data;
          // 判断这个班级是否已经上传了文件
          this.$axios
            .get(this.global.server_config.url + "/judgeUpload", {
              params: {
                classId: class_id,
                fileId: this.$data.period_value,
              },
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            })
            .then((res2) => {
              if (res2.data != 0) {
                console.log("res2.data != 0 :  " + res2.data);  
                this.$data.dialogVisibleRepeat = true;
                return false;
              }
              console.log("判断这个班级是否已经上传了文件" + res2.data);
            });
        });
      return true;
    },
    // 获取班级id
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
          than.$data.class_id = res.data;
        });
    },
    // 删除文件之前
    onRemove(file){
      // this.$message('这是onRemove');
    },
    // 删除文件之前的操作
    onBeforeRemove(file, fileList){
      return true;
    },
    //合成需要的url
    syntheticUploadUrl(){
      var url = this.global.server_config.url + "/SingleFile" 
                  + "?periodName=" + this.$data.period_value
                  + "&grade=" + this.$data.grade_value
                  + "&major=" + this.$data.major_value
                  + "&sequence=" + this.$data.class_value
      // console.log(url)
      return url;
    },
    //上传成功
    onLoadSuccess(){
      this.$message({
          message: '恭喜你，上传成功',
          type: 'success'
        });
    },
    //上传失败
    onLoadError(){
     this.$message.error('文件上传失败');
    },
    //是否关闭“重复提交”框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

// **************** 选择框信息获取 ****************
    //多选框选择交的期数
    choise_period(event) {},
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
};
</script>

<style scoped>
.choise-file {
  margin-bottom: 10px;
}
.info-option {
  margin-bottom: 20px;
}
</style>
