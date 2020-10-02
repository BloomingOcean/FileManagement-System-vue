<template>
  <div id="app">
    <el-container class="my-container">
      <el-header class="my-header">
        <span style="color: aliceblue;font-size: x-large">组织部文件上传系统(version 3.0)</span>
      </el-header>
      <el-container>
        <el-aside>
          <el-menu :default-active="defaultActive" style="height: 100%">
            <el-menu-item index="YouthLearningUpload" @click="redirectUrl('/YouthLearningUpload')">
              <i class="el-icon-menu"></i>
              <span slot="title">青年大学习</span>
            </el-menu-item>
            <el-menu-item index="MmaterialUpload" @click="MmaterialUpload()">
              <i class="el-icon-menu"></i>
              <span slot="title">资料</span>
            </el-menu-item>
            <el-menu-item index="FileUploadSituation" @click="redirectUrl('/FileUploadSituation')">
              <i class="el-icon-menu"></i>
              <span slot="title">文件上交情况</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="my-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        defaultActive: this.$route.name
      }
    },
    methods: {
      redirectUrl(val){
        this.$router.push(val);
      },
      MmaterialUpload(){
        this.$alert('此功能暂未开放，敬请期待', '提示', {
          confirmButtonText: '确定',
          });
      },
      FileUploadSituation(){
        this.$alert('无管理员权限，禁止访问', '提示', {
          confirmButtonText: '确定',
        });
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .my-container {
    margin: 0 auto;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .my-header {
    background-color: deepskyblue;
    height: 20px;
    font-size: large;
    display: flex;
    justify-content:center;
    align-items:center;
  }
  .my-main {
    margin: 1em 1em;
  }
</style>
