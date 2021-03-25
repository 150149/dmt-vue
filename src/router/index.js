import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/repair',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Repair.vue'),
                    meta: { title: '故障登记' }
                },
                {
                    path: '/repairinfo',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/RepairInfo.vue'),
                    meta: { title: '故障详情' }
                },
                {
                    path: '/repairdetail',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/RepairDetail.vue'),
                    meta: { title: '详细登记' }
                },
                {
                    path: '/broadcast',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Broadcast.vue'),
                    meta: { title: '通知公告' }
                },
                {
                    path: '/sign',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Sign.vue'),
                    meta: { title: '在线签到' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Table.vue'),
                    meta: { title: '表格资料' }
                },
                {
                    path: '/tableinfo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/TableInfo.vue'),
                    meta: { title: '表格详情' }
                },
                {
                    path: '/document',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Document.vue'),
                    meta: { title: '文档资料' }
                },
                {
                    path: '/file',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/File.vue'),
                    meta: { title: '文件资料' }
                },
                {
                    path: '/documentinfo',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/DocumentInfo.vue'),
                    meta: { title: '文档详情' }
                },
                // {
                //     path: '/chart-repair',
                //     component: () => import(/* webpackChunkName: "form" */ '../components/page/Chart-Repair.vue'),
                //     meta: { title: '故障统计' }
                // },
                {
                    path: '/chart-salary',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Chart-Salary.vue'),
                    meta: { title: '签到统计' ,permission: true}
                },
                {
                    path: '/salary',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Salary.vue'),
                    meta: { title: '工资结算' ,permission: true}
                },
                {
                    path: '/chart-work',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Chart-Work.vue'),
                    meta: { title: '值班表' }
                },
                {
                    path: '/chart-free',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Chart-Free.vue'),
                    meta: { title: '空闲表' }
                },
                {
                    path: '/personinfo',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/PersonInfo.vue'),
                    meta: { title: '个人信息' }
                },
                {
                    path: '/personfree',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/PersonFree.vue'),
                    meta: { title: '空闲时间' }
                },
                {
                    path: '/usertable',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/UserTable.vue'),
                    meta: { title: '用户管理' ,permission: true}
                },
                {
                    path: '/weeklyrepair',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/WeeklyRepair.vue'),
                    meta: { title: '周四检修' }
                },
                {
                    path: '/worksort',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/WorkSort.vue'),
                    meta: { title: '排班管理' ,permission: true}
                },
                {
                    path: '/money',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Money.vue'),
                    meta: { title: '账单管理' ,permission: true}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' ,permission: true}
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
