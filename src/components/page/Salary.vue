<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 工资结算
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-lx-tag"
                        class="handle-add mr10"
                        @click="openForm"
                >新增人员</el-button>
                <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        v-model="query"
                        value-format="yyyy-MM"
                        class="handle-select mr10"
                ></el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
                <el-button type="success" icon="el-icon-date" @click="getSalary">统计工资</el-button>
                <el-button type="warning" @click="setSalary" v-if="tableVisible===false">结算收支进财务账单</el-button>
            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
                    v-show="tableVisible"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="date" label="日期"  align="center"></el-table-column>
                <el-table-column prop="name" align="center" label="姓名"></el-table-column>
                <el-table-column prop="postsalary" align="center" label="岗位工资"></el-table-column>
                <el-table-column prop="positionsalary" align="center" label="职务工资"></el-table-column>


                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >编辑</el-button>
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

        <div style="padding: 10px"></div>

        <div class="container" v-if="tableVisible===false">
            <el-table
                    :data="tableData2"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="date" label="日期"  align="center"></el-table-column>
                <el-table-column prop="name" align="center" label="姓名"></el-table-column>
                <el-table-column prop="timer" align="center" label="总工时"></el-table-column>
                <el-table-column prop="postsalary" align="center" label="岗位工资"></el-table-column>
                <el-table-column prop="positionsalary" align="center" label="职务工资"></el-table-column>
                <el-table-column prop="salary" align="center" label="总工资"></el-table-column>
                <el-table-column prop="income" align="center" label="返还工资"></el-table-column>

            </el-table>
        </div>


        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="日期" >
                    <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="form.date"
                            value-format="yyyy-MM"
                            :disabled=editOpen
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name" :disabled=editOpen></el-input>
                </el-form-item>
                <el-form-item label="岗位工资">
                    <el-input v-model="form.postsalary"></el-input>
                </el-form-item>
                <el-form-item label="职务工资">
                    <el-input v-model="form.positionsalary"></el-input>
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
        name: "Salary",
        data(){
            return{
                query: '',
                tableData: [],
                editVisible: false,
                form: {
                    date: [],
                    name: '',
                    postsalary: '',
                    positionsalary: '',
                },
                loading: true,
                tableData2: [],
                editOpen: true,
                tableVisible: true,
            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/salary") {
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
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth(); //得到月份
                var date = now.getDate(); //得到日期
                var hour = now.getHours();
                month = month.toString().padStart(2, "0");
                date = date.toString().padStart(2, "0");
                var defaultDate = `${year}-${month}`;

                if (this.query==='') {
                    this.query=defaultDate;
                }

                this.loading = true;
                this.$axios.post('/Salary',{
                    date: this.query
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
                        this.tableVisible=true;
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：salary.getData 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                    this.loading = false;
                });
            },

            getSalary(){
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth(); //得到月份
                var date = now.getDate(); //得到日期
                var hour = now.getHours();
                month = month.toString().padStart(2, "0");
                date = date.toString().padStart(2, "0");
                var defaultDate = `${year}-${month}`;

                if (this.query==='') {
                    this.query=defaultDate;
                }

                this.loading = true;
                this.$axios.post('/SalaryCompute',{
                    date: this.query
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.tableVisible=false;
                        this.tableData2=res1.data.data;
                        this.loading = false;
                    }else if (res1.data.code===400) {
                        this.$message.error('失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：salary.computed 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },

            setSalary(){
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth(); //得到月份
                var date = now.getDate(); //得到日期
                var hour = now.getHours();
                month = month.toString().padStart(2, "0");
                date = date.toString().padStart(2, "0");
                var defaultDate = `${year}-${month}`;

                if (this.query==='') {
                    this.query=defaultDate;
                }

                this.loading = true;
                this.$axios.post('/SalarySave',{
                    date: this.query
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.tableVisible=false;
                        this.$message.success('保存成功');
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：salary.setSalary 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },

            handleEdit(row){
                this.form.date=row.date;
                this.form.postsalary=row.postsalary;
                this.form.positionsalary=row.positionsalary;
                this.form.name=row.name;
                this.editOpen=true;
                this.editVisible=true;
            },

            openForm(){
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth(); //得到月份
                var date = now.getDate(); //得到日期
                var hour = now.getHours();
                month = month + 1;
                month = month.toString().padStart(2, "0");
                date = date.toString().padStart(2, "0");
                var defaultDate = `${year}-${month}`;

                this.form.date=defaultDate;
                this.form.postsalary='';
                this.form.positionsalary='';
                this.form.name='';
                this.editOpen=false;
                this.editVisible=true;
            },

            saveEdit(){
                this.loading = true;
                this.editVisible=false;
                this.$axios.post('/SalaryUpdate',{
                    date: this.form.date,
                    name: this.form.name,
                    postsalary: this.form.postsalary,
                    positionsalary: this.form.positionsalary,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.$message.success('保存成功');
                        this.getData();
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：salary.saveEdit 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                    this.loading = false;
                });
            },

            handleDelete(row){
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                this.loading = true;
                this.$axios.post('/SalaryDelete',{
                    date: row.date,
                    name: row.name,
                    postsalary: row.postsalary,
                    positionsalary: row.positionsalary,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.$message.success('删除成功');
                        this.getData();
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：salary.handleDelete 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                    this.loading = false;
                });
                    })
                    .catch(() => {});
            },

        }
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