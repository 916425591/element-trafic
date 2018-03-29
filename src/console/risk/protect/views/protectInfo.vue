<template>
  <div>
    <div class="ds-widget-box" :style='height' :data-json="tableHeight">
      <div class="ds-widget-title">
        <span class="ds-title-icon"></span>
        <h2>查询条件</h2>
      </div>
      <div class="ds-widget-cont">
        <Form ref="queryCondition" :rules="ruleCustom" :model="queryCondition" :label-width="80" inline>
          <FormItem label="重要级别">
            <Select v-model="queryCondition.level" style="width: 200px;">
              <Option v-for="item in levelData" :value="item.key" :key="item.key">{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="目标名称">
            <Input placeholder="请输入目标名称." v-model="queryCondition.name" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickQueryBtn()">查询</Button>
            <Button type="default" @click="clickClearBtn()">清空查询</Button>
          </FormItem>
        </Form>
      </div>
      <div class="ds-widget-title">
        <span class="ds-title-icon"></span>
        <h2>查询列表</h2>
        <div class="ds-fload-right">
          <Button type="primary" @click="risk_target_clickAddBtn">新增</Button>
          <Button type="warning" @click="risk_target_clickEditBtn">修改</Button>
          <Button type="info" @click="risk_target_clickDisasterBtn">诱发事故</Button>
          <Button type="success" @click="risk_target_clickMonitorBtn">监测项</Button>
          <span v-if="record.id">
            <Poptip placement="top-end" confirm title="您确认删除这条内容吗？" @on-ok="risk_target_clickDeleteBtn">
                <Button type="error">删除</Button>
            </Poptip>
          </span>
          <span v-else>
                <Button type="error" @click="risk_target_clickDeleteBtn">删除</Button>
             </span>
        </div>
      </div>
      <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
        <Table :columns="columns1" :data="tableData" ref="riskTable" border highlight-row @on-row-click="risk_target_clickTableRow"></Table>
        <div class="ds-page-body" v-if="pageShow">
          <Page :total=totalSize :current=pageNum :page-size="pageSize" @on-change="clickPage"></Page>
        </div>
      </div>
    </div>

    <protect-maintain ref="maintain" @maintain-parent="queryFenseTargetList"></protect-maintain>
    <disaster-accident ref="accident" @accident-parent="queryFenseTargetList"></disaster-accident>
    <monitor-item ref="monitor" @monitor-parent="queryFenseTargetList"></monitor-item>

  </div>
</template>
<script>
    import protectMaintain from './protectMaintain';
    import disasterAccident from './disasterAccident';
    import monitorItem from './monitorItem';
    import { mapActions } from 'vuex';
    import axios from 'axios'
    import verify from '@/common/utils/verify'
    import Cookies from 'js-cookie';
    export default {
        components: {
            protectMaintain,
            disasterAccident,
            monitorItem,
            verify
        },
        data() {
            const validateFenseTypeName= (rule, value, callback) => {
                if (value&&!verify.name.test(value)) {
                    return callback(new Error('不能包含特殊符号，20字符以内'));
                }else {
                    callback()
                }
            };
            const validateName = (rule, value, callback) => {
                if (value&&!verify.name.test(value)) {
                    return callback(new Error('不能包含特殊符号，20字符以内'));
                }else {
                    callback()
                }
            };
            return {
                columns1: [
                    {
                        title: '序号',
                        width: 80,
                        align:'center',
                        type: 'index'
                    },
                    {
                        title: '防护目标名称',
                        align:'center',
                        key: 'name'
                    },
                    {
                        title: '目标类型',
                        align:'center',
                        key: 'fenseTypeName'
                    },
                    {
                        title: '重要级别',
                        align:'center',
                        key: 'levelName'
                    },
                    {
                        title: '责任人',
                        align:'center',
                        key: 'dutyPersonName'
                    },
                    {
                        title: '所在位置',
                        align:'center',
                        key: 'address'
                    }
                ],
                queryCondition:{
                    name:'',
                    level:'null'
                },
                levelData:[],
                tableData: [],
                pageShow:false,
                totalSize: null,
                pageNum: 1,
                record:'',
                treeSelected: false,
                height: {
                    height: '',
                    // 'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                },
                ruleCustom: {
                    name:[
                        { validator: validateName, trigger: 'blur' }
                    ],
                    fenseTypeName:[
                        { validator: validateFenseTypeName, trigger: 'blur' }
                    ]
                }
            }
        },
       /* created () {
            this.queryFenseTargetList();
        },*/
        computed: {
            protectTargetTypeNode (){
                return this.$store.state.riskProtect.protectTargetTypeNode;
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
            this.setHeightContent(h)
            this.tableHeightMessage(158);
            this.getLevelData();
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getLevelData(){
                //获取级别详情
                let info={
                    userCode:Cookies.get('userCode'),
                    type:"RISK_IMPORTANT_LEVEL"
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/platform/dictionary/getDictionaryByType',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            if(response.data.data){
                                this.levelData = response.data.data;
                                this.levelData.unshift({"key":"null","value":"---请选择---"});
                            }
                        }
                    }
                ).catch(

                )
            },
            queryFenseTargetList() {
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    name:this.queryCondition.name,
                    level:this.queryCondition.level,
                    queryCode:this.protectTargetTypeNode.queryCode
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/risk/fenseTarget/queryFenseTargetListByPage',
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
            clickQueryBtn (){// 点击查询按钮
                this.pageNum=1;
                this.queryFenseTargetList();
            },
            clickClearBtn (){//点击清除查询按钮
                this.queryCondition.name='';
                this.queryCondition.fenseTypeName='';
                this.pageNum=1;
                this.queryFenseTargetList();
            },
            risk_target_clickAddBtn (){// 点击新增按钮
                if(this.treeSelected&&this.protectTargetTypeNode&&this.protectTargetTypeNode.id){
                    this.$refs.maintain.addEditStatus='add';//设置新增编辑状态
                    this.$refs.maintain.reSetInfo(this.protectTargetTypeNode);
                    /*this.$refs.maintain.riskTargetInfo={};
                    this.$refs.maintain.riskTargetInfo.fenseTypeId=this.protectTargetTypeNode.id;
                    this.$refs.maintain.riskTargetInfo.fenseTypeName=this.protectTargetTypeNode.name;*/
                    this.$refs.maintain.riskTargetInfo.level='null';
                    this.$refs.maintain.$refs['riskTargetInfo'].resetFields();
                    this.$refs.maintain.getLevelData();
                    this.$refs.maintain.riskTargetModalStatus=true;
                }else{
                    this.$Message.error('请选择某一风险隐患类型.');
                }
            },
            risk_target_clickEditBtn (){// 点击编辑按钮
                if(this.$refs.maintain.riskTargetInfo.id){
                    this.$refs.maintain.addEditStatus='edit';//设置新增编辑状态
                    this.$refs.maintain.getDetail(this.$refs.maintain.riskTargetInfo.id);
                    this.$refs.maintain.getLevelData();
                    this.$refs.maintain.riskTargetModalStatus=true;
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            risk_target_clickTableRow (data,index){// 点击表格每一行
                this.$refs.maintain.riskTargetInfo=data;
                this.$refs.accident.accidentInfo.sourceId=data.id;
                this.$refs.accident.accidentInfo.sourceType=2;
                this.$refs.monitor.monitorInfo.objId=data.id;
                this.$refs.monitor.monitorInfo.objType=2;
                this.record=data;
            },
            risk_target_clickDeleteBtn (){// 点击删除按钮
                if(this.record.id){
                    this.$refs.maintain.deleteMaintain(this.record.id);
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            risk_target_clickDisasterBtn (){ // 点击诱发事故按钮
                if(this.$refs.accident.accidentInfo.sourceId){
                    this.$refs.accident.pageNum=1;
                    this.$refs.accident.accidentData='';
                    let sourceId = this.$refs.accident.accidentInfo.sourceId;
                    let sourceType = this.$refs.accident.accidentInfo.sourceType;
                    this.$refs.accident.accidentInfo={sourceId:sourceId,sourceType:sourceType};
                    this.$refs.accident.queryAccidentList();
                    this.$refs.accident.targetDisasterModalStatus=true;
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            risk_target_clickMonitorBtn (){ // 点击监测项按钮
                if(this.$refs.monitor.monitorInfo.objId){
                    this.$refs.monitor.pageNum=1;
                    this.$refs.monitor.monitorData='';
                    let objId = this.$refs.monitor.monitorInfo.objId;
                    let objType = this.$refs.monitor.monitorInfo.objType;
                    this.$refs.monitor.monitorInfo={objId:objId,objType:objType};
                    this.$refs.monitor.queryMonitorList();
                    this.$refs.monitor.targetMonitorModalStatus=true;
                }else{
                    this.$Message.error('请选择某一行记录.');
                }
            },
            clickPage (pageNum){//点击分页
                this.pageNum=pageNum;
                this.queryFenseTargetList();
            },
            initPage(){
                this.pageShow = false;
                this.totalSize = 0;
                this.pageNum = 1;
            },
            resetTable(){
                this.record={};
                this.$refs.maintain.resetFormItem();
                this.$refs.maintain.riskTargetInfo.id=null;
                // this.$refs.maintain.riskTargetInfo={};
                this.$refs.accident.accidentInfo={};
                this.$refs.monitor.monitorInfo={};
            },
            resetAll(){
                this.resetTable();
                this.treeSelected = false;
                this.tableData = [];
                this.initPage();
            }
        }
    }
</script>

