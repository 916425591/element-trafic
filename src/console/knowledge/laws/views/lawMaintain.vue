<template>
  <div>
    <Modal v-model="modalStatus" :mask-closable="false" width="800" @on-cancel="clickCancelBtn('lawsInfo')" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <span>法律法规维护</span>
        </p>
        <div>
          <Form ref="lawsInfo" :rules="ruleCustom" :model="lawsInfo" :label-width="100">
            <Row>
              <i-col span="8">
                <FormItem label="文件类型:" v-if="addEditStatus === 'add'">
                  <i-input placeholder="请输入文件类型." style="width: 100%" v-model="lawsInfo.fileTypeName" readonly></i-input>
                </FormItem>
                <FormItem label="文件类型:" v-if="addEditStatus === 'edit'" prop="fileTypeName">
                  <i-input placeholder="请输入文件类型." style="width: 100%" v-model="lawsInfo.fileTypeName" readonly @on-focus="openIncident" @on-click="openIncident"></i-input>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="文件标题:" prop="name">
                  <i-input placeholder="请输入文件标题." style="width: 100%" v-model="lawsInfo.name"></i-input>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="文件号:" prop="fileCode">
                  <i-input placeholder="请输入文件号." style="width: 100%" v-model="lawsInfo.fileCode"></i-input>
                </FormItem>
              </i-col>
              <i-col span="16">
                <FormItem label="关键字:" prop="keywords">
                  <i-input placeholder="请输入关键字." style="width: 100%" v-model="lawsInfo.keywords"></i-input>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="发文单位:"  prop="publishOrgName">
                  <i-input placeholder="请输入发文单位." style="width: 100%" v-model="lawsInfo.publishOrgName" readonly @on-focus="openOrg" @on-click="openOrg"></i-input>
                </FormItem>
              </i-col>
              <i-col span="16">
                <FormItem label="文件层级:">
                  <RadioGroup v-model="lawsInfo.fileLevel">
                    <Radio label="1">国家级</Radio>
                    <Radio label="2">省部级</Radio>
                    <Radio label="3">地市级</Radio>
                    <Radio label="4">县市级</Radio>
                    <Radio label="5">乡镇级</Radio>
                  </RadioGroup>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="发布日期:"   prop="publishDate">
                  <DatePicker type="date" placeholder="请选择发布日期" style="width: 100%" format="yyyy-MM-dd" v-model="lawsInfo.publishDate" :editable="false"></DatePicker>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="文件内容:" prop="content">
                  <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
                  <!--<i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="lawsInfo.content"></i-input>-->
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" @click="clickConfirmBtn('lawsInfo')">确定</Button>
          <Button type="ghost" @click="clickCancelBtn('lawsInfo')">取消</Button>
        </div>
    </Modal>
    <law-type></law-type>
      <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </div>
</template>
<script>
import tinymce from 'tinymce';
import lawType from './lawType'
import { mapActions } from 'vuex'
import verify from '@/common/utils/verify'
import axios from 'axios'
import tree from '@/common/components/treeModal/tree'
import Cookies from 'js-cookie';

export default {
  components: {
    lawType,
      tree,
      verify
  },
  data () {
      const validateFileType = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择文件类型'));
          } else {
              callback()
          }
      };
      const validateName = (rule, value, callback) => {

          if (!value) {
              return callback(new Error('请输入文件标题'));
          } else if(verify.name.test(value)){
              callback()
          } else{
              return callback(new Error('请输入汉字、数字、英文字母的组合'))
          }
      };
      const validateFileCode = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入文件号'));
          } else if(verify.name.test(value)){
              callback()
          }else {
              return callback(new Error('请输入汉字、数字、英文字母的组合'))
          }
      };
      const validatePublishOrgName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择发文单位'));
          } else {
              callback()
          }
      };
      const validatePublishDate = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择发布日期'));
          } else {
              callback()
          }
      };
      const validateContent = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('文件内容不能为空'));
          } else {
              callback()
          }
      };
      const validateKeyWords = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('关键字不能为空'));
          } else {
              callback()
          }
      };
      return {
          addEditStatus:'',
          modalStatus: false,
          treeMode:false,
          fileRecord:{},
          lawsInfo:{
              fileType:'',
              name:'',
              fileCode:'',
              keywords:'',
              publishOrg:'',
              fileLevel:'',
              publishDate:'',
              content:''
          },
          ruleCustom: {
              keywords: [
                { required: true, validator: validateKeyWords, trigger: 'blur' }
              ],
              fileType: [
                  { validator: validateFileType, trigger: 'blur' }
              ],
              name:[
                  { required: true, validator: validateName, trigger: 'blur' }
              ],
              fileLevel:[
                  { validator: validateFileCode, trigger: 'blur' }
              ],
              publishOrgName:[
                  { required: true, validator: validatePublishOrgName, trigger: 'blur' }
              ],
              publishDate:[
                  { required: true, validator: validatePublishDate, trigger: 'change' }
              ],
              content:[
                  { required: true, validator: validateContent, trigger: 'blur' }
              ]
          }
      };
  },
  computed:{
    returnCode() {
      return this.$store.state.laws.returnCode
    },
    queryCondition (){
      return this.$store.state.laws.queryConditions;
    },
    lawsFileTypeInfo (){
      return this.$store.state.laws.lawsFileTypeInfo;
    },
    getSelectedTreeNode () {
      return this.$store.state.laws.nodes;
    }
  },
  created() {

  },
  methods: {
      resetMaintain(){
          this.fileRecord = {};
          this.lawsInfo = {
              fileType:'',
              name:'',
              fileCode:'',
              keywords:'',
              publishOrg:'',
              fileLevel:'',
              publishDate:'',
              content:''
          };
          this.$refs['lawsInfo'].resetFields();
      },
      getDetail(id){
          //获取详情查询
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/file/getFileDetail',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.lawsInfo = response.data.data;
                          if(this.lawsInfo.content){
                              localStorage.editorContentLaw=this.lawsInfo.content;
                              tinymce.get('tinymceEditer').setContent(localStorage.editorContentLaw);
                          }
                      }
                  }
              }
          ).catch(

          )
      },
      openOrg(){
          let TreeInfo = {
              title: '事件类型',
              treeMultiple: false,
              additional: 'orgTree',
              request: 'post',
              queryInfo: {
                  userCode: Cookies.get('userCode')
              },
              url: this.$store.state.userCode.url+'/platform/public/queryOrgTree4New'
          };
          this.saveDemoData(TreeInfo);
          this.treeMode = true;
      },
      init () {
          this.$nextTick(() => {
              let vm = this;
              let height = 150;
              tinymce.init({
                  selector: '#tinymceEditer',
                  branding: false,
                  elementpath: false,
                  height: height,
                  language: 'zh_CN.GB2312',
                  plugins: [
                      'advlist autolink lists link image charmap print preview imagetools',
                  ],
                  toolbar1: 'undo redo | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                  autosave_interval: '20s',
                  image_advtab: true,
                  images_upload_url: '',
                  table_default_styles: {
                      width: '100%',
                      borderCollapse: 'collapse'
                  },
                  setup: function (editor) {
                      editor.on('init', function (e) {
                          vm.spinShow = false;
                         if (localStorage.editorContentLaw) {
                             tinymce.get('tinymceEditer').setContent(localStorage.editorContentLaw);
                         }
                      });
                      editor.on('keydown', function (e) {
                          localStorage.editorContentLaw = tinymce.get('tinymceEditer').getContent();
                          console.log('keydown',localStorage.editorContentLaw)
                      });
                  }
              });
          });
      },
    ...mapActions([
      'changeModalStatus',// 改变模态框状态
      'saveAddLaws',// 新增保存
      'saveEditLaws',// 编辑保存
      'changeTypeModalStatus',//改变类型弹出框状态
      'dateFormat',//格式化时间
      'getLawsTableList',// 获取表格列表
      'setFileType',
      'saveDemoData',
    ]),
      openIncident () {
        //文件树
          let TreeInfo = {
              title: '文件类型',
              treeMultiple: false,
              additional: 'fileType',
              request: 'post',
              queryInfo: {
                  userCode: Cookies.get('userCode'),
                  category:1
              },
              url: this.$store.state.userCode.url+'/platform/public/queryKnowledgeTree4New'
          };
          this.saveDemoData(TreeInfo);
          this.treeMode = true;
      },
      saveFile(name) {
          //列表查询
          let info={
              userCode:Cookies.get('userCode'),
              fileType:this.$store.state.laws.nodes.id,
              name:this.lawsInfo.name,
              fileCode:this.lawsInfo.fileCode,
              keywords:this.lawsInfo.keywords,
              publishOrg:this.lawsInfo.publishOrg,
              fileLevel:this.lawsInfo.fileLevel,
              publishDate:this.lawsInfo.publishDate,
              content: localStorage.editorContentLaw
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/file/addFile',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      tinymce.get('tinymceEditer').setContent('');
                      this.$emit('maintain-parent');
                      this.$refs[name].resetFields();
                  }
              }
          ).catch(

          )
      },
      editFile(name) {
          //编辑
          let info={
              userCode:Cookies.get('userCode'),
              fileType:this.fileRecord.fileType,
              id:this.lawsInfo.id,
              name:this.lawsInfo.name,
              fileCode:this.lawsInfo.fileCode,
              keywords:this.lawsInfo.keywords,
              publishOrg:this.lawsInfo.publishOrg,
              fileLevel:this.lawsInfo.fileLevel,
              publishDate:this.lawsInfo.publishDate,
              content: localStorage.editorContentLaw
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/file/modifyFile',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      tinymce.get('tinymceEditer').setContent('');
                      this.$emit('maintain-parent');
                      this.$refs[name].resetFields();
                  }
              }
          ).catch(

          )
      },
      clickConfirmBtn (name){// 点击确认按钮
          localStorage.editorContentLaw = tinymce.get('tinymceEditer').getContent();
          this.lawsInfo.content=localStorage.editorContentLaw;
          this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.addEditStatus === 'add'){//新增
                    this.saveFile(name);
                }else if(this.addEditStatus === 'edit'){//编辑
                    this.editFile(name);
                }else{

                }
            } else {
                this.$Message.error('请先完成必填项！');
            }
          })

      },
      cleanForm(){
          this.lawsInfo.name='';
          this.lawsInfo.fileCode='';
          this.lawsInfo.keywords='';
          this.lawsInfo.publishOrg='';
          this.lawsInfo.fileLevel='';
          this.lawsInfo.publishDate='';
          this.lawsInfo.content='';
      },
    clickCancelBtn (name){// 点击取消按钮
        this.$refs[name].resetFields();
        if(this.addEditStatus==='add'){
            this.cleanForm();
        }
        this.modalStatus=false;
        tinymce.get('tinymceEditer').setContent('');
    },
      delete(id){
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/file/removeFile',
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
    treeModalSave(data, type){
    if ( type === 'fileType') {
        this.lawsInfo.fileTypeName=data[0].title;
        this.fileRecord.fileType=data[0].id;

        this.$refs.lawsInfo.validateField('fileTypeName', valid => {
            console.log(valid);
        });
    }else if(type === 'orgTree'){
        this.lawsInfo.publishOrgName = data[0].title;
        this.lawsInfo.publishOrg = data[0].id;
        this.$refs.lawsInfo.validateField('publishOrgName', valid => {
            console.log(valid);
        });
    }
        this.treeModalClose();
    }
  },
  mounted () {
    this.init();
  },
  destroyed () {
    tinymce.get('tinymceEditer').destroy();
  }
}
</script>

