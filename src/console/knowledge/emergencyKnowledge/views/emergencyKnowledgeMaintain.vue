<template>
  <div>
    <Modal v-model="modalStatus" :mask-closable="false" width="800" on-visible-change="clickCloseModel" @on-cancel="clickCancelBtn('emergencyInfo')" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <span>应急知识维护</span>
        </p>
        <div>
          <Form ref="emergencyInfo" :rules="ruleCustom" :model="emergencyInfo" :label-width="90">
            <Row>
              <i-col span="12">
                <FormItem label="知识分类:" v-if="addEditStatus === 'add'">
                  <i-input placeholder="请输入知识类型." style="width: 100%" v-model="emergencyInfo.knowledgeTypeName" readonly></i-input>
                </FormItem>
                <FormItem label="知识分类:" v-if="addEditStatus === 'edit'" prop="knowledgeTypeName">
                  <i-input placeholder="请输入事件类型." style="width: 100%" v-model="emergencyInfo.knowledgeTypeName" readonly @on-focus="openKnowledgeType" @on-click="openKnowledgeType"></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="事件类型:" prop="incidentTypeName">
                  <i-input placeholder="请输入事件类型." style="width: 100%" v-model="emergencyInfo.incidentTypeName" readonly @on-focus="openIncident" @on-click="openIncident"></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="事件等级:" prop="incidentLevelId">
                  <Select v-model="emergencyInfo.incidentLevelId">
                    <Option v-for="item in levelData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="12">
              <FormItem label="标题:" prop="title">
                <i-input placeholder="请输入关键字." style="width: 100%" v-model="emergencyInfo.title"></i-input>
              </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="关键字:" prop="keywords">
                  <i-input placeholder="请输入关键字." style="width: 100%" v-model="emergencyInfo.keywords"></i-input>
                </FormItem>
              </i-col>
              <i-col span="24" >
                <FormItem label="文件内容:" prop="content">
                  <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="emergencyInfo.content"></i-input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" @click="clickConfirmBtn('emergencyInfo')">确定</Button>
          <Button type="ghost" @click="clickCancelBtn('emergencyInfo')">取消</Button>
        </div>
    </Modal>
    <law-type></law-type>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </div>
</template>
<script>
import lawType from './emergencyKnowledgeType'
import { mapActions } from 'vuex'
import tree from '@/common/components/treeModal/tree'
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      lawType,
      tree,
      verify
  },
  data () {

      const validateKnowledgeTypeName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择知识库类型'));
          }else {
              callback()
          }
      };
      const validateIncidentTypeName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择事件类型'));
          }else {
              callback()
          }
      };
      const validateIncidentLevelId = (rule, value, callback) => {
          if (value === 'null') {
              return callback(new Error('请选择事件等级'));
          }else {
              callback()
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
      const validateKeywords = (rule, value, callback) => {
          if (verify.regChFig.test(value)||value.replace(/(^\s*)|(\s*$)/g,"")==='') {
              callback()
          }else {
              return callback(new Error('不能输入特殊符号'));
          }
      };
      const validateContent = (rule, value, callback) => {
          if (value) {
              callback()
          }else {
              return callback(new Error('文件内容不能为空'));
          }
      };
      return {
          record:'',
          addEditStatus:'',
          emergencyInfo:{},
          modalStatus:false,
          treeMode:false,
          levelData:"",
          ruleCustom: {
              knowledgeTypeName: [
                  { required: true,validator: validateKnowledgeTypeName, trigger: 'blur' }
              ],
              incidentTypeName: [
                  { required: true,validator: validateIncidentTypeName, trigger: 'blur' }
              ],
              incidentLevelId: [
                  { required: true,validator: validateIncidentLevelId, trigger: 'blur' }
              ],
              title: [
                  { required: true,validator: validateTitle, trigger: 'blur' }
              ],
              keywords: [
                  { required: false,validator: validateKeywords, trigger: 'blur' }
              ],
              content: [
                  { required: true,validator: validateContent, trigger: 'blur' }
              ],
          }
      };
  },
  computed:{
    lawsFileTypeInfo (){
      return this.$store.state.laws.lawsFileTypeInfo;
    },
  },
    created () {
        this.queryIncidentLevel();
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
    ]),
      resetMaintain(){
          this.record = {};
          this. emergencyInfo={};
          this.$refs['emergencyInfo'].resetFields();
      },
      getDetail(id){
          //获取详情查询
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/knowledge/getKnowledgeById',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.emergencyInfo = response.data.data;
                          if(!this.emergencyInfo.incidentLevelId){
                              this.emergencyInfo.incidentLevelId='null'
                          }
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
                      this.levelData.unshift({id:'null',name:'---请选择---'});
                      console.log(this.levelData)
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
      openKnowledgeType () {
          //知识树
          let TreeInfo = {
              title: '请选择知识类型',
              treeMultiple: false,
              additional: 'knowledgeType',
              request: 'post',
              queryInfo: {
                  userCode: Cookies.get('userCode'),
                  category:3
              },
              url: this.$store.state.userCode.url+'/platform/public/queryKnowledgeTree4New'
          };
          this.saveDemoData(TreeInfo);
          this.treeMode = true;
      },
      addEmergency() {
          //列表查询
          let info=this.emergencyInfo;
          info.userCode=Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/knowledge/addKnowledge',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      this.$emit('maintain-parent');
                  }
              }
          ).catch(

          )
      },
      updateEmergency() {
          //列表查询
          let info=this.emergencyInfo;
          info.userCode=Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/knowledge/updateKnowledge',
              data: info
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
    async clickConfirmBtn (name){// 点击确认按钮
        this.$refs[name].validate((valid) => {
            if (valid) {
              if(this.addEditStatus === 'add'){//新增
                this.addEmergency();
              }else if(this.addEditStatus === 'edit'){//编辑
                this.updateEmergency();
              }else{

              }
            } else {
                this.$Message.error('请先完成必填项！');
            }
        })
    },
    clickCancelBtn (name){// 点击取消按钮
        this.$refs[name].resetFields();
        if(this.addEditStatus==='add'){
            this.emergencyInfo={};
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
              url: this.$store.state.userCode.url+'/knowledgeBank/knowledge/deletedKnowledge',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      this.$emit('maintain-parent');
                  }
              }
          ).catch(

          )
      },
      treeModalSave(data, type){
          if ( type === 'knowledgeType') {
              this.emergencyInfo.knowledgeTypeName=data[0].title;
              this.emergencyInfo.knowledgeTypeId=data[0].id;

              this.$refs.emergencyInfo.validateField('knowledgeTypeName', valid => {
                  console.log(valid);
              });
          }else if(type === 'incidentType'){
              this.emergencyInfo.incidentTypeName=data[0].title;
              this.emergencyInfo.incidentTypeId=data[0].id;

              this.$refs.emergencyInfo.validateField('incidentTypeName', valid => {
                  console.log(valid);
              });
          }
          this.treeModalClose();
      }
  }

}
</script>

