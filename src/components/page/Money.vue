<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 账单管理
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
                >新增记录</el-button>

                <div class="handle-input mr10" style="width: 300px;margin-left:10px"> 当前余额: {{count}}</div>
            </div>

            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="date" label="登记日期"  align="center"></el-table-column>
                <el-table-column prop="income" align="center" label="收入"></el-table-column>
                <el-table-column prop="outcome" align="center" label="支出">
                </el-table-column>
                <el-table-column prop="remark" label="说明" align="center">
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageindex"
                        :page-size="query.pagesize"
                        :total="pagetotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
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
                <el-form-item label="登记日期" >
                    <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="form.date"
                            value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="收入">
                    <el-input v-model="form.income"></el-input>
                </el-form-item>
                <el-form-item label="支出">
                    <el-input v-model="form.outcome"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="form.remark"></el-input>
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
        name: 'money',
        data() {
            return {
                query: {
                    remark:'',
                    pageindex: 1,
                    pagesize: 20,
                    pagetotal: ''
                },
                tableData: [],
                editVisible: false,
                pagetotal: 0,
                count:'',
                form: {
                    id: 0,
                    date: '',
                    income: '',
                    outcome: '',
                    remark: '',
                },
                loading: true
            };
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/money") {
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
                this.$axios.post('/Money',{
                    remark: this.query.remark,
                    pageindex: this.query.pageindex,
                    pagesize: this.query.pagesize
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data.l;
                        this.count=res1.data.data.count;
                        var j = parseInt(res1.data.message);
                        this.pagetotal=j;
                        //this.$message.success('查询成功');
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：monney.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                    this.loading = false;
                });
            },

            open1(){
              this.form.income="";
              this.form.outcome="";
              this.form.remark="";
              this.form.date="";
              this.editVisible=true;
            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.$axios.post('/MoneyDelete',{
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
                                alert("请截图以下信息报给维护员: 出错位置：money.handledelete 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7);
                            this.loading = false;
                        });
                    })
                    .catch(() => {});
            },

            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.loading=true;
                this.$axios.post('/MoneyAdd',{
                    income: this.form.income,
                    outcome: this.form.outcome,
                    remark: this.form.remark,
                    date: this.form.date,
                }).then(res4=>{
                    if (res4.data.code===200) {
                        this.getData();
                        this.$message.success('成功');
                    }  else if (res4.data.code===400) {
                        this.$message.error('失败:' + res4.data.message);
                        this.getData();
                    } else if (res4.data.code===403) {
                        this.$message.error('失败:' + res4.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res4.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：money.savedit 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                   this.$message.error(res5.message);
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageindex', val);
                this.getData();
            }
        }
    };
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
