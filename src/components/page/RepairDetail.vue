<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 详细登记
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.type" placeholder="故障种类" class="handle-select mr10">
                    <el-option key="%" label="所有类别" value="%"></el-option>
                    <el-option key="1" label="投影仪" value="1"></el-option>
                    <el-option key="2" label="网络" value="2"></el-option>
                    <el-option key="3" label="云桌面" value="3"></el-option>
                    <el-option key="4" label="功放或音箱" value="4"></el-option>
                    <el-option key="5" label="电脑" value="5"></el-option>
                    <el-option key="6" label="幕布" value="6"></el-option>
                    <el-option key="7" label="扩音器或麦克风" value="7"></el-option>
                    <el-option key="8" label="其他" value="8"></el-option>
                </el-select>
                <el-select v-model="query.state" placeholder="状态" class="handle-select mr10">
                    <el-option key="%" label="所有状态" value="%"></el-option>
                    <el-option key="1" label="待处理" value="1"></el-option>
                    <el-option key="2" label="跟进" value="2"></el-option>
                    <el-option key="3" label="已处理" value="3"></el-option>
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
                <el-input v-model="query.class1" placeholder="教室或者登记内容" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button  @click="handleDownload" >下载</el-button>
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
                <el-table-column prop="date" label="登记日期"  align="center"></el-table-column>
                <el-table-column prop="classtype" align="center" label="节次"></el-table-column>
                <el-table-column prop="room" align="center" label="教室">
                </el-table-column>
                <el-table-column prop="type" label="故障种类" align="center">
                </el-table-column>
                <el-table-column prop="name" align="center" label="登记人员"></el-table-column>
                <el-table-column prop="name2" align="center" label="维修人员"></el-table-column>
                <el-table-column prop="deal" align="center" label="处理结果"></el-table-column>
                <el-table-column prop="remarks" align="center" label="备注"></el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium"  v-if="scope.row.state === '跟进'">&nbsp跟&nbsp&nbsp进&nbsp</el-tag>
                            <el-tag size="medium" type="danger" v-if="scope.row.state === '待处理'">{{ scope.row.state }}</el-tag>
                            <el-tag size="medium" type="success" v-if="scope.row.state === '已处理'">{{ scope.row.state }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
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
                title="编辑"
                :visible.sync="editVisible"
                width="30%"
                :close-on-click-modal=false
                :close-on-press-escape=false
                :show-close=false
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
                <el-form-item label="节次" >
                    <el-select v-model="form.classtype" placeholder="节次"  value="1">
                        <el-option key="1" label="上午 1-2节" value="1"></el-option>
                        <el-option key="2" label="上午 3-4节" value="2"></el-option>
                        <el-option key="3" label="下午 5-7节" value="3"></el-option>
                        <el-option key="4" label="晚上9-10节" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-select v-model="form.state" placeholder="状态"  value="1">
                        <el-option key="1" label="待处理" value="1"></el-option>
                        <el-option key="2" label="跟进" value="2"></el-option>
                        <el-option key="3" label="已处理" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="故障种类">
                    <el-select v-model="form.type" placeholder="故障种类"  value="1">
                        <el-option key="1" label="投影仪" value="1"></el-option>
                        <el-option key="2" label="网络" value="2"></el-option>
                        <el-option key="3" label="云桌面" value="3"></el-option>
                        <el-option key="4" label="功放或音箱" value="4"></el-option>
                        <el-option key="5" label="电脑" value="5"></el-option>
                        <el-option key="6" label="幕布" value="6"></el-option>
                        <el-option key="7" label="扩音器或麦克风" value="7"></el-option>
                        <el-option key="8" label="其他" value="8"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="教室">
                    <el-input v-model="form.room"></el-input>
                </el-form-item>
                <el-form-item label="登记人员">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="故障现象">
                    <el-input v-model="form.reason"></el-input>
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
    import XLSX from "xlsx";
    import FileSaver from "file-saver";
    export default {
        name: 'repairdetail',
        data() {
            return {
                query: {
                    type: '%',
                    state: '%',
                    date1: '',
                    date2: '',
                    class1: '',
                    pageindex: 1,
                    pagesize: 20,
                    pagetotal: ''
                },
                tableData: [],
                tableData2: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pagetotal: 0,
                form: {
                    id: 0,
                    date: '',
                    classtype: '',
                    room: '',
                    type: '',
                    reason: '',
                    name: '',
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
                    if (to.path==="/repairdetail") {
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

                if (hour>0 && hour <= 9 ){
                    this.$set(this.form, "classtype", "上午 1-2节");
                }
                if (hour>9 && hour <= 12 ){
                    this.$set(this.form, "classtype", "上午 3-4节");
                }
                if (hour>12 && hour <= 17 ){
                    this.$set(this.form, "classtype", "下午 5-7节");
                }
                if (hour>17 && hour <= 24 ){
                    this.$set(this.form, "classtype", "晚上9-10节");
                }

            },

            open1() {
                this.getNowTime();
                this.$set(this.form, "id", "0");
                this.$set(this.form, "room", "");
                this.$set(this.form, "type", "");
                this.$set(this.form, "reason", "");
                this.$set(this.form, "name", "");
                this.$set(this.form, "state", "待处理");
                this.editVisible=true;
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                this.loading = true;
                this.$axios.post('/RepairDetail',{
                    type: this.query.type,
                    state: this.query.state,
                    date1: this.query.date1,
                    date2: this.query.date2,
                    class1: this.query.class1,
                    pageindex: this.query.pageindex,
                    pagesize: this.query.pagesize
                }).then(res1=>{
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
                        alert("请截图以下信息报给维护员: 出错位置：repairDetail.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
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
                        this.$axios.post('/RepairInfoDelete',{
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
                                alert("请截图以下信息报给维护员: 出错位置：repairDetail.handledelete 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
            },
            // 编辑操作
            handleEdit(row) {
                this.loading = true;
                this.$axios.post('/RepairInfoQuery',{
                    id: row.repair
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.loading = false;
                        this.$router.push({
                            path: '/repairinfo',
                            query: {
                                form : row,
                                table: res1.data.data
                            }
                        });
                    } else if (res1.data.code===400) {
                        this.$message.error('失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：repairDetail.handledit 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });



                //this.editVisible = true;
            },

            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageindex', val);
                this.getData();
            },

            handleDownload(){
                this.loading = true;
                this.$axios.post('/RepairDetail',{
                    type: this.query.type,
                    state: this.query.state,
                    date1: this.query.date1,
                    date2: this.query.date2,
                    class1: this.query.class1,
                    pageindex: 1,
                    pagesize: this.pagetotal
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
                        var j = parseInt(res1.data.message);
                        //this.$message.success('查询成功');
                        this.loading = false;
                        this.query.pagesize=j;
                        this.query.pageindex=1;
                        var that = this;

                        setTimeout(function () {
                            var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
                            var wbout = XLSX.write(wb, {
                                bookType: "xlsx",
                                bookSST: true,
                                type: "array"
                            });
                            var now = new Date();
                            var year = now.getFullYear(); //得到年份
                            var month = now.getMonth(); //得到月份
                            var date = now.getDate(); //得到日期
                            var hour = now.getHours();
                            month = month + 1;
                            month = month.toString().padStart(2, "0");
                            date = date.toString().padStart(2, "0");
                            var defaultDate = `${year}-${month}-${date}`;
                            if (that.query.type!=="%") {
                                if (that.query.type==="1") {
                                    defaultDate = defaultDate + "_投影仪";
                                }
                                if (that.query.type==="2") {
                                    defaultDate = defaultDate + "_网络";
                                }
                                if (that.query.type==="3") {
                                    defaultDate = defaultDate + "_云桌面";
                                }
                                if (that.query.type==="4") {
                                    defaultDate = defaultDate + "_功放或音响";
                                }
                                if (that.query.type==="5") {
                                    defaultDate = defaultDate + "_电脑";
                                }
                                if (that.query.type==="6") {
                                    defaultDate = defaultDate + "_幕布";
                                }
                                if (that.query.type==="7") {
                                    defaultDate = defaultDate + "_扩音器或麦克风";
                                }
                                if (that.query.type==="8") {
                                    defaultDate = defaultDate + "_其他";
                                }
                            }
                            if (that.query.state!=='%') {
                                if (that.query.state==="1") {
                                    defaultDate = defaultDate + "_待处理";
                                }
                                if (that.query.state==="2") {
                                    defaultDate = defaultDate + "_跟进";
                                }
                                if (that.query.state==="3") {
                                    defaultDate = defaultDate + "_已处理";
                                }
                            }
                            if (that.query.class1!=="" && that.query.class1!==null) {
                                defaultDate = defaultDate + "_" + that.query.class1;
                            }

                            try {
                                FileSaver.saveAs(
                                    //Blob 对象表示一个不可变、原始数据的类文件对象。
                                    //Blob 表示的不一定是JavaScript原生格式的数据。
                                    //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                                    //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                                    new Blob([wbout], { type: "application/octet-stream" }),
                                    //设置导出文件名称
                                    defaultDate + "_导出的表格.xlsx"
                                );
                            } catch (e) {
                                if (typeof console !== "undefined") console.log(e, wbout);
                            }
                            that.query.pagesize=20;

                            return wbout;
                        },300);


                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：repairDetail.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
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
    }

    .handle-add {
        width: 100px;
    }

    .handle-input {
        width: 140px;
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
