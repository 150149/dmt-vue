<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 通知公告
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
                        v-if="usertype==='主管' || usertype==='主管老师'"
                >新增公告</el-button>

            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
                    id="out-table"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="sender" label="发送人"  align="center"></el-table-column>
                <el-table-column prop="info" align="center" label="公告内容"></el-table-column>

                <el-table-column label="操作" width="180" align="center" v-if="usertype==='主管' || usertype==='主管老师'">
                    <template slot-scope="scope" >
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="公告内容">
                    <el-input :disabled="show2" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.info"></el-input>
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
        name: 'broadcast',
        data() {
            return {
                query: {
                    pageindex: 1,
                    pagesize: 20,
                    pagetotal: ''
                },
                tableData: [],
                editVisible: false,
                pagetotal: 0,
                form: {
                    info: '',
                },
                loading: true,
                usertype: '',
            };
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/broadcast") {
                        that.getData();
                    }
                },
                deep: true
            }
        },

        created(){
            this.getData();
        },

        computed: {
            show2(){
                var usertype = localStorage.getItem("type");
                if (usertype === "主管" || usertype === "主管老师" || usertype==="组长") {
                    return false;
                } else {
                    return true;
                }
            }
        },

        methods: {
            getNowTime() {
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth(); //得到月份
                var date = now.getDate(); //得到日期
                var hour = now.getHours();
                month = month + 1;
                month = month.toString().padStart(2, "0");
                date = date.toString().padStart(2, "0");
                var defaultDate = `${year}-${month}-${date}`;
                this.$set(this.form, "date", defaultDate);

                if (hour > 0 && hour <= 9) {
                    this.$set(this.form, "classtype", "上午 1-2节");
                }
                if (hour > 9 && hour <= 12) {
                    this.$set(this.form, "classtype", "上午 3-4节");
                }
                if (hour > 12 && hour <= 17) {
                    this.$set(this.form, "classtype", "下午 5-7节");
                }
                if (hour > 17 && hour <= 24) {
                    this.$set(this.form, "classtype", "晚上9-10节");
                }

            },

            open1() {
                this.editVisible = true;
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                this.loading = true;
                this.usertype=localStorage.getItem("type");
                this.$axios.post('/Broadcast', {
                    pageindex: this.query.pageindex,
                    pagesize: this.query.pagesize
                }).then(res1 => {
                    if (res1.data.code === 200) {
                        this.tableData = res1.data.data;
                        var j = parseInt(res1.data.message);
                        this.pagetotal = j;
                        //this.$message.success('查询成功');
                        this.loading = false;
                    } else if (res1.data.code === 400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code === 403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading = false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code === 500) {
                        alert("请截图以下信息报给维护员: 出错位置：broadcast.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading = false;
                }).catch(res2 => {
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
                        this.$axios.post('/BroadcastDelete', {
                            id: row.id
                        }).then(res6 => {
                            if (res6.data.code === 200) {
                                this.getData();
                                this.$message.success('删除成功');
                                this.loading = false;
                            } else if (res6.data.code === 400) {
                                this.$message.error('失败:' + res6.data.message);
                            } else if (res6.data.code === 403) {
                                this.$message.error('失败:' + res6.data.message);
                                this.loading = false;
                                this.$router.push({path: '/login'});
                            } else if (res6.data.code === 500) {
                                alert("请截图以下信息报给维护员: 出错位置：broadcast.handledelete 出错详情: " + res6.data.message);
                            }
                            this.loading = false;
                        }).catch(res7 => {
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {
                    });
            },

            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.loading = true;
                this.$axios.post('/BroadcastAdd', {
                    info: this.form.info,
                }).then(res4 => {
                    if (res4.data.code === 200) {
                        this.getData();
                        this.$message.success('成功');
                    } else if (res4.data.code === 400) {
                        this.$message.error('失败:' + res4.data.message);
                    } else if (res4.data.code === 403) {
                        this.$message.error('失败:' + res4.data.message);
                        this.loading = false;
                        this.$router.push({path: '/login'});
                    } else if (res4.data.code === 500) {
                        alert("请截图以下信息报给维护员: 出错位置：broadcast.saveEdit 出错详情: " + res4.data.message);
                    }
                    this.loading = false;
                }).catch(res5 => {
                    this.$message.error(res5.message);
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageindex', val);
                this.getData();
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
            font-size: 7px !important;
        }
        .container {
            width: 500px !important;
        }
        .el-table-column {
            width: 10px !important;
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
