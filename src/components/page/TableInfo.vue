<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 表格详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="overflow: auto">

            <div class="handle-box">

                <el-input v-model="schfilter" placeholder="搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" class="handle-select">搜索</el-button>
                <el-select  v-model="selectData" placeholder="在职状况" class="handle-select mr10" @change="selectTrigger(selectData)" v-if="showSelect===true">
                    <el-option key="%" label="所有类别" value="%"></el-option>
                    <el-option key="1" label="在职" value="1"></el-option>
                    <el-option key="2" label="离职" value="2"></el-option>
                </el-select>
                <el-button type="warning"  @click="handleDownload" class="handle-select">下载</el-button>
            </div>

            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    fit="fit"
                    v-loading="loading"
                    id="out-table"
            >


                <el-table-column
                        v-for="(val,key) in this.tableData[0]"
                        :prop="key"
                        :label="key"
                        sortable
                        align="center"
                >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.row.id)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>


        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="tableData" :model="tableData" label-width="70px">
                <el-divider></el-divider>

                <el-form-item
                        v-for="(val,key) in this.tableData[0]"
                        v-if="key!=='id'"
                        :label="key"
                >
                    <el-input v-model="tableData[form][key]"></el-input>
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
    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    export default {
        name: "TableInfo",

        data() {
            return{
                parentContent: '',
                otableData: [],
                schfilter: '',
                loading: true,
                id: '1',
                form: '0',
                editVisible: 'false',
                fit: true,
                showSelect: false,
                selectData: '',
            }
        },

        created(){
            this.getData();
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

        methods: {

            getData(){
                this.editVisible=false;
                this.loading=true;
                this.$axios.post("/TableQuery",{
                    id: this.$route.query.id
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.id=this.$route.query.id;
                        if (res1.data.data.title==="1协管员通讯录") {
                            this.showSelect=true;
                        } else {
                            this.showSelect=false;
                        }
                        var array=JSON.parse(decodeURIComponent(res1.data.data.table));

                        var data=[];

                        for (var i=1;i<array.length;i++) {
                            var map={};
                            map["id"]=i;
                            for (var j=0;j<array[0].length;j++) {
                                map[array[0][j]] = array[i][j];
                            }
                            data.push(map);
                        }
                        this. otableData=data;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：tableinfo.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },

            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        for (var i=0;i<this.otableData.length;i++) {
                            if (this.otableData[i].id===row) {
                                this.otableData.splice(i,1);
                            }
                        }

                        var ot = this.otableData;

                        var a=[];
                        for (var i=0;i<ot.length;i++){
                            var b=[];
                            if (i===0) {
                                Object.getOwnPropertyNames(ot[i]).forEach(function(key){
                                    b.push(key);
                                });
                                a.push(b);
                            }

                            b=[];
                            var c = Object.getOwnPropertyNames(ot[i]);
                            c.pop();

                            c.forEach(function(key){
                                b.push(ot[i][key]);
                            });
                            a.push(b);
                        }

                        var str=encodeURIComponent(JSON.stringify(a));


                        this.loading = true;
                        this.$axios.post('/TableUpdate',{
                            id: this.id,
                            table: str,
                        }).then(res6=>{
                            if (res6.data.code===200) {
                                this.getData();
                                this.$message.success('删除成功');
                                this.loading = false;
                                this.getData();
                            } else if (res6.data.code===400) {
                                this.$message.error('失败:' + res6.data.message);
                            } else if (res6.data.code===403) {
                                this.$message.error('失败:' + res6.data.message);
                                this.loading=false;
                                this.$router.push({path: '/login'});
                            } else if (res6.data.code===500) {
                                alert("请截图以下信息报给维护员: 出错位置：tableinfo.handleDelete.res6 出错详情: " + res6.data.message);
                            }
                            this.loading=false;
                        }).catch(res7=>{
                            this.$message.error(res7.message);
                        });
                    })
                    .catch(res8 => {
                        this.$message.error(res7.message);
                    });
            },
            // 编辑操作
            handleEdit(row,key2) {
                this.form=row;
                this.editVisible=true;
            },

            saveEdit(){
                var ot = this.otableData;

                var a=[];
                for (var i=0;i<ot.length;i++){
                    var b=[];
                    if (i===0) {
                        Object.getOwnPropertyNames(ot[i]).forEach(function(key){
                            b.push(key);
                        });
                        a.push(b);
                    }

                    b=[];
                    var c = Object.getOwnPropertyNames(ot[i]);
                    c.pop();

                    c.forEach(function(key){
                        b.push(ot[i][key]);
                    });
                    a.push(b);
                }

                var str=encodeURIComponent(JSON.stringify(a));


                this.loading = true;
                this.$axios.post('/TableUpdate',{
                    id: this.id,
                    table: str,
                }).then(res6=>{
                    if (res6.data.code===200) {
                        this.getData();
                        this.$message.success('修改成功');
                        this.loading = false;
                        this.getData();
                    }else if (res6.data.code===400) {
                        this.$message.error('失败:' + res6.data.message);
                    } else if (res6.data.code===403) {
                        this.$message.error('失败:' + res6.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res6.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：monney.getdata 出错详情: " + res6.data.message);
                    }
                    this.loading=false;
                }).catch(res7=>{
                    this.$message.error(res7.message);
                });
            },

            selectTrigger(val) {
                if (val==="1") {
                    this.schfilter="在职";
                } else if (val==="2") {
                    this.schfilter="离职";
                } else if (val==="%") {
                    this.schfilter="";
                }
            },

            handleDownload(){
                var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    FileSaver.saveAs(
                        //Blob 对象表示一个不可变、原始数据的类文件对象。
                        //Blob 表示的不一定是JavaScript原生格式的数据。
                        //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                        //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                        new Blob([wbout], { type: "application/octet-stream" }),
                        //设置导出文件名称
                        "导出的表格.xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            },


        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/tableinfo") {
                        that.getData();
                    }
                },
                deep: true
            },

        },
    }
</script>

<style scoped>

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-add {
        width: 100px;
    }

    .handle-input {
        width: 143px;
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
        margin-right: 20px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 7px;
    }

    .tb-edit .input-box {
        display: none
    }
    .tb-edit .current-cell .input-box {
        display: block;
        margin-left: -15px;
    }

</style>