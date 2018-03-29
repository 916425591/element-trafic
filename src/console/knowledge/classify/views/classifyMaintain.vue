<template>
  <div>
    <Modal v-model="modalStatus" :mask-closable="false" width="800" on-visible-change="clickCloseModel" @on-cancel="clickCancelBtn('classifyInfo')" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <span>分类分级维护</span>
        </p>
        <div>
          <Form ref="classifyInfo" :rules="ruleCustom"  :model="classifyInfo" :label-width="100">
            <Row>
              <i-col span="12">
                <FormItem label="事件类型:" v-if="addEditStatus === 'add'">
                  <i-input placeholder="请选择事件类型." style="width: 100%" v-model="classifyInfo.incidentTypeName" readonly ></i-input>
                </FormItem>
                <FormItem label="事件类型:" v-if="addEditStatus === 'edit'" prop="incidentTypeName">
                  <i-input placeholder="请选择事件类型."  style="width: 100%" v-model="classifyInfo.incidentTypeName" readonly @on-focus="openIncident" @on-click="openIncident"></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="事件等级:" prop="incidentLevelId">
                  <Select v-model="classifyInfo.incidentLevelId">
                    <Option v-for="item in levelData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="标题:" prop="title">
                  <i-input placeholder="请输入标题." style="width: 100%" v-model="classifyInfo.title"></i-input>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="关键字:" prop="keywords">
                  <i-input placeholder="请输入关键字." style="width: 100%" v-model="classifyInfo.keywords"></i-input>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="文件内容:" prop="content">
                  <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="classifyInfo.content"></i-input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" @click="clickConfirmBtn('classifyInfo')">确定</Button>
          <Button type="ghost" @click="clickCancelBtn('classifyInfo')">取消</Button>
        </div>
    </Modal>
    <classify-type></classify-type>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </div>
</template>
<script>
import classifyType from './classifyType'
import { mapActions } from 'vuex'
import tree from '@/common/components/treeModal/tree'
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
    classifyType,
      verify,
    tree
  },
  data () {
      const validateIncidentLevelId = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择事件等级'));
          }else {
              callback()
          }
      };
      const validateKeywords = (rule, value, callback) => {
          if (verify.regChFig.test(value)||value.replace(/(^\s*)|(\s*$)/g,"")==='') {
              callback()
          }else {
              return callback(new Error('不能输入特殊符号'));
          }
      };
      const validateTitle = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入标题'));
          }else if(verify.name.test(value)){
              callback()
          }else {
              return callback(new Error('请输入汉字、数字、英文字母的组合'))
          }
      };
      const validateContent = (rule, value, callback) => {
          if (value) {
              callback()
          }else {
              return callback(new Error('文件内容不能为空'));
          }
      };
      const validateIncidentTypeName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择事件类型'));
          }else {
              callback()
          }
      };
    return {
        treeMode:false,
        addEditStatus:'',
        modalStatus:false,
        record:'',
        levelData: [],
        classifyInfo:{
            content:'',
            incidentTypeName:'',
            incidentLevelId: null,
            incidentLevelName:'',
            incidentTypeId:'',
            keywords:'',
            knowledgeTypeId:'',
            title:''
        },
        ruleCustom: {
            incidentTypeName: [
                { required: true, validator: validateIncidentTypeName, trigger: 'blur' }
            ],
            keywords: [
                { required: false, validator: validateKeywords, trigger: 'blur' }
            ],
            content: [
                { required: true, validator: validateContent, trigger: 'blur' }
            ],
            incidentLevelId: [
                { required: true, validator: validateIncidentLevelId, trigger: 'change' }
            ],
            title: [
                { required: true, validator: validateTitle, trigger: 'blur' }
            ],
        }
    };
  },
    created () {
        this.queryIncidentLevel();
    },

  computed:{
      getSelectedTreeNode () {
          return this.$store.state.classify.nodes;
      }
  },
  methods: {
    ...mapActions([
      'changeModalStatus',// 改变模态框状态
      'saveAddClassify',// 新增保存
      'saveEditClassify',// 编辑保存
      'changeTypeModalStatus',//改变类型弹出框状态
      'dateFormat',//格式化时间
      'getClassifyTableList',// 获取表格列表
        'saveDemoData',
    ]),
      resetMaintain(){
          this.record = {};
          this. classifyInfo={
              content:'',
                  incidentTypeName:'',
                  incidentLevelId: null,
                  incidentLevelName:'',
                  incidentTypeId:'',
                  keywords:'',
                  knowledgeTypeId:'',
                  title:''
          };
          this.$refs['classifyInfo'].resetFields();
      },
      getDetail(id){
          //获取详情查询
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/hierarchical/getHierarchicalDetail',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.classifyInfo = response.data.data;
                      }
                  }
              }
          ).catch(

          )
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
                  }
              }
          ).catch(

          )
      },
      openIncident () {
          //文件树
          let TreeInfo = {
              title: '事件类型',
              treeMultiple: false,
              additional: 'incidentType',
              request: 'post',
              queryInfo: {
                  userCode: Cookies.get('userCode')
              },
              url: this.$store.state.userCode.url+'/platform/public/queryIncidentTypeTree4New'
          };
          this.saveDemoData(TreeInfo);
          this.treeMode = true;
      },
    async clickConfirmBtn (name){// 点击确认按钮
        this.$refs[name].validate((valid) => {
            if (valid) {
              if(this.addEditStatus === 'add'){//新增
                  this.saveFile(name);
              }else if(this.addEditStatus === 'edit'){//编辑
                this.update(name);
              }
            } else {
                this.$Message.error('请先完成必填项！');
            }
        })
    },
      saveFile(name) {
          //列表查询
          let info={
              userCode:Cookies.get('userCode'),
              incidentLevelId:this.classifyInfo.incidentLevelId,
              incidentTypeId:this.classifyInfo.incidentTypeId,
              keywords:this.classifyInfo.keywords,
              content:this.classifyInfo.content,
              title:this.classifyInfo.title
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/hierarchical/addHierarchical',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.classifyInfo={};
                      this.modalStatus = false;
                      this.$emit('maintain-parent');
                      this.$refs[name].resetFields();
                  }
              }
          ).catch(

          )
      },
      update(name) {
          //列表查询
          let info={
              userCode:Cookies.get('userCode'),
              incidentLevelId:this.classifyInfo.incidentLevelId,
              incidentTypeId:this.classifyInfo.incidentTypeId,
              keywords:this.classifyInfo.keywords,
              content:this.classifyInfo.content,
              title:this.classifyInfo.title,
              knowledgeTypeId:this.classifyInfo.knowledgeTypeId,
              id:this.classifyInfo.id
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/hierarchical/modifyHierarchical',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      this.$emit('maintain-parent');
                      this.$refs[name].resetFields();
                  }
              }
          ).catch(

          )
      },
    clickCancelBtn (name){// 点击取消按钮
        this.$refs[name].resetFields();
        if(this.addEditStatus==='add'){
            this.classifyInfo={};
        }
        this.modalStatus = false;
    },
    clickCloseModel (){ // 点击关闭弹出框
      alert(11)
    },
    choiceFileType (){//修改时弹框选择文件类型
      this.changeTypeModalStatus(true)
    },
    //格式化时间
    changeDateFormat (date){
      this.dateFormat(date);
    },
      treeModalClose(){
          this.treeMode=false;
      },
      delete(id){
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/hierarchical/removeHierarchical',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      this.$emit('maintain-parent')
                  }
              }
          ).catch(

          )
      },
      treeModalSave(data, type){
          if ( type === 'incidentType') {
              this.classifyInfo.incidentTypeName=data[0].title;
              this.classifyInfo.incidentTypeId=data[0].id;

              this.$refs.classifyInfo.validateField('incidentTypeName', valid => {
                  console.log(valid);
              });
          }
          this.treeModalClose();
      }
  }
}
</script>

