<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 周四检修
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
            >
                <el-table-column  width="55" align="center"  type="selection"></el-table-column>
                <el-table-column prop="room" align="center" label="教室"></el-table-column>
                <el-table-column prop="type" label="故障种类" align="center"></el-table-column>
                <el-table-column prop="name" align="center" label="登记人员"></el-table-column>
                <el-table-column prop="reason" align="center" label="故障现象"></el-table-column>
                <el-table-column prop="deal" align="center" label="最后一条维修过程"></el-table-column>
                <el-table-column prop="remarks" align="center" label="最后一条备注"></el-table-column>


            </el-table>
        </div>

    </div>
</template>

<script>
    export default {
        name: "WeeklyRepair",
        data(){
            return {
                tableData: [],
                loading: true,

            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/weeklyrepair") {
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
                this.$axios.get('/WeeklyRepair').then(res4=>{
                    if (res4.data.code===200) {
                        this.tableData=res4.data.data;
                    } else if (res4.data.code===400) {
                        this.$message.error('失败:' + res4.data.message);
                    } else if (res4.data.code===403) {
                        this.$message.error('失败:' + res4.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res4.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：weeklyRepair.getData 出错详情: " + res4.data.message);
                    }
                    this.loading=false;
                }).catch(res5=>{
                    this.$message.error(res5.message);
                });
            }
        }
    }
</script>

<style scoped>

</style>