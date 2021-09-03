<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '2',
                    title: '日常业务',
                    subs: [
                        {
                          index: 'repair',
                          title: '故障登记',
                        },
                        {
                            index: 'sign',
                            title: '在线签到',
                        },
                        {
                            index: 'broadcast',
                            title: '通知公告',
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '资料查询',
                    subs: [
                        {
                            index: 'table',
                            title: '表格资料',
                        },
                        {
                            index: 'document',
                            title: '文档资料',
                        },
                        {
                            index: 'file',
                            title: '文件资料',
                        },
                        {
                            index: 'classmachine',
                            title: '设备资料',
                        },
                        {
                            index: 'classtable',
                            title: '课表资料',
                        },
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: '4',
                    title: '统计报表',
                    subs: [
                        // {
                        //     index: 'chart-repair',
                        //     title: '故障统计',
                        // },
                        {
                            index: 'chart-work',
                            title: '值班表',
                        },
                        {
                            index: 'chart-free',
                            title: '空闲表',
                        },
                    ]
                },
            ],

            item2: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '2',
                    title: '日常业务',
                    subs: [
                        {
                            index: 'repair',
                            title: '故障登记',
                        },
                        {
                            index: 'sign',
                            title: '在线签到',
                        },
                        {
                            index: 'broadcast',
                            title: '通知公告',
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '资料查询',
                    subs: [
                        {
                            index: 'table',
                            title: '表格资料',
                        },
                        {
                            index: 'document',
                            title: '文档资料',
                        },
                        {
                            index: 'file',
                            title: '文件资料',
                        },
                        {
                            index: 'classmachine',
                            title: '设备资料',
                        },
                        {
                            index: 'classtable',
                            title: '课表资料',
                        },
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: '4',
                    title: '统计报表',
                    subs: [
                        // {
                        //     index: 'chart-repair',
                        //     title: '故障统计',
                        // },
                        {
                            index: 'chart-work',
                            title: '值班表',
                        },
                        {
                            index: 'chart-salary',
                            title: '签到统计',
                        },
                        {
                            index: 'chart-free',
                            title: '空闲表',
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-warn',
                    index: '5',
                    title: '系统管理',
                    subs: [
                        {
                            index: 'usertable',
                            title: '用户管理'
                        },
                        {
                            index: 'worksort',
                            title: '排班管理'
                        },
                        {
                            index: 'salary',
                            title: '工资结算'
                        },
                        {
                            index: 'money',
                            title: '账单管理'
                        },
                        {
                            index: 'systemconfig',
                            title: '系统配置'
                        }
                    ]
                },
            ],

            item3: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '2',
                    title: '日常业务',
                    subs: [
                        {
                            index: 'repair',
                            title: '故障登记',
                        },
                        {
                            index: 'sign',
                            title: '在线签到',
                        },
                        {
                            index: 'broadcast',
                            title: '通知公告',
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '资料查询',
                    subs: [
                        {
                            index: 'table',
                            title: '表格资料',
                        },
                        {
                            index: 'document',
                            title: '文档资料',
                        },
                        {
                            index: 'file',
                            title: '文件资料',
                        },
                        {
                            index: 'classmachine',
                            title: '设备资料',
                        },
                        {
                            index: 'classtable',
                            title: '课表资料',
                        },
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: '4',
                    title: '统计报表',
                    subs: [
                        // {
                        //     index: 'chart-repair',
                        //     title: '故障统计',
                        // },
                        {
                            index: 'chart-work',
                            title: '值班表',
                        },
                        {
                            index: 'chart-salary',
                            title: '签到统计',
                        },
                        {
                            index: 'chart-free',
                            title: '空闲表',
                        },
                    ]
                },
            ],
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
        bus.$on('type', msg => {
            var usertype=localStorage.getItem("type");
            var name=localStorage.getItem("name");
            if (usertype==="主管" || name==="陈华灿") {
                this.items=this.item2;
            }
            if (usertype==="组长") {
                this.items=this.item3;
            }
        });

    },

    watch: {
        "$route" : {
            handler(to,from){
                const that = this;
                if (to.path==="/dashboard") {
                    var usertype=localStorage.getItem("type");
                    var name=localStorage.getItem("name");
                    if (usertype==="主管" || name==="陈华灿") {
                        this.items=this.item2;
                    }
                    if (usertype==="组长") {
                        this.items=this.item3;
                    }
                }
            },
            deep: true
        }
    },

};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
