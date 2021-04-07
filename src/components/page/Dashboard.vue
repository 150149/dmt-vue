<template>
    <div>
        <el-row :gutter="20" v-loading="loading">
            <el-card shadow="hover" class="broadcast">
                公告: {{topB}}
            </el-card>

            <el-col :span="8" :lg="8" :xs="24" :sm="24">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/head.png" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{type}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        加入电教中心时间：
                        <span>{{addtime}}</span>
                    </div>
                    <div class="user-info-list">
                        你登录的账号 ：
                        <span>{{username}}</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;" hidden-sm-only>
                    <div slot="header" class="clearfix">
                        <span>服务器监控</span>
                    </div>内存
                    <el-progress :percentage=memory color="#42b983"></el-progress>CPU
                    <el-progress :percentage=cpu color="#f1e05a"></el-progress>硬盘
                    <el-progress :percentage=disk></el-progress>
                </el-card>
            </el-col>
            <el-col :span="8" :lg="16" :xs="24" :sm="24" hidden-xs-only>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{fault}}</div>
                                    <div>今天处理故障次数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{today}}</div>
                                    <div>今天接到电话次数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{thismonth}}</div>
                                    <div>本月支出费用</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import 'element-ui/lib/theme-chalk/display.css';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            addtime: "",
            username:"",
            fault:"",
            today:"",
            thismonth: "",
            type: "",
            memory: 0,
            loading: false,
            cpu: 0,
            disk:0,
            topB: '暂无公告',
            options: {
                type: 'line',
                title: {
                    text: '最近一周故障处理数'
                },
                xRorate: 25,
                labels: [],
                datasets: [
                    {
                        label: '投影仪',
                        data: []
                    },
                    {
                        label: '网络',
                        data: []
                    },
                    {
                        label: '云桌面',
                        data: []
                    },
                    {
                        label: '功放或音箱',
                        data: []
                    },
                    {
                        label: '电脑',
                        data: []
                    },
                    {
                        label: '幕布',
                        data: []
                    },
                    {
                        label: '扩音器或麦克风',
                        data: []
                    },
                    {
                        label: '其他',
                        data: []
                    },
                ]
            },
            notifyPromise:Promise.resolve(),
        };
    },
    components: {
        Schart
    },

    created(){
        this.convert();
    },

    watch: {
        "$route" : {
            handler(to,from){
                const that = this;
                if (to.path==="/dashboard") {
                    that.convert();
                }
            },
            deep: true
        }
    },

    // created() {
    //     this.handleListener();
    //     this.changeDate();
    // },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        convert(){
            this.loading=true;
            this.$axios.get("/DashBoard").then(res1=>{

                if (res1.data.code===200){
                    this.name=res1.data.data.name;
                    this.addtime=res1.data.data.addtime;
                    this.username=res1.data.data.username;
                    this.fault=res1.data.data.fault;
                    this.today=res1.data.data.today;
                    this.thismonth=res1.data.data.thismonth;
                    this.type=res1.data.data.type;
                    this.memory=parseInt(res1.data.data.memory);
                    this.cpu=parseInt(res1.data.data.cpu);
                    this.disk=parseInt(res1.data.data.disk);
                    localStorage.setItem('type', res1.data.data.type);
                    localStorage.setItem('name', res1.data.data.name);
                    bus.$emit('type', res1.data.data.type);
                } else if (res1.data.code===400) {
                    this.$message.error('查询失败:' + res1.data.message);
                } else if (res1.data.code===403) {
                    this.$message.error('查询失败:' + res1.data.message);
                    this.loading=false;
                    this.$router.push({path: '/login'});
                } else if (res1.data.code===500) {
                    alert("请截图以下信息报给维护员: 出错位置：dasboard.convert 出错详情: " + res1.data.message);
                }
                this.loading=false;
            }).catch(res2=>{
                this.$message.error(res2.message);
            });

            this.$axios.get("/ChartRepair").then(res1=>{

                if (res1.data.code===200){
                    this.options.labels=res1.data.data.a1;
                    this.options.datasets[0].data=res1.data.data.a2;
                    this.options.datasets[1].data=res1.data.data.a3;
                    this.options.datasets[2].data=res1.data.data.a4;
                    this.options.datasets[3].data=res1.data.data.a5;
                    this.options.datasets[4].data=res1.data.data.a6;
                    this.options.datasets[5].data=res1.data.data.a7;
                    this.options.datasets[6].data=res1.data.data.a8;
                    this.options.datasets[7].data=res1.data.data.a9;
                } else if (res1.data.code===400) {
                    this.$message.error('查询失败:' + res1.data.message);
                } else if (res1.data.code===403) {
                    this.$message.error('查询失败:' + res1.data.message);
                    this.loading=false;
                    this.$router.push({path: '/login'});
                } else if (res1.data.code===500) {
                    alert("请截图以下信息报给维护员: 出错位置：dashboard.convert 出错详情: " + res1.data.message);
                }
                this.loading=false;
            }).catch(res2=>{
                this.$message.error(res2.message);
            });

            this.$axios.post('/Broadcast', {
                pageindex: 1,
                pagesize: 1
            }).then(res1 => {
                if (res1.data.code === 200) {
                    this.topB = res1.data.data[0].info;
                    //this.$message.success('查询成功');
                    this.loading = false;
                } else if (res1.data.code === 400) {
                    this.$message.error('查询失败:' + res1.data.message);
                } else if (res1.data.code === 403) {
                    this.$message.error('查询失败:' + res1.data.message);
                    this.loading = false;
                    this.$router.push({path: '/login'});
                } else if (res1.data.code === 500) {
                    alert("请截图以下信息报给维护员: 出错位置：dashboard.getdata.broadcast 出错详情: " + res1.data.message);
                }
                this.loading = false;
            }).catch(res2 => {
                this.$message.error(res2.message);
            });


            this.$axios.get("/BroadcastShow").then(res1=>{

                if (res1.data.code===200){

                    for (let i=0; i<res1.data.data.length; i++) {
                        this.notify(res1.data.data[i].info);
                    }

                } else if (res1.data.code===400) {
                    this.$message.error('查询失败:' + res1.data.message);
                } else if (res1.data.code===403) {
                    this.$message.error('查询失败:' + res1.data.message);
                    this.loading=false;
                    this.$router.push({path: '/login'});
                } else if (res1.data.code===500) {
                    alert("请截图以下信息报给维护员: 出错位置：dashboard.getdata.BroadcastShow 出错详情: " + res1.data.message);
                }
                this.loading=false;
            }).catch(res2=>{
                this.$message.error(res2.message);
            });


        },
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },

        notify(info) {
            this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(()=>{
                this.$notify({
                    title: "通知",
                    message: info,
                    duration: 0,
                    type: 'warning',
                });
            })
        },
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>

    .broadcast {
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 20px;
        font-size: 15px;
        font-weight: bold;
        height:30px;
        display: flex;
        align-items: center;
    }

.el-row {
    margin-bottom: 10px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

@media screen and (max-width: 500px) {
    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 7px !important;
        color: #999;
    }

    .grid-num {
        font-size: 10px !important;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 10px !important;
        width: 1px;
        height: 1px;
        text-align: center;
        line-height: 1px;
        color: #fff;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 7px !important;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 10px !important;
        color: #222;
    }

    .user-info-list {
        font-size: 7px !important;
        color: #999;
        line-height: 25px;
    }
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 365px;
}
</style>
