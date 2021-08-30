<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 课表查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-lx-tag"
                        class="handle-add mr10"
                        v-if="usertype==='主管' || usertype==='主管老师'"
                        @click="open1"
                >上传课表</el-button>
                <el-input v-model="query.room" placeholder="教室" class="handle-input mr10"></el-input>
                <el-input v-model="query.teacher" placeholder="老师" class="handle-input mr10"></el-input>
                <el-button  type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="jieci" label="节次"  align="center"></el-table-column>
                <el-table-column prop="a1" align="center" label="星期一"></el-table-column>
                <el-table-column prop="a2" align="center" label="星期二"></el-table-column>
                <el-table-column prop="a3" align="center" label="星期三"></el-table-column>
                <el-table-column prop="a4" align="center" label="星期四"></el-table-column>
                <el-table-column prop="a5" align="center" label="星期五"></el-table-column>

            </el-table>
        </div>

        <el-upload
                ref="quillUploader"
                class="avatar-uploader"
                :action="photoUrl"
                :show-file-list="false"
                :auto-upload="true"
                :on-success="onChangeQuill"
                :on-error="onError"
                :limit="20"
                :multiple="true"
                v-if="usertype==='主管' || usertype==='主管老师'"
                v-show="false">
        </el-upload>


    </div>
</template>

<script>
    export default {
        name: "ClassTable",

        data() {
            return{
                tableData: [],
                loading: true,
                usertype: '',
                photoUrl :'http://dmt.dgut.edu.cn/api/ClassTableUpload', // 上传图片地址
                query:{
                  room: '6F101',
                  teacher: '',
                },
            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/classtable") {
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

                if (this.query.room.indexOf("-")===-1 && this.query.room.toUpperCase()!=="6B503") {
                    this.query.room=this.query.room.substring(0,2) + "-" + this.query.room.substring(2,5);
                }
                this.query.room = this.query.room.toUpperCase();
                this.query.room = this.query.room.replace(/\s+/g,"");
                this.query.teacher = this.query.teacher.replace(/\s+/g,"");

                this.loading=true;
                this.$axios.post("/ClassTable", {
                    room: this.query.room,
                    teacher: this.query.teacher,
                }).then(res1=>{
                    this.tableData=res1.data.data;
                    this.usertype=localStorage.getItem("type");
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：classTable.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },

            handleSearch() {
                this.getData();
            },

            open1(){
                document.querySelector(".avatar-uploader input").click();
            },

            onError(err, file, fileList){
                alert("上传错误" + err);
            },

            onChangeQuill(response, file, fileList) {

                console.log(response.data);

                let quill = this.$refs.myTextEditor.quill;
                let length = quill.getSelection().index;
                // 图片上传到对象存储后的具体地址
                let imgSrc =  response.data;
                if (response.data.code===200){
                    this.$message.success('上传成功');
                    this.getData();
                } else if (response.data.code===400) {
                    this.$message.error('上传失败,' + response.data.message);
                    this.getData();
                } else if (response.data.code===500) {
                    alert("请截图以下信息报给维护员: 出错位置：classTable.upload 出错详情: " + response.data.message);
                } else if (response.data.code===403) {
                    this.$message.error("登录过期，请重新登录");
                }

            },

        },
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 143px;
    }

    .handle-add {
        width: 100px;
    }

    .handle-input {
        width: 120px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 7px;
    }

</style>