<template>
  <div>
    <Modal v-model="riskMonitorModalStatus" :mask-closable="false" width="800" @on-cancel="clickCancelBtn('monitorInfo')">
        <p slot="header" style="color:#f60;text-align:center">
            <span>监测项维护</span>
        </p>
        <div>
          <Form ref="monitorInfo" :rules="ruleCustom" :model="monitorInfo" :label-width="100">
            <Row>
              <i-col span="12">
                <FormItem label="监测项名称:" prop="name">
                  <i-input placeholder="请输入监测项名称." style="width: 100%" v-model="monitorInfo.name"></i-input>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem label="正常值范围:" prop="normalRange">
                  <i-input placeholder="请输入正常值范围." style="width: 100%" v-model="monitorInfo.normalRange"></i-input>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem label="预警标准:" prop="warningStandard">
                  <i-input  type="textarea" :autosize="{minRows: 4,maxRows: 10}" v-model="monitorInfo.warningStandard"></i-input>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </div>
        <div style="text-align:right">
          <Button type="primary" @click="clickConfirmBtn('monitorInfo')">确定</Button>
          <Button type="ghost" @click="clickCancelBtn('monitorInfo')">清空</Button>
        </div>
        <br />
        <div slot="footer">
          <Table border :columns="columns1" :data="monitorDatas" highlight-row @on-row-click="risk_monitor_clickTableRow" ref="itemTable"></Table>
          <div class="ds-page-body">
              <Page :total="totalSize" :page-size="pageSize" :current=pageNum @on-change="clickPage" v-if="pageShow"></Page>
          </div>
        </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      verify
  },
  data () {
      const validateWarningStandard = (rule, value, callback) => {
          if (value&&value.length>1000) {
              return callback(new Error('预警标准不能超过1000字符'));
          }else {
              callback()
          }
      };
      const validateNormalRange = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入正常值范围'));
          }else if(verify.normalRangeReg.test(value)){
              callback()
          }else {
              return callback(new Error('请输入如“1-20”的字符串'));
          }
      };
      const validateName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入名称'));
          }else if(verify.name.test(value)){
              callback()
          }else {
              return callback(new Error('不能输入特殊符号、名称长度不能超过20字符'));
          }
      };
      return {
        riskMonitorModalStatus:false,
        columns1: [
            {
                title: '序号',
                width: 80,
                align: 'center',
                type: 'index'
            },
            {
                title: '监测项名称',
                key: 'name',
                align: 'center'
            },
            {
                title: '正常值范围',
                key: 'normalRange',
                align: 'center'
            },
            {
                title: '预警标准',
                key: 'warningStandard',
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
                                    vm.deleteMonitorItem(params)
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
        monitorDatas: [],
        monitorInfo:{},
        pageShow:false,
        totalSize: null,
        pageSize: 4,
        pageNum: 1,
        ruleCustom: {
            warningStandard:[
                { validator: validateWarningStandard, trigger: 'blur' }
            ],
            normalRange:[
                { required: true, validator: validateNormalRange, trigger: 'blur' }
            ],
            name:[
                { required: true, validator: validateName, trigger: 'blur' }
            ],
        }
    };
  },
  computed:{
    /*riskMonitorModalStatus() {
      return this.$store.state.risk.monitorItemModalStatus
    },*/
  },
  methods: {
    ...mapActions([
      
    ]),
      queryMonitorList() {
          //列表查询
          let info = {
              userCode: Cookies.get('userCode'),
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              objType: this.monitorInfo.objType,
              objId: this.monitorInfo.objId
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/risk/monitorItem/queryMonitorItemListByPage',
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
                      this.monitorDatas = response.data.data.list;
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
              url: this.$store.state.userCode.url+'/risk/monitorItem/getMonitorItemById',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.monitorInfo = response.data.data;
                      }
                  }
              }
          ).catch(

          )
      },
      monitor_addMonitorItem(){
          // 新增
          let info=this.monitorInfo;
          info.userCode = Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/risk/monitorItem/addMonitorItem',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.clearFrom();
                      this.queryMonitorList();
                  }
              }
          ).catch(

          )
      },
      clickConfirmBtn(name){
          this.$refs[name].validate((valid) => {
              if (valid) {
                this.monitor_addMonitorItem();
              } else {
                  this.$Message.error('请先完成必填项！');
              }
          })
      },
      clickCancelBtn(name){
          this.$refs[name].resetFields();
          const objId = this.monitorInfo.objId;
          const objType = this.monitorInfo.objType;
          this.monitorInfo = {};
          this.monitorInfo.objId=objId;
          this.monitorInfo.objType=objType;
          this.$refs.itemTable.clearCurrentRow();
      },
      clickPage (pageNum){//点击分页
          this.pageNum=pageNum;
          this.queryMonitorList();
      },
      risk_monitor_clickTableRow(data){
          const objType = this.monitorInfo.objType;
          const objId = this.monitorInfo.objId;
          this.monitorInfo=data;
          this.monitorInfo.objType=objType;
          this.monitorInfo.objId=objId;
          this.getDetail(data.id);
      },
      deleteMonitorItem(data){
          // 删除监测项记录
          let info={
              id:data.row.id,
              userCode:Cookies.get('userCode')
          }
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/risk/monitorItem/deletedMonitorItem',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('删除成功!');
                      this.monitorDatas.splice(data.index, 1);
                      this.clearFrom();
                      if(this.monitorDatas.length<1){
                          this.pageNum = 1;
                      }
                      this.queryMonitorList();
                  }
              }
          ).catch(

          )
      },
    clearFrom () {
        this.monitorInfo.id = null;
        this.monitorInfo.name = null;
        this.monitorInfo.normalRange = null;
        this.monitorInfo.warningStandard = null;
    }
  }
}
</script>

