<template>
    <!-- 值守工作台 -->
    <div>
        <Row>
            <i-col span="17">
                <div class="ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>值守信息列表</h2>
                        <div class="ds-fload-right">
                            <Button type="success"  @click="openAddModal">新增</Button>
                            <Button type="info"  @click="openManagementPlanModal">处置方案</Button>
                            <Button type="primary" @click="openReportModal">请示汇报</Button>
                            <Button type="warning" @click="openStartPlanModal">启动预案</Button>
                            <Button type="error" @click="openNoticeModal">通知</Button>
                            <Button class="ds-white" @click="openSubmitModal">上报</Button>
                        </div>
                    </div>
                    <div class="ds-table-box" :style='height' :data-json="tableHeight">
                        <Table border highlight-row :columns="dutyListHead" :data="dutyListData" @on-row-click="selectDisposal"></Table>
                        <div class="ds-page-body" v-if="pageTotal > pageSize">
                            <Page :total="pageTotal" :page-size="pageSize" :current="pageNum" @on-change="slectPage" show-total class="ds-page-right"></Page>
                        </div>
                    </div>
                </div>
                <div class="ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>处理记录</h2>
                    </div>
                    <div class="ds-table-box" :style='height'>
                        <Table border highlight-row :columns="recordHead" :data="recordData"></Table>
                    </div>
                </div>
            </i-col>
            <i-col span="7">
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2 @click="openConfirmationModal">待办事项</h2>
                        <div class="ds-fload-right">
                            <Button type="info" @click="openRegisterModal">登记</Button>
                            <Button type="warning" @click="openHandleModal">处理</Button>
                            <Button type="primary" @click="openTransferModal">交班</Button>
                        </div>
                    </div>
                    <div class="ds-table-box"  :style='height'>
                        <Scroll :distance-to-edge="10" :height="scollHeight" :on-reach-bottom="searchMoreBackLog">
                            <Table border highlight-row :columns="backlogHead" :data="backlogData" @on-row-click="selectBackLog"></Table>
                        </Scroll>
                    </div>
                </div>
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>最新通知</h2>
                    </div>
                    <div class="ds-table-box"  :style='height'>
                        <Scroll :distance-to-edge="10" :height="scollHeight" :on-reach-bottom="searchMoreNotice">
                            <Table border highlight-row :columns="noticeHead" :data="noticeData" @on-row-click="selectNotice"></Table>
                        </Scroll>
                    </div>
                </div>
                <!-- <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>值班通讯录</h2>
                    </div>
                    <div class="ds-mial-box" style="height: 203px">
                        <Input icon="ios-search-strong"></Input>
                        <ul class="ds-mial-org">
                            <li v-for="(item, index) in mailList">
                                <span>{{ item.orgName }}</span>
                                <span>{{ item.orgMobile }}</span>
                                <ul class="ds-mial-person">
                                    <li v-for="(key, index) in item.members">
                                        <span>{{ key.name }}</span>
                                        <span>{{ key.mobile }}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div> -->
            </i-col>
        </Row>
        <!-- 确认是否筛选预案 -->
        <confirm v-if="confirmModal" @close-modal="closeConfirmModal" @open-modal="openSelectModal"></confirm>
        <!-- 处置方案 -->
        <management-plan v-if="managementPlanModal" @close-modal="closePlanModal" @save-modal="savePlanModal" @open-modal="managementPlanLeader" ref="managementPlan"></management-plan>
        <!-- 新增值班信息 -->
        <add-duty v-if="addModal" ref="addDuty" @close-modal="closeAddDutyModal" @save-modal="addDutySuccess" @open-modal="openDutyType"></add-duty>
        <!-- 请示汇报 -->
        <report v-if="reportModal" @close-modal="closeReportModal" @save-modal="saveReportModal" @open-modal="selectLeader" ref="report"></report>
        <!-- 通知 -->
        <notice v-if="noticeModal" @close-modal="closeNoticeModal" @save-modal="saveNoticeModal" @open-modal="openNoticeOrg" ref="notice"></notice>
        <!-- 登记 -->
        <register v-if="registerModal" @close-modal="closeRegisterModal" @save-modal="saveRegisterModal"></register>
        <!-- 待办事项处理 -->
        <handle v-if="handleModal" @close-modal="closeHandleModal" @save-modal="saveHandleModal"></handle>
        <!-- 值班交接 -->
        <transfer v-if="transferModal" @close-modal="closeTransferModal" @open-modal="openTransferPerson" ref="transfer"></transfer>
        <!-- 确认交接 -->
        <confirmation-transfer v-if="confirmationModal" @close-modal="closeConfirmationModal"></confirmation-transfer>
        <!-- 确认上报 -->
        <submit-report v-if="submitReportModal" @close-modal="closeSubmitReport" @save-modal="saveSubmitReport" @open-modal="openOrg" ref="submitReport"></submit-report>
        <!-- tree组件 -->
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
        <!-- 带查询功能list -->
        <table-list v-if="tableListModal" @table-search-close="closeSearchModal" @table-search-save="saveSearchModal"></table-list>
        <!-- 启动预案 -->
        <start-plan v-if="startPlanModal" @start-plan-save="startPlan" @start-plan-close="startPlanClose" @open-member="settingOrg" ref="startPlan"></start-plan>
        <!-- 预案启动成功 -->
        <start-success v-if="startSuccessModal" @close-modal="closeStartSuccessModal"></start-success>
        <!-- 结束预案 -->
        <end-plan v-if="endPlanModal" @close-modal="closeEndPlanModal"></end-plan>
        <!-- 确认选择预案 -->
        <confirm-select-plan v-if="confirmSelectPlanModal" @close-modal="closeConfirmSelectPlanModal" @save-modal="saveConfirmSelectPlanModal"></confirm-select-plan>
        <!-- 通知详情查看 -->
        <see-notice v-if="seeNoticeModal" @close-modal="closeSeeNoticeModal" @change-status="seeNoticeStatus"></see-notice>
        <!-- 回执处理 -->
        <handle-notice v-if="handleNoticeModal" @close-modal="closeHandleNotice" @change-status="handleNoticeStatus"></handle-notice>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import confirm from './modal/confirm'
    import managementPlan from './modal/managementPlan'
    import addDuty from './modal/addDuty'
    import report from './modal/report'
    import notice from './modal/notice'
    import register from './modal/register'
    import handle from './modal/handle'
    import transfer from './modal/transfer'
    import confirmationTransfer from './modal/confirmationTransfer'
    import submitReport from './modal/submitReport'
    import tree from '@/common/components/treeModal/tree'
    import tableList from '@/common/components/tableSearchModal/tableSearchModal'
    import startPlan from '@/common/components/startPlan/startPlan'
    import startSuccess from './modal/startSuccess'
    import endPlan from './modal/endPlan'
    import confirmSelectPlan from './modal/confirmSelectPlan'
    import seeNotice from './modal/seeNotice'
    import handleNotice from './modal/handleNotice'
    import Cookies from 'js-cookie';

    export default {
        components: {
            confirm,
            managementPlan,
            addDuty,
            report,
            notice,
            register,
            handle,
            transfer,
            confirmationTransfer,
            submitReport,
            tree,
            tableList,
            startPlan,
            startSuccess,
            endPlan,
            confirmSelectPlan,
            seeNotice,
            handleNotice
        },
        data () {
            return {
                height: {
                    // margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                },
                scollHeight: '',
                handleNoticeModal: false,
                seeNoticeModal: false,
                confirmSelectPlanModal: false,
                confirmModal: false,
                startPlanModal: false,
                startSuccessModal: false,
                endPlanModal: false,
                treeMode: false,
                tableListModal: false,
                addModal: false,
                managementPlanModal: false,
                addDutyModal: false,
                reportModal: false,
                noticeModal: false,
                registerModal: false,
                handleModal: false,
                transferModal: false,
                confirmationModal: false,
                submitReportModal: false,
                pageTotal: 1,
                pageNum: 1,
                selectDutyNode: {},
                dutyListHead: [
                    {
                        title: '-',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'statusTitle',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '登记/上报时间',
                        key: 'reportTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '信息描述',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '事发地址',
                        key: 'address',
                        width:150,
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'typeName',
                        width: 110,
                        align: 'center'
                    },
                    {
                        title: '等级',
                        key: 'levelName',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '来源',
                        key: 'sourceTitle',
                        width: 90,
                        align: 'center'
                    }
                ],
                dutyListData: [],
                recordHead: [
                    {
                        title: '-',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'typeTitle',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '处理时间',
                        key: 'disposalTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '经办人',
                        key: 'disposaler',
                        width: 120,
                        align: 'center'
                    }
                ],
                recordData: [],
                logPageNum: 1,
                logPageSize: 0,
                backlogHead: [
                    {
                        title: '登记',
                        key: 'simpleTime',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '紧急',
                        key: 'urgentTitle',
                        width: 80,
                        align: 'center'
                    }
                ],
                backlogData: [],
                noticePageNum: 1,
                noticePageSize: 0,
                selectBackLogNode: {},
                noticeHead: [
                    {
                        title: '通知时间',
                        key: 'noticeTime',
                        width: 110,
                        align: 'center'
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'statusName',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    cursor: 'pointer',
                                    padding: '5px'
                                },
                                on: {
                                        click: () => {
                                            this.showState(params)
                                        }
                                    }
                            }, params.row.statusTitle);
                        }
                    }
                ],
                noticeData: [],
                mailList: [
                    {
                        orgName: '金海市公安局',
                        orgMobile: '60231458',
                        members: [
                            {
                                name: '张三丰',
                                mobile: '15618533321'
                            },
                            {
                                name: '张四丰',
                                mobile: '13915487562'
                            }
                        ]
                    },
                    {
                        orgName: '金海市民政局',
                        orgMobile: '60231458',
                        members: [
                            {
                                name: '张三丰',
                                mobile: '15618533321'
                            },
                            {
                                name: '张四丰',
                                mobile: '13915487562'
                            }
                        ]
                    }
                ],
                selectNoticeNode: {}
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            },
            pageSize() {
                const res = this.$store.state.heightTable.tableInfo.numberBranches
                const numberBranches = parseInt(res / 2 - 1)
                this.logPageSize = parseInt(res / 2 + 1)
                this.noticePageSize = parseInt(res / 2 + 1)
                return numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                const res = this.$store.state.heightTable.tableInfo.tableHeight
                this.scollHeight = parseInt(res) / 2 -20
                this.height.height = parseInt(res) / 2 + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created(){
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(95)
            //查询值班信息列表 
            this.queryDutyInfo();
            //查询待办事项
            this.queryBacklogs();
            //查询最新通知
            this.queryNewNotices();
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'saveEdutyTableData',
                'saveTableData',
                'saveEdutyWorkItem',
                'saveStartPlanDetail',
                'saveEdutyPlan',
                'saveEdutyNoctice',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            //查询未反馈的通知
            queryNewNotices(type){
                const queryO  = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.noticePageNum,
                    pageSize: this.noticePageSize
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/eduty/notice/queryTargetNotice',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const dataList = response.data.data.list;                            
                            if ( type === 'scroll') {
                                if (dataList.length < 1 ) {
                                    this.$Message.warning('没有更多了')
                                    return;
                                }
                                for ( let i=0;i<dataList.length;i++ ) {
                                    this.noticeData.push(dataList[i]);
                                }
                            } else {
                                this.noticeData = dataList;
                            }
                        }
                    }
                ).catch(
                    
                );
            },
            searchMoreNotice () {
                //查询更多通知
                this.noticePageNum = this.noticePageNum+1;
                this.queryNewNotices('scroll');
            },
            slectPage (index) {
                this.pageNum = index;
                this.queryDutyInfo();
            },
            //查询待办事项
            queryBacklogs(type){
                const queryO  = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.logPageNum,
                    pageSize: this.logPageSize
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/eduty/backlog/queryBacklogList',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const dataList = response.data.data.list;                            
                            if ( type === 'scroll') {
                                if (dataList.length < 1 ) {
                                    this.$Message.warning('没有更多了')
                                    return;
                                }
                                for ( let i=0;i<dataList.length;i++ ) {
                                    this.backlogData.push(dataList[i]);
                                }
                            } else {
                                this.backlogData = dataList;
                            }
                        }
                    }
                ).catch(
                    
                );
            },
            searchMoreBackLog () {
                //滚动加载
                this.logPageNum = this.logPageNum+1;
                this.queryBacklogs('scroll');
            },
            //查询值守信息
            queryDutyInfo(){
                const queryO  = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/eduty/eIncident/queryIncident',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.pageTotal = response.data.data.total;
                            this.dutyListData = response.data.data.list;
                        }
                    }
                ).catch(
                    
                );
            },
            selectDisposal (data) {
                console.log(data)
                this.selectDutyNode = data;
                this.saveEdutyTableData(this.selectDutyNode);
                this.saveStartPlanDetail(this.selectDutyNode);
                this.queryDisposalRecord();
            },
            queryDisposalRecord(){
                const queryO  = {
                    userCode: Cookies.get('userCode'),
                    incidentId: this.selectDutyNode.id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/disposalRecord/queryDisposalRecord4Incident',
                    params:queryO 
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const dataList = response.data.data;                            
                            this.recordData = dataList;
                        }
                    }
                ).catch(
                    
                );
            },
            openManagementPlanModal () {
                //打开处置方案弹窗
                const id = this.selectDutyNode.id;
                const disposalId = this.selectDutyNode.disposalId;
                if ( !id ) {
                    this.$Message.warning('请先选择值班信息');
                } else {
                    if ( disposalId ) {
                        //有disposalId查询
                        const queryO = {
                            userCode: Cookies.get('userCode'),
                            id: disposalId
                        }
                        axios({
                            method: 'get',
                            url: this.getUrl+'/eduty/disposalPlan/getDisposalPlan',
                            params:queryO 
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.saveEdutyPlan(response.data.data);
                                    this.managementPlanModal = true;
                                }
                            }
                        ).catch(
                            
                        );
                    } else {
                        const data = {
                            userCode: Cookies.get('userCode'),
                            incidentTypeId: this.selectDutyNode.typeId,
                            level: this.selectDutyNode.levelId
                        }
                        axios({
                            method: 'get',
                            url: this.getUrl+'/plan/publishPlan/createPlanDisposalPlanByIncidentTypeId',
                            params:data 
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    if ( response.data.data.planId ) {
                                        this.saveEdutyPlan(response.data.data);
                                        this.managementPlanModal = true;
                                    } else {
                                        this.confirmModal = true;
                                    }
                                    
                                }
                            }
                        ).catch(
                            
                        );
                    }
                }
                
            },
            managementPlanLeader () {
                //处置方案领导
                const tableInfo = {
                    title: '选择领导',
                    multiple: false,
                    url: this.getUrl+'/platform/public/queryPersonBase4Page',
                    name: '名称',
                    type: 'managementLeader',
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: Cookies.get('userCode'),
                        name: ''
                    }
                }
                this.saveTableData(tableInfo);
                this.tableListModal = true;
            },
            savePlanModal () {
                this.selectDutyNode = {};
                this.queryDutyInfo();
                this.closePlanModal();
            },
            closePlanModal () {
                //关闭处置方案弹窗
                this.managementPlanModal = false;
            },
            openAddModal () {
                //打开新增弹窗
                this.addModal = true;
            },
            openDutyType (type) {
                if ( type === 'incidentType' ) {
                    //设置事件类型
                    let TreeInfo = {
                        title: '事件类型',
                        treeMultiple: false,
                        additional: 'incidentType',
                        request: 'post',
                        queryInfo: {
                            userCode: Cookies.get('userCode')
                        },
                        url: this.getUrl+'/platform/public/queryIncidentTypeTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeMode = true;
                }
                if ( type === 'region' ) {
                    //打开事发区域弹窗
                    let TreeInfo = {
                        title: '事发区域',
                        treeMultiple: false,
                        additional: 'region',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode')
                        },
                        url: this.getUrl+'/platform/public/queryRegionTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeMode = true;
                }
            }, 
            addDutySuccess () {
                //新增值班信息成功
                this.pageNum = 1;
                this.queryDutyInfo();
                this.closeAddDutyModal();
            },
            closeAddDutyModal () {
                //关闭新增弹窗
                this.addModal = false;
            },
            openReportModal () {
                //打开请示汇报弹窗
                const id = this.selectDutyNode.id;
                if ( !id ) {
                    this.$Message.warning('请先选择值班信息');
                } else {
                    this.reportModal = true;
                }
            },
            saveReportModal() {
                //请示汇报成功
                this.selectDutyNode = {};
                this.queryDutyInfo();
                this.closeReportModal();
                this.queryNewNotices();
            },
            closeReportModal () {
                this.reportModal = false;
            },
            openNoticeModal () {
                //打开通知弹窗
                this.noticeModal = true;
            },
            saveNoticeModal () {
                //通知成功
                this.selectDutyNode = {};
                this.queryDutyInfo();
                this.queryNewNotices();
                this.closeNoticeModal();
            },
            closeNoticeModal () {
                this.noticeModal = false;
            },
            openRegisterModal () {
                //打开待办事项录入弹窗
                this.registerModal = true;
            },
            saveRegisterModal () {
                this.logPageNum = 1;
                this.queryBacklogs();
                this.closeRegisterModal();
            },
            closeRegisterModal () {
                this.registerModal = false;
            },
            openHandleModal () {
                //打开代办事项处理
                const id = this.selectBackLogNode.id;
                if ( !id ) {
                    this.$Message.warning('请先选择待办事项');
                } else {
                    this.handleModal = true;
                }
            },
            saveHandleModal () {
                //保存处置
                this.selectBackLogNode = {};
                this.queryBacklogs();
                this.closeHandleModal();
            },
            closeHandleModal () {
                this.handleModal = false;
            },
            openTransferModal () {
                //打开值班交接
                this.transferModal = true;
            },
            openTransferPerson () {
                //打开交接班人员
                const tableInfo = {
                    title: '选择领导',
                    multiple: false,
                    url: this.getUrl+'/platform/public/queryPersonBase4Page',
                    name: '名称',
                    type: 'transferPerson',
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: Cookies.get('userCode'),
                        name: ''
                    }
                }
                this.saveTableData(tableInfo);
                this.tableListModal = true;
            },
            closeTransferModal () {
                //关闭值班交接
                this.transferModal = false;
            },
            openSubmitModal () {
                //打开上班弹窗
                const id = this.selectDutyNode.id;
                if ( !id ) {
                    this.$Message.warning('请先选择值班信息');
                } else {
                    this.submitReportModal = true;
                }
            },
            saveSubmitReport () {
                //确认上报
                this.selectDutyNode = {};
                this.queryDutyInfo();
                this.closeSubmitReport();
            },
            closeSubmitReport () {
                this.submitReportModal = false;
            },
            openConfirmationModal () {
                //打开交接班信息确认弹窗
                this.confirmationModal = true;
            },
            treeModalSave (data, type) {
                //tree
                if ( type === 'incidentType') {
                    this.$refs.addDuty.settingModal(data, type);
                }
                if ( type === 'region' ) {
                    this.$refs.addDuty.settingModal(data, type);
                }
                if ( type === 'settingMember' ) {
                    this.$refs.startPlan.settingMember(data)
                }
                if ( type === 'reportOrg') {
                    this.$refs.submitReport.settingOrg(data)
                }
                this.treeModalClose();
            },
            treeModalClose () {
                //tree
                this.treeMode = false;
            },
            selectLeader () {
                const tableInfo = {
                    title: '选择领导',
                    multiple: false,
                    url: this.getUrl+'/platform/public/queryPersonBase4Page',
                    name: '名称',
                    type: 'leader',
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: Cookies.get('userCode'),
                        name: ''
                    }
                }
                this.saveTableData(tableInfo);
                this.tableListModal = true;
            },
            saveSearchModal (data, type) {
                //保存selectTable组件
                if ( type === 'leader' ) {
                    this.$refs.report.settingLeader(data);
                }
                if ( type === 'transferPerson' ) {
                    this.$refs.transfer.settingPerson(data);
                }
                if ( type === 'managementLeader' ) {
                    this.$refs.managementPlan.settingLeader(data);
                }
                if ( type === 'noticeOrg' ) {
                    this.$refs.notice.addOrg(data);
                }
                if ( type === 'searchPlan' ) {
                    //保存选择的预案
                    const queryO = {
                        userCode: Cookies.get('userCode'),
                        publishPlanId: data.id,
                        level: this.selectDutyNode.levelId
                    }
                    axios({
                        method: 'get',
                        url: this.getUrl+'/plan/publishPlan/createDisposalPlanByPublishPlanId',
                        params: queryO
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.saveStartPlanDetail(response.data.data);
                                this.startPlanModal = true;
                            }
                        }
                    ).catch(
                        
                    );
                }
                this.closeSearchModal();
            },
            closeSearchModal () {
                this.tableListModal = false;
            },
            selectBackLog (data) {
                this.selectBackLogNode = data;
                this.saveEdutyWorkItem(data);
            },
            closeConfirmationModal () {
                //关闭确认交班弹窗
                this.confirmationModal = false;
            },
            openStartPlanModal () {
                //启动预案
                const id = this.selectDutyNode.id;
                const status = this.selectDutyNode.status;
                if ( !id ) {
                    this.$Message.warning('请先选择值班信息');
                } else if ( status === 60 ) {
                    this.startSuccessModal = true;
                } else if ( status === 70 ) {
                    this.endPlanModal = true;
                } else {
                    const data = this.selectDutyNode;
                    if ( !data.disposalId ) {
                        this.$Message.warning('尚未生成方案，不能启动预案');
                    } else if ( data.disposalId && !data.publishPlanId ) {
                        this.confirmSelectPlanModal = true;
                    } else if ( data.publishPlanId && data.instructionStatus === 2 ) {
                        this.$Message.warning('领导批示不同意，不能启动预案');
                    } else if ( data.publishPlanId && data.instructionStatus === 1) {
                        this.startPlanModal = true;
                    } else {
                        this.$Message.warning('请先请示领导批示');
                    }
                }
            },
            startPlan (data) {
                const queryO = data;
                queryO.incidentId = this.selectDutyNode.id;
                axios({
                    method: 'post',
                    url: this.getUrl+'/eduty/disposalPlan/startPlan',
                    data: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('预案启动成功');
                            this.queryDutyInfo();
                            this.startPlanClose();
                        }
                    }
                ).catch(
                    
                );
            },
            startPlanClose () {
                this.startPlanModal = false;
            },
            settingOrg () {
                //设置成员单位
                let TreeInfo = {
                    title: '设置成员单位',
                    treeMultiple: false,
                    additional: 'settingMember',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    searchShow: true,
                    url: this.getUrl+'/platform/public/queryOrgTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            closeConfirmModal () {
                this.confirmModal = false;
            },
            openSelectModal (type) {
                if ( type === 'selectPlan' ) {
                    //筛选预案
                    const tableInfo = {
                        title: '筛选预案',
                        multiple: false,
                        url: this.getUrl+'/plan/publishPlan/screeningPlan',
                        name: '预案名称',
                        type: 'searchPlan',
                        request: 'post',
                        queryInfo: {
                            userCode: Cookies.get('userCode'),
                            name: '',
                            incidentTypeId: this.selectDutyNode.typeId
                        }
                    }
                    this.saveTableData(tableInfo);
                    this.tableListModal = true;
                    this.confirmModal = false;
                }
                if ( type === 'editPlan' ) {
                    this.saveEdutyPlan({});
                    this.managementPlanModal = true;
                    this.confirmModal = false;
                }
            },
            closeStartSuccessModal () {
                //关闭确认启动成功提示
                this.startSuccessModal = false;
            },
            closeEndPlanModal () {
                //关闭确认预案完成提示
                this.endPlanModal = false;
            },
            openNoticeOrg () {
                //筛选预案
                const tableInfo = {
                    title: '选择单位',
                    multiple: true,
                    url: this.getUrl+'/platform/public/queryOrgBasePaging',
                    name: '单位名称',
                    type: 'noticeOrg',
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: Cookies.get('userCode'),
                    }
                }
                this.saveTableData(tableInfo);
                this.tableListModal = true;
            },
            closeConfirmSelectPlanModal () {
                this.confirmSelectPlanModal = false;
            },
            saveConfirmSelectPlanModal () {
                this.closeConfirmSelectPlanModal();
                this.openSelectModal('selectPlan');
                // this.startPlanModal = true;
            },
            selectNotice (data, index) {
                this.selectNoticeNode = data;
                this.selectNoticeNode.index = index;
            },
            showState (data) {
                const status = data.row.status;
                
                if (status === 10) {
                    this.seeNoticeModal = true;
                    this.saveEdutyNoctice(data.row);
                }
                if (status === 20) {
                    this.handleNoticeModal = true;
                    data.row.seeShow = true;
                    this.saveEdutyNoctice(data.row);
                }
                if (status === 30) {
                    this.handleNoticeModal = true;
                    data.row.seeShow = false;
                    this.saveEdutyNoctice(data.row);
                }
            },
            seeNoticeStatus (data) {
                const newNotice = this.selectNoticeNode;
                newNotice.status = data.status;
                newNotice.statusTitle = data.statusTitle;
                const index = this.selectNoticeNode.index;
                this.$set(this.noticeData, index, newNotice);
            },
            closeSeeNoticeModal () {
                //关闭查看通知弹窗
                this.seeNoticeModal = false;
            },
            handleNoticeStatus (data) {
                const newNotice = this.selectNoticeNode;
                newNotice.status = data.status;
                newNotice.statusTitle = data.statusTitle;
                const index = this.selectNoticeNode.index;
                this.$set(this.noticeData, index, newNotice);
            },
            closeHandleNotice () {
                this.handleNoticeModal = false;
            },
            openOrg () {
                //设置成员单位
                let TreeInfo = {
                    title: '设置成员单位',
                    treeMultiple: false,
                    additional: 'reportOrg',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    searchShow: true,
                    url: this.getUrl+'/platform/public/queryOrgTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            }
        }
    }
</script>

<style scoped>
    .ds-mial-box {
        padding: 10px;
    }
    .ds-mial-box li {
        line-height: 22px;
    }
    .ds-mial-org {
        padding-left: 10px;
    }
    .ds-mial-person {
        padding-left: 30px;
    }
    .ds-white {
        background: #ffffff;
    }
</style>

