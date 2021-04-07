<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 表格资料
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
                >新增表格</el-button>
            </div>

            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column width="200"  align="center"></el-table-column>
                <el-table-column width="450" prop="title" label="名称"  align="left"></el-table-column>
                <el-table-column prop="date" width="200" label="修改时间"  align="left"></el-table-column>


                <el-table-column label="操作" width="600" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-view"
                                @click="handleEdit(scope.row)"
                        >查看</el-button>

                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                style="color:#E6A23C"
                                v-if="usertype==='主管' || usertype==='主管老师'"
                                @click="handleRename(scope.row)"
                        >修改名称</el-button>

                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                v-if="usertype==='主管' || usertype==='主管老师'"
                                @click="handleDelete(scope.row)"
                        >删除</el-button>

                    </template>

                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog
                title="编辑"
                :visible.sync="editVisible"
                width="30%"
                close-on-click-modal="false"
                close-on-press-escape="false"
                show-close="false"
        >
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="表格标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleRename2">确 定</el-button>
            </span>
        </el-dialog>

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
        name: "Table",

        data() {
            return{
                tableData: [],
                form: {
                    title: '',
                    id: '',
                },
                editVisible : false,
                id: '',
                photoUrl :'http://dmt.dgut.edu.cn/api/TableUpload', // 上传图片地址
                loading: true,
                usertype: '',
            }
        },

        created(){
            this.getData();
        },

        methods: {
            getData(){
                this.loading=true;
                this.$axios.get("/Table").then(res1=>{
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
                        alert("请截图以下信息报给维护员: 出错位置：table.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },
            handleEdit(row) {
                this.$router.push({
                    path: '/tableinfo',
                    query: {
                        id : row.id,
                    }
                });
            },

            handleRename2() {
                this.editVisible=false;
                this.loading=true;
                this.$axios.post("/TableRename",{
                    title: this.form.title,
                    id: this.form.id,
                }).then(res2=>{
                    if (res2.data.code===200) {
                        this.$message.success('重命名成功');
                        this.getData();
                    } else if (res2.data.code===400) {
                        this.$message.error('失败:' + res2.data.message);
                    } else if (res2.data.code===403) {
                        this.$message.error('失败:' + res2.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res2.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：table.handlerename2 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res3=>{
                   this.$message.error(res3.message);
                });
            },

            handleRename(row) {
                this.form.title=row.title;
                this.form.id=row.id;
                this.editVisible=true;
            },

            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.$axios.post('/TableDelete',{
                            id: row.id
                        }).then(res6=>{
                            if (res6.data.code===200) {
                                this.getData();
                                this.$message.success('删除成功');
                                this.loading = false;
                            } else if (res6.data.code===400) {
                                this.$message.error('失败:' + res6.data.message);
                            } else if (res6.data.code===403) {
                                this.$message.error('失败:' + res6.data.message);
                                this.loading=false;
                                this.$router.push({path: '/login'});
                            } else if (res6.data.code===500) {
                                alert("请截图以下信息报给维护员: 出错位置：table.handleDelete 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
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
                } else if (response.data.code===500) {
                    alert("请截图以下信息报给维护员: 出错位置：table.upload 出错详情: " + response.data.message);
                } else if (response.data.code===403) {
                    this.$message.error("登录过期，请重新登录");
                }

            },
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/table") {
                        that.getData();
                    }
                },
                deep: true
            }
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