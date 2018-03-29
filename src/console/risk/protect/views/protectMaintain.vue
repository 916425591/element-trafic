<template>
  <div>
    <Modal v-model="riskTargetModalStatus" :mask-closable="false" width="800" @on-cancel="('riskTargetInfo')">
      <p slot="header" style="color:#f60;text-align:center">
        <span>防护目标维护</span>
      </p>
      <div>
        <Form ref="riskTargetInfo" :rules="ruleCustom" :model="riskTargetInfo" :label-width="90">
          <Row>
            <i-col span="12">
            <FormItem label="隐患类型:" v-if="addEditStatus === 'add'">
              <i-input placeholder="请选择目标类型." v-model="riskTargetInfo.fenseTypeName" readonly></i-input>
            </FormItem>
            <FormItem label="隐患类型:" v-if="addEditStatus === 'edit'" prop="fenseTypeName">
              <i-input placeholder="请选择目标类型." v-model="riskTargetInfo.fenseTypeName" readonly @on-focus="choiceRiskTargetType" @on-click="choiceRiskTargetType"></i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="目标名称:" prop="name">
              <i-input placeholder="请输入目标名称." v-model="riskTargetInfo.name"></i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="重要级别:" prop="level">
              <Select v-model="riskTargetInfo.level">
                <Option v-for="item in levelData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="责任人:" prop="dutyPersonName">
              <i-input placeholder="请选择责任人." v-model="riskTargetInfo.dutyPersonName" readonly @on-focus="choicePerson" @on-click="choicePerson"></i-input>
            </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
            <FormItem label="周期性:" prop="cycleType">
              <RadioGroup v-model="riskTargetInfo.cycleType">
                <Radio label="1">周期性</Radio>
                <Radio label="2">长期性</Radio>
                <Radio label="3">临时性</Radio>
              </RadioGroup>
            </FormItem>
            </i-col>
            <i-col span="12" >
              <Row v-if="this.riskTargetInfo.cycleType==='3'||this.riskTargetInfo.cycleType===3">
                <FormItem label="周期时间:" >
                  <i-col span="12" prop="cycleStartTime">
                    <DatePicker type="date" placeholder="开始时间" v-model="riskTargetInfo.cycleStartTime"></DatePicker>
                  </i-col>
                  <i-col span="12" prop="cycleEndTime">
                    <DatePicker type="date" placeholder="结束时间" v-model="riskTargetInfo.cycleEndTime"></DatePicker>
                  </i-col>
                </FormItem>
              </Row>
              <Row v-if="this.riskTargetInfo.cycleType==='1'||this.riskTargetInfo.cycleType===1">
                <FormItem label="周期时间:" >
                  <i-col span="12" prop="cycleStartTime">
                    <DatePicker type="datetime" placeholder="开始时间" v-model="riskTargetInfo.cycleStartTime" format="MM-dd"></DatePicker>
                  </i-col>
                  <i-col span="12" prop="cycleEndTime">
                    <DatePicker type="datetime" placeholder="结束时间" v-model="riskTargetInfo.cycleEndTime" format="MM-dd"></DatePicker>
                  </i-col>
                </FormItem>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
            <FormItem label="所在区域:" prop="regionName">
              <i-input placeholder="请输入所在区域." style="width: 100%" v-model="riskTargetInfo.regionName" readonly @on-focus="choiceRegion" @on-click="choiceRegion" ></i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="地理位置:" prop="address">
              <i-input placeholder="请输入地理位置." v-model="riskTargetInfo.address"></i-input>
            </FormItem>
            </i-col>
            <i-col span="24">
            <FormItem label="防护内容:" prop="content">
              <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="riskTargetInfo.content"></i-input>
            </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" type="primary" @click="clickConfirmBtn('riskTargetInfo')">确定</Button>
        <Button size="large" type="ghost" @click="clickCancelBtn('riskTargetInfo')">取消</Button>
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
            const validateContent = (rule, value, callback) => {
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
                if (value&&value==='null') {
                    return callback(new Error('请选择防护目标级别'));
                }else {
                    callback();
                }
            };
            const validateFenseTypeName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择防护目标类型'));
                }else {
                    callback();
                }
            };
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入防护目标名称'));
                }else {
                    callback()
                }
            };
            return {
                levelData:[],
                addEditStatus:'',
                riskTargetInfo:{cycleType:"1"},
                riskTargetModalStatus:false,
                treeMode:false,
                tableListModal:false,
                ruleCustom: {
                    content: [
                        { validator: validateContent, trigger: 'blur' }
                    ],
                    address:[
                        { validator: validateAddress, trigger: 'blur' }
                    ],
                    regionName:[
                        { required: true,validator: validateRegionName, trigger: 'blur' }
                    ],
                    cycleEndTime:[
                        { validator: validateCycleEndTime, trigger: 'blur' }
                    ],
                    cycleStartTime:[
                        { validator: validateCycleStartTime, trigger: 'blur' }
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
                    fenseTypeName:[
                        { required: true,validator: validateFenseTypeName, trigger: 'blur' }
                    ],
                }
            };
        },
        computed:{
            protectTargetTypeNode (){
                return this.$store.state.riskProtect.protectTargetTypeNode;
            }
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'saveTableData',
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
                                const list = response.data.data;
                                this.levelData = [];
                                for (let i=0;i<list.length;i++) {
                                    this.levelData.push({
                                        value: list[i].key * 1,
                                        label: list[i].value
                                    })
                                }
                            }
                        }
                    }
                ).catch(

                )
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
            choiceRiskTargetType () {
                //防护目标类别树
                let TreeInfo = {
                    title: '防护目标类型',
                    treeMultiple: false,
                    additional: 'targetType',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.$store.state.userCode.url+'/platform/public/queryFenseTargetType4New'
                };
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            clickConfirmBtn (name){// 点击确认按钮
                this.$refs[name].validate((valid) => {
                    if (valid) {
                      if(this.addEditStatus === 'add'){//新增
                          this.addTarget();
                          this.classifyInfo={};
                      }else if(this.addEditStatus === 'edit'){//编辑
                          this.updateTarget();
                      }else{

                      }
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
            },
            addTarget() {
                // 新增
                let info=this.riskTargetInfo;
                info.userCode = Cookies.get('userCode');
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/risk/fenseTarget/addFenseTarget',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('操作成功!');
                            this.riskTargetModalStatus = false;
                            this.$emit('maintain-parent');
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
                    url: this.$store.state.userCode.url+'/risk/fenseTarget/getFenseTargetById',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            if(response.data.data){
                                this.riskTargetInfo = response.data.data;
                            }
                        }
                    }
                ).catch(

                )
            },
            reSetInfo (data) {
                console.log(this.riskInfo)
                this.riskTargetInfo.fenseTypeId = data.id;
                this.riskTargetInfo.fenseTypeName = data.name;
                this.riskTargetInfo.cycleType = '1';
                this.riskTargetInfo.cycleStartTime='';
                this.riskTargetInfo.cycleEndTime='';
            },
            updateTarget() {
                // 更新
                let info=this.riskTargetInfo;
                info.userCode = Cookies.get('userCode');
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/risk/fenseTarget/updateFenseTarget',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('操作成功!');
                            this.riskTargetModalStatus = false;
                            this.$emit('maintain-parent');
                        }
                    }
                ).catch(

                )
            },
            resetFormItem(){
                this.riskTargetInfo.name="";
                this.riskTargetInfo.level="";
                this.riskTargetInfo.dutyPersonName="";
                this.riskTargetInfo.dutyPersonId=null;
                this.riskTargetInfo.cycleType="1";
                this.riskTargetInfo.regionName="";
                this.riskTargetInfo.regionId=null;
                this.riskTargetInfo.address="";
                this.riskTargetInfo.content="";
            },
            clickCancelBtn (name){// 点击取消按钮
                if (this.$refs[name]) {
                    this.$refs[name].resetFields();
                }
                this.riskTargetModalStatus=false;
            },
            treeModalClose(){
                this.treeMode=false;
            },
            treeModalSave(data, type){
                if ( type === 'targetType') {
                    this.riskTargetInfo.fenseTypeName=data[0].title;
                    this.riskTargetInfo.fenseTypeId=data[0].id;

                    this.$refs.riskTargetInfo.validateField('riskTypeName', valid => {
                        console.log(valid);
                    });
                }else if(type === 'region'){
                    this.riskTargetInfo.regionName=data[0].title;
                    this.riskTargetInfo.regionId=data[0].id;

                    this.$refs.riskTargetInfo.validateField('regionName', valid => {
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
                    this.riskTargetInfo.dutyPersonName=data.name;
                    this.riskTargetInfo.dutyPersonId=data.id;

                    this.$refs.riskTargetInfo.validateField('dutyPersonName', valid => {
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
                    url: this.$store.state.userCode.url+'/risk/fenseTarget/deletedFenseTarget',
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

