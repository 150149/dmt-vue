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



        <!-- 编辑弹出框 -->
        <el-dialog title="上传课表"
                   :visible.sync="editVisible3"
                   width="30%"
                   :close-on-click-modal=false
                   :close-on-press-escape=false
                   :show-close=false
        >
            <el-divider></el-divider>
            <el-upload
                    ref="quillUploader"
                    class="upload-demo"
                    drag
                    width="100%"
                    action="http://dmt.dgut.edu.cn/api/ClassTableUpload"
                    :auto-upload="true"
                    :on-success="onChangeQuill"
                    :on-error="onError"
                    :limit="1"
                    :multiple="false"
                    align="center"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传大小为150M以内的文件</div>
            </el-upload>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible3 = false">取消上传</el-button>
            </span>

        </el-dialog>


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
                editVisible3: false,
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
                this.editVisible3=true;
            },

            onError(err, file, fileList){
                this.$message.success('上传成功,稍后可查看最新的结果');
                this.editVisible3=false;
                this.getData();
            },

            onChangeQuill(response, file, fileList) {
                this.$message.success('上传成功,稍后可查看最新的结果');
                this.editVisible3=false;
                this.getData();
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