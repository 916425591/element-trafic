<template>
    <div>
        <div class="ds-widget-box ds-box" :data-height="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>新调度指令</h2>
            </div>
            <div class="ds-detail-box">
                <i-form :model="incidentDetail" :label-width="100">
                    <Row>
                        <i-col span="8">
                            <form-item label="事发时间： ">
                                <span>{{ incidentDetail.occurTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事发区域： ">
                                <span>{{ incidentDetail.regionName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事件类型： ">
                                <span>{{ incidentDetail.incidentTypeName }}</span>
                            </form-item>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="8">
                            <form-item label="事件等级： ">
                                <span>{{ incidentDetail.incidentLevelName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事发地址： ">
                                <span>{{ incidentDetail.address }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="24">
                            <form-item label="事件描述： ">
                                <span>{{ incidentDetail.description }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="已采措施： ">
                                <span>{{ incidentDetail.measures }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="调度时间： ">
                                <span>{{ dispatchDetail.dispatchTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="任务内容： ">
                                <span>{{ dispatchDetail.dispatchTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="注意事项： ">
                                <span>{{ dispatchDetail.attention }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="所需资源： ">
                                <Table :height="height" border highlight-row :columns="resourceHead" :data="resourceData"></Table>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
                <div class="ds-btn-box">
                    <div v-if="btnShow">
                        <Button v-if="outBtnShow" type="primary" @click="seeOutInfo">查看出动</Button>
                        <Button v-if="feedbackBtnShow" type="primary" @click="seeFeedbackInfo">查看反馈</Button>
                        <Button type="primary" @click="seeDetail">{{ btnState.name }}</Button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 反馈信息 -->
        <feedback-info v-if="feedbackModal" @close-modal="closefeedbackModal" @save-modal="savefeedbackModal" @open-modal="settingFeedbackModal" ref="feedbackInfo"></feedback-info>
        <!-- 出动信息操作弹窗 -->
        <out-info-modal v-if="outOperateModal" @close-out-modal="closeOutOperate" @save-out-info="submitOutInfo" @open-modal="OutSettingModal" ref="outInfoModal"></out-info-modal>
        <!-- 所需资源弹窗 -->
        <out-register-resource v-if="outRegisterResourceModal" @close-modal="outResourceClose" @save-resource="outSaveResource"></out-register-resource>
        <!-- 出动信息 -->
        <see-out-info v-if="seeOutInfoModal" @close-modal="closeOutInfoModal" ref="seeOutInfo"></see-out-info>
        <!-- 反馈信息 -->
        <see-feedback v-if="seeFeedbackModal" @close-modal="closefeedbackInfoModal" ref="seeFeedback"></see-feedback>
        <!-- list查询组件 -->
        <table-list v-if="tableListModal" @table-search-close="closeSearchModal" @table-search-save="saveSearchModal"></table-list>
        <!-- 树结构弹窗 -->
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    import tableList from '@/common/components/tableSearchModal/tableSearchModal'
    import outInfoModal from '@/console/scd/modal/outInfoModal'
    import feedbackInfo from '@/console/scd/modal/feedbackInfoModal'
    import seeOutInfo from '@/console/scd/modal/seeOutInfoModal'
    import seeFeedback from '@/console/scd/modal/seeFeedbackInfoListModal'
    import outRegisterResource from '@/console/scd/modal/registerResourceModal'
    import tree from '@/common/components/treeModal/tree'

    export default {
        components: {
            tableList,
            outInfoModal,
            feedbackInfo,
            seeOutInfo,
            seeFeedback,
            outRegisterResource,
            tree
        },
        data () {
            return {
                detail: {},
                outBtnShow: false,
                feedbackBtnShow: false,
                btnShow: false,
                outInfoModal: false,
                feedbackModal: false,
                seeOutInfoModal: false,
                seeFeedbackModal: false,
                treeMode: false,
                registerResourceModal: false,
                tableListModal: false,
                registerResourceModal: false,
                outOperateModal: false,
                outRegisterResourceModal: false,
                registerResourceTableNode: {},
                addResource: null,
                btnState: {
                    name: ''
                },
                incidentDetail: {},
                dispatchDetail: {},
                resourceHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源名称',
                        key: 'resTypeName',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'count',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '资源说明',
                        key: 'description',
                        width: 300,
                        align: 'center'
                    }
                ],
                resourceData: [],
                outInfo: {
                    org: {
                        id: 1,
                        name: '金海市公安局'
                    },
                    person: {
                        id: null,
                        name: ''
                    },
                    time: '',
                    content: ''
                },
                feedbackInfo: {
                    orgId: null,
                    orgName: '',
                    feedbackerId: null,
                    feedbacker: '',
                    feedbackTime: '',
                    content: ''
                },
                registerResource: {

                },
                registerResource: {
                    id: null,
                    name: '',
                    number: '',
                    unit: ''
                },
                height: ''
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                this.height = parseInt(height) - 329;
                return height;
            }
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'saveTableData',
                'saveData',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryDetail (node) {
                this.detail = node;
                const status = node.status;
                const id = node.id;
                if ( status === 10 ) {
                    this.btnState = {
                        state: 0,
                        name: '接收'
                    }
                    this.outBtnShow = false;
                    this.feedbackBtnShow = false;
                }
                if ( status === 20 ) {
                    this.btnState = {
                        state: 1,
                        name: '出动'
                    }
                    this.outBtnShow = false;
                    this.feedbackBtnShow = false;
                }
                if ( status === 30 ) {
                    this.btnState = {
                        state: 2,
                        name: '反馈'
                    }
                    this.outBtnShow = true;
                    this.feedbackBtnShow = false;
                }
                if ( status === 40 ) {
                    this.btnState = {
                        state: 2,
                        name: '反馈'
                    }
                    this.outBtnShow = true;
                    this.feedbackBtnShow = true;
                }
                this.btnShow = true;
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    dispatchId: id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/dispatch/getNewDispatchTask4Incident',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.incidentDetail = response.data.data.incident || {};
                            this.dispatchDetail = response.data.data.dispatch || {};
                            this.resourceData = response.data.data.dispatch.ress || [];
                        }
                    }
                ).catch(
                    
                );
            },
            seeDetail () {
                const status = this.btnState.state;
                if ( status === 0 ) {
                    const newData = this.selectDispatchNode;
                    const queryO = {
                        userCode: Cookies.get('userCode'),
                        dispatchId: this.detail.id
                    }
                    axios({
                        method: 'get',
                        url: this.getUrl+'/scd/dispatch/receiveDispatchRecord',
                        params: queryO
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.btnState = {
                                    state: 1,
                                    name: '出动'
                                }
                                this.$emit('dispatch-setting', 'receive', response.data.data);
                                this.closeDispatchModal();
                            }
                        }
                    ).catch(
                        
                    );
                }
                if ( status === 1 ) {
                    this.outOperateModal = true;
                }
                if ( status === 2 ) {
                    this.feedbackModal = true;
                }
            },
            settingFeedbackModal (type, data) {
                //设置反馈信息弹窗
                if ( type === 'feedbackOrg' ) {
                    //打开执行单位弹窗
                    let TreeInfo = {
                        title: '设置反馈单位',
                        treeMultiple: false,
                        additional: 'feedbackOrg',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode')
                        },
                        url: this.getUrl+'/platform/public/queryOrgTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeMode = true;
                }
                if ( type === 'feedbackExecutor' ) {
                    //打开反馈人员
                    const tableInfo = {
                        title: '反馈人员',
                        multiple: false,
                        url: this.getUrl+'/platform/public/queryPersonBase4Page',
                        name: '反馈者名称',
                        type: 'feedbackExecutor',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode'),
                            name: '',
                            queryCode: data
                        }
                    }
                    this.saveTableData(tableInfo);
                    this.tableListModal = true;
                }
            },
            savefeedbackModal (data) {
                //保存反馈信息
                const queryO = data;
                queryO.userCode = Cookies.get('userCode');
                queryO.planInstanceId = this.detail.planInstanceId;
                queryO.incidentId = this.detail.id;
                queryO.dispatchId = this.detail.id;
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/feedback/endFeedback',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.btnState = {
                                state: 2,
                                name: '反馈'
                            }
                            this.$emit('dispatch-setting', 'feedback');
                            this.closefeedbackModal ();
                        }
                    }
                ).catch(
                    
                );
            },
            closefeedbackModal () {
                this.feedbackModal = false;
            },
            closefeedbackInfoModal () {
                this.feedbackInfo = {
                    orgId: null,
                    orgName: '',
                    feedbackerId: null,
                    feedbacker: '',
                    feedbackTime: '',
                    content: ''
                }
                this.feedbackModal = false;
            },
            closeregisterResourceModal () {
                //关闭携带资源弹窗
                this.registerResourceModal = false;
            },
            saveregisterResource () {
                //保存携带资源
                if ( this.addResource ) {
                    this.outInfoData.push(this.registerResource);
                    this.addResource = false;
                } else {
                    this.$set(this.outInfoData,this.registerResourceTableNode.index,this.registerResource);
                }
                this.registerResourceTableNode = {};
                this.registerResourceModal = false;
            },
            closeSearchModal () {
                //关闭tableList弹窗
                this.tableListModal = false;
            },
            saveSearchModal (data, type) {
                //tableList选择数据
                if ( type === 'person' ) {
                    this.$refs.outInfoModal.settingPerson(data);
                    this.tableListModal = false;
                }
                if ( type === 'feedbackExecutor' ) {
                    this.$refs.feedbackInfo.settingInput(data, type);
                }
                this.tableListModal = false;
            },
            openOutPersonModal () {
                //打开出动信息执行人员弹窗
                const tableInfo = {
                    title: '执行人员',
                    multiple: false,
                    url: '',
                    name: '执行者名称',
                    type: 'outExecutor',
                    searchShow: true,
                    querO: {
                        userCode: Cookies.get('userCode'),
                        name: ''
                    }
                }
                this.saveTableData(tableInfo);
                this.tableListModal = true;
            },
            changeOutInfoTime (time) {
                //刷新出动信息出动时间
                this.outInfo.time = time;
            },
            addResourceModal () {
                //增加携带资源
                this.addResource = true;
                this.registerResource = {
                    id: null,
                    name: '',
                    number: '',
                    unit: ''
                };
                this.registerResourceModal = true;
            },
            editResourceModal () {
                //修改携带资源
                if ( !this.registerResourceTableNode.name ) {
                    this.$Message.warning('请先选择列表数据')
                } else {
                    this.registerResource = this.registerResourceTableNode;
                    this.registerResourceModal = true;
                }
            },
            registerResourceTableSelect (node,index) {
                this.registerResourceTableNode = node;
                this.registerResourceTableNode.index = index;
            },
            submitOutInfo (data) {
                //保存出动信息
                console.log(data)
                const queryO = data;
                queryO.userCode = Cookies.get('userCode');
                queryO.dispatchId = this.detail.id;
                queryO.incidentId = this.detail.incidentId;
                queryO.planInstanceId = this.detail.planInstanceId;
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/feedback/setoutRegister',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.btnState = {
                                state: 2,
                                name: '反馈'
                            }
                            this.outBtnShow = true;
                            this.$emit('dispatch-setting', 'out');
                            this.closeOutOperate();
                        }
                    }
                ).catch(
                    
                );
                
                
            },
            closeOutOperate () {
                //关闭出动弹窗
                this.outOperateModal = false;
            },
            OutSettingModal (type,data) {
                //打开出动信息个弹窗设置
                if ( type === 'org') {
                    //打开事件类型弹窗
                    let TreeInfo = {
                        title: '出动单位',
                        treeMultiple: false,
                        additional: 'outOrg',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode')
                        },
                        url: this.getUrl+'/platform/public/queryOrgTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeMode = true;
                }
                if ( type === 'person' ) {
                    let tableInfo = {
                        title: '出动人员',
                        multiple: false,
                        name: '人员名称',
                        type: 'person',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode'),
                            pageNum : 1,
                            pageSize : 10,
                            publishPlanId: 2,
                            queryCode: data
                        },
                        url: this.getUrl+'/platform/public/queryPersonBase4Page'
                    }
                    this.saveTableData(tableInfo);
                    this.tableListModal = true;
                }
                if ( type === 'resourceModal' ) {
                    this.outRegisterResourceModal = true;
                }
                if ( type === 'editResource') {
                    this.outRegisterResourceModal = true;
                }
            },
            treeModalClose () {
                //关闭tree
                this.treeMode = false;
            },
            treeModalSave (data, type) {
                if ( type === 'outOrg') {
                    this.$refs.outInfoModal.settingOrg(data);
                }
                if ( type === 'feedbackOrg' ) {
                    this.$refs.feedbackInfo.settingInput(data, type);
                }
                this.treeModalClose();
            },
            outSaveResource (type, data) {
                //携带资源登记
                if ( type === 'add' ) {
                    this.$refs.outInfoModal.settingResource(data);
                } else {
                    this.$refs.outInfoModal.editResource(data);
                }
                this.outRegisterResourceModal = false;
            },
            outResourceClose () {
                //关闭出动信息携带资源弹窗
                this.outRegisterResourceModal = false;
            },
            seeOutInfo () {
                //查看出动信息
                this.seeOutInfoModal = true;
                window.setTimeout(() => {
                    this.$refs.seeOutInfo.queryOutInfo(this.detail.id);
                }, 100);
            },
            closeOutInfoModal () {
                //关闭查看出动信息
                this.seeOutInfoModal = false;
            },
            seeFeedbackInfo () {
                //查看反馈信息
                this.seeFeedbackModal = true;
                window.setTimeout(() => {
                    this.$refs.seeFeedback.queryOutInfo(this.detail.id);
                }, 100);
            },
            closefeedbackInfoModal () {
                //关闭查看反馈信息
                this.seeFeedbackModal = false;
            }
        }
    }
</script>

<style scoped>
    .ds-detail-box {
        padding-top: 20px;
        margin-right: 20px;
    }
    .ivu-form-item {
        margin-bottom: 10px;
    }
    .ds-btn-box {
        height: 32px;
        text-align: right;
        margin-bottom: 10px;
    }
</style>

