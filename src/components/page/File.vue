<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文件管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-lx-tag"
                        class="handle-add mr10"
                        @click="open1"
                >上传文件</el-button>

            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column width="180" align="center" >
                    <template slot-scope="scope">
                        <img
                                :src="fileTypeIcon(scope.row)"
                                class="name-col-icon"
                                alt="文件类型图标"
                                height="40"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="文件名"  align="center" ></el-table-column>
                <el-table-column prop="createTime" align="center" width="200" label="创建时间" ></el-table-column>
                <el-table-column prop="type" label="类型" width="180" align="center"></el-table-column>
                <el-table-column prop="sender" align="center" width="180" label="上传者"></el-table-column>

                <el-table-column label="操作" width="180" align="center" >
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleDownload(scope.row)"
                        >下载</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="上传文件"
                   :visible.sync="editVisible3"
                   width="30%"
                   :close-on-click-modal=false
                   :close-on-press-escape=false
                   :show-close=false
        >
            <el-divider></el-divider>
            <el-upload
                    class="upload-demo"
                    drag
                    width="100%"
                    :auto-upload="true"
                    :on-success="onChangeQuill"
                    :on-error="onError"
                    :limit="20"
                    action="http://dmt.dgut.edu.cn/api/FileAdd"
                    multiple
                    align="center"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传大小为150M以内的文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>

        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="新建文件夹" :visible.sync="editVisible4" width="30%">
            <el-divider></el-divider>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="文件夹名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible4 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit2">确 定</el-button>
            </span>

        </el-dialog>
    </div>
</template>


<script>
    export default {
        name: "File",
        data() {
            return{
                form: {
                    name: '',
                },
                tableData: [],
                nowFolder: 0,
                editVisible3: false,
                editVisible4: false,
                loading: true,
                complete: false,
            }
        },

        created(){
            this.getData();
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/file") {
                        that.getData();
                    }
                },
                deep: true
            }
        },

        methods: {
            getData() {
                this.loading = true;
                this.$axios.post('/File',{
                    nowfolder: this.nowfolder,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
                        //this.$message.success('查询成功');
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：file.getData 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },

            open1() {
                this.editVisible3=true;
                this.complete=false;
            },

            open2() {
                this.editVisible4=true;
            },

            // 保存编辑
            saveEdit() {
                if (this.complete === false) {
                    this.$message.error('请等待上传完成');
                    return;
                }
                this.editVisible3 = false;
                this.complete=false;
            },

            saveEdit2() {
                this.editVisible4 = false;
                this.loading=true;
                this.$axios.post('/FileNewFolder',{
                    name: this.form.name,
                }).then(res4=>{
                    if (res4.data.code===200) {
                        this.getData();
                        this.$message.success('成功');
                    } else if (res4.data.code===400) {
                        this.$message.error('失败:' + res4.data.message);
                    } else if (res4.data.code===403) {
                        this.$message.error('失败:' + res4.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res4.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：file.saveedit2 出错详情: " + res4.data.message);
                    }
                    this.getData();
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });
            },

            handleDownload(row) {
                var link = document.createElement('a');
                link.href  = row.link;
                link.download = row.name;
                link.style.display = 'none';
                link.click();
            },

            onError(err, file, fileList){
                alert("上传错误" + err);
                this.complete=true;
            },

            onChangeQuill(response, file, fileList) {

                this.$message.success('上传成功');
                this.getData();
                this.complete=true;

            },

            fileTypeIcon(row) {
                let _path = "";
                // 文件夹
                if (row.type===0) {
                    _path = "./images/folder@3x.png";
                    return _path;
                }
                // 其他根据后缀类型
                let _suffix = row.name.toString().toLowerCase();
                if (_suffix.toString().toLowerCase().includes(".jpg") || _suffix.toString().toLowerCase().includes(".jpeg") || _suffix.toString().toLowerCase().includes(".png") || _suffix.toString().toLowerCase().includes(".bmp")) {
                    _path = require("./images/file_img@3x.png");
                    return _path;
                } else if (_suffix.toString().toLowerCase().includes(".zip") || _suffix.toString().toLowerCase().includes(".rar") || _suffix.toString().toLowerCase().includes(".7z") || _suffix.toString().toLowerCase().includes(".gz")) {
                    _path = require("./images/file_zip@3x.png");
                } else if ( _suffix.toString().toLowerCase().includes(".avi") || _suffix.toString().toLowerCase().includes(".mp4") || _suffix.toString().toLowerCase().includes(".rmvb") || _suffix.toString().toLowerCase().includes(".flv") ||
                    _suffix.toString().toLowerCase().includes(".mov") || _suffix.toString().toLowerCase().includes(".m2v") || _suffix.toString().toLowerCase().includes(".mkv")) {
                    _path = require("./images/file_video@3x.png");
                } else if (_suffix.toString().toLowerCase().includes(".mp3") || _suffix.toString().toLowerCase().includes(".wav") || _suffix.toString().toLowerCase().includes(".wma") ) {
                    _path = require("./images/file_mp3@3x.png");
                } else if (_suffix.toString().toLowerCase().includes(".xlsx") || _suffix.toString().toLowerCase().includes(".xls")) {
                    _path = require("./images/file_excel@3x.png");
                } else if (_suffix.toString().toLowerCase().includes(".doc") ||_suffix.toString().toLowerCase().includes(".docx")) {
                    _path = require("./images/file_docx@3x.png");
                } else if (_suffix.toString().toLowerCase().includes(".pdf")) {
                    _path = require("./images/file_pdf@3x.png");
                } else if (_suffix.toString().toLowerCase().includes(".ppt") || _suffix.toString().toLowerCase().includes(".pptx")) {
                    _path = require("./images/file_ppt@3x.png");
                } else if (_suffix.toString().toLowerCase().includes(".txt")) {
                    _path = require("./images/file_txt@3x.png");
                } else {
                    _path = require("./images/file_none@3x.png");
                }
                return _path;
            },

            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.$axios.post('/FileDelete',{
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
                                alert("请截图以下信息报给维护员: 出错位置：file.handleDelete 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
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
        height: 7px;
    }

</style>