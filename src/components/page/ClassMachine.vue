<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备资料
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
                >新增教室</el-button>
                <el-input v-model="schfilter" placeholder="要搜索的内容" class="handle-input mr10"></el-input>
                <el-button  type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button  class="handle-select" @click="handleDownload" >下载</el-button>
                当前有 {{this.tableData.length}} 条数据
            </div>
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
                    id="out-table"
            >
                <el-table-column  width="55" align="center"  ></el-table-column>
                <el-table-column prop="room" label="教室" sortable align="center"></el-table-column>
                <el-table-column prop="projector" align="center" sortable label="投影仪"></el-table-column>
                <el-table-column prop="curtain" align="center" sortable label="幕布"></el-table-column>
                <el-table-column prop="amplifier" label="功放" sortable align="center"></el-table-column>
                <el-table-column prop="receiver" align="center" sortable label="麦克风接收器"></el-table-column>
                <el-table-column prop="computer" align="center" sortable label="电脑"></el-table-column>
                <el-table-column prop="microphone" align="center" sortable label="手持麦"></el-table-column>
                <el-table-column prop="frequency1" align="center" sortable label="大麦频率"></el-table-column>
                <el-table-column prop="frequency2" align="center" sortable label="小麦频率"></el-table-column>
                <el-table-column prop="HDMI" label="HDMI状态" sortable align="center">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" type="danger" v-if="scope.row.hdmi === '未安装'">{{scope.row.hdmi }}</el-tag>
                            <el-tag size="medium" type="success" v-if="scope.row.hdmi === '已安装'">{{ scope.row.hdmi }}</el-tag>
                            <el-tag size="medium" type="primary" v-if="scope.row.hdmi === 'HDMI线2条'">{{ scope.row.hdmi }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mark" align="center" sortable label="备注"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit1(scope.row)"
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

        <!-- 编辑弹出框 -->
        <el-dialog
                title="新增教室"
                :visible.sync="editVisible1"
                width="30%"
                :close-on-click-modal=false
                :close-on-press-escape=false
                :show-close=false
        >
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="教室">
                    <el-input v-model="form.room"></el-input>
                </el-form-item>
                <el-form-item label="投影仪">
                    <el-input v-model="form.projector"></el-input>
                </el-form-item>
                <el-form-item label="幕布">
                    <el-input v-model="form.curtain"></el-input>
                </el-form-item>
                <el-form-item label="功放">
                    <el-input v-model="form.amplifier"></el-input>
                </el-form-item>
                <el-form-item label="麦克风接收器">
                    <el-input v-model="form.receiver"></el-input>
                </el-form-item>
                <el-form-item label="电脑">
                    <el-input v-model="form.computer"></el-input>
                </el-form-item>
                <el-form-item label="手持麦">
                    <el-input v-model="form.microphone"></el-input>
                </el-form-item>
                <el-form-item label="大麦频率">
                    <el-input v-model="form.frequency1"></el-input>
                </el-form-item>
                <el-form-item label="小麦频率">
                    <el-input v-model="form.frequency2"></el-input>
                </el-form-item>
                <el-form-item label="HDMI状态" >
                    <el-select v-model="form.hdmi" placeholder="HDMI状态"  value="未安装">
                        <el-option key="1" label="已安装" value="已安装"></el-option>
                        <el-option key="2" label="未安装" value="未安装"></el-option>
                        <el-option key="3" label="HDMI线2条" value="HDMI线2条"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.mark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog
                title="编辑"
                :visible.sync="editVisible2"
                width="30%"
                :close-on-click-modal=false
                :close-on-press-escape=false
                :show-close=false
        >
            <el-form ref="form" :model="form" label-width="70px">
                <el-divider></el-divider>
                <el-form-item label="教室">
                    <el-input v-model="form.room"></el-input>
                </el-form-item>
                <el-form-item label="投影仪">
                    <el-input v-model="form.projector"></el-input>
                </el-form-item>
                <el-form-item label="幕布">
                    <el-input v-model="form.curtain"></el-input>
                </el-form-item>
                <el-form-item label="功放">
                    <el-input v-model="form.amplifier"></el-input>
                </el-form-item>
                <el-form-item label="麦克风接收器">
                    <el-input v-model="form.receiver"></el-input>
                </el-form-item>
                <el-form-item label="电脑">
                    <el-input v-model="form.computer"></el-input>
                </el-form-item>
                <el-form-item label="手持麦">
                    <el-input v-model="form.microphone"></el-input>
                </el-form-item>
                <el-form-item label="大麦频率">
                    <el-input v-model="form.frequency1"></el-input>
                </el-form-item>
                <el-form-item label="小麦频率">
                    <el-input v-model="form.frequency2"></el-input>
                </el-form-item>
                <el-form-item label="HDMI状态" >
                    <el-select v-model="form.hdmi" placeholder="HDMI状态"  value="未安装">
                        <el-option key="1" label="已安装" value="已安装"></el-option>
                        <el-option key="2" label="未安装" value="未安装"></el-option>
                        <el-option key="3" label="HDMI线2条" value="HDMI线2条"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.mark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit2">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import XLSX from "xlsx";
    import FileSaver from "file-saver";
    export default {
        name: 'classmachine',
        data() {
            return {
                otableData: [],
                schfilter: '',
                editVisible1: false,
                editVisible2: false,
                form: {
                    id: 0,
                    room: '',
                    projector: '',
                    curtain: '',
                    amplifier: '',
                    receiver: '',
                    computer: '',
                    microphone: '',
                    frequency1: '',
                    frequency2: '',
                    hdmi: '',
                    mark: '',
                },
                loading: true
            };
        },

        computed:{
            tableData:function(){
                var search=this.schfilter.toString().toLowerCase();

                if(search){
                    return  this.otableData.filter(function(dataNews){
                        return Object.keys(dataNews).some(function(key){
                            return String(dataNews[key]).toLowerCase().includes(search);
                        })
                    })
                }
                return this.otableData;
            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/classmachine") {
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

            open1() {
                this.$set(this.form, "id", "0");
                this.$set(this.form, "room", "");
                this.$set(this.form, "projector", "");
                this.$set(this.form, "curtain", "");
                this.$set(this.form, "amplifier", "");
                this.$set(this.form, "receiver", "");
                this.$set(this.form, "computer", "");
                this.$set(this.form, "microphone", "");
                this.$set(this.form, "frequency1", "");
                this.$set(this.form, "frequency2", "");
                this.$set(this.form, "hdmi", "");
                this.$set(this.form, "mark", "");
                this.editVisible1=true;
            },

            getData() {
                this.loading = true;
                this.$axios.get('/ClassMachine').then(res1=>{
                    if (res1.data.code===200) {
                        this.otableData=res1.data.data;
                        //this.$message.success('查询成功');
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：classMachine.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },
            // 触发搜索按钮
            handleSearch() {

            },
            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true;
                        this.$axios.post('/ClassMachineDelete',{
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
                                alert("请截图以下信息报给维护员: 出错位置：classMachine.handledelete 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(() => {});
            },
            // 编辑操作
            handleEdit1(row) {
                this.form.id=row.id;
                this.form.room=row.room;
                this.form.projector=row.projector;
                this.form.curtain=row.curtain;
                this.form.amplifier=row.amplifier;
                this.form.receiver=row.receiver;
                this.form.computer=row.computer;
                this.form.microphone=row.microphone;
                this.form.frequency1=row.frequency1;
                this.form.frequency2=row.frequency2;
                this.form.hdmi=row.hdmi;
                this.form.mark=row.mark;
                this.editVisible2=true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible1 = false;
                this.loading=true;
                this.$axios.post('/ClassMachineAdd',{
                    id: this.form.id,
                    room: this.form.room,
                    projector: this.form.projector,
                    curtain: this.form.curtain,
                    amplifier: this.form.amplifier,
                    receiver: this.form.receiver,
                    computer: this.form.computer,
                    microphone: this.form.microphone,
                    frequency1: this.form.frequency1,
                    frequency2: this.form.frequency2,
                    hdmi: this.form.hdmi,
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
                        alert("请截图以下信息报给维护员: 出错位置：classMachine.saveEdit 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });
            },

            // 保存编辑
            saveEdit2() {
                this.editVisible2 = false;
                this.loading=true;
                this.$axios.post('/ClassMachineEdit',{
                    id: this.form.id,
                    room: this.form.room,
                    projector: this.form.projector,
                    curtain: this.form.curtain,
                    amplifier: this.form.amplifier,
                    receiver: this.form.receiver,
                    computer: this.form.computer,
                    microphone: this.form.microphone,
                    frequency1: this.form.frequency1,
                    frequency2: this.form.frequency2,
                    hdmi: this.form.hdmi,
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
                        alert("请截图以下信息报给维护员: 出错位置：classMachine.saveEdit2 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });
            },

            handleDownload(){
                this.loading = true;
                this.$axios.get('/ClassMachine').then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
                        //this.$message.success('查询成功');
                        this.loading = false;

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

                            return wbout;
                        },300);


                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：repair.getdata 出错详情: " + res1.data.message);
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
