<template>
  <div>
    <Modal v-model="targetDisasterModalStatus" :mask-closable="false" width="880" @on-cancel="clickCancelBtn('accidentInfo')">
        <p slot="header" style="color:#f60;text-align:center">
            <span>可能诱发事故新增</span>
        </p>
        <div>
          <Form ref="accidentInfo" :model="accidentInfo" :rules="ruleCustom" :label-width="100">
            <Row>
              <i-col span="12">
                <FormItem label="事故类型:" prop="incidentTypeName">
                  <i-input placeholder="请输入事故类型." style="width: 100%" v-model="accidentInfo.incidentTypeName" readonly @on-focus="openIncident" @on-click="openIncident"></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="高危时段:">
                  <Row>
                    <i-col span="12" prop="highRiskStart">
                      <DatePicker type="date" placeholder="开始时间" v-model="accidentInfo.highRiskStart" ></DatePicker>
                    </i-col>
                    <i-col span="12" prop="highRiskEnd">
                      <DatePicker type="date" placeholder="结束时间" v-model="accidentInfo.highRiskEnd"></DatePicker>
                    </i-col>
                  </Row>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="诱发因素:" prop="inducingFactor">
                  <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="accidentInfo.inducingFactor"></i-input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div style="text-align:right">
          <Button type="primary" @click="clickConfirmBtn('accidentInfo')">确定</Button>
          <Button type="ghost" @click="clickCancelBtn('accidentInfo')">清除</Button>
        </div>
        <br />
        <div slot="footer">
          <Table border :columns="columns1" :data="accidentDatas" highlight-row @on-row-click="target_accident_clickTableRow" ref="accidentTable"></Table>
          <div class="ds-page-body">
              <Page :total="totalSize" :page-size="pageSize" :current=pageNum @on-change="clickPage" v-if="pageShow"></Page>
          </div>
        </div>
    </Modal>
      <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import tree from '@/common/components/treeModal/tree'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      tree,
      verify
  },
  data () {
      const validateInducingFactor = (rule, value, callback) => {
          if (value && value.length>1000) {
              return callback(new Error('不能超过1000字'));
          }else if(!value){
              return callback(new Error('诱发因素不能为空'));
          }else{
              callback();
          }
      };
      const validateIncidentTypeName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择事故类型'));
          }else {
              callback();
          }
      };
      const validateHighRiskStart = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择高危时段起始时间'));
          }else {
              callback();
          }
      };
      const validateHighRiskEnd = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请选择高危时段结束时间'));
          }else {
              callback();
          }
      };
    return {
      columns1: [
            {
                title: '序号',
                type: 'index',
                width: 80,
                align: 'center'
            },
            {
                title: '事故类型',
                key: 'sourceName',
                align: 'center'
            },
            {
                title: '高危时段',
                key: 'highRisk',
                align: 'center'
            },
            {
                title: '诱发因素',
                key: 'inducingFactor',
                align: 'center'
            },
            {
              title: '操作',
              align: 'center',
              width: 70,
              render: (h, params) => {
                  return h('div', [
                      h('Poptip', {
                          props: {
                              confirm: true,
                              title: '您确定要删除这条数据吗?',
                              transfer: true
                          },
                          on: {
                              'on-ok': () => {
                                  let vm = this
                                  vm.deleteAccident(params)
                              }
                          }
                      }, [
                          h('Button', {
                              style: {
                                  marginRight: '5px'
                              },
                              props: {
                                  size: 'small',
                                  placement: 'top'
                              }
                          }, '删除')
                      ])
                  ]);
              }
            }
        ],
        accidentInfo: {},
        pageShow:false,
        totalSize: null,
        pageSize: 2,
        pageNum: 1,
        accidentDatas:[],
        treeMode:false,
        targetDisasterModalStatus:false,
        ruleCustom: {
            inducingFactor:[
                { required: true,validator: validateInducingFactor, trigger: 'blur' }
            ],
            highRiskEnd:[
                { validator: validateHighRiskEnd, trigger: 'change' }
            ],
            highRiskStart:[
                { validator: validateHighRiskStart, trigger: 'change' }
            ],
            incidentTypeName:[
                { required: true, validator: validateIncidentTypeName, trigger: 'blur' }
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
      openIncident () {
          //事件类型树
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
      queryAccidentList() {
          //列表查询
          let info = {
              userCode: Cookies.get('userCode'),
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              sourceType:2,
              sourceId:this.accidentInfo.sourceId
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/risk/DisasterAccident/queryDisasterAccidentListByPage',
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
                      let result = response.data.data.list;
                      if(!result || result.length<1){
                          this.accidentDatas=result;
                          return;
                      }
                      for(let i=0;i<result.length;i++){
                          if(result[i].highRiskStart&&result[i].highRiskEnd){
                              result[i].highRisk=result[i].highRiskStart+"至"+result[i].highRiskEnd;
                          }else if(result[i].highRiskStart){
                              result[i].highRisk=result[i].highRiskStart;
                          }else if(result[i].highRiskEnd){
                              result[i].highRisk=result[i].highRiskEnd;
                          }
                      }
                      this.accidentDatas=result;
                  }
              }
          ).catch(

          )
      },
      addAccident() { // 点击确定
          // 新增
          let info=this.accidentInfo;
          info.userCode = Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/risk/DisasterAccident/addDisasterAccident',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.clearFrom();
                      this.queryAccidentList();
                  }
              }
          ).catch(

          )
      },
      clickConfirmBtn(name){
          this.$refs[name].validate((valid) => {
              if (valid) {
                this.addAccident();
              } else {
                  this.$Message.error('请先完成必填项！');
              }
          })

      },
      getDetail(id){
          //获取详情查询
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/risk/DisasterAccident/getDisasterAccidentById',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.accidentInfo = response.data.data;
                      }
                  }
              }
          ).catch(

          )
      },
      // 点击清空
      clickCancelBtn(name){
          this.$refs[name].resetFields();
          const sourceId = this.accidentInfo.sourceId;
          const sourceType = this.accidentInfo.sourceType;
          this.accidentInfo = {};
          this.accidentInfo.sourceId=sourceId;
          this.accidentInfo.sourceType=sourceType;
          this.$refs.accidentTable.clearCurrentRow();
      },
      /**
       * 点击表格时触发
       * @param data
       */
      target_accident_clickTableRow(data){
          const sourceId = this.accidentInfo.sourceId;
          const sourceType = this.accidentInfo.sourceType;
          this.accidentInfo=data;

          this.accidentInfo.sourceId=sourceId;
          this.accidentInfo.sourceType=sourceType;
          this.getDetail(data.id);
      },
      clickPage (pageNum){//点击分页
          this.pageNum=pageNum;
          this.queryAccidentList();
      },
      treeModalClose(){
          this.treeMode=false;
      },
      treeModalSave(data, type){
          if ( type === 'incidentType') {
              this.accidentInfo.incidentTypeName=data[0].title;
              this.accidentInfo.incidentTypeId=data[0].id;

              this.$refs.accidentInfo.validateField('incidentTypeName', valid => {
                  
              });
          }
          this.treeModalClose();
      },
      deleteAccident(data){
          // 删除诱发事件记录
          let info={
              id:data.row.id,
              userCode:Cookies.get('userCode')
          }
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/risk/DisasterAccident/deletedDisasterAccident',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('删除成功!');
                      this.accidentDatas.splice(data.index, 1);
                      this.clearFrom();
                      if(this.accidentDatas.length<1){
                        this.pageNum = 1;
                      }
                      this.queryAccidentList();
                  }
              }
          ).catch(

          )
      },
      clearFrom () {
        this.accidentInfo.id = null;
        this.accidentInfo.incidentTypeName = null;
        this.accidentInfo.highRiskStart = null;
        this.accidentInfo.highRiskEnd = null;
        this.accidentInfo.inducingFactor = null;
      }
  }
}
</script>

