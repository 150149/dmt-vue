<template>
    <div>
        <el-card>
            <div ref="chart1" id="chart1" style="width:100%;height:376px"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "Chart-Repair",
        data() {
            return{
                chart1: {
                    title: {
                        text:'故障记录数折线图'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['总故障记录','投影仪','网络','云桌面','功放或音箱','电脑','幕布','扩音器或麦克风','其他']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        show:true,
                        feature: {
                            saveAsImage: {},
                            dataZoom: {
                                yAxisIndex:"none"
                            }
                        }
                    },
                    dataZoom:[
                        {
                            type:"inside"
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []//月份或日期
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'投影仪',
                            type:'line',
                            data:[]
                        },
                        {
                            name:'网络',
                            type:'line',
                            data:[]
                        },
                        {
                            name:'云桌面',
                            type:'line',
                            data:[]
                        },
                        {
                            name:'功放或音箱',
                            type:'line',
                            data:[]
                        },
                        {
                            name:'电脑',
                            type:'line',
                            data:[]
                        },
                        {
                            name:'幕布',
                            type:'line',
                            data:[]
                        },
                        {
                            name:'扩音器或麦克风',
                            type:'line',
                            data:[]
                        },
                        {
                            name:'其他',
                            type:'line',
                            data:[]
                        }
                    ]
                },
            }
        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    console.log(to);
                    if (to.path==="/chart-repair") {
                        that.getData();
                    }
                },
                deep: true
            }
        },

        methods: {
            getData(){
                this.$axios.get("/ChartRepair").then(res1=>{

                    if (res1.data.message===200) {
                        this.chart1.xAxis.data=res1.data.data.a1;
                        this.chart1.series[0].data=res1.data.data.a2;
                        this.chart1.series[1].data=res1.data.data.a3;
                        this.chart1.series[2].data=res1.data.data.a4;
                        this.chart1.series[3].data=res1.data.data.a5;
                        this.chart1.series[4].data=res1.data.data.a6;
                        this.chart1.series[5].data=res1.data.data.a7;
                        this.chart1.series[6].data=res1.data.data.a8;
                        this.chart1.series[7].data=res1.data.data.a9;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/iogin'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：chart-repair.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.messages);
                });

                const chart1 = this.$refs.chart1;
                if (chart1) {
                    const myChart = this.$echarts.init(document.getElementById("chart1"));
                    const option = this.chart1;
                    myChart.setOption(option);
                    window.addEventListener("resize", function() {
                        myChart.resize();
                    })
                }
                this.$on('hook:destroyed',()=>{
                    window.removeEventListener("resize", function() {
                        myChart.resize();
                    });
                })
            },
        },
    }
</script>

<style scoped>

</style>