<template>
  <div id="main-body">
    <div class="select-checkbox">
      <el-select v-model="period_value" placeholder="请选择期次">
        <el-option
          v-for="item in options_period"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="situation" placeholder="请选择上传情况">
        <el-option
          v-for="item in upload_situation"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" @click="check" plain>查询</el-button>
    </div>
    
    <!-- 表格展示为上传信息 -->
    <el-table
        :data="class_info"
        stripe
        height="600"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="majorName"
          label="专业"
          width="180">
        </el-table-column>
        <el-table-column
          prop="classSequence"
          label="班级"
          width="180">
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import axios from "axios";
import GlobalVue from '../Global.vue';
export default {
  name: "FileUploadSituation",
  data() {
    return {
      server_config: this.global.server_config,
      options_period: [],
      period_value: "",
      class_info: [],
      upload_situation: ["已上交", "未上交"],
      situation: ""
    };
  },
  //页面初始化
  mounted:function(){
    var than = this;
    if(than.$data.period_value==""){
      var period_value = "initNewPeriod"
    }
    this.$axios
      .get(this.global.server_config.url + "/classInfo/UnloadClass", {
        params: {
          FiledName: period_value
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        than.$data.class_info = res.data;
      })
    this.$axios
      .get(this.global.server_config.url + "/upload/getPeriod", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        than.$data.options_period = res.data;
      })          
  },
  methods: {
    //查询按钮
    check(){
      if(this.$data.situation=="" || this.$data.period_value==""){
        this.$alert("请填写期次、上传情况", "信息缺失", {
          confirmButtonText: "确定",
        });
      }
      if(this.$data.situation=="未上交"){
        this.$axios
        .get(this.global.server_config.url + "/classInfo/UnloadClass", {
          params: {
            FiledName: this.$data.period_value
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.$data.class_info = res.data;
        })   
      }else if(this.$data.situation=="已上交"){
        this.$axios
        .get(this.global.server_config.url + "/classInfo/UploadedClass", {
          params: {
            FiledName: this.$data.period_value
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          this.$data.class_info = res.data;
        })
      }
    },
  }
};
</script>

<style scoped>
.select-checkbox {
  margin-bottom: 10px;
}
.choise-file {
  margin-bottom: 10px;
}
.info-option {
  margin-bottom: 20px;
}
</style>
