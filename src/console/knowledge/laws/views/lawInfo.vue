<template>
  <!-- 法律法规库 -->
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
                  <form-item label="文件标题: " prop="name">
                      <Input placeholder="请输入文件标题." v-model="queryCondition.name" />
                  </form-item>
              </i-col>
              <i-col span="6">
                  <form-item label="文件层级:">
                      <Select v-model="queryCondition.fileLevel">
                          <Option v-for="item in fileLevelData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                  </form-item>
              </i-col>
              <i-col span="6">
                  <form-item label="关键字:" prop="keywords">
                      <Input placeholder="请输入文件关键字." v-model="queryCondition.keywords" />
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
              <span v-if="lawTableInfo.id">
                            <Poptip placement="top-end" confirm title="您确认删除这条内容吗？" @on-ok="clickDeleteBtn">
                                <Button type="error">删除</Button>
                            </Poptip>
                        </span>
              <span v-else>
                <Button type="error" @click="clickDeleteBtn">删除</Button>
             </span>

          </div>
      </div>
      <div class="ds-widget-cont" :style='height'>
        <Table :columns="columns1" :data="tableData" ref="lawsTable" border highlight-row @on-row-click="clickTableRow" :data-json="tableHeight"></Table>
        <div class="ds-page-body" v-if="pageShow">
          <Page :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage"></Page>
        </div>
      </div>
    </div>

    <law-maintain ref="maintain" @maintain-parent="queryFileList"></law-maintain>

  </div>
</template>
<script>
import axios from 'axios'
import { mapActions } from 'vuex';
import lawMaintain from './lawMaintain'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      lawMaintain,
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
      const validateName = (rule, value, callback) => {
          if (value&&!verify.name.test(value)) {
              return callback(new Error('名称不能包含特殊符号，20字符以内'));
          }else {
              callback()
          }
      };
      return {
          lawModal: false,
          columns1: [
              {
                  title: '序号',
                  width: 80,
                  align:'center',
                  type: 'index'
              },
              {
                  title: '文件标题',
                  align:'center',
                  key: 'name'
              },
              {
                  title: '文件号',
                  align:'center',
                  key: 'fileCode'
              },
              {
                  title: '文件类型',
                  align:'center',
                  key: 'fileTypeName'
              },
              {
                  title: '文件层级',
                  align:'center',
                  key: 'fileLevelName'
              },
              {
                  title: '发布单位',
                  align:'center',
                  key: 'publishOrgName'
              },
              {
                  title: '发布时间',
                  align:'center',
                  key: 'publishDate'
              },
              {
                  title: '关键字',
                  align:'center',
                  key: 'keywords'
              }
          ],
          queryCondition:{
              name:'',
              fileLevel:'null',
              keywords:''
          },
          tableData:[],
          pageShow:false,
          totalSize: null,
          treeSelected:false,
          pageNum: 1,
          lawTableInfo:{},
          nodes:null,
          fileLevelData:[
                {
                    value:'null',
                    label:'---请选择---'
                },
                {
                    value:1,
                    label:'国家级'
                },
                {
                    value:2,
                    label:'省部级'
                },
                {
                    value:3,
                    label:'地市级'
                },
                {
                    value:4,
                    label:'县市级'
                },
                {
                    value:5,
                    label:'乡镇级'
                }
            ],
          height: {
                margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
                height: '',
                //'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
            },
          ruleCustom: {
              keywords:[
                  { validator: validateKeywords, trigger: 'blur' }
              ],
              name:[
                  { validator: validateName, trigger: 'blur' }
              ],
          }
        }
  },
  computed: {
    lawsTableList () {
      return this.$store.state.laws.lawsTableList;
    },
    lawsInfo (){
      return this.$store.state.laws.lawsInfo;
    },
    lawsFileTypeInfo (){
      return this.$store.state.laws.lawsFileTypeInfo;
    },
    returnCode (){
      return this.$store.state.laws.returnCode;
    },
      getSelectedTreeNode () {
          return this.$store.state.laws.nodes;
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
        const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setHeightContent(h)
        this.tableHeightMessage(160) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
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
    queryFileList() {
        this.lawTableInfo='';
        this.$refs.maintain.fileRecord={};
        //列表查询
        let info = {
            userCode: Cookies.get('userCode'),
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name:this.queryCondition.name,
            fileLevel:this.queryCondition.fileLevel,
            keywords:this.queryCondition.keywords,
            queryCode:this.$store.state.laws.nodes.queryCode
        };
        axios({
            method: 'post',
            url: this.$store.state.userCode.url+'/knowledgeBank/file/queryFileByPage',
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
                    this.tableData = this.formatTableDataAndFileLevel(response.data.data.list);
                }
            }
        ).catch(

        )
    },
      resetInfo(){
          this.tableData = [];
          this.lawTableInfo = {};
          this.$refs.maintain.resetMaintain();
          this.initPage();
      },
      initPage(){
          this.totalSize = null;
          this.pageNum = 1;
          this.pageShow = false;
      },
      /**
       * 格式化日期
       * @param data
       * @returns {*}
       */
      formatTableDataAndFileLevel(data){
        for(let i=0;i<data.length;i++){
            if(data[i].publishDate){
                data[i].publishDate = data[i].publishDate.slice(0,10);
            }
        }
        return data;
      },
      clickQueryBtn (name){// 点击查询按钮
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.pageNum=1;
                this.queryFileList();
                this.lawTableInfo={};
            } else {
                this.$Message.error('字段输入不合法');
            }
        })
    },
      clickClearBtn (name){//点击清除查询按钮
        this.$refs[name].resetFields();
        this.queryCondition.name='';
        this.queryCondition.fileLevel='null';
        this.queryCondition.keywords='';
        this.pageNum=1;
        this.queryFileList();
        this.lawTableInfo={};
    },
      clickAddBtn (){// 点击新增按钮
      if(this.treeSelected&&this.getSelectedTreeNode.id && this.getSelectedTreeNode.name){
          localStorage.editorContentLaw = '';
          this.$refs.maintain.init();
          this.$refs.maintain.addEditStatus='add';
          this.$refs.maintain.lawsInfo.fileTypeName=this.$store.state.laws.nodes.name;
          this.$refs.maintain.lawsInfo.publishOrg='';
          this.$refs.maintain.lawsInfo.publishOrgName='';
          this.$refs.maintain.cleanForm();
          localStorage.editorContentLaw = '';
          tinymce.get('tinymceEditer').setContent(localStorage.editorContentLaw);
          this.$refs.maintain.lawsInfo.content = ''
          console.log('add',localStorage.editorContentLaw)
        this.$refs.maintain.modalStatus=true;//显示弹出框
      }else{
        this.$Message.error('请选择某一法律法规类型.');
      }
      
    },
      clickEditBtn () {// 点击编辑按钮
        console.log('lawTableInfo', this.lawTableInfo)
        if (this.lawTableInfo && this.lawTableInfo.id) {
            this.$refs.maintain.addEditStatus = 'edit';
            this.$refs.maintain.init();
            this.$refs.maintain.getDetail(this.lawTableInfo.id);
            this.$refs.maintain.modalStatus = true;//显示弹出框
        }else{
            this.$Message.error('请选择某一记录.');
        }
      // if(this.lawsInfo && this.lawsInfo.id){
      //   this.setAddEditStatus('edit');//设置新增编辑状态
      //   this.changeModalStatus(true);
      // }else{
      //   this.$Message.error('请选择某一行记录.');
      // }
    },
      clickTableRow (data,index){// 点击表格每一行
        this.lawTableInfo=data;
        this.$refs.maintain.fileRecord=data;
        this.$refs.maintain.lawsInfo.id=data.id;
        this.$refs.maintain.lawsInfo.fileType=data.fileTypeName;
        this.$refs.maintain.lawsInfo.name=data.name;
        this.$refs.maintain.lawsInfo.fileCode=data.fileCode;
        this.$refs.maintain.lawsInfo.keywords=data.keywords;
        this.$refs.maintain.lawsInfo.publishOrg=data.publishOrg;
        this.$refs.maintain.lawsInfo.fileLevel=data.fileLevel;
        this.$refs.maintain.lawsInfo.publishDate=data.publishDate;
        this.$refs.maintain.lawsInfo.content=data.content;
        localStorage.editorContentLaw = data.content ? data.content : ''
        console.log('localStorage.editorContentLaw', localStorage.editorContentLaw)
        console.log('content',data.content)
    },
      clickDeleteBtn (){// 点击删除按钮
        console.log(this.lawTableInfo)
      if(this.lawTableInfo && this.lawTableInfo.id){
          this.$refs.maintain.delete(this.lawTableInfo.id);
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
      clickPage (num){//点击分页
        this.pageNum=num;
        this.queryFileList();
    },
    setTreeSelected(param){
      this.treeSelected = param;
  }
  }
}
</script>

