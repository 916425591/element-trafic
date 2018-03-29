<template>
    <!-- 隐患监测 -->
    <div>
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <div class="ds-widget-cont">
                <Form :label-width="80" inline ref="queryCondition" :rules="ruleCustom" :model="queryCondition">
                    <FormItem label="隐患名称" prop="objName">
                        <Input placeholder="请输入隐患名称." v-model="queryCondition.objName" />
                    </FormItem>
                    <FormItem label="监测项" prop="itemName">
                        <Input placeholder="请输入监测项." v-model="queryCondition.itemName" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="clickQueryBtn('queryCondition')">查询</Button>
                        <Button type="default" @click="clickClearBtn('queryCondition')">清空查询</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
                <div class="ds-fload-right">
                    <Button type="info" @click="risk_danger_record">监测记录维护</Button>
                </div>
            </div>
            <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
                <Table :columns="columns1" :data="tableData" ref="riskTable" border highlight-row @on-row-click="risk_clickTableRow"></Table>
                <div class="ds-page-body" v-if="pageShow">
                    <Page :total=totalSize :current=pageNum :page-size="pageSize" @on-change="clickPage"></Page>
                </div>
            </div>
        </div>
        <hidden-danger-maintain ref="maintain" @maintain-parent="queryMonitorRecordList"></hidden-danger-maintain>
        <hidden-record ref="record"></hidden-record>
    </div>
</template>
<script>
    import hiddenDangerMaintain from './hiddenDangerMaintain'
    import hiddenRecord from './hiddenRecord'
    import { mapActions } from 'vuex';
    import axios from 'axios'
    import Cookies from 'js-cookie';
    import verify from '@/common/utils/verify'
    export default {
        components: {
            hiddenDangerMaintain,
            verify,
            hiddenRecord
        },
        data: function () {
            const validateObjName = (rule, value, callback) => {
                if (value&&!verify.name.test(value)) {
                    return callback(new Error('名称不能包含特殊符号，20字符以内'));
                }else {
                    callback()
                }
            };
            const validateItemName = (rule, value, callback) => {
                if (value&&!verify.name.test(value)) {
                    return callback(new Error('名称不能包含特殊符号，20字符以内'));
                }else {
                    callback()
                }
            };
            return {
                hiddenDangerMaintain:false,
                columns1: [
                    {
                        title: '序号',
                        width: 80,
                        align: 'center',
                        type: 'index'
                    },
                    {
                        title: '隐患名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '监测项',
                        align: 'center',
                        key: 'itemName'
                    },
                    {
                        title: '取值范围',
                        align: 'center',
                        key: 'normalRange'
                    },
                    {
                        title: '最近监测时间',
                        align: 'center',
                        key: 'monitorTime'
                    },
                    {
                        title: '最近检测值',
                        align: 'center',
                        key: 'value'
                    },
                    {
                        title: '最近预警状态',
                        align: 'center',
                        key: 'statusName'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.risk_clickNormalBtn(params)
                                        }
                                    }
                                }, '正常'),
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.risk_clickAbnormalBtn(params)
                                        }
                                    }
                                }, '异常')
                            ]);
                        }
                    }
                ],
                queryCondition:{
                    name:'',
                    itemName:''
                },
                tableData: [],
                pageShow:false,
                totalSize: null,
                pageNum: 1,
                height: {
                    height: '',
                    // 'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                },
                ruleCustom: {
                    objName:[
                        { validator: validateObjName, trigger: 'blur' }
                    ],
                    itemName:[
                        { validator: validateItemName, trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
            //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
            pageSize() {
                return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            riskHiddenDangerTypeNode () {
                return this.$store.state.hiddenDanger.riskHiddenDangerTypeNode;
            },
            tableHeight() {
                const res = this.$store.state.heightTable.tableInfo.tableHeight
                this.height.height = parseInt(res) + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h);
            this.tableHeightMessage(158);
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryMonitorRecordList() {
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    name:this.queryCondition.name,
                    itemName:this.queryCondition.itemName,
                    queryCode:this.riskHiddenDangerTypeNode.queryCode,
                    objType:this.riskHiddenDangerTypeNode.objType
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/risk/monitorRecord/queryMonitorRecord4List',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let total = response.data.data.total;
                            this.totalSize = response.data.data.total;
                            console.log(total)
                            if ( total > this.pageSize ) {
                                this.pageShow = true;
                            } else {
                                this.pageShow = false;
                            }
                            this.tableData = response.data.data.list;
                            this.resetTable();
                        }
                    }
                ).catch(

                )
            },
            risk_danger_record() {
                if (this.$refs.record.recordInfo.itemId) {
                    this.$refs.record.pageNum = 1;
                    this.$refs.record.queryRecordBaseList();
                    this.$refs.record.dangerModalStatus = true;
                }else{
                    this.$Message.error('请选择某一隐患');
                }
            },
            clickQueryBtn (name){// 点击查询按钮
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.pageNum=1;
                        this.queryMonitorRecordList();
                    } else {
                        this.$Message.error('字段输入不合法');
                    }
                })
            },
            clickClearBtn (name){//点击清除查询按钮
                this.$refs[name].resetFields();
                this.queryCondition.name='';
                this.queryCondition.itemName='';
                this.pageNum=1;
                this.queryMonitorRecordList();
            },
            risk_danger_clickAddBtn (){// 点击新增按钮
                if(this.$refs.maintain.recordInfo.itemId){
                    this.$refs.maintain.queryRecordBaseList();
                    this.$refs.maintain.recordInfo.level='null';
                    this.$refs.maintain.recordInfo.status=2;
                    this.$refs.maintain.dangerModalStatus=true;
                }else{
                    this.$Message.error('请选择某一风险隐患类型.');
                }
            },
            risk_clickAbnormalBtn(params){
                this.$refs.maintain.initFormItemAndOpenModal(params);
                /*this.$refs.maintain.recordInfo.itemId=params.row.itemId;
                this.$refs.maintain.initFormItem(params);
                // this.$refs.maintain.queryRecordBaseList();
                this.$refs.maintain.recordInfo.level='null';
                this.$refs.maintain.recordInfo.status=2;*/
            },
            risk_clickNormalBtn(params){
                this.$refs.maintain.recordInfo.itemId=params.row.itemId;
                this.$refs.maintain.queryRecordBaseList();
                let temp = {};
                temp.monitorTime=new Date();
                temp.status=1;
                temp.value="正常值";
                this.$refs.maintain.risk_record_clickTableRow(temp);
                this.$refs.maintain.saveRecrod();
            },
            risk_danger_clickEditBtn (){// 点击编辑按钮
                if(this.$refs.maintain.recordInfo.itemId){
                    this.$refs.maintain.dangerModalStatus=true;
                }else{
                    this.$Message.error('请选择某一风险隐患类型.');
                }
            },
            risk_clickTableRow (data,index){// 点击表格每一行
                this.$refs.maintain.initRiskInfo(data);
                this.$refs.record.recordInfo.itemId=data.itemId;
            },
            async risk_danger_clickDeleteBtn (){// 点击删除按钮
                if(this.$refs.maintain.recordInfo.itemId){

                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            risk_clickDisasterBtn (){ // 点击诱发事故按钮
                if(this.riskTypeInfo.id && this.riskTypeInfo.name){
                    this.changeRiskDisasterModalStatus(true);
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            risk_clickMonitorBtn (){ // 点击监测项按钮
                if(this.riskTypeInfo.id && this.riskTypeInfo.name){
                    this.changeRiskMonitorModalStatus(true);
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            clickPage (pageNum){//点击分页
                this.pageNum=pageNum;
                this.queryMonitorRecordList();
            },
            resetTable(){
                this.$refs.maintain.recordInfo = {
                    itemId:null,
                    name:null,
                    itemName:null,
                    normalRange:null
                },
                    this.$refs.record.recordInfo.itemId = null;
            },
            initPage(){
                this.pageShow = false;
                this.totalSize = 0;
                this.pageNum = 1;
            },
            resetAll(){
                this.resetTable();
                this.tableData = [];
                this.initPage();
            }
        }
    }
</script>

