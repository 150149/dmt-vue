<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 排班管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container" >
            <div class="handle-box">

                <el-button  type="primary" icon="el-icon-message"  @click="open2">保存排班表</el-button>
                <el-input v-model="query.dayper" placeholder="白天上班人数" class="handle-input mr10"></el-input>
                <el-input v-model="query.nightper" placeholder="晚上上班人数" class="handle-input mr10"></el-input>
                <el-input v-model="query.fangcha" placeholder="输出的最大方差" class="handle-input mr10"></el-input>
                <el-button type="warning" icon="el-icon-edit" @click="open1">计算排班表</el-button>

            </div>

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
                        <el-input v-model="scope.row.a1" ></el-input>
                        <p v-if="scope.$index===0">{{free1[0][0]}}</p>
                        <p v-if="scope.$index===1">{{free1[0][1]}}</p>
                        <p v-if="scope.$index===2">{{free1[0][2]}}</p>
                        <p v-if="scope.$index===3">{{free1[0][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a2" align="center" label="星期二">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a2" ></el-input>
                        <p v-if="scope.$index===0">{{free1[1][0]}}</p>
                        <p v-if="scope.$index===1">{{free1[1][1]}}</p>
                        <p v-if="scope.$index===2">{{free1[1][2]}}</p>
                        <p v-if="scope.$index===3">{{free1[1][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a3" align="center" label="星期三">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a3" ></el-input>
                        <p v-if="scope.$index===0">{{free1[2][0]}}</p>
                        <p v-if="scope.$index===1">{{free1[2][1]}}</p>
                        <p v-if="scope.$index===2">{{free1[2][2]}}</p>
                        <p v-if="scope.$index===3">{{free1[2][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a4" align="center" label="星期四">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a4" :disabled="true" v-if="scope.row.jieci==='五六七节'"></el-input>
                        <el-input v-model="scope.row.a4" v-if="scope.row.jieci!=='五六七节'"></el-input>
                        <p v-if="scope.$index===0">{{free1[3][0]}}</p>
                        <p v-if="scope.$index===1">{{free1[3][1]}}</p>
                        <p v-if="scope.$index===2">{{free1[3][2]}}</p>
                        <p v-if="scope.$index===3">{{free1[3][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a5" align="center" label="星期五">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a5" ></el-input>
                        <p v-if="scope.$index===0">{{free1[4][0]}}</p>
                        <p v-if="scope.$index===1">{{free1[4][1]}}</p>
                        <p v-if="scope.$index===2">{{free1[4][2]}}</p>
                        <p v-if="scope.$index===3">{{free1[4][3]}}</p>
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
                        <el-input v-model="scope.row.a1" ></el-input>
                        <p v-if="scope.$index===0">{{free2[0][0]}}</p>
                        <p v-if="scope.$index===1">{{free2[0][1]}}</p>
                        <p v-if="scope.$index===2">{{free2[0][2]}}</p>
                        <p v-if="scope.$index===3">{{free2[0][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a2" align="center" label="星期二">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a2" ></el-input>
                        <p v-if="scope.$index===0">{{free2[1][0]}}</p>
                        <p v-if="scope.$index===1">{{free2[1][1]}}</p>
                        <p v-if="scope.$index===2">{{free2[1][2]}}</p>
                        <p v-if="scope.$index===3">{{free2[1][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a3" align="center" label="星期三">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a3" ></el-input>
                        <p v-if="scope.$index===0">{{free2[2][0]}}</p>
                        <p v-if="scope.$index===1">{{free2[2][1]}}</p>
                        <p v-if="scope.$index===2">{{free2[2][2]}}</p>
                        <p v-if="scope.$index===3">{{free2[2][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a4" align="center" label="星期四">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a4" :disabled="true" v-if="scope.row.jieci==='五六七节'"></el-input>
                        <el-input v-model="scope.row.a4" v-if="scope.row.jieci!=='五六七节'"></el-input>
                        <p v-if="scope.$index===0">{{free2[3][0]}}</p>
                        <p v-if="scope.$index===1">{{free2[3][1]}}</p>
                        <p v-if="scope.$index===2">{{free2[3][2]}}</p>
                        <p v-if="scope.$index===3">{{free2[3][3]}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="a5" align="center" label="星期五">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.a5" ></el-input>
                        <p v-if="scope.$index===0">{{free2[4][0]}}</p>
                        <p v-if="scope.$index===1">{{free2[4][1]}}</p>
                        <p v-if="scope.$index===2">{{free2[4][2]}}</p>
                        <p v-if="scope.$index===3">{{free2[4][3]}}</p>
                    </template>
                </el-table-column>

            </el-table>


        </div>



    </div>
</template>

<script>
    export default {
        name: "WorkSort",
        data(){
            return{
                tableData: [],
                tableData2: [],
                free1: [],
                free2: [],
                query: {
                    dayper: '3',
                    nightper: '2',
                    fangcha: '4',
                    girlnotinone: 'false',
                    girlnotnight: 'false',
                    notnew: 'false',
                },
                loading: true,
                free1: [[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]],
                free2: [[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]],
            }
        },



        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/worksort") {
                        that.getData();
                    }
                },
                deep: true
            }
        },

        created(){
            this.getData();
        },

        destroyed() {
            clearTimeout(this.timer)
        },

        methods: {
            getData(){
                this.loading=true;
                this.$axios.get("/WorkTable").then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data.a1;
                        this.tableData2=res1.data.data.a2;
                        this.getFree();
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：worksort.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },

            getFree(){
                this.loading=true;
                this.$axios.post("/WorkSortFree",{
                    t1: this.tableData,
                    t2: this.tableData2,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.free1=res1.data.data.a1;
                        this.free2=res1.data.data.a2;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：worksort.getFree 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },

            timer() {
                return setTimeout(()=>{
                    this.$axios.post("/WorkSort",{
                        dayper: this.query.dayper,
                        nightper: this.query.nightper,
                        fangcha: this.query.fangcha,
                        girlnotinone: this.query.girlnotinone,
                        girlnotnight: this.query.girlnotnight,
                        notnew: this.query.notnew,
                    }).then(res1=>{
                        if (res1.data.code===200) {
                            this.$message.success('计算完成');
                            this.tableData=res1.data.data.t1;
                            this.tableData2=res1.data.data.t2;
                            this.getFree();
                        } else if (res1.data.code===400) {
                            this.$message.warning(res1.data.message);
                        } else if (res1.data.code===500) {
                            alert("请截图以下信息报给维护员: 出错位置：worksort.timer 出错详情: " + res1.data.message);
                        } else if (res1.data.code===403) {
                            this.$message.error("登录过期，请重新登录");
                        }
                    })
                },5000)
            },

            open1(){
                this.loading=true;
                this.$axios.post("/WorkSort",{
                    dayper: this.query.dayper,
                    nightper: this.query.nightper,
                    fangcha: this.query.fangcha,
                    girlnotinone: this.query.girlnotinone,
                    girlnotnight: this.query.girlnotnight,
                    notnew: this.query.notnew,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.$message.success('计算完成');
                        this.tableData=res1.data.data.t1;
                        this.tableData2=res1.data.data.t2;
                        this.getFree();
                    } else if (res1.data.code===400) {
                        this.timer();
                        this.$message.warning(res1.data.message);
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：worksort.open1 出错详情: " + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error("登录过期，请重新登录");
                    }
                    this.loading=false;
                })
            },

            open2(){
                this.loading=true;
                this.$axios.post("/WorkTableSave",{
                    t1: this.tableData,
                    t2: this.tableData2,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.$message.success('保存成功');
                    } else if (res1.data.code===400) {
                        this.$message.error('失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：worksort.open2 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
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