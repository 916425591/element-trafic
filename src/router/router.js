import Main from '@/common/components/console-layout/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/website/login.vue'], resolve); }
};

export const processRouter = {
    path: '/process',
    name: 'process',
    meta: {
        title: '继续预案'
    },
    component: resolve => { require(['@/console/scd/centerWork/view/incidentProcess.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/console/modules/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@/console/modules/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/console/modules/error-page/500.vue'], resolve); }
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/common/components/console-layout/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home',title: { i18n: 'home' },name: 'home_index',component: resolve => { require(['@/console/home/index.vue'],resolve)} },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/console/modules/own-space/own-space.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/console/modules/message/message.vue'], resolve); } },
        /**预案路由信息 */
        { path: 'planEditHistory', title: '预案修订历史', name: 'planEditHistory_index', component: resolve => { require(['@/console/modules/planEdit/view/planEditHistory.vue'], resolve); } },
        { path: 'incidentProcess', title: '指挥中心指挥调度', name: 'incidentProcess_index', component: resolve => { require(['@/console/scd/centerWork/view/incidentProcess.vue'], resolve); } },
        { path: '/plan/maintain', title: '预案编制', name: 'emergencyPlanning_index', component: resolve => { require(['@/console/modules/emergencyPlanning/index.vue'], resolve); } },
        { path: '/plan/audit', title: '预案审核', name: 'planReview_index', component: resolve => { require(['@/console/modules/planReview/planReview.vue'], resolve); } },
        { path: '/plan/query', title: '预案查询', name: 'planQuery_index', component: resolve => { require(['@/console/modules/planQuery/view/planQuery.vue'], resolve); } },
        /**/{ path: '/basedata/planType', title: '预案类型维护', name: 'planType_index', component: resolve => { require(['@/console/modules/planType/view/planType.vue'], resolve); } },
        { path: '/plan/revise', title: '预案修订', name: 'planEdit_index', component: resolve => { require(['@/console/modules/planEdit/view/planEdit.vue'], resolve); } },
        { path: '/plan/template', title: '预案模板', name: 'planTemplate_index', component: resolve => { require(['@/console/modules/planTemplate/view/planTemplate.vue'], resolve); } },
        { path: '/plan/flows', title: '预案流程库', name: 'planFlow_index', component: resolve => { require(['@/console/modules/planFlow/view/planFlow.vue'], resolve); } },
        { path: '/plan/workitems', title: '工作项库', name: 'workLibrary_index', component: resolve => { require(['@/console/modules/workLibrary/view/workLibrary.vue'], resolve); } },
        { path: '/plan/elements', title: '预案元素库', name: 'planLibrary_index', component: resolve => { require(['@/console/modules/planLibrary/view/planLibrary.vue'], resolve); } },
        /**法律法规 */
        { path: '/knowledge/laws', title: '法律法规库', name: 'laws_index', component: resolve => { require(['@/console/knowledge/laws/views/laws.vue'], resolve); } },
        { path: '/knowledge/classify', title: '分类分级知识库', name: 'classify_index', component: resolve => { require(['@/console/knowledge/classify/views/classify.vue'], resolve); } },
        { path: '/knowledge/knowledge', title: '应急知识库', name: 'emergencyKnowledge_index', component: resolve => { require(['@/console/knowledge/emergencyKnowledge/views/emergencyKnowledge.vue'], resolve); } },
        { path: '/knowledge/chemical', title: '危险化学品库', name: 'chemical_index', component: resolve => { require(['@/console/knowledge/chemical/views/chemical.vue'], resolve); } },
        { path: '/knowledge/case', title: '典型案例', name: 'case_index', component: resolve => { require(['@/console/knowledge/case/views/case.vue'], resolve); } },
        /**风险隐患 */
        { path: '/risk/riskMaintain', title: '风险隐患维护', name: 'riskMaintain_index', component: resolve => { require(['@/console/risk/risks/views/risk.vue'], resolve); } },
        { path: '/risk/protectTarget', title: '防护目标维护', name: 'protect_index', component: resolve => { require(['@/console/risk/protect/views/protect.vue'], resolve); } },
        { path: '/risk/dangersMonitor', title: '隐患监测', name: 'hiddenDanger_index', component: resolve => { require(['@/console/risk/hiddenDanger/views/hiddenDanger.vue'], resolve); } },
        { path: '/risk/possibleDisaster', title: '可能诱发的灾害事故 ', name: 'possibleDisaster_index', component: resolve => { require(['@/console/risk/possibleDisaster/views/possibleDisaster.vue'], resolve); } },
        /**指挥调度 */
        { path: '/scd/centerwork', title: '指挥中心工作台', name: 'centerWork_index', component: resolve => { require(['@/console/scd/centerWork/view/centerWork.vue'], resolve); } },
        { path: '/scd/management', title: '突发事件管理', name: 'management_index', component: resolve => { require(['@/console/scd/incidentManagement/view/incidentManagement.vue'], resolve); } },
        { path: '/scd/dispatchQuery', title: '调度信息查询', name: 'dispatchInfo_index', component: resolve => { require(['@/console/scd/dispatchInfo/view/dispatchInfo.vue'], resolve); } },
        { path: '/scd/feedbackQuery', title: '反馈信息查询', name: 'feedbackInfo_index', component: resolve => { require(['@/console/scd/feedbackInfo/view/feedbackInfo.vue'], resolve); } },
        { path: '/scd/wrongCenterWork', title: '基层工作台', name: 'wrongCenterWork_index', component: resolve => { require(['@/console/scd/wrongCenterWork/view/wrongCenterWork.vue'], resolve); } },
        /**应急值守 */
        { path: '/eduty/duty', title: '值守工作台', name: 'duty_index', component: resolve => { require(['@/console/eduty/dutyWork/view/dutyWork.vue'], resolve); } },
        { path: '/eduty/dutyInfo', title: '值守信息查询', name: 'dutyInfo_index', component: resolve => { require(['@/console/eduty/onDuty/view/onDuty.vue'], resolve); } },
        { path: '/eduty/disposalScheme', title: '处置方案查询', name: 'disposalScheme_index', component: resolve => { require(['@/console/eduty/disposalScheme/view/disposalScheme.vue'], resolve); } },
        { path: '/eduty/instructions', title: '领导批示查询', name: 'instructions_index', component: resolve => { require(['@/console/eduty/leaderInstructions/view/leaderInstructions.vue'], resolve); } },
        { path: '/eduty/startPlanQuery', title: '启动预案记录查询', name: 'startPlan_index', component: resolve => { require(['@/console/eduty/startPlan/view/startPlan.vue'], resolve); } },
        { path: '/eduty/feedbackQuery', title: '回执信息查询', name: 'noticeDetail_index', component: resolve => { require(['@/console/eduty/noticeDetail/view/noticeDetail.vue'], resolve); } },
        { path: '/eduty/recordQuery', title: '值班记录查询', name: 'record_index', component: resolve => { require(['@/console/eduty/record/view/record.vue'], resolve); } },
        { path: '/eduty/transferRecord', title: '交接班记录查询', name: 'transferRecord_index', component: resolve => { require(['@/console/eduty/transferRecord/view/transferRecord.vue'], resolve); } },
        { path: '/eduty/scheduling', title: '值班排班', name: 'scheduling_index', component: resolve => { require(['@/console/eduty/scheduling/view/scheduling.vue'], resolve); } },
        /**资源 */
        { path: '/resource/refuge', title: '避险场所维护', name: 'refuge_index', component: resolve => { require(['@/console/resource/refuge/refuge.vue'], resolve); } },
        { path: '/resource/expert', title: '专家信息维护', name: 'expert_index', component: resolve => { require(['@/console/resource/expert/expert.vue'], resolve); } },
        { path: '/resource/vehicle', title: '专业车辆维护', name: 'vehicle_index', component: resolve => { require(['@/console/resource/vehicle/vehicle.vue'], resolve); } },
        { path: '/resource/material', title: '应急物资维护', name: 'material_index', component: resolve => { require(['@/console/resource/material/material.vue'], resolve); } },
        { path: '/resource/equipment', title: '应急装备维护', name: 'equipment_index', component: resolve => { require(['@/console/resource/equipment/equipment.vue'], resolve); } },
        { path: '/resource/team', title: '处置队伍维护', name: 'team_index', component: resolve => { require(['@/console/resource/team/team.vue'], resolve); } },
        { path: '/basedata/resourceType', title: '资源类型维护', name: 'resources_index', component: resolve => { require(['@/console/resource/resources/resources.vue'], resolve); } },
        { path: '/basedata/fenseType', title: '防护目标类型维护 ', name: 'fenseType_index', component: resolve => { require(['@/console/platform/fenseType/views/fenseType.vue'], resolve); } },
        { path: '/basedata/riskType', title: '风险隐患类型维护 ', name: 'riskType_index', component: resolve => { require(['@/console/platform/riskType/views/riskType.vue'], resolve); } },
        { path: '/basedata/knowledgeType', title: '知识库类型维护', name: 'typeSetting_index', component: resolve => { require(['@/console/platform/knowledgeType/views/knowledgeType.vue'], resolve); } },
        { path: '/basedata/chemicalType', title: '化学品类型维护', name: 'chemicalType_index', component: resolve => { require(['@/console/platform/chemicalType/views/chemicalType.vue'], resolve); } },
        { path: '/basedata/incidentType', title: '事件类型维护', name: 'incidentType_index', component: resolve => { require(['@/console/platform/incidentType/views/incidentType.vue'], resolve); } },
        { path: '/basedata/region', title: '区域维护', name: 'region_index', component: resolve => { require(['@/console/platform/region/views/region.vue'], resolve); } },
        { path: '/basedata/incidentLevel', title: '事件类型维护', name: 'incidentLevel_index', component: resolve => { require(['@/console/platform/incidentLevel/views/incidentLevel.vue'], resolve); } },



        /**警员功能权限维护*/
        { path: '/trafic/police/permissions', title: '权限维护', name: 'permissions', component: resolve => { require(['@/console/trafic/police/permissions/permissions.vue'], resolve); } },
        { path: '/trafic/police/department', title: '部门维护', name: 'department', component: resolve => { require(['@/console/trafic/police/permissions/department.vue'], resolve); } },
        { path: '/trafic/police/permissions/the-officer', title: '警员信息维护', name: 'the-officer', component: resolve => { require(['@/console/trafic/police/permissions/the-officer/the-officer.vue'], resolve); } },
        /**交管应急值守*/
        { path: '/trafic/onduty/scheduling',  title: '值班/排班',     name: 'scheduling', component: resolve => { require(['@/console/trafic/onduty/scheduling/scheduling.vue'], resolve); } },
        { path: '/trafic/onduty/scheduTable', title: '值班/排班表格', name: 'scheduTable', component: resolve => { require(['@/console/trafic/onduty/scheduling/scheduTable.vue'], resolve); } },
        /**交管Gis*/
        { path: '/trafic/gis', title: '值班/排班', name: 'gis', component: resolve => { require(['@/console/trafic/gis/gis.vue'], resolve); } },
        { path: '/trafic/gis/html5', title: 'html5', name: 'html5', component: resolve => { require(['@/console/trafic/gis/html5.vue'], resolve); } },
        /**设备信息结构设计*/
        { path: '/trafic/equipment/equipment', title: '设备信息结构设计', name: 'equipment', component: resolve => { require(['@/console/trafic/equipment/equipment.vue'], resolve); } },
        { path: '/trafic/equipment/gisResources', title: '设备资源查询', name: 'gitresources', component: resolve => { require(['@/console/trafic/equipment/gisResources.vue'], resolve); } },
        { path: '/trafic/equipment/device', title: '设备属性', name: 'device', component: resolve => { require(['@/console/trafic/equipment/device.vue'], resolve); } },
        { path: '/trafic/equipment/echartsEpt', title: '设备三种展现形式', name: 'device', component: resolve => { require(['@/console/trafic/equipment/echartsEpt.vue'], resolve); } },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/test',
    //     icon: 'android-sad',
    //     title: '测试',
    //     name: 'test',
    //     component: Main,
    //     children: [
    //         { path: 'node', title: '节点测试', name: 'node_index', component: resolve => { require(['@/console/modules/node/node.vue'], resolve); } },
    //         { path: 'menu', title: '菜单测试', name: 'menu_index', component: resolve => { require(['@/console/modules/node/menu.vue'], resolve); } },
    //         { path: 'websocket', title: 'websocket', name: 'websocket_index', component: resolve => { require(['@/console/modules/node/websocket.vue'], resolve); } }
    //     ]
    // }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    processRouter,
    otherRouter,
    // preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
