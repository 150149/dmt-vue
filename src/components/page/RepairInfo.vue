<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 故障登记
                </el-breadcrumb-item>
                <el-breadcrumb-item>故障详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
            <el-card shadow="hover" style="margin-bottom: 20px;">
                <el-table
                        :data="tableData"
                        class="table"
                        header-cell-class-name="table-header"
                        style="width: 100%"
                        v-loading="loading"
                >
                    <el-table-column  width="55" align="center"></el-table-column>
                    <el-table-column prop="date" label="登记日期"  align="center"></el-table-column>
                    <el-table-column prop="classtype" align="center" label="节次"></el-table-column>
                    <el-table-column prop="room" align="center" label="教室">
                    </el-table-column>
                    <el-table-column prop="type" label="故障种类" align="center">
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="登记人员"></el-table-column>
                    <el-table-column prop="state" label="状态" align="center">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium"  v-if="scope.row.state === '跟进'">&nbsp跟&nbsp&nbsp进&nbsp</el-tag>
                                <el-tag size="medium" type="danger" v-if="scope.row.state === '待处理'">{{ scope.row.state }}</el-tag>
                                <el-tag size="medium" type="success" v-if="scope.row.state === '已处理'">{{ scope.row.state }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <el-card shadow="hover" style="margin-bottom: 20px;" >
                <div slot="header" class="clearfix">
                    <span>故障现象</span>
                </div>
                <el-tooltip class="item" effect="dark" content="在此修改并不会录入数据库，如需编辑请点击下方编辑按钮" placement="bottom-start">
                <el-input
                        placeholder="加载中"
                        v-model="input2">
                </el-input>
                </el-tooltip>
            </el-card>

            <el-card shadow="hover" style="margin-bottom: 20px;">
                <div slot="header" class="clearfix">
                    <span>处理信息</span>
                </div>
                <el-table
                        :data="tableData2"
                        class="table"
                        header-cell-class-name="table-header"
                        style="width: 100%"
                        v-loading="loading"
                >
                    <el-table-column  width="55" align="center"></el-table-column>
                    <el-table-column prop="date" label="处理时间"  align="center"></el-table-column>
                    <el-table-column prop="deal" align="center" label="维修过程"></el-table-column>
                    <el-table-column prop="name" align="center" label="维修人员">
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注" align="center">
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    style="color: #ff0000"
                                    @click="handleDelete2(scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

        <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="3">
                <el-button style="width: 100% ;height: 40px" type="primary" icon="el-icon-message"  @click="open2">添加维修记录</el-button>
            </el-col>
            <el-col :span="3">
                <el-button style="width: 100%;height: 40px" type="warning" icon="el-icon-edit" @click="open1">编辑这条记录</el-button>
            </el-col>
            <el-col :span="3">
                <el-button style="width: 100%;height: 40px" type="danger" icon="el-icon-delete" @click="handleDelete">删除这条记录</el-button>
            </el-col>
        </el-row>



        <el-dialog
                title="编辑"
                :visible.sync="editVisible2"
                width="30%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
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
                        <el-option key="1" label="上午 1-2节" value="上午 1-2节"></el-option>
                        <el-option key="2" label="上午 3-4节" value="上午 3-4节"></el-option>
                        <el-option key="3" label="下午 5-7节" value="下午 5-7节"></el-option>
                        <el-option key="4" label="晚上9-10节" value="晚上9-10节"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-select v-model="form.state" placeholder="状态"  value="1">
                        <el-option key="1" label="待处理" value="待处理"></el-option>
                        <el-option key="2" label="跟进" value="跟进"></el-option>
                        <el-option key="3" label="已处理" value="已处理"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="故障种类">
                    <el-select v-model="form.type" placeholder="故障种类"  value="1">
                        <el-option key="1" label="投影仪" value="投影仪"></el-option>
                        <el-option key="2" label="网络" value="网络"></el-option>
                        <el-option key="3" label="云桌面" value="云桌面"></el-option>
                        <el-option key="4" label="功放或音箱" value="功放或音箱"></el-option>
                        <el-option key="5" label="电脑" value="电脑"></el-option>
                        <el-option key="6" label="幕布" value="幕布"></el-option>
                        <el-option key="7" label="扩音器或麦克风" value="扩音器或麦克风"></el-option>
                        <el-option key="8" label="其他" value="其他"></el-option>
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
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>





        <el-dialog
                title="新增维修信息"
                :visible.sync="editVisible3"
                width="30%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
        >
            <el-form ref="form" :model="form2" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="处理日期" >
                    <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="form2.date"
                            value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item label="处理状态" >
                    <el-select v-model="form2.state" placeholder="状态"  value="已处理">
                        <el-option key="1" label="待处理" value="待处理"></el-option>
                        <el-option key="2" label="跟进" value="跟进"></el-option>
                        <el-option key="3" label="已处理" value="已处理"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="处理人员">
                    <el-input v-model="form2.name"></el-input>
                </el-form-item>
                <el-form-item label="维修过程">
                    <el-input v-model="form2.deal"></el-input>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="form2.remarks"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit2">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data() {
            return {
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
                form2: {
                    id: '',
                    repair: '',
                    date: '',
                    deal: '',
                    remarks: '',
                    name: '',
                    state: '已处理',
                },
                tableData: [],
                tableData2: [],
                editVisible2: false,
                editVisible3: false,
                input2: '',
                loading: true,
            };
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/repairinfo") {
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
            onSubmit() {
                this.$message.success('提交成功！');
            },

            open1() {
                this.editVisible2 = true;
            },

            open2() {
                var now = new Date();
                var year = now.getFullYear(); //得到年份
                var month = now.getMonth(); //得到月份
                var date = now.getDate(); //得到日期
                var hour = now.getHours();
                month = month + 1;
                month = month.toString().padStart(2, "0");
                date = date.toString().padStart(2, "0");
                var defaultDate = `${year}-${month}-${date}`;
                this.$set(this.form2, "date", defaultDate);
                this.editVisible3 = true;
            },

            saveEdit() {
                this.editVisible2 = false;
                this.loading=true;
                this.$axios.post('/RepairAdd',{
                    id: this.form.id,
                    date: this.form.date,
                    classtype: this.form.classtype,
                    room: this.form.room,
                    type: this.form.type,
                    reason: this.form.reason,
                    name: this.form.name,
                    state: this.form.state
                }).then(res4=>{
                    if (res4.data.code===200) {
                        this.tableData=[this.form];
                        this.$message.success('添加或编辑成功');
                    } else if (res4.data.code===400) {
                        this.$message.error('失败:' + res4.data.message);
                    } else if (res4.data.code===403) {
                        this.$message.error('失败:' + res4.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res4.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：repairinfo.saveEdit 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });


            },

            saveEdit2() {
                this.editVisible3 = false;
                this.loading = true;
                this.$axios.post('/RepairInfoAdd',{
                    repair: this.form2.repair,
                    date: this.form2.date,
                    deal: this.form2.deal,
                    remarks: this.form2.remarks,
                    name: this.form2.name,
                    state: this.form2.state
                }).then(res4=>{
                    if (res4.data.code===200) {

                        this.$axios.post('/RepairInfoQuery',{
                            id: this.form.id
                        }).then(res1=>{
                            if (res1.data.code===200) {
                                this.loading = false;
                                this.tableData2=res1.data.data;
                            } else if (res1.data.code===400) {
                                this.$message.error('失败:' + res1.data.message);
                            } else if (res1.data.code===403) {
                                this.$message.error('失败:' + res1.data.message);
                                this.loading=false;
                                this.$router.push({path: '/login'});
                            } else if (res1.data.code===500) {
                                alert("请截图以下信息报给维护员: 出错位置：repairinfo.saveEdit2.res1 出错详情: " + res1.data.message);
                            }
                            this.loading=false;
                        }).catch(res2=>{
                            this.$message.error(res2.message)
                        });


                        this.$axios.post('/RepairQueryByID',{
                            id: this.form.id
                        }).then(res7=>{
                            if (res7.data.code===200) {
                                this.loading = false;
                                this.tableData=[res7.data.data];
                            } else if (res1.data.code===400) {
                                this.$message.error('查询失败:' + res7.data.message);
                            } else if (res1.data.code===403) {
                                this.$message.error('查询失败:' + res7.data.message);
                                this.loading=false;
                                this.$router.push({path: '/login'});
                            } else if (res7.data.code===500) {
                                alert("请截图以下信息报给维护员: 出错位置：repairinfo.saveEdit2.res7 出错详情: " + res7.data.message);
                            }
                            this.loading=false;
                        }).catch(res8=>{
                            this.$message.error(res8.message);
                        });


                        this.$message.success('添加处理信息成功');
                    } else if (res4.data.code===400) {
                        this.$message.error('失败:' + res4.data.message);
                    } else if (res4.data.code===403) {
                        this.$message.error('失败:' + res4.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res4.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：repairinfo.saveEdit2.res4 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });


            },

            goBack() {
                this.$router.go(-1);// 返回
                //关闭子页面

            },

            getData() {

                //this.$message.success('查询成功');
                this.form.id=this.$route.query.form.id;
                this.form.date=this.$route.query.form.date;
                this.form.classtype=this.$route.query.form.classtype;
                this.form.room=this.$route.query.form.room;
                this.form.type=this.$route.query.form.type;
                this.form.reason=this.$route.query.form.reason;
                this.form.name=this.$route.query.form.name;
                this.form.state=this.$route.query.form.state;

                this.tableData=[this.$route.query.form];
                this.tableData2=this.$route.query.table;

                this.input2=this.form.reason;

                this.form2.repair=this.form.id;
                this.loading=false;
            },
            handleDelete2(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading=true;
                        this.$axios.post('/RepairInfoDelete',{
                            id: row.id
                        }).then(res6=>{
                            if (res6.data.code===200) {
                                this.$axios.post('/RepairInfoQuery',{
                                    id: this.form.id
                                }).then(res1=>{
                                    if (res1.data.code===200) {
                                        this.loading = false;
                                        this.tableData2=res1.data.data;
                                    } else if (res1.data.code===400) {
                                        this.$message.error('失败:' + res1.data.message);
                                    } else if (res1.data.code===403) {
                                        this.$message.error('失败:' + res1.data.message);
                                        this.loading=false;
                                        this.$router.push({path: '/login'});
                                    } else if (res1.data.code===500) {
                                        alert("请截图以下信息报给维护员: 出错位置：repairinfo.handleDelete2.res1 出错详情: " + res1.data.message);
                                    }
                                    this.loading=false;
                                }).catch(res2=>{
                                    this.$message.error(res2.message);
                                });
                                this.getData();

                                this.$message.success('删除成功');
                            } else if (res6.data.code===400) {
                                this.$message.error('查询失败:' + res6.data.message);
                            } else if (res6.data.code===403) {
                                this.$message.error('查询失败:' + res6.data.message);
                                this.loading=false;
                                this.$router.push({path: '/login'});
                            } else if (res6.data.code===500) {
                                alert("请截图以下信息报给维护员: 出错位置：monney.getdata 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
            },

            handleDelete() {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading=true;
                        this.$axios.post('/RepairDelete',{
                            id: this.form.id
                        }).then(res6=>{
                            if (res6.data.code===200) {
                                this.getData();
                                this.goBack();
                                this.$message.success('删除成功');
                            } else if (res6.data.code===400) {
                                this.$message.error('失败:' + res6.data.message);
                            } else if (res6.data.code===403) {
                                this.$message.error('失败:' + res6.data.message);
                                this.loading=false;
                                this.$router.push({path: '/login'});
                            } else if (res6.data.code===500) {
                                alert("请截图以下信息报给维护员: 出错位置：repairinfo.handleDelete 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
            },
        }
    };
</script>