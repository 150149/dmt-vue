import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import Vuex from 'vuex'

Vue.use(Vuex);

var axios = require('axios');
axios.defaults.baseURL = 'http://dmt.dgut.edu.cn/api';
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.$axios=axios;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    var user = localStorage.getItem("user");
    var usertype = localStorage.getItem("type");
    document.title = `${to.meta.title} | 多媒体管理系统`;
    if (user==null && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已

        if (to.path==="/chart-salary") {
            if (usertype==="主管" || usertype==="主管老师" || usertype==="组长") {
                next();
            } else {
                next("/403");
            }
        } else {
            if (usertype==="主管" || usertype==="主管老师") {
                next();
            } else if (usertype==="组长" || usertype==="协管员") {
                next('/403');
            } else {
                console.log(usertype);
            }
        }

    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
