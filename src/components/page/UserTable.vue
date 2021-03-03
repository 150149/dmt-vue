<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
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
                >新增用户</el-button>
            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="学号"  align="center"></el-table-column>
                <el-table-column prop="name" align="center" label="姓名"></el-table-column>
                <el-table-column prop="type" align="center" label="职称">
                </el-table-column>
                <el-table-column prop="addtime" label="添加时间" align="center">
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" type="danger" v-if="scope.row.able === '禁用'">{{ scope.row.able }}</el-tag>
                            <el-tag size="medium" type="success" v-if="scope.row.able === '可用'">{{ scope.row.able }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="500" align="center">
                    <template slot-scope="scope" >
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleWork(scope.row)"
                                v-if="scope.row.work === '可排班'"
                                style="color: #67C23A"
                        >{{ scope.row.work }}</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleWork(scope.row)"
                                v-if="scope.row.work === '不排班'"
                                style="color: #F56C6C"
                        >{{ scope.row.work }}</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUp(scope.row)"
                        >升职</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleChange(scope.row)"
                                style="color: #E6A23C"
                        >重设密码</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleDoor(scope.row)"
                                v-if="scope.row.door === '0'"
                                style="color: #F56C6C"
                        >禁用门禁</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleDoor(scope.row)"
                                v-if="scope.row.door === '1'"
                                style="color: #67C23A"
                        >可用门禁</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleAble(scope.row)"
                                style="color: #F56C6C"
                                v-if="scope.row.able === '禁用'"
                        >禁用账号</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleAble(scope.row)"
                                style="color: #67C23A"
                                v-if="scope.row.able === '可用'"
                        >可用账号</el-button>
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
        <el-dialog title="添加用户" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>

                <el-form-item label="学号">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
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
        name: "UserTable",
        data() {
            return {
                tableData: [],
                editVisible: false,
                pagetotal: 0,
                form: {
                    username: '',
                    able: '',
                    name: '',
                    type: '',
                    addtime: '',
                    work: '',
                    door: '',
                    state: ''
                },
                idx: -1,
                id: -1,
                loading: true
            };
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/usertable") {
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
                this.$axios.get('/UserTable').then(res1=>{
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
                        alert("请截图以下信息报给维护员: 出错位置：usertable.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                    this.loading = false;
                });
            },

            open1() {
                this.$set(this.form, "name", "");
                this.$set(this.form, "username", "");
                this.editVisible=true;
            },

            handleWork(row) {
                this.form.username=row.username;
                this.form.type=row.type;
                this.form.door=row.door;
                this.form.able=row.able;

                if (row.work==="可排班") {
                    this.form.work="不排班";
                } else {
                    this.form.work="可排班";
                }
                this.handlePost();

            },

            handleUp(row) {
                this.$confirm('确定要升职吗？该操作不可逆', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.form.username = row.username;

                        if (row.type === "协管员") {
                            this.form.type = "组长"
                        } else if (row.type === "组长") {
                            this.form.type = "主管"
                        } else if (row.type === "主管") {
                            this.form.type = "主管老师"
                        } else {
                            this.$message.error('修改失败，类型错误');
                            return;
                        }

                        this.form.door = row.door;
                        this.form.able = row.able;
                        this.form.work = row.work;

                        this.handlePost();
                    })
            },

            handleDoor(row) {
                this.form.username=row.username;
                this.form.type=row.type;
                this.form.door=row.door;
                this.form.able=row.able;
                this.form.work=row.work;

                if (row.door==="1"){
                    this.form.door="0";
                } else if (row.door==="0") {
                    this.form.door="1";
                } else {
                    this.$message.error('修改失败，类型错误');
                    return;
                }

                this.handlePost();

            },

            handleAble(row) {
                this.form.username=row.username;
                this.form.type=row.type;
                this.form.door=row.door;
                this.form.able=row.able;
                this.form.work=row.work;

                if (row.able==="禁用"){
                    this.form.able="可用";
                } else if (row.able==="可用") {
                    this.form.able="禁用";
                } else {
                    this.$message.error('修改失败，类型错误');
                    return;
                }

                this.handlePost();

            },

            handlePost(){
                this.$axios.post('/UserUpdate',{
                    username:this.form.username,
                    work:this.form.work,
                    type:this.form.type,
                    door:this.form.door,
                    able:this.form.able,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.getData();
                        this.$message.success('修改成功');
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：userTable.hadlePost 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },

            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.$axios.post('/UserDelete',{
                            id: row.username
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
                                alert("请截图以下信息报给维护员: 出错位置：table.getdata 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
            },

            handleChange(row) {
                // 二次确认删除
                this.$confirm('确定要重设密码吗？新的密码将为学号', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.$axios.post('/UserChange',{
                            id: row.username
                        }).then(res6=>{
                            if (res6.data.code===200) {
                                this.getData();
                                this.$message.success('重设成功');
                                this.loading = false;
                            } else if (res6.data.code===400) {
                                this.$message.error('失败:' + res6.data.message);
                            } else if (res6.data.code===403) {
                                this.$message.error('失败:' + res6.data.message);
                                this.loading=false;
                                this.$router.push({path: '/login'});
                            } else if (res6.data.code===500) {
                                alert("请截图以下信息报给维护员: 出错位置：userTable.handleChange 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
            },

            saveEdit() {
                this.editVisible = false;
                this.loading=true;
                this.$axios.post('/UserAdd',{
                    username: this.form.username,
                    name: this.form.name,
                }).then(res4=>{
                    if (res4.data.code===200) {
                        this.$message.success('成功');
                    }else if (res4.data.code===400) {
                        this.$message.error('失败:' + res4.data.message);
                    } else if (res4.data.code===403) {
                        this.$message.error('失败:' + res4.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res4.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：Usertable.saveEdit 出错详情: " + res4.data.message);
                    }
                    this.getData();
                    this.loading=false;
                }).catch(res5=>{
                   this.$message.error(res5.message);
                });
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