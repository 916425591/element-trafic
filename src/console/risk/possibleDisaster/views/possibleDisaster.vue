<template>
    <!-- 可能诱发的灾害事故 -->
    <div>
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <div class="ds-widget-cont">
                <Form :label-width="80" inline  ref="queryCondition" :rules="ruleCustom" :model="queryCondition">
                    <FormItem label="灾害类型" prop="incidentTypeName">
                        <Input placeholder="请输入灾害类型." v-model="queryCondition.incidentTypeName" />
                    </FormItem>
                    <FormItem label="隐患名称" prop="name">
                        <Input placeholder="请输入隐患名称." v-model="queryCondition.name" />
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

            </div>
            <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
                <Table :columns="columns1" :data="tableData" ref="riskTable" border highlight-row @on-row-click="risk_clickTableRow"></Table>
                <div class="ds-page-body" v-if="pageShow">
                    <Page :total=totalSize :current=pageNum :page-size="pageSize" @on-change="clickPage"></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';
    import axios from 'axios'
    import verify from '@/common/utils/verify'
    import Cookies from 'js-cookie';
    export default {
        components: {
            verify
        },
        data: function () {
            const validateName = (rule, value, callback) => {
                if (value&&!verify.name.test(value)) {
                    return callback(new Error('不能包含特殊符号，20字符以内'));
                }else {
                    callback()
                }
            };
            const validateIncidentTypeName = (rule, value, callback) => {
                if (value&&!verify.name.test(value)) {
                    return callback(new Error('不能包含特殊符号，20字符以内'));
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
                        title: '灾害类型',
                        align: 'center',
                        key: 'incidentTypeName'
                    },
                    {
                        title: '诱发危险源',
                        align: 'center',
                        key: 'sourceName'
                    },
                    {
                        title: '危险源类型',
                        align: 'center',
                        key: 'dangerTypeName'
                    },
                    {
                        title: '高危时段初',
                        align: 'center',
                        key: 'highRiskStart'
                    },
                    {
                        title: '高位时段末',
                        align: 'center',
                        key: 'highRiskEnd'
                    },
                    {
                        title: '所在位置',
                        align: 'center',
                        key: 'address'
                    }
                ],
                queryCondition:{
                    name:'',
                    incidentTypeId:''
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
                    incidentTypeName:[
                        { validator: validateIncidentTypeName, trigger: 'blur' }
                    ],
                    name:[
                        { validator: validateName, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            riskTableList () {
                return this.$store.state.risk.riskTableList;
            },
            riskInfo (){
                return this.$store.state.risk.riskInfo;
            },
            queryRiskCondition (){
                return this.$store.state.risk.queryRiskConditions;
            },
            riskTypeInfo (){
                return this.$store.state.risk.riskTypeInfo;
            },
            returnCode (){
                return this.$store.state.risk.returnCode;
            },
            pageSize() {
                const res = this.$store.state.heightTable.tableInfo.numberBranches
                const numberBranches = parseInt(res)
                return numberBranches /*根据高度换算 自定义每页显示条数*/
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

            this.queryDisasterAccidentList();
        },
        methods: {
            ...mapActions([
                'changeModalStatus',// 改变弹出框状态
                'getRiskTableList',// 获取表格列表
                'setRiskInfo',//点击表格某一行把值赋上去
                'deleteRiskRecord',// 删除一行记录
                'setAddEditStatus',// 设置新增编辑状态
                'setQueryConditions',//设置查询参数
                'changeRiskDisasterModalStatus',
                'changeRiskMonitorModalStatus',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryDisasterAccidentList() {
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    name:this.queryCondition.name,
                    incidentTypeName:this.queryCondition.incidentTypeName
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/risk/DisasterAccident/queryDisasterAccidentListByPage',
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
                        }
                    }
                ).catch(

                )
            },
            clickQueryBtn (name){// 点击查询按钮
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.pageNum=1;
                        this.queryDisasterAccidentList();
                    } else {
                        this.$Message.error('字段输入不合法');
                    }
                })
            },
            clickClearBtn (name){// 点击清除查询按钮
                this.$refs[name].resetFields();
                this.queryCondition.name='';
                this.queryCondition.incidentTypeId='';
                this.pageNum=1;
                this.queryDisasterAccidentList();
            },
            risk_clickAddBtn (){// 点击新增按钮
                if(this.riskTypeInfo.id && this.riskTypeInfo.name){
                    this.setAddEditStatus('add');//设置新增编辑状态
                    this.$refs.riskTable.clearCurrentRow();//清除选中行高亮
                    //this.setRiskInfo(); //把信息设置为空
                    this.changeModalStatus(true); //显示弹框
                }else{
                    this.$Message.error('请选择某一风险隐患类型.');
                }
            },
            risk_clickEditBtn (){// 点击编辑按钮
                if(this.riskInfo && this.riskInfo.id){
                    this.setAddEditStatus('edit');//设置新增编辑状态
                    this.changeModalStatus(true);
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            risk_clickTableRow (data,index){// 点击表格每一行
                console.log(this.riskInfo)
            },
            risk_clickDeleteBtn (){// 点击删除按钮
                if(this.riskInfo && this.riskInfo.id){
                    this.deleteRiskRecord(this.riskInfo.id);
                    if(this.returnCode === '200'){
                        this.getRiskTableList({
                            'userCode':Cookies.get('userCode'),
                            'pageNum':1,
                            'pageSize':10,
                            'riskTypeId':this.riskTypeInfo.id,
                            'name':this.queryRiskCondition.name,
                            'level':this.queryRiskCondition.level
                        })
                    }
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
                this.queryDisasterAccidentList();
            }
        }
    }
</script>

