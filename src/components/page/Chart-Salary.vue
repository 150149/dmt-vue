<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 签到统计
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
                <el-table-column prop="date" label="日期"  align="center"></el-table-column>
                <el-table-column prop="name" align="center" label="姓名"></el-table-column>
                <el-table-column prop="timer" align="center" label="总工时"></el-table-column>
                <el-table-column prop="salary" align="center" label="总工资"></el-table-column>
            </el-table>

        </div>

    </div>
</template>

<script>
    export default {
        name: "Chart-Salary",
        data(){
            return{
                tableData: [],
                loading: false,

            }
        },
        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/chart-salary") {
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
                this.$axios.get("/SalaryChart").then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：chart-salary.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },
        }

    }
</script>

<style scoped>

</style>