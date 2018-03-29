<template>
  <div>
    <div class="ds-widget-box">
      <div class="ds-widget-title">
          <span class="ds-title-icon"></span>
          <h2>查询条件</h2>
      </div>
      <div class="ds-widget-cont">
        <Form ref="queryCondition" :rules="ruleCustom" :model="queryCondition" :label-width="100" inline>
          <FormItem label="事件类型:" prop="incidentTypeName">
            <Input placeholder="请输入事件类型." v-model="queryCondition.incidentTypeName" />
          </FormItem>
          <FormItem label="事件等级:" :label-width="100" prop="incidentLevelName">
            <Input placeholder="请输入事件等级." v-model="queryCondition.incidentLevelName" />
          </FormItem>
          <FormItem label="案例名称:" :label-width="100" prop="name">
            <Input placeholder="请输入案例名称." v-model="queryCondition.name" />
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
            <Button type="success" @click="clickAddBtn">新增</Button>
            <Button type="warning" @click="clickEditBtn">修改</Button>
            <Button type="info" @click="clickDisposeBtn">处置信息维护</Button>
            <Button @click="clickDetailBtn" style="background: #fff;">详情</Button>
              <span v-if="record.id">
                            <Poptip placement="top-end" confirm title="您确认删除这条内容吗？" @on-ok="clickDeleteBtn">
                                <Button type="error">删除</Button>
                            </Poptip>
                        </span>
              <span v-else>
                <Button type="error" @click="clickDeleteBtn">删除</Button>
             </span>
            <!--<Button type="error" @click="clickDeleteBtn">删除</Button>-->
          </div>
      </div>
      <div class="ds-widget-cont" :style='height'>
        <Table :columns="columns1" :data="tableData" ref="lawsTable" border highlight-row @on-row-click="clickTableRow" :data-json="tableHeight"></Table>
        <div class="ds-page-body" v-if="pageShow">
          <Page :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage"></Page>
        </div>
      </div>
    </div>

    <case-maintain ref="maintain" @maintain-parent="queryCaseList"></case-maintain>
    <case-dispose-maintain ref="dispose"></case-dispose-maintain>
    <case-detail ref="detail"></case-detail>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import caseMaintain from './caseMaintain'
import caseDisposeMaintain from './caseDisposeMaintain'
import caseDetail from './caseDetail'
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      caseMaintain,
      caseDisposeMaintain,
      caseDetail,
      verify
  },
  data() {
      const validateName = (rule, value, callback) => {
          if (value&&!verify.name.test(value)) {
              return callback(new Error('名称不能包含特殊符号，20字符以内'));
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
      const validateIncidentLevelName = (rule, value, callback) => {
          if (value&&!verify.name.test(value)) {
              return callback(new Error('不能包含特殊符号，20字符以内'));
          }else {
              callback()
          }
      };
    return {
        record:{},
        caseDetail:false,
        incidentType: [
          {
            value: 1,
            label: '自然灾害'
          }
        ],
        incidentLevel: [
          {
            value: 1,
            label: '一级'
          }
        ],
        columns1: [
          {
              title: '序号',
              width: 80,
              align:'center',
              type: 'index'
          },
          {
              title: '案例名称',
              align:'center',
              key: 'name'
          },
          {
              title: '事件类型',
              align:'center',
              key: 'incidentTypeName'
          },
          {
              title: '事件等级',
              align:'center',
              key: 'incidentLevelName'
          },
          {
              title: '事发地址',
              align:'center',
              key: 'address'
          },
          {
              title: '事发时间',
              align:'center',
              key: 'occurTime'
          },
          {
              title: '事发区域',
              align:'center',
              key: 'regionName'
          }
      ],
        queryCondition:{
            title:'',
            incidentTypeId:'',
            incidentLevelId:'',
            name:''
        },
        tableData: [],
        pageShow:false,
        totalSize: null,
        pageNum: 1,
        height: {
            // margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
            height: '',
            //'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
        },
        ruleCustom: {
            incidentTypeName:[
                { validator: validateIncidentTypeName, trigger: 'blur' }
            ],
            incidentLevelName:[
                { validator: validateIncidentLevelName, trigger: 'blur' }
            ],
            name:[
                { validator: validateName, trigger: 'blur' }
            ],

        }
    }
  },
    created () {
        this.queryCaseList();
        const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setHeightContent(h)
        this.tableHeightMessage(160) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
    },
  computed: {
      //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
      pageSize() {
          return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
      },
      tableHeight() {
          this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
          return this.height.height
      }
  },
  methods: {
    ...mapActions([
        'changeModalStatus',// 改变弹出框状态
        'getLawsTableList',// 获取表格列表
        'setInfoWhereClick',//点击表格某一行把值赋上去
        'deleteLawsRecord',// 删除一行记录
        'setAddEditStatus',// 设置新增编辑状态
        'setQueryConditions',//设置查询参数
        'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
        'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ]),
      queryCaseList() {
          //列表查询
          this.record='';
          let info = {
              userCode: Cookies.get('userCode'),
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              name:this.queryCondition.name,
              incidentTypeName:this.queryCondition.incidentTypeName,
              incidentLevelName:this.queryCondition.incidentLevelName
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/case/queryCaseListByPage',
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
                this.queryCaseList();
                this.record='';
            } else {
                this.$Message.error('字段输入不合法');
            }
        })
    },
    clickClearBtn (name){//点击清除查询按钮
        this.$refs[name].resetFields();
        this.queryCondition.name='';
        this.queryCondition.incidentTypeId='';
        this.queryCondition.incidentLevelId='';
        this.pageNum=1;
        this.queryCaseList();
        this.record='';
    },
    clickAddBtn (){// 点击新增按钮
        this.$refs.maintain.addEditStatus='add';
        this.$refs.maintain.caseInfo={};
        this.$refs.maintain.caseInfo.incidentLevelId="null";
        this.$refs.maintain.caseInfo.occurTime="";
        this.$refs.maintain.$refs['caseInfo'].resetFields();
        this.$refs.maintain.modalStatus=true;
    },
      clickDetailBtn(){
        this.$refs.detail.queryTime();
        this.$refs.detail.modalStatus=true;
      },
    clickEditBtn (){// 点击编辑按钮
      if(this.record && this.record.id){
          this.$refs.maintain.addEditStatus='edit';
          this.$refs.maintain.caseInfo=this.record;
          this.$refs.maintain.getDetail(this.record.id);
          this.$refs.maintain.modalStatus=true;
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
      clickDisposeBtn (){// 点击处置记录维护
          if(this.record && this.record.id){
              this.$refs.dispose.disposeInfo={};
              this.$refs.dispose.disposeInfo.caseId =this.record.id;
              this.$refs.dispose.queryDisposeList();
              this.$refs.dispose.modalStatus=true;
          }else{
              this.$Message.error('请选择某一行记录.');
          }

      },
    clickTableRow (data,index){// 点击表格每一行
        this.record=data;
        this.$refs.detail.caseBaseInfo=data;
    },
      clickDeleteBtn () {// 点击删除按钮
          if (this.record && this.record.id) {
              this.$refs.maintain.delete(this.record.id);
          } else {
              this.$Message.error('请选择某一行记录.');
          }
      },
    clickPage (num){//点击分页
        this.pageNum=num;
        this.queryCaseList();
    }
  }
}
</script>

