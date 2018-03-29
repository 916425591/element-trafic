<template>
  <div>
    <Modal v-model="riskModalStatus" :mask-closable="false" width="800" @on-cancel="clickCancelBtn('riskInfo')">
        <p slot="header" style="color:#f60;text-align:center">
            <span>隐患信息维护</span>
        </p>
        <div>
          <Form ref="riskInfo" :rules="ruleCustom" :model="riskInfo" :label-width="90">
            <Row>
              <i-col span="12">
                <FormItem label="隐患类型:" v-if="addEditStatus === 'add'">
                  <i-input placeholder="请选择隐患类型." style="width: 100%" v-model="riskInfo.riskTypeName" readonly></i-input>
                </FormItem>
                <FormItem label="隐患类型:" v-if="addEditStatus === 'edit'" prop="riskTypeName">
                  <i-input placeholder="请选择隐患类型." style="width: 100%" v-model="riskInfo.riskTypeName" readonly @on-focus="choiceRiskType" @on-click="choiceRiskType"></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="隐患名称:" prop="name">
                  <i-input placeholder="请输入隐患名称." style="width: 100%" v-model="riskInfo.name"></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="重要级别:" prop="level">
                  <Select v-model="riskInfo.level">
                    <Option v-for="item in levelData" :value="item.value" :key="item.key">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="责任人:" prop="dutyPersonName">
                    <i-input placeholder="请选择责任人." v-model="riskInfo.dutyPersonName" readonly @on-focus="choicePerson" @on-click="choicePerson"></i-input>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="周期性:" prop="cycleType">
                  <RadioGroup v-model="riskInfo.cycleType">
                    <Radio :label="1">周期性</Radio>
                    <Radio :label="2">长期性</Radio>
                    <Radio :label="3">临时性</Radio>
                  </RadioGroup>
                </FormItem>
              </i-col>
              <i-col span="12">
                  <Row v-if="this.riskInfo.cycleType==='3'||this.riskInfo.cycleType===3">
                    <FormItem label="周期时间:" >
                      <i-col span="12" prop="cycleStartTime">
                        <DatePicker type="date" placeholder="开始时间" v-model="riskInfo.cycleStartTime"></DatePicker>
                      </i-col>
                      <i-col span="12" prop="cycleEndTime">
                        <DatePicker type="date" placeholder="结束时间" v-model="riskInfo.cycleEndTime"></DatePicker>
                      </i-col>
                    </FormItem>
                  </Row>
                  <Row v-if="this.riskInfo.cycleType==='1'||this.riskInfo.cycleType===1">
                    <FormItem label="周期时间:" >
                      <i-col span="12" prop="cycleStartTime">
                        <DatePicker type="datetime" placeholder="开始时间" v-model="riskInfo.cycleStartTime" format="MM-dd"></DatePicker>
                      </i-col>
                      <i-col span="12" prop="cycleEndTime">
                        <DatePicker type="datetime" placeholder="结束时间" v-model="riskInfo.cycleEndTime" format="MM-dd"></DatePicker>
                      </i-col>
                    </FormItem>
                  </Row>
                </FormItem>
              </i-col>
            </Row>
            <Row>
              <i-col span="12">
                <FormItem label="所在区域:" prop="regionName">
                  <i-input placeholder="请输入所在区域." v-model="riskInfo.regionName" readonly @on-focus="choiceRegion" @on-click="choiceRegion" ></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="地理位置:" prop="address">
                  <i-input placeholder="请输入地理位置." style="width: 100%" v-model="riskInfo.address"></i-input>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="关键特征:" prop="keyWords">
                  <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="riskInfo.keyWords"></i-input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button size="large" type="primary" @click="clickConfirmBtn('riskInfo')">确定</Button>
          <Button size="large" type="ghost" @click="clickCancelBtn('riskInfo')">取消</Button>
        </div>
    </Modal>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    <table-list v-if="tableListModal" @table-search-close="closeSearchModal" @table-search-save="saveSearchModal"></table-list>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import tree from '@/common/components/treeModal/tree'
import tableList from '@/common/components/tableSearchModal/tableSearchModal'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      tree,
      tableList,
      verify
  },
  data () {
      const validateKeywords = (rule, value, callback) => {
          if (verify.regChFig.test(value)||value.replace(/(^\s*)|(\s*$)/g,"")==='') {
              callback()
          }else {
              return callback(new Error('不能输入特殊符号'));
          }
      };
      const validateAddress = (rule, value, callback) => {
          if (value&&value.length>200) {
              return callback(new Error('地址不能超过200字'));
          }else {
              callback();
          }
      };
      const validateRegionName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择所在区域'));
          }else {
              callback();
          }
      };
      const validateCycleEndTime = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择周期结束时间'));
          }else {
              callback();
          }
      };
      const validateCycleStartTime = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择周期起始时间'));
          }else {
              callback();
          }
      };
      const validateCycleType = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择周期性'));
          }else {
              callback();
          }
      };
      const validateDutyPersonName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择责任人'));
          }else {
              callback();
          }
      };
      const validateLevel = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择隐患级别'));
          }else {
              callback();
          }
      };
      const validateRiskTypeName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择隐患类型'));
          }else {
              callback();
          }
      };
      const validateName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入隐患名称'));
          }else if(verify.name.test(value)){
              callback()
          }else {
              return callback(new Error('不能输入特殊符号、名称长度不能超过20字符'));
          }
      };
      return {
          levelData:[],
          treeMode:false,
          tableListModal:false,
          addEditStatus:'',
          riskModalStatus:false,
          riskInfo:{
              riskTypeId: null,
              riskTypeName: '',
              level: null,
              cycleType: '1'
          },
          ruleCustom: {
              keywords: [
                  { required: true, validator: validateKeywords, trigger: 'blur' }
              ],
              address:[
                  { required: true, validator: validateAddress, trigger: 'blur' }
              ],
              regionName:[
                  { required: true,validator: validateRegionName, trigger: 'blur' }
              ],
              cycleEndTime:[
                  { required: true, validator: validateCycleEndTime, trigger: 'blur' }
              ],
              cycleStartTime:[
                  { required: true, validator: validateCycleStartTime, trigger: 'blur' }
              ],
              cycleType:[
                  { required: true,validator: validateCycleType, trigger: 'change' }
              ],
              dutyPersonName:[
                  { required: true,validator: validateDutyPersonName, trigger: 'blur' }
              ],
              level:[
                  { required: true,validator: validateLevel, trigger: 'change' }
              ],
              name:[
                  { required: true,validator: validateName, trigger: 'blur' }
              ],
              riskTypeName:[
                  { required: true,validator: validateRiskTypeName, trigger: 'blur' }
              ],
          }
      };
  },
  computed:{
      riskTypeNode () {
          return this.$store.state.risk.riskTypeNode;
      }
  },
  methods: {
    ...mapActions([
        'saveDemoData',
        'saveTableData',
    ]),
    ddTime(time) {
        console.log(time)
    },
    reSetInfo (data) {
        console.log(this.riskInfo)
        this.riskInfo.riskTypeId = data.id;
        this.riskInfo.riskTypeName = data.name;
        this.riskInfo.level = null;
        this.riskInfo.cycleType = 1;
        this.riskInfo.cycleStartTime='';
        this.riskInfo.cycleEndTime='';
    },
      choiceRegion () {
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
      choicePerson(){
          const tableInfo = {
              title: '请选择责任人',
              multiple: false,
              url: this.$store.state.userCode.url+'/platform/public/queryPersonBase4Page',
              name: '姓名',
              type: 'dutyPerson',
              request: 'post',
              searchShow: true,
              queryInfo: {
                  userCode: Cookies.get('userCode'),
                  name: ''
              }
          }
          this.saveTableData(tableInfo);
          this.tableListModal = true;
      },
      choiceRiskType () {
          //隐患类别树
          let TreeInfo = {
              title: '风险隐患类型',
              treeMultiple: false,
              additional: 'riskType',
              request: 'post',
              queryInfo: {
                  userCode: Cookies.get('userCode')
              },
              url: this.$store.state.userCode.url+'/platform/public/queryRiskType4New'
          };
          this.saveDemoData(TreeInfo);
          this.treeMode = true;
      },
      clickConfirmBtn (name){// 点击确认按钮
          this.$refs[name].validate((valid) => {
              if (valid) {
                if(this.addEditStatus === 'add'){//新增
                    this.addRisk();
                    this.classifyInfo={};
                }else if(this.addEditStatus === 'edit'){//编辑
                    this.updateRisk();
                }
              } else {
                  this.$Message.error('请先完成必填项！');
              }
          })
      },
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
                          const list = response.data.data;
                          this.levelData = [];
                          for (let i=0;i<list.length;i++) {
                              this.levelData.push({
                                  value: list[i].key * 1,
                                  label: list[i].value
                              })
                          }
                          console.log(this.levelData)
                      }
                  }
              }
          ).catch(

          )
      },
      getDetail(id){
          //获取详情查询
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/risk/risk/getRiskById',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.riskInfo = response.data.data;
                      }
                  }
              }
          ).catch(

          )
      },
      addRisk() {
          // 新增
          let info=this.riskInfo;
          info.userCode = Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/risk/risk/addRisk',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.riskModalStatus = false;
                      this.$emit('maintain-parent');
                  }
              }
          ).catch(

          )
      },
      updateRisk() {
          // 更新
          let info=this.riskInfo;
          info.userCode = Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/risk/risk/updateRisk',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.riskModalStatus = false;
                      this.$emit('maintain-parent');
                  }
              }
          ).catch(

          )
      },
    clickCancelBtn (name){// 点击取消按钮
        if(this.$refs[name]){
            this.$refs[name].resetFields();
        }
        this.riskModalStatus=false;
    },
      treeModalClose(){
          this.treeMode=false;
      },
      treeModalSave(data, type){
          if ( type === 'riskType') {
              this.riskInfo.riskTypeName=data[0].title;
              this.riskInfo.riskTypeId=data[0].id;

              this.$refs.riskInfo.validateField('riskTypeName', valid => {
                  console.log(valid);
              });
          }else if(type === 'region'){
              this.riskInfo.regionName=data[0].title;
              this.riskInfo.regionId=data[0].id;

              this.$refs.riskInfo.validateField('regionName', valid => {
                  console.log(valid);
              });
          }
          this.treeModalClose();
      },
      closeSearchModal(){
          this.tableListModal=false;
      },
      saveSearchModal(data, type){
          if ( type === 'dutyPerson') {
              this.riskInfo.dutyPersonName=data.name;
              this.riskInfo.dutyPersonId=data.id;

              this.$refs.riskInfo.validateField('dutyPersonName', valid => {
                  console.log(valid);
              });
          }
          this.closeSearchModal();
      },
      deleteMaintain(id){
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/risk/risk/deletedRisk',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.$emit('maintain-parent');
                  }
              }
          ).catch(

          )
      }
  }
}
</script>

