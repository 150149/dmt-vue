<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 签到人数查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker
                        type="date"
                        placeholder="选择起始日期"
                        v-model="query.start"
                        value-format="yyyy-MM-dd"
                        class="handle-select mr10"
                ></el-date-picker>
                <el-date-picker
                        type="date"
                        placeholder="选择结束日期"
                        v-model="query.end"
                        value-format="yyyy-MM-dd"
                        class="handle-select mr10"
                ></el-date-picker>
                <el-input v-model="query.day" placeholder="白天签到人数" class="handle-input mr10"></el-input>
                <el-input v-model="query.night" placeholder="夜晚签到人数" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                <el-table-column prop="num" align="center" label="签到人数"></el-table-column>
                <el-table-column prop="state" label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" type="danger" >异常</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="open2(scope.row)"
                        >查看</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>

    </div>
</template>

<script>
    export default {
        name: "NoSign",
        data() {
            return{
                tableData: [],
                query: {
                    start: '',
                    end: '',
                    day: '3',
                    night: '2',
                },
                loading: true,
            }
        },

        created(){
            var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth(); //得到月份
            var date = now.getDate(); //得到日期
            var hour = now.getHours();
            month = month + 1;
            month = month.toString().padStart(2, "0");
            date = date.toString().padStart(2, "0");
            var defaultDate = `${year}-${month}-${date}`;

            this.query.start= `${year}` + "-01-01 00:00:00";
            this.query.end= defaultDate + " 23:00:00";
            this.getData();
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/nosign") {
                        that.getData();
                    }
                },
                deep: true
            }
        },

        methods: {
            getData() {
                this.loading = true;
                this.$axios.post('/SignQueryNoSign',{
                    start: this.query.start,
                    end: this.query.end,
                    day: this.query.day,
                    night: this.query.night,
                }).then(res1=>{
                    if (res1.data.code===200) {
                        this.tableData=res1.data.data;
                        this.loading = false;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：NoSign.getData 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                });
            },

            handleSearch() {
                this.getData();
            },

            open2(row) {
                var date = row.start.split(' ')[0];
                this.$router.push({
                    path: '/sign',
                    query: {
                        date: date,
                    }
                });
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

</style>  