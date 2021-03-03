<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>文档详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" v-loading="loading">

            <div id="table" v-html="parentContent"></div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "DocumentInfo",
        data() {
            return{
                tableData: [],
                parentContent: '',
                loading: false,
            }
        },
        created(){
            this.getData();
        },

        methods: {


            getData(){
                this.loading=true;
                this.$axios.post("/DocumentQuery",{
                    id: this.$route.query.id
                }).then(res1=>{
                    if (res1.data.code===200) {
                        var str =decodeURIComponent(res1.data.data.data);

                        while(str.indexOf('/images')>=0) {
                            str= str.replace('/images','http://dmt.dgut.edu.cn');
                        }
                        this.parentContent= str;
                    }  else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：documentinfo.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res2=>{
                    this.$message.error(res2.message);
                })
            },




        },

        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/documentinfo") {
                        that.getData();
                    }
                },
                deep: true
            }
        },
    }
</script>

<style scoped>

</style>