<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 系统配置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
                    id="out-table"
            >
                <el-table-column  width="55" align="center"  ></el-table-column>
                <el-table-column prop="key" label="Key"  align="center"></el-table-column>
                <el-table-column prop="value" label="Value"  align="center"></el-table-column>
                <el-table-column prop="mark" label="描述"  align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <!-- 编辑弹出框 -->
        <el-dialog
                title="编辑"
                :visible.sync="editVisible"
                width="30%"
                :close-on-click-modal=false
                :close-on-press-escape=false
                :show-close=false
        >
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="Key">
                    <el-input v-model="form.key"></el-input>
                </el-form-item>
                <el-form-item label="Value">
                    <el-input v-model="form.value"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.mark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'systemconfig',
        data() {
            return {
                tableData: [],
                editVisible: false,
                form: {
                    key: '',
                    value: '',
                    mark: '',
                },
                loading: true
            };
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/systemconfig") {
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

            getData() {
                this.loading = true;
                this.$axios.get('/SystemConfig').then(res1=>{
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
                        alert("请截图以下信息报给维护员: 出错位置：SystemConfig.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },


            // 编辑操作
            handleEdit(row) {
                this.form.key=row.key;
                this.form.value=row.value;
                this.form.mark=row.mark;
                this.editVisible=true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.loading=true;
                this.$axios.post('/SystemConfigEdit',{
                    key: this.form.key,
                    value: this.form.value,
                    mark: this.form.mark,
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
                        alert("请截图以下信息报给维护员: 出错位置：SystemConfigEdit.saveEdit 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });
            },

        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 143px;
        margin-bottom: 10px;
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

    @media screen and (max-width: 500px){

        .table {
            width: 500px !important;
            font-size: 3px !important;
        }
        .container {
            width: 500px !important;
        }
        .el-table-column {
            width: 10px !important;
            font-size: 3px !important;
        }
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
