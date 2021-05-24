<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 课表查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-lx-tag"
                        class="handle-add mr10"
                        v-if="usertype==='主管' || usertype==='主管老师'"
                        @click="open1"
                >上传课表</el-button>
                <el-input v-model="query.class1" placeholder="教室或老师" class="handle-input mr10"></el-input>
                <el-button  type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>


        </div>

        <el-upload
                ref="quillUploader"
                class="avatar-uploader"
                :action="photoUrl"
                :show-file-list="false"
                :auto-upload="true"
                :on-success="onChangeQuill"
                :on-error="onError"
                :limit="20"
                :multiple="true"
                v-if="usertype==='主管' || usertype==='主管老师'"
                v-show="false">
        </el-upload>


    </div>
</template>

<script>
    export default {
        name: "ClassTable"
    }
</script>

<style scoped>

</style>