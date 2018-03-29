<template>
  <div>
    <Modal v-model="modalStatus" :mask-closable="false" width="800" @on-cancel="clickCancelBtn('caseInfo')" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <span>典型案例信息维护</span>
      </p>
      <div>
        <Form ref="caseInfo" :rules="ruleCustom" :model="caseInfo" :label-width="90">
          <Row>
            <i-col span="12">
            <FormItem label="案例名称:" inline prop="name">
              <i-input placeholder="请输入案例名称." v-model="caseInfo.name"></i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="事件类型:" prop="incidentTypeName">
              <i-input placeholder="请输入事件类型." v-model="caseInfo.incidentTypeName" readonly @on-focus="openIncident" @on-click="openIncident"></i-input>
            </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
            <FormItem label="事件等级:" prop="incidentLevelId">
              <Select v-model="caseInfo.incidentLevelId">
                <Option v-for="item in levelData" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="事发区域:" prop="regionName">
              <i-input placeholder="请输入事发区域." v-model="caseInfo.regionName" readonly @on-focus="openRegion" @on-click="openRegion"></i-input>
            </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
            <FormItem label="事发时间:" prop="occurTime">
              <DatePicker type="date" placeholder="请选择事发时间" style="width: 100%" format="yyyy-MM-dd" v-model="caseInfo.occurTime" :editable="false"></DatePicker>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="事发地址:" prop="address">
              <i-input placeholder="请输入事发地址." v-model="caseInfo.address"></i-input>
            </FormItem>
            </i-col>
            <i-col span="24">
            <FormItem label="事件描述:" prop="description">
              <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="caseInfo.description"></i-input>
            </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="clickConfirmBtn('caseInfo')">确定</Button>
        <Button type="ghost" @click="clickCancelBtn('caseInfo')">取消</Button>
      </div>
    </Modal>
    <law-type></law-type>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </div>
</template>
<script>
import lawType from './caseType'
import { mapActions } from 'vuex'
import axios from 'axios'
import verify from '@/common/utils/verify'
import tree from '@/common/components/treeModal/tree'
import Cookies from 'js-cookie';
export default {
  components: {
      lawType,
      tree,
      verify
  },
    created () {
        this.queryIncidentLevel();
    },
  data () {
      const validateDescription = (rule, value, callback) => {
          if (value&&value.length>1000) {
              return callback(new Error('事件描述不能超过1000字符'));
          } else{
              callback()
          }
      };
      const validateAddress = (rule, value, callback) => {
          if (value&&value.length>200) {
              return callback(new Error('地址长度不能超过200字符'));
          } else{
              callback()
          }
      };
      const validateOccurTime = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择日期'));
          } else{
              callback()
          }
      };
      const validateRegionName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择事区域'));
          } else{
              callback()
          }
      };
      const validateIncidentLevelId = (rule, value, callback) => {
          if (!value||value==='null') {
              return callback(new Error('请选择事件等级'));
          } else{
              callback()
          }
      };
      const validateIncidentTypeName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择事件类型'));
          } else{
              callback()
          }
      };
      const validateName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入案例名称'));
          } else if(verify.name.test(value)){
              callback()
          }else {
              return callback(new Error('请输入汉字、数字、英文字母的组合,20字符以内'))
          }
      };
      return {
          caseInfo:{},
          modalStatus:false,
          addEditStatus:'',
          treeMode:false,
          levelData:[],
          ruleCustom: {
              name: [
                  { required: true,validator: validateName, trigger: 'blur' }
              ],
              incidentTypeName: [
                  { required: true,validator: validateIncidentTypeName, trigger: 'blur' }
              ],
              incidentLevelId: [
                  { required: true,validator: validateIncidentLevelId, trigger: 'change' }
              ],
              regionName: [
                  { required: true,validator: validateRegionName, trigger: 'blur' }
              ],
              occurTime: [
                  { required: true,validator: validateOccurTime, trigger: 'change' }
              ],
              address: [
                  { validator: validateAddress, trigger: 'blur' }
              ],
              description: [
                  { validator: validateDescription, trigger: 'blur' }
              ],
          }
        };
  },
  computed:{

  },
  methods: {
    ...mapActions([
        'saveDemoData',
    ]),
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
                      this.levelData.unshift({id:"null",name:"---请选择---"})
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
      openRegion () {
          //区域树
          let TreeInfo = {
              title: '请选择区域',
              treeMultiple: false,
              additional: 'region',
              request: 'post',
              queryInfo: {
                  userCode: Cookies.get('userCode')
              },
              url: this.$store.state.userCode.url+'/platform/public/queryRegionTree4New'
          };
          this.saveDemoData(TreeInfo);
          this.treeMode = true;
      },
      getDetail(id){
          //获取详情查询
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/case/getCaseById',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.caseInfo = response.data.data;
                      }
                  }
              }
          ).catch(

          )
      },
      addCase(name) {
          //列表查询
          let info=this.caseInfo;
          info.userCode=Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/case/addCase',
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
      updateCase(name) {
          //列表查询
          let info=this.caseInfo;
          info.userCode=Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/case/updateCase',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false
                      this.$emit('maintain-parent')
                      this.$refs[name].resetFields();
                  }
              }
          ).catch(

          )
      },
      delete(id){
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/case/deletedCase',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false
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
                      this.addCase();
                  }else if(this.addEditStatus === 'edit'){//编辑
                      this.updateCase();
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
              this.caseInfo={};
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
      changeDate (date){
      this.caseInfo.occurTime=date;
    },
      treeModalClose(){
          this.treeMode=false;
      },
      treeModalSave(data, type){
          if ( type === 'region') {
              this.caseInfo.regionName=data[0].title;
              this.caseInfo.regionId=data[0].id;
              this.$refs.caseInfo.validateField('regionName', valid => {
                  console.log(valid);
              });
          }else if(type === 'incidentType'){
              this.caseInfo.incidentTypeName=data[0].title;
              this.caseInfo.incidentTypeId=data[0].id;
              this.$refs.caseInfo.validateField('incidentTypeName', valid => {
                  console.log(valid);
              });
          }
          this.treeModalClose();
      }
  }
}
</script>

