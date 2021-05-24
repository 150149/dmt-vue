<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 在线签到
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
                >在线签到</el-button>
                <el-select v-model="query.type" placeholder="签到类型" class="handle-select mr10">
                    <el-option key="%" label="所有" value="%"></el-option>
                    <el-option key="1" label="值班" value="1"></el-option>
                    <el-option key="2" label="替班" value="2"></el-option>
                    <el-option key="3" label="加班" value="3"></el-option>
                    <el-option key="4" label="检修" value="4"></el-option>
                </el-select>
                <el-select v-model="query.state" placeholder="状态" class="handle-select mr10">
                    <el-option key="%" label="所有状态" value="%"></el-option>
                    <el-option key="1" label="待确认" value="2"></el-option>
                    <el-option key="2" label="已确认" value="1"></el-option>
                </el-select>
                <el-date-picker
                        type="date"
                        placeholder="选择起始日期"
                        v-model="query.date1"
                        value-format="yyyy-MM-dd"
                        class="handle-select mr10"
                ></el-date-picker>
                <el-date-picker
                        type="date"
                        placeholder="选择结束日期"
                        v-model="query.date2"
                        value-format="yyyy-MM-dd"
                        class="handle-select mr10"
                ></el-date-picker>
                <el-input v-model="query.name" placeholder="签到人员" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-search" @click="handleNoSign" v-if="usertype==='主管' || usertype==='主管老师'">签到人数查询</el-button>
            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="start" label="上班时间"  align="center" width="200"></el-table-column>
                <el-table-column prop="length" align="center" label="时长"></el-table-column>
                <el-table-column prop="name" align="center" label="登记人员">
                </el-table-column>
                <el-table-column prop="type" label="签到类型" align="center">
                </el-table-column>
                <el-table-column prop="salary" align="center" label="工资">
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" type="danger" v-if="scope.row.state === '待确认'">{{ scope.row.state }}</el-tag>
                            <el-tag size="medium" type="success" v-if="scope.row.state === '已确认'">{{ scope.row.state }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center" v-if="usertype==='主管' || usertype==='主管老师'">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="open2(scope.row)"
                        >查看</el-button>
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
                title="新增在线签到"
                :visible.sync="editVisible3"
                width="30%"
                close-on-click-modal="false"
                close-on-press-escape="false"
                show-close="false"
        >
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="上班时间" >
                    <el-date-picker
                            v-model="form.start"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择上班时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="类型" >
                    <el-select v-model="form.type" placeholder="签到类型" >
                        <el-option key="%" label="所有" value="%"></el-option>
                        <el-option key="1" label="值班" value="1"></el-option>
                        <el-option key="2" label="替班" value="2"></el-option>
                        <el-option key="3" label="加班" value="3"></el-option>
                        <el-option key="4" label="检修" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作时长">
                    <el-input v-model="form.length"></el-input>
                </el-form-item>
                <el-form-item label="签到人员">
                    <el-input :disabled="show2"
                              v-model="form.name"
                              maxlength="4"
                              show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" placeholder="如果不是值班请填写备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="查看或编辑"
                :visible.sync="editVisible4"
                width="30%"
                close-on-click-modal="false"
                close-on-press-escape="false"
                show-close="false"
        >
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="上班时间" >
                    <el-date-picker
                            v-model="form.start"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择上班时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="类型" >
                    <el-select v-model="form.type" placeholder="签到类型" >
                        <el-option key="1" label="值班" value="1"></el-option>
                        <el-option key="2" label="替班" value="2"></el-option>
                        <el-option key="3" label="加班" value="3"></el-option>
                        <el-option key="4" label="检修" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.state" placeholder="状态" class="handle-select mr10">
                        <el-option key="1" label="待确认" value="待确认"></el-option>
                        <el-option key="2" label="已确认" value="已确认"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作时长">
                    <el-input v-model="form.length"></el-input>
                </el-form-item>
                <el-form-item label="签到人员">
                    <el-input  v-model="form.name"
                               maxlength="4"
                               show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" placeholder="如果不是值班请填写备注"></el-input>
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
        name: "Sign",
        data() {
            return{
                form: {
                    id: '',
                    start: '',
                    type: '',
                    length: '',
                    name: '',
                    remark: '',
                    state: '',
                },
                tableData: [],
                query: {
                  type: '%',
                  state: '%',
                  date1: '',
                  date2: '',
                  name: '',
                  length: '',
                  pageindex: 1,
                  pagesize: 20,
                },
                editVisible3: false,
                editVisible4: false,
                pagetotal: 0,
                loading: true,
                usertype: '',
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

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/sign") {
                        that.getData();
                    }
                },
                deep: true
            }
        },

        methods: {
            getData() {
                if (this.$route.query.date!=null) {
                    this.query.date1=this.$route.query.date;

                    var strDate = this.$route.query.date;
                    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
                    date=date.setDate(date.getDate()+1);

                    var Dates = new Date(date);
                    var Y = Dates.getFullYear();
                    var M = Dates.getMonth() + 1;
                    var D = Dates.getDate();
                    this.query.date2=Y + (M < 10 ? "-0" : "-") + M + (D < 10 ? "-0" : "-") + D;

                    this.$route.query.date=null;
                }

                this.loading = true;
                this.$axios.post('/Sign',{
                    type: this.query.type,
                    state: this.query.state,
                    date1: this.query.date1,
                    date2: this.query.date2,
                    name: this.query.name,
                    length: this.query.length,
                    pageindex: this.query.pageindex,
                    pagesize: this.query.pagesize,
                }).then(res1=>{
                    this.usertype=localStorage.getItem("type");
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
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
                        alert("请截图以下信息报给维护员: 出错位置：sign.getData 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },

            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageindex', val);
                this.getData();
            },

            handleNoSign() {
                this.$router.push("/nosign");
            },

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
                //this.$set(this.form, "start", defaultDate);

                if (hour>=0 && hour <= 9 ){
                    this.$set(this.form, "start",defaultDate + " " + "08:10:00");
                    this.$set(this.form, "length", "2");
                }
                if (hour>9 && hour <= 12 ){
                    this.$set(this.form, "start",defaultDate + " " + "10:10:00");
                    this.$set(this.form, "length", "2");
                }
                if (hour>12 && hour <= 17 ){
                    this.$set(this.form, "start",defaultDate + " " + "14:10:00");
                    this.$set(this.form, "length", "3");
                }
                if (hour>17 && hour < 24 ){
                    this.$set(this.form, "start",defaultDate + " " + "19:10:00");
                    this.$set(this.form, "length", "2");
                }

            },

            handleSearch() {
                this.$set(this.query, 'pageindex', 1);
                this.getData();
            },

            open2(row) {
                this.form.start=row.start;
                this.form.type=row.type;
                this.form.name=row.name;
                this.form.remark=row.remark;
                this.form.length=row.length;
                this.form.state=row.state;
                this.form.id=row.id;
                if (row.remark=="null") {
                    this.form.remark=null;
                }
                this.editVisible4=true;
            },

            open1() {
                this.getNowTime();
                var name = localStorage.getItem("name");
                this.$set(this.form, "type", "值班");
                this.$set(this.form, "name", name);
                this.$set(this.form, "remark", "");
                this.editVisible3=true;
            },

            // 保存编辑
            saveEdit() {

                this.editVisible3 = false;
                this.loading=true;
                this.$axios.post('/SignAdd',{
                    start: this.form.start,
                    length: this.form.length,
                    name: this.form.name,
                    type: this.form.type,
                    remark: this.form.remark,
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
                        alert("请截图以下信息报给维护员: 出错位置：sign.saveEdit 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                    this.getData();
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });
            },

            saveEdit2() {
                this.editVisible4 = false;
                this.loading=true;
                this.$axios.post('/SignUpdate',{
                    id: this.form.id,
                    start: this.form.start,
                    length: this.form.length,
                    name: this.form.name,
                    type: this.form.type,
                    remark: this.form.remark,
                    state: this.form.state,
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
                        alert("请截图以下信息报给维护员: 出错位置：monney.getdata 出错详情: " + res4.data.message);
                    }
                    this.getData();
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });
            },

            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.$axios.post('/SignDelete',{
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
                                alert("请截图以下信息报给维护员: 出错位置：sign.handleDelete 出错详情: " + res6.data.message);
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