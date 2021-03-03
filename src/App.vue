<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/


    @media screen and (max-width: 500px) {
        .el-message {
            min-width: 300px !important;
        }
        .el-message-box{
            width: 300px !important;
        }
        .el-dialog__wrapper .el-dialog {
            width: 300px !important;
        }
        .el-dialog__body {
            padding: 10px 20px !important;
        }
        .el-form-item__label{
            width: 68px!important;
        }
        .el-select,.el-input{
            width: 180px!important;
        }
        .el-dialog__wrapper .el-dialog {
            width: 300px !important;
        }
        .el-dialog__body {
            padding: 10px 20px !important;
        }
        .el-form-item__label{
            width: 68px!important;
        }
        .el-select,.el-input{
            width: 180px!important;
        }
        .el-dialog__footer{
            padding-bottom: 15px;
            padding-top: 5px;
        }

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

</style>