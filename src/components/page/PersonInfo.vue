<template>
    <div>
        <el-row :gutter="20" style="margin-top:10px;" v-loading="loading">
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>个人中心</span>
                        </div>
                        <div class="name-role">
                            <span class="sender">{{dataForm.name}}</span>
                        </div>
                        <div class="registe-info">
          <span class="registe-info">
              <li class="fa fa-clock-o">注册时间： {{dataForm.addtime}}</li>
          </span>
                        </div>
                        <el-divider></el-divider>
                        <div class="personal-relation">
                            <div class="relation-item">学号:  <div style="float: right; padding-right:20px;">{{dataForm.username}}</div></div>
                        </div>
                        <div class="personal-relation">
                            <div class="relation-item">性别:  <div style="float: right; padding-right:20px;">{{dataForm.sex}}</div></div>
                        </div>
                        <div class="personal-relation">
                            <div class="relation-item">年级:  <div style="float: right; padding-right:20px;">{{dataForm.grade}}</div></div>
                        </div>
                        <div class="personal-relation">
                            <div class="relation-item">班级:  <div style="float: right; padding-right:20px;">{{dataForm.banji}}</div></div>
                        </div>
                        <div class="personal-relation">
                            <div class="relation-item">职称:  <div style="float: right; padding-right:20px;">{{dataForm.type}}</div></div>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="grid-content bg-purple">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>基本资料</span>
                        </div>
                        <div>
                            <el-form label-width="80px" v-model="dataForm" size="small" label-position="right">
                                <el-form-item label="年级" prop="grade">
                                    <el-input  maxlength="16" auto-complete="off" v-model="dataForm.grade"></el-input>
                                </el-form-item>
                                <el-form-item label="班级" prop="banji">
                                    <el-input maxlength="16" auto-complete="off" v-model="dataForm.banji"></el-input>
                                </el-form-item>
                                <el-form-item label="性别" prop="sex">
                                    <el-input  maxlength="2" v-model="dataForm.sex"></el-input>
                                </el-form-item>
                                <el-form-item label="新的密码" prop="password">
                                    <el-input  maxlength="16" v-model="dataForm.password"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button size="mini" @click="sendData" type="primary">提交</el-button>
                                <el-button size="mini" @click="back" type="warning" >关闭</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>

        </el-row>
    </div>
</template>
<script>
    export default {
        name: "PersonInfo",
        data(){
            return{
                dataForm:{
                    name: '',
                    username: '',
                    sex: '',
                    grade: '',
                    banji: '',
                    type: '',
                    addtime: '',
                    password: ''
                },
                loading: true,
            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/personinfo") {
                        that.getData();
                    }
                },
                deep: true
            }
        },

        created(){
            this.getData();
        },

        methods: {
            getData(){
                this.loading=true;
                this.$axios.get("/PersonInfo").then(res1=>{
                    if (res1.data.code===200){
                        this.dataForm.name=res1.data.data.name;
                        this.dataForm.addtime=res1.data.data.addtime;
                        this.dataForm.username=res1.data.data.username;
                        this.dataForm.sex=res1.data.data.sex;
                        this.dataForm.grade=res1.data.data.grade;
                        this.dataForm.banji=res1.data.data.banji;
                        this.dataForm.type=res1.data.data.type;
                        this.dataForm.addtime=res1.data.data.addtime;
                        if (this.dataForm.grade===0){
                            this.dataForm.grade="";
                        }
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：personinfo.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },
            sendData(){
                this.loading=true;
                this.$axios.post('/PersonInfoUpdate',{
                    grade: this.dataForm.grade,
                    banji: this.dataForm.banji,
                    sex: this.dataForm.sex,
                    password: this.dataForm.password,
                }).then(res3=>{
                    if (res3.data.code===200){
                        this.getData();
                        this.$message.success('修改成功');
                    } else if (res3.data.code===400) {
                        this.$message.error('查询失败:' + res3.data.message);
                    } else if (res3.data.code===403) {
                        this.$message.error('查询失败:' + res3.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res3.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：personinfo.sendData 出错详情: " + res3.data.message);
                    }
                    this.loading=false;
                }).catch(res4=>{
                    this.$message.error(res4.message);
                })
            },

            back(){
                this.$router.go(-1);
            }
        },
    }
</script>

<style  scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
    }

    .name-role {
          font-size: 16px;
          padding: 5px;
          text-align:center;
    }

    .sender{
        text-align:center;
    }

    .registe-info{
        text-align: center;
        padding-top:10px;
    }
    .personal-relation {
        font-size: 16px;
        padding: 0px 5px 15px;
        margin-right: 1px;
        width: 100%
    }

    .relation-item {
        padding: 12px;

    }
    .dialog-footer{
        padding-top:10px ;
        padding-left: 10%;
    }

    .el-row {
          margin-bottom: 20px;
    }

    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>