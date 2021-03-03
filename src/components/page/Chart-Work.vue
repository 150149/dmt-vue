<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 值班表
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
                <el-table-column prop="a1" align="center" label="星期一"></el-table-column>
                <el-table-column prop="a2" align="center" label="星期二"></el-table-column>
                <el-table-column prop="a3" align="center" label="星期三"></el-table-column>
                <el-table-column prop="a4" align="center" label="星期四"></el-table-column>
                <el-table-column prop="a5" align="center" label="星期五"></el-table-column>

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
                <el-table-column prop="a1" align="center" label="星期一"></el-table-column>
                <el-table-column prop="a2" align="center" label="星期二"></el-table-column>
                <el-table-column prop="a3" align="center" label="星期三"></el-table-column>
                <el-table-column prop="a4" align="center" label="星期四"></el-table-column>
                <el-table-column prop="a5" align="center" label="星期五"></el-table-column>

            </el-table>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Chart-Work",
        data(){
            return{
                tableData: [],
                tableData2: [],
                loading: false,
            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/chart-work") {
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
                this.$axios.get("/WorkTable").then(res1=> {
                    if (res1.data.code === 200) {
                        this.tableData = res1.data.data.a1;
                        this.tableData2 = res1.data.data.a2;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：chart-work.getdata 出错详情: " + res1.data.message);
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