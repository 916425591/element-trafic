<template>
  <div>
    <div class="ds-widget-box">
      <div class="ds-widget-title">
        <span class="ds-title-icon"></span>
        <h2>查询条件</h2>
      </div>
      <div class="ds-widget-cont">
        <Form :label-width="80" inline>
          <FormItem label="目标类型" >
            <Select style="width:200px" v-model="queryCondition.fenseTypeId">
              <Option value="1" label="一级">
                <span>一级</span>
              </Option>
              <Option value="2" label="二级">
                <span>二级</span>
              </Option>
              <Option value="3" label="三级">
                <span>三级</span>
              </Option>
              <Option value="4" label="四级">
                <span>四级</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem label="隐患名称">
            <Input placeholder="请输入隐患名称." v-model="queryCondition.name" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickQueryBtn">查询</Button>
            <Button type="default" @click="clickClearBtn">清空查询</Button>
          </FormItem>
        </Form>
      </div>
      <div class="ds-widget-title">
        <span class="ds-title-icon"></span>
        <h2>查询列表</h2>
        <div class="ds-fload-right">
          <Button type="primary" @click="risk_clickAddBtn">新增</Button>
          <Button type="warning" @click="risk_clickEditBtn">修改</Button>
          <Button type="info" @click="risk_clickDisasterBtn">诱发事故</Button>
          <Button type="success" @click="risk_clickMonitorBtn">监测项</Button>
          <Poptip placement="top-end" confirm title="您确认删除这条内容吗？" @on-ok="risk_clickDeleteBtn">
                <Button type="error">删除</Button>
            </Poptip>
        </div>
      </div>
      <div class="ds-widget-cont">
        <Table :columns="columns1" :data="tableData" ref="riskTable" border highlight-row @on-row-click="risk_clickTableRow"></Table>
        <div class="ds-page-body" v-if="pageShow">
          <Page :total=totalSize :current=pageNum @on-change="clickPage"></Page>
        </div>
      </div>
    </div>

    <risk-maintain></risk-maintain>
    <disaster-accident></disaster-accident>
    <monitor-item></monitor-item>

  </div>
</template>
<script>
    import riskMaintain from './riskMaintain';
    import disasterAccident from './disasterAccident';
    import monitorItem from './monitorItem';
    import { mapActions } from 'vuex';
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        components: {
            riskMaintain,
            disasterAccident,
            monitorItem
        },
        data() {
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
                        key: 'level'
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
                    fenseTypeId:''
                },
                tableData: [],
                pageShow:false,
                totalSize: null,
                pageSize: 10,
                pageNum: 1
            }
        },
        created () {
            this.queryFenseTargetList();
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
            }
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
                'changeRiskMonitorModalStatus'
            ]),
            queryFenseTargetList() {
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    name:this.queryCondition.name,
                    fenseTypeId:this.queryCondition.fenseTypeId
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
                this.queryCondition.fenseTypeId='';
                this.pageNum=1;
                this.queryFenseTargetList();
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
                this.setRiskInfo(data);
                console.log(this.riskInfo)
            },
            async risk_clickDeleteBtn (){// 点击删除按钮
                if(this.riskInfo && this.riskInfo.id){
                    this.deleteRiskRecord(this.riskInfo.id);
                    if(this.returnCode === '200'){
                        await this.getRiskTableList({
                            'userCode':Cookies.get('userCode'),
                            'pageNum':1,
                            'pageSize':10,
                            'fenseTypeId':this.riskTypeInfo.id,
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
                this.queryFenseTargetList();
            }
        }
    }
</script>

