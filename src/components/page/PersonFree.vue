<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 空闲时间登记
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container" >
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="jieci" label="单周"  align="center"></el-table-column>
                <el-table-column prop="a1" align="center" label="星期一">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a1"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a2" align="center" label="星期二">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a2" ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a3" align="center" label="星期三">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a3" ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a4" align="center" label="星期四">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a4"  ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a5" align="center" label="星期五">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a5" ></el-checkbox>
                    </template>
                </el-table-column>


            </el-table>



        </div>

        <div style="padding: 10px"></div>

        <div class="container">
            <el-table
                    :data="tableData2"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"></el-table-column>
                <el-table-column prop="jieci" label="双周"  align="center"></el-table-column>
                <el-table-column prop="a1" align="center" label="星期一">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a1" ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a2" align="center" label="星期二">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a2" ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a3" align="center" label="星期三">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a3" ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a4" align="center" label="星期四">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a4"  ></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="a5" align="center" label="星期五">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.a5" ></el-checkbox>
                    </template>
                </el-table-column>

            </el-table>


        </div>

        <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="3">
                <el-button style="width: 100% ;height: 40px" type="primary" icon="el-icon-message"  @click="sendData">保存</el-button>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "PersonFree",
        data(){
            return{
                tableData: [],
                tableData2: [],
                loading: true,
            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/personfree") {
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
                this.loading=true;
                this.$axios.get("/PersonFree").then(res1=>{
                    this.tableData=res1.data.data.t1;
                    this.tableData2=res1.data.data.t2;
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data.t1;
                        this.tableData2=res1.data.data.t2;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：personfree.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                })
            },
            sendData(){
                this.loading=true;
                this.$axios.post('/PersonFreeUpdate',{
                    d:this.tableData,
                    s:this.tableData2,
                }).then(res2=>{

                    if (res2.data.code===200){
                        this.$message.success('保存成功');
                        this.getData();
                    } else if (res2.data.code===400) {
                        this.$message.error('失败:' + res2.data.message);
                    } else if (res2.data.code===403) {
                        this.$message.error('失败:' + res2.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res2.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：personfree.senddata 出错详情: " + res2.data.message);
                    }
                    this.loading=false;
                }).catch(res3=>{
                    this.$message.error('保存失败,' + res3.message);
                })
            }
        },
    }
</script>

<style scoped>

</style>