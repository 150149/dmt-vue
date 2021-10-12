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
          <div class="handle-box">
            <el-button  @click="handleDownload" >下载</el-button>
          </div>
            <el-table
                    :data="tableData"
                    class="table"
                    header-cell-class-name="table-header"
                    style="width: 100%"
                    v-loading="loading"
                    id="out-table"
            >
                <el-table-column  width="55" align="center"  type="selection"></el-table-column>
                <el-table-column prop="date" align="center" sortable label="登记时间"></el-table-column>
                <el-table-column prop="room" align="center" sortable label="教室"></el-table-column>
                <el-table-column prop="type" label="故障种类" sortable align="center"></el-table-column>
                <el-table-column prop="name" align="center" sortable label="登记人员"></el-table-column>
                <el-table-column prop="reason" align="center" sortable label="故障现象"></el-table-column>
                <el-table-column prop="deal" align="center" sortable label="最后一条维修过程"></el-table-column>
                <el-table-column prop="remarks" align="center" sortable label="最后一条备注"></el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <el-button
                      type="text"
                      icon="el-icon-edit"
                      @click="handleEdit(scope.row)"
                  >查看</el-button>
                </template>
              </el-table-column>

            </el-table>
        </div>

    </div>
</template>

<script>
import XLSX from "xlsx";
import FileSaver from "file-saver";
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
            },

          handleEdit(row) {
            this.loading = true;
            this.$axios.post('/RepairInfoQuery',{
              id: row.repair
            }).then(res1=>{
              if (res1.data.code===200) {
                this.loading = false;
                this.$router.push({
                  path: '/repairinfo',
                  query: {
                    form : row,
                    table: res1.data.data
                  }
                });
              } else if (res1.data.code===400) {
                this.$message.error('失败:' + res1.data.message);
              } else if (res1.data.code===403) {
                this.$message.error('失败:' + res1.data.message);
                this.loading=false;
                this.$router.push({path: '/login'});
              } else if (res1.data.code===500) {
                alert("请截图以下信息报给维护员: 出错位置：weeklyRepair.handledit 出错详情: " + res1.data.message);
              }
              this.loading=false;
            }).catch(res2=>{
              this.$message.error(res2.message);
            });



            //this.editVisible = true;
          },

          handleDownload(){
            var that = this;

            setTimeout(function () {
              var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
              var wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "array"
              });
              var now = new Date();
              var year = now.getFullYear(); //得到年份
              var month = now.getMonth(); //得到月份
              var date = now.getDate(); //得到日期
              var hour = now.getHours();
              month = month + 1;
              month = month.toString().padStart(2, "0");
              date = date.toString().padStart(2, "0");
              var defaultDate = `${year}-${month}-${date}`;

              try {
                FileSaver.saveAs(
                    //Blob 对象表示一个不可变、原始数据的类文件对象。
                    //Blob 表示的不一定是JavaScript原生格式的数据。
                    //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                    //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                    new Blob([wbout], { type: "application/octet-stream" }),
                    //设置导出文件名称
                    defaultDate + "_周四检修_导出的表格.xlsx"
                );
              } catch (e) {
                if (typeof console !== "undefined") console.log(e, wbout);
              }
              that.query.pagesize=20;

              return wbout;
            },300);


          },
        }
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
  width: 140px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}

@media screen and (max-width: 500px){
  .table {
    width: 500px !important;
    font-size: 7px !important;
  }
  .container {
    width: 500px !important;
  }
  .el-table-column {
    width: 10px !important;
  }
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