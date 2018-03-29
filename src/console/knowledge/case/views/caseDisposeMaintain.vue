<template>
    <div>
        <Modal v-model="modalStatus" :mask-closable="false" width="800" @on-cancel="clickCancelBtn('disposeInfo')" class-name="vertical-center-modal">
            <p slot="header" style="color:#f60;text-align:center">
                <span>处置信息维护</span>
            </p>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>处置信息</h2>
                </div>
                <Form ref="disposeInfo" :rules="ruleCustom" :model="disposeInfo" :label-width="100">
                    <Row>
                        <!--<i-col span="8">
                        <FormItem label="调度类型：" inline >
                            <i-input placeholder="请输入调度类型." style="width: 100%" v-model="disposeInfo.dispatchType"></i-input>
                        </FormItem>
                        </i-col>-->
                        <i-col span="12">
                        <FormItem label="调度时间:" prop="dispatchTime">
                            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择事发时间" style="width: 100%" v-model="disposeInfo.dispatchTime" :editable="false"></DatePicker>
                        </FormItem>
                        </i-col>
                        <i-col span="12">
                        <FormItem label="调度人员:" prop="dispatcherName">
                            <i-input placeholder="请输入调度人员." style="width: 100%" v-model="disposeInfo.dispatcherName" readonly @on-focus="choiceDispatcherPerson"></i-input>
                        </FormItem>
                        </i-col>
                        <i-col span="24">
                        <FormItem label="调度内容:" prop="dispatchContent">
                            <i-input  type="textarea" :autosize="{minRows: 3,maxRows: 3}" v-model="disposeInfo.dispatchContent"></i-input>
                        </FormItem>
                        </i-col>
                        <i-col span="8">
                        <FormItem label="出动时间：" prop="feedbackTime">
                            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择事发时间" style="width: 100%" v-model="disposeInfo.feedbackTime" :editable="false"></DatePicker>
                        </FormItem>
                        </i-col>
                        <i-col span="8">
                        <FormItem label="出动单位:" prop="feedbackOrgName">
                            <i-input placeholder="请输入出动单位." v-model="disposeInfo.feedbackOrgName" readonly @on-focus="openOrgTree"></i-input>
                        </FormItem>
                        </i-col>
                        <i-col span="8">
                        <FormItem label="出动人员:" prop="feedbackerName">
                            <i-input placeholder="请输入出动人员." style="width: 100%" v-model="disposeInfo.feedbackerName" readonly @on-focus="choiceFeedbackPerson"></i-input>
                        </FormItem>
                        </i-col>
                        <i-col offset="19" span="5" style="margin-bottom: 10px;">
                            <Button type="primary" @click="clickConfirmBtn('disposeInfo')">确定</Button>
                            <Button type="ghost" @click="clickCancelBtn('disposeInfo')">清空</Button>
                        </i-col>
                    </Row>

                </Form>
                
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>处置记录表</h2>
                    <Row type="flex" justify="end" class="code-row-bg">
                        <i-col span="2">
                        <span v-if="record.id">
                            <Poptip placement="top-end" confirm title="您确认删除这条内容吗？" @on-ok="deleteDispatch">
                                <Button type="error">删除</Button>
                            </Poptip>
                        </span>
                        <span v-else>
                            <Button type="error" @click="deleteDispatch">删除</Button>
                        </span>

                       <!-- <Button type="error" @click="deleteDispatch">删除</Button>-->
                        </i-col>
                    </Row>
                </div>
                <div class="ds-widget-cont">
                    <Table :columns="columns1" :data=dispostList ref="dispatchTable" border highlight-row @on-row-click="clickTableRow"></Table>
                    <div class="ds-page-body" v-if="pageShow">
                        <Page :total="totalSize" :page-size="pageSize" @on-change="clickPage" class="ds-page-right"></Page>
                    </div>
                </div>
            </div>
            <div slot="footer">

            </div>
        </Modal>
        <law-type></law-type>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
        <table-list v-if="tableListModal" @table-search-close="closeSearchModal" @table-search-save="saveSearchModal"></table-list>
    </div>
</template>
<script>
    import lawType from './caseType'
    import { mapActions } from 'vuex'
    import tree from '@/common/components/treeModal/tree'
    import tableList from '@/common/components/tableSearchModal/tableSearchModal'
    import axios from 'axios'
    import verify from '@/common/utils/verify'
    import Cookies from 'js-cookie';
    export default {
        components: {
            lawType,
            tree,
            tableList,
            verify
        },
        data () {
            const validateFeedbackerName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择出动人'));
                } else{
                    callback()
                }
            };
            const validateFeedbackOrgName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择出动单位'));
                } else{
                    callback()
                }
            };
            const validateFeedbackTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择出动时间'));
                } else{
                    callback()
                }
            };
            const validateDispatchContent = (rule, value, callback) => {
                if (value&&value.length>1000) {
                    return callback(new Error('调度内容不能超过1000字'));
                } else{
                    callback()
                }
            };
            const validateDispatcherName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择调度人'));
                } else{
                    callback()
                }
            };
            const validateDispatchTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择调度时间'));
                } else{
                    callback()
                }
            };
            return {
                ruleCustom: {
                    feedbackerName: [
                        { required: true, validator: validateFeedbackerName, trigger: 'blur' }
                    ],
                    feedbackOrgName: [
                        { required: true, validator: validateFeedbackOrgName, trigger: 'blur' }
                    ],
                    feedbackTime: [
                        { required: true, validator: validateFeedbackTime, trigger: 'blur' }
                    ],
                    dispatchContent: [
                        { validator: validateDispatchContent, trigger: 'blur' }
                    ],
                    dispatcherName: [
                        { required: true, validator: validateDispatcherName, trigger: 'blur' }
                    ],
                    dispatchTime: [
                        { required: true, validator: validateDispatchTime, trigger: 'blur' }
                    ],

                },
                record: {},
                tableListModal:false,
                treeMode:'',
                disposeInfo:{
                    dispatchTime: '',
                    feedbackTime: ''
                },
                modalStatus: false,
                dispostList:[],
                pageShow:false,
                totalSize: null,
                pageSize: 2,
                pageNum: 1,
                columns1: [
                    {
                        title: '序号',
                        width: 80,
                        align:'center',
                        type: 'index'
                    },
                    {
                        title: '调度时间',
                        align:'center',
                        key: 'dispatchTime'
                    },
                    {
                        title: '出动单位',
                        align:'center',
                        key: 'feedbackOrgName'
                    },
                    {
                        title: '调度内容',
                        align:'center',
                        key: 'dispatchContent'
                    }
                ],
            };
        },
        computed:{
            // modalStatus() {
            //     return this.$store.state.laws.modalStatus
            // },
            lawsInfo() {
                return this.$store.state.laws.lawsInfo
            },
            addEditStatus() {
                return this.$store.state.laws.addEditStatus
            },
            returnCode() {
                return this.$store.state.laws.returnCode
            },
            queryCondition (){
                return this.$store.state.laws.queryConditions;
            },
            lawsFileTypeInfo (){
                return this.$store.state.laws.lawsFileTypeInfo;
            }
        },
        methods: {
            ...mapActions([
                'changeModalStatus',// 改变模态框状态
                'saveAddLaws',// 新增保存
                'saveEditLaws',// 编辑保存
                'changeTypeModalStatus',//改变类型弹出框状态
                'dateFormat',//格式化时间
                'getLawsTableList',// 获取表格列表
                'saveDemoData',
                'saveTableData',
            ]),
            choiceDispatcherPerson(){
                const tableInfo = {
                    title: '请选择调度人',
                    multiple: false,
                    url: this.$store.state.userCode.url+'/platform/public/queryPersonBase4Page',
                    name: '姓名',
                    type: 'dispatcherPerson',
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
            choiceFeedbackPerson(){
                const tableInfo = {
                    title: '请选择出动人',
                    multiple: false,
                    url: this.$store.state.userCode.url+'/platform/public/queryPersonBase4Page',
                    name: '姓名',
                    type: 'feedbackPerson',
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
            getDetail(id){
                //获取详情查询
                let info={
                    userCode:Cookies.get('userCode'),
                    id:id
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/knowledgeBank/caseDispatch/getCaseDispatchById',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            if(response.data.data){
                                this.disposeInfo = response.data.data;
                            }
                        }
                    }
                ).catch(

                )
            },
            queryDisposeList() {
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    caseId:this.disposeInfo.caseId
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/knowledgeBank/caseDispatch/queryCaseDispatchListByPage',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let total = response.data.data.total;
                            this.totalSize = response.data.data.total;
                            if ( total > this.pageSize ) {
                                this.pageShow = true;
                            } else {
                                this.pageShow = false;
                            }
                            this.dispostList = response.data.data.list;
                            this.record.id = null;
                            this.disposeInfo = {caseId: this.disposeInfo.caseId};
                        }
                    }
                ).catch(

                )
            },
            openOrgTree () {
                //文件树
                let TreeInfo = {
                    title: '出动单位',
                    treeMultiple: false,
                    additional: 'orgTree',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.$store.state.userCode.url+'/platform/public/queryOrgTree4New'
                };
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            addDispose() {
                // 新增
                let info=this.disposeInfo;
                info.userCode=Cookies.get('userCode');
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/knowledgeBank/caseDispatch/addCaseDispatch',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('操作成功!');
                            this.queryDisposeList();
                            this.record.id=null;
                        }
                    }
                ).catch(

                )
            },
            clickConfirmBtn (name){// 点击确认按钮
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.addDispose();
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
            },
            clickCancelBtn (name){// 点击取消按钮
                this.disposeInfo= {};
                this.$refs[name].resetFields();
            },
            clickCloseModel (){ // 点击关闭弹出框
                alert(11)
            },
            choiceFileType (){//修改时弹框选择文件类型
                this.changeTypeModalStatus(true)
            },
            //格式化时间
            changeDate (date){
                this.disposeInfo.dispatchTime=date;
            },
            changeFeedbackDate(date){
                this.disposeInfo.feedbackTime=date;
            },
            deleteDispatch(){
                if(this.record && this.record.id){
                    this.delete(this.record.id);
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            delete(id){
                let info={
                    userCode:Cookies.get('userCode'),
                    id:id
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/knowledgeBank/caseDispatch/deletedCaseDispatch',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('操作成功!');
                            this.queryDisposeList();
                        }
                    }
                ).catch(

                )
            },
            treeModalClose(){
                this.treeMode=false;
            },
            treeModalSave(data, type){
                if ( type === 'orgTree') {
                    this.disposeInfo.feedbackOrgName=data[0].title;
                    this.disposeInfo.feedbackOrgId=data[0].id;

                    this.$refs.disposeInfo.validateField('feedbackOrgName', valid => {
                        console.log(valid);
                    });
                }
                this.treeModalClose();
            },
            clickPage (num){//点击分页
                this.pageNum=num;
                this.queryDisposeList();
            },
            clickTableRow (data,index){// 点击表格每一行
                this.record = data;
                this.disposeInfo=data;
                this.getDetail(data.id);
            },
            closeSearchModal(){
                this.tableListModal=false;
            },
            saveSearchModal(data, type){
                if ( type === 'dispatcherPerson') {
                    this.disposeInfo.dispatcherName=data.name;
                    this.disposeInfo.dispatcherId=data.id;

                    this.$refs.disposeInfo.validateField('dispatcherName', valid => {
                        console.log(valid);
                    });
                }else if(type === 'feedbackPerson'){
                    this.disposeInfo.feedbackerName=data.name;
                    this.disposeInfo.feedbackerId=data.id;

                    this.$refs.disposeInfo.validateField('feedbackerName', valid => {
                        console.log(valid);
                    });
                }
                this.closeSearchModal();
            },
        }
    }
</script>

