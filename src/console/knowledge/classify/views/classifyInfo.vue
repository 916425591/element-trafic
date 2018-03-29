<template>
  <div>
    <div class="ds-widget-box">
      <div class="ds-widget-title">
          <span class="ds-title-icon"></span>
          <h2>查询条件</h2>
      </div>
      <div class="ds-widget-cont">
        <i-form ref="queryCondition" :rules="ruleCustom" :model="queryCondition" :label-width="80">
          <Row>
              <i-col span="6">
                  <form-item label="标题: " prop="title">
                      <Input placeholder="请输入标题." v-model="queryCondition.title" />
                  </form-item>
              </i-col>
              <i-col span="6">
                  <form-item label="事件等级:">
                      <Select v-model="queryCondition.incidentLevelId">
                          <Option v-for="item in levelData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                      </Select>
                  </form-item>
              </i-col>
              <i-col span="6">
                  <form-item label="关键字:" prop="keywords">
                      <Input placeholder="请输入关键字." v-model="queryCondition.keywords" />
                  </form-item>
              </i-col>
              <i-col span="6">
                <form-item label="">
                  <Button type="primary" @click="clickQueryBtn('queryCondition')">查询</Button>
                  <Button type="default" @click="clickClearBtn('queryCondition')">清空查询</Button>
                </form-item>
              </i-col>
          </Row>
        </i-form>
      </div>
      <div class="ds-widget-title">
          <span class="ds-title-icon"></span>
          <h2>查询列表</h2>
          <div class="ds-fload-right">
            <Button type="success" @click="clickAddBtn">新增</Button>
            <Button type="warning" @click="clickEditBtn">修改</Button>
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
      <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
        <Table :columns="columns1" :data="tableData" ref="classifyTable" border highlight-row @on-row-click="clickTableRow"></Table>
        <div class="ds-page-body" v-if="pageShow">
          <Page :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage"></Page>
        </div>
      </div>
    </div>
    <!--  -->
    <classify-maintain ref="maintain" @maintain-parent="queryHierarchical"></classify-maintain>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import classifyMaintain from './classifyMaintain'
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
    classifyMaintain,
      verify
  },
  data() {
      const validateKeywords = (rule, value, callback) => {
          if (value&&!verify.bankName.test(value)) {
              return callback(new Error('关键字不能包含特殊符号，80字符以内'));
          }else {
              callback()
          }
      };
      const validateTitle = (rule, value, callback) => {
          if (value&&!verify.name.test(value)) {
              return callback(new Error('名称不能包含特殊符号，20字符以内'));
          }else {
              callback()
          }
      };
      return {
          classifyInfo:{},
          columns1: [
          {
              title: '序号',
              width: 80,
              align:'center',
              type: 'index'
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
              title: '标题',
              align:'center',
              key: 'title'
          },
          {
              title: '关键字',
              align:'center',
              key: 'keywords'
          },
          {
              title: '内容',
              align:'center',
              key: 'content'
          }
      ],
          queryCondition:{
            title:'',
            incidentLevelId:'null',
            keywords:''
        },
          tableData:[],
          pageShow:false,
          totalSize: null,
          pageNum: 1,
          treeSelected: false,
          record: {},
          levelData:[],
          height: {
            height: '',
            //'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
        },
          ruleCustom: {
              keywords:[
                  { validator: validateKeywords, trigger: 'blur' }
              ],
              title:[
                  { validator: validateTitle, trigger: 'blur' }
              ],
          }
    }
  },
  computed: {
    classifyTableList () {
      return this.$store.state.classify.classifyTableList;
    },
    classifyFileTypeInfo (){
      return this.$store.state.classify.classifyFileTypeInfo;
    },
    returnCode (){
      return this.$store.state.classify.returnCode;
    },
      //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
      pageSize() {
          return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
      },
      tableHeight() {
          this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
          return this.height.height
      }
  },
    created () {
        this.queryIncidentLevel();
        const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setHeightContent(h)

        this.tableHeightMessage(160) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
    },
  methods: {
    ...mapActions([
        'changeModalStatus',// 改变弹出框状态
        'getClassifyTableList',// 获取表格列表
        'setInfoWhereClick',//点击表格某一行把值赋上去
        'deleteClassifyRecord',// 删除一行记录
        'setAddEditStatus',// 设置新增编辑状态
        'setQueryConditions',//设置查询参数
        'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
        'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ]),
      resetInfo(){
        this.tableData = [];
        this.classifyInfo = {};
        this.record = {};
        this.$refs.maintain.resetMaintain();
        this.initPage();
      },
      initPage(){
        this.pageShow = false;
        this.totalSize = 0;
        this.pageNum = 1;
      },
      queryIncidentLevel() {
          //事件等级查询
          let info={};
          info.userCode=Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/platform/public/queryIncidentLevel',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.levelData = response.data.data;
                      this.levelData.unshift({id:'null',name:'---请选择---'});
                  }
              }
          ).catch(

          )
      },
      queryHierarchical() {
          this.record='';
          this.$refs.maintain.classifyInfo={};
          //列表查询
          let info = {
              userCode: Cookies.get('userCode'),
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              title:this.queryCondition.title,
              incidentLevelId:this.queryCondition.incidentLevelId,
              keywords:this.queryCondition.keywords
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/hierarchical/queryHierarchicalByPage',
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
      queryHierarchical() {
          //列表查询
          let info = {
              userCode: Cookies.get('userCode'),
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              title:this.queryCondition.title,
              incidentLevelId:this.queryCondition.incidentLevelId,
              keywords:this.queryCondition.keywords,
              queryCode:this.$store.state.classify.nodes.queryCode
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/hierarchical/queryHierarchicalByPage',
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
                this.queryHierarchical();
                this.record='';
            } else {
                this.$Message.error('字段输入不合法');
            }
        })
    },
    clickClearBtn (name){//点击清除查询按钮
        this.$refs[name].resetFields();
        this.queryCondition.title='';
        this.queryCondition.keywords='';
        this.queryCondition.incidentLevelId='null';
        this.pageNum=1;
        this.queryHierarchical();
        this.record='';

    },
    clickAddBtn (){// 点击新增按钮
        if(this.treeSelected&&this.$store.state.classify.nodes.id){
            this.$refs.maintain.classifyInfo.incidentTypeName=this.$store.state.classify.nodes.name;
            this.$refs.maintain.classifyInfo.incidentTypeId=this.$store.state.classify.nodes.id;
            this.$refs.maintain.addEditStatus='add';//设置新增状态
            this.$refs.maintain.modalStatus=true;//弹出模态框
        }else{
            this.$Message.error('请选择某一事件类型.');
        }
    },
    clickEditBtn (){// 点击编辑按钮
      if(this.record && this.record.id){
          this.$refs.maintain.addEditStatus='edit';//设置新增状态
          this.$refs.maintain.record=this.record;
          this.$refs.maintain.getDetail(this.record.id);
          this.$refs.maintain.classifyInfo=this.record;
          this.$refs.maintain.modalStatus=true;//弹出模态框
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
    clickTableRow (data,index){// 点击表格每一行
        this.$refs.maintain.record=data;
        this.record=data;
    },
    async clickDeleteBtn () {// 点击删除按钮
        if (this.record && this.record.id) {
            this.$refs.maintain.delete(this.record.id);
        } else {
            this.$Message.error('请选择某一行记录.');
        }
    },
    clickPage (num){//点击分页
        this.pageNum=num;
        this.queryHierarchical();
    },
      setTreeSelected(param){
        this.treeSelected = param;
      }
  }
}
</script>

