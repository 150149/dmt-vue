<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" v-loading="loading">

            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
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
                :accept="acceptFile">
        </el-upload>

    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                editorOption: {
                    modules: {
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                [{ 'indent': '-1' }, { 'indent': '+1' }],
                                [{ 'size': ['small', false, 'large', 'huge'] }],
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'align': [] }],
                                ['clean'],
                                ['link', 'image']
                            ],
                            handlers: {
                                image: function(value) {
                                    if (value) {
                                        // 触发element-ui的文件上传
                                        document.querySelector(".avatar-uploader input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                },
                            }
                        }
                    },
                    placeholder: '请输入',
                },
                id: '',
                loading: true,
                photoUrl :'http://dmt.dgut.edu.cn/api/DocumentUpload' // 上传图片地址
            }
        },
        components: {
            quillEditor
        },
        created(){
            this.getData();
        },
        watch: {
            "$route" : {
                handler(to,from){
                    const that = this;
                    if (to.path==="/editor") {
                        that.getData();
                    }
                },
                deep: true
            }
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            goBack() {
                this.$router.go(-1);// 返回
                //关闭子页面

            },

            onError(err, file, fileList){
                alert("上传错误" + err);
            },

            onChangeQuill(response, file, fileList) {

                        console.log(response.data);

                        let quill = this.$refs.myTextEditor.quill;
                        let length = quill.getSelection().index;
                        // 图片上传到对象存储后的具体地址
                        let imgSrc =  response.data;
                        quill.insertEmbed(length, "image", imgSrc);
                        // 调整光标到最后
                        quill.setSelection(length + 1)

            },

            submit(){
                var str =encodeURIComponent(this.content);
                this.loading=true;
                this.$axios.post("/DocumentEdit",{
                    data: str,
                    id: this.id,
                }).then(res2=>{
                    if (res2.data.code==200) {
                        this.$message.success('修改成功');
                        this.goBack();
                    } else if (res2.data.code===400) {
                        this.$message.error('失败:' + res2.data.message);
                    } else if (res2.data.code===403) {
                        this.$message.error('失败:' + res2.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res2.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：vueEditor.submit 出错详情: " + res2.data.message);
                    }
                    this.loading=false;
                }).catch(res3=>{
                   this.$message.error(res3.message);
                });
            },

            getData(){
                this.id=this.$route.query.id;
                this.loading=true;
                this.$axios.post("/DocumentQuery",{
                    id: this.$route.query.id
                }).then(res1=>{
                    if (res1.data.code===200) {
                        var str =decodeURIComponent(res1.data.data.data);

                        while(str.indexOf('/images')>=0) {
                            str= str.replace('/images','http://dmt.dgut.edu.cn');
                        }
                        this.content=str;
                    } else if (res1.data.code===400) {
                        this.$message.error('查询失败:' + res1.data.message);
                    } else if (res1.data.code===403) {
                        this.$message.error('查询失败:' + res1.data.message);
                        this.loading=false;
                        this.$router.push({path: '/login'});
                    } else if (res1.data.code===500) {
                        alert("请截图以下信息报给维护员: 出错位置：VueEditor.getdata 出错详情: " + res1.data.message);
                    }
                    this.loading=false;
                }).catch(res1=>{
                    this.$message.error(res1.message);
                })
            },
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>