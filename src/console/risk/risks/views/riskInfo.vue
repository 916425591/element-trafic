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
          <FormItem label="隐患名称">
            <Input placeholder="请输入隐患名称." v-model="queryCondition.name" />
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
            <Button type="primary" @click="risk_clickAddBtn">新增</Button>
            <Button type="warning" @click="risk_clickEditBtn">修改</Button>
            <Button type="info" @click="risk_clickDisasterBtn">诱发事故</Button>
            <Button type="success" @click="risk_clickMonitorBtn">监测项</Button>
            <span v-if="record.id">
                <Poptip placement="top-end" confirm title="您确认删除这条内容吗？" @on-ok="risk_clickDeleteBtn">
                    <Button type="error">删除</Button>
                </Poptip>
            </span>
            <span v-else>
                <Button type="error" @click="risk_clickDeleteBtn">删除</Button>
            </span>
            <!--<Button type="error" @click="risk_clickDeleteBtn">删除</Button>-->
          </div>
      </div>
      <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
        <Table :columns="columns1" :data="tableData" ref="riskTable" border highlight-row @on-row-click="risk_clickTableRow"></Table>
        <div class="ds-page-body" v-if="pageShow">
          <Page :total=totalSize :current=pageNum :page-size="pageSize" @on-change="clickPage"></Page>
        </div>
      </div>
    </div>

   <risk-maintain ref="maintain" @maintain-parent="queryRiskList"></risk-maintain>
   <disaster-accident ref="accident" @accident-parent="queryRiskList"></disaster-accident>
   <monitor-item ref="monitor" @monitor-parent="queryRiskList"></monitor-item>

  </div>
</template>
<script>
import riskMaintain from './riskMaintain';
import disasterAccident from './disasterAccident';
import monitorItem from './monitorItem';
import { mapActions } from 'vuex';
import axios from 'axios'
import Cookies from 'js-cookie';
import verify from '@/common/utils/verify'
export default {
  components: {
      riskMaintain,
      disasterAccident,
      monitorItem,
      verify
  },
  data() {
      const validateRiskTypeName= (rule, value, callback) => {
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
              title: '名称',
              align:'center',
              key: 'name'
          },
          {
              title: '隐患类型',
              align:'center',
              key: 'riskTypeName'
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
      tableData: [],
      pageShow:false,
      totalSize: null,
      pageNum: 1,
      record:'',
      treeSelected:false,
      height: {
          height: '',
          // 'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
      },
        levelData:[],
      ruleCustom: {
            name:[
                { validator: validateName, trigger: 'blur' }
            ],
          riskTypeName:[
                { validator: validateRiskTypeName, trigger: 'blur' }
            ]
        }
    }
  },
    /*created () {
        this.queryRiskList();
    },*/
  computed: {
    riskTypeNode (){
      return this.$store.state.risk.riskTypeNode;
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
      'setHeightContent',/*将获取到的可读高度 存放到VUEX中进行换算*/
      'saveRiskTreeNode'
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
      queryRiskList() {
          //列表查询
          let info = {
              userCode: Cookies.get('userCode'),
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              name:this.queryCondition.name,
              level:this.queryCondition.level,
              queryCode:this.riskTypeNode.queryCode
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/risk/risk/queryRiskListByPage',
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
                      this.tableData = response.data.data.list;
                      this.resetTable();
                  }
              }
          ).catch(

          )
      },
      clickQueryBtn (){// 点击查询按钮
        this.pageNum=1;
        this.queryRiskList();
        
    },
      clickClearBtn (){// 点击清除查询按钮
        // this.$refs[name].resetFields();
        this.queryCondition.name='';
        this.queryCondition.riskTypeName='';
        this.pageNum=1;
        this.queryRiskList();
    },
    risk_clickAddBtn (){// 点击新增按钮
      if(this.treeSelected&&this.riskTypeNode&&this.riskTypeNode.id){
          this.$refs.maintain.addEditStatus='add';//设置新增编辑状态
          this.$refs.maintain.reSetInfo(this.riskTypeNode);
        //   this.$refs.maintain.riskInfo={};
        //   this.$refs.maintain.riskInfo.riskTypeId=this.riskTypeNode.id;
        //   this.$refs.maintain.riskInfo.riskTypeName=this.riskTypeNode.name;
        //   this.$refs.maintain.riskInfo.cycleType= '1';
        //   this.$refs.maintain.riskInfo.level='null';
        this.$refs.maintain.$refs['riskInfo'].resetFields();
          this.$refs.maintain.getLevelData();
          this.$refs.maintain.riskModalStatus=true;
      }else{
        this.$Message.error('请选择某一风险隐患类型.');
      }
    },
    risk_clickEditBtn (){// 点击编辑按钮
      if(this.$refs.maintain.riskInfo.id){
          this.$refs.maintain.addEditStatus='edit';//设置新增编辑状态
          this.$refs.maintain.getDetail(this.$refs.maintain.riskInfo.id);
          this.$refs.maintain.getLevelData();
          this.$refs.maintain.riskModalStatus=true;
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
    risk_clickTableRow (data,index){// 点击表格每一行
        this.$refs.maintain.riskInfo=data;
        this.$refs.maintain.riskInfo.level = data.level;
        this.$refs.accident.accidentInfo.sourceId=data.id;
        this.$refs.accident.accidentInfo.sourceType=1;
        this.$refs.monitor.monitorInfo.objId=data.id;
        this.$refs.monitor.monitorInfo.objType=1;
        this.record=data;
    },
    risk_clickDeleteBtn (){// 点击删除按钮
      if(this.record.id){
          this.$refs.maintain.deleteMaintain(this.record.id);
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
    risk_clickDisasterBtn (){ // 点击诱发事故按钮
      if(this.$refs.accident.accidentInfo.sourceId){
          this.$refs.accident.pageNum=1;
          this.$refs.accident.accidentData='';
          let sourceId = this.$refs.accident.accidentInfo.sourceId;
          let sourceType = this.$refs.accident.accidentInfo.sourceType;
          this.$refs.accident.accidentInfo={sourceId:sourceId,sourceType:sourceType};
          this.$refs.accident.queryAccidentList();
          this.$refs.accident.riskDisasterModalStatus=true;
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
    risk_clickMonitorBtn (){ // 点击监测项按钮
      if(this.$refs.monitor.monitorInfo.objId){
          this.$refs.monitor.pageNum=1;
          this.$refs.monitor.monitorData='';
          let objId = this.$refs.monitor.monitorInfo.objId;
          let objType = this.$refs.monitor.monitorInfo.objType;
          this.$refs.monitor.monitorInfo={objId:objId,objType:objType};
          this.$refs.monitor.queryMonitorList();
          this.$refs.monitor.riskMonitorModalStatus=true;
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
    clickPage (pageNum){//点击分页
        this.pageNum=pageNum;
        this.queryRiskList();
    },
    initPage(){
      this.pageShow = false;
      this.totalSize = 0;
      this.pageNum = 1;
    },
    resetTable(){
          this.$refs.maintain.riskInfo.id=null;
          this.$refs.accident.accidentInfo={};
          this.$refs.monitor.monitorInfo={};
      },
    resetAll(){
      this.treeSelected = false;
      this.tableData = [];
      this.record={};
      this.resetTable();
      this.initPage();
      }
  }
}
</script>

