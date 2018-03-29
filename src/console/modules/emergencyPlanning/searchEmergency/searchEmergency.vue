<template>
  <Row>
    <i-col span="24">
      <div class="ds-widget-box">
        <div class="ds-widget-title">
          <span class="ds-title-icon"></span>
          <h2>查询条件</h2>
        </div>
        <div class="style-emergency">
          <div>
            <span>预案类型:</span>
            <i-input v-model="planQuery.planTypeName" placeholder="请输入预案名称" style="width: 200px" @on-focus="selectPlanType"></i-input>
            <span class="margin_20">预案名称</span>
            <i-input v-model="planQuery.name" placeholder="请输入预案名称" style="width: 200px"></i-input>
            <Button size='large' type="primary" class="margin_20" @click="searchInformation">查询</Button>
            <Button size='large' class="margin_10" @click="clearInformation">清空查询</Button>
          </div>
        </div>
        <div class="ds-widget-box" v-bind:style="height" :data-json="tableHeight">
          <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>预案列表</h2>
            <span style="float:right;margin-right:5px;">
              <Button type="success" @click="addPlan">新增</Button>
              <Button type="warning" @click="editPlan">修改</Button>
            </span>
          </div>
          <div class="ds-table-box">
            <Table border stripe highlight-row ref="currentRowTable" :columns="columns" :data="tableData" @on-row-click="sendPlanIdInfo"></Table>
            <div class="ds-page-body" v-if="pageTotal > pageSize">
              <Page ref="pages" :total="pageTotal" :page-size="pageSize" :currentPage="1" @on-change="slectPage" show-total class="ds-page-right"></Page>
            </div>
          </div>
        </div>
      </div>
    </i-col>
    <modal v-model="modal6" title="增加预案信息" :mask-closable="false" class-name="vertical-center-modal" @on-cancel="handleReset('formCustom')">
      <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="120">
        <form-item label="预案名称" prop="name">
          <i-input type="text" v-model="formCustom.name"></i-input>
        </form-item>
        <form-item label="预案类型" prop="planTypeName">
          <i-input type="text" v-model="formCustom.planTypeName" @on-focus="openAddPlanType"></i-input>
        </form-item>
        <form-item label="事件类型" prop="incidentTypeId">
          <i-input type="text" v-model="formCustom.incidentTypeName" @on-focus="selectIncidentTypeId"></i-input>
        </form-item>
        <form-item label="事件级别" prop="incidentLevelId">
          <Select v-model="formCustom.incidentLevelId">
            <Option v-for="item in incidentLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </form-item>
        <form-item label="主编单位" prop="chiefEditOrgName">
          <i-input type="text" v-model="formCustom.chiefEditOrgName" @on-focus="selectOrg"></i-input>
        </form-item>
        <form-item label="检索关键字" prop="keyWords">
          <i-input type="text" v-model="formCustom.keyWords"></i-input>
        </form-item>
        <form-item label="适用区域" prop="regionName">
          <i-input type="text" v-model="formCustom.regionName" @on-focus="selectArea"></i-input>
        </form-item>
      </i-form>
      <div slot="footer">
        <Button size='large' type="primary"  @click="handleSubmit('formCustom')">保存</Button>
        <Button size='large' @click="handleReset('formCustom')">取消</Button>
      </div>
    </modal>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </Row>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import tree from '@/common/components/treeModal/tree'
import Cookies from 'js-cookie';

export default {
  components: {
    tree
  },
  data() {
    const validatePlanName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入预案名称'));
      } else {
        callback()
      }
    };
    // const validatepPlanTypeId = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入预案类型'));
    //   }
    // };
    const validateIncidentTypeId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入事件类型'));
      } else {
        callback()
      }
    };
    const validateIncidentLevelId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入事件级别'));
      } else {
        callback()
      }
    };
    const validateChiefEditOrg = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入主编单位'));
      } else {
        callback()
      }
    };
    return {
      treeMode: false,
      pageShow: false,
      pageNum: 1,
      incidentLevel: [],
      modal6: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '预案名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '预案类型',
          key: 'planTypeName',
          align: 'center'
        },
        {
          title: '事件类型',
          key: 'incidentTypeName',
          align: 'center'
        },
        {
          title: '事件级别',
          key: 'incidentLevelName',
          align: 'center'
        },
        {
          title: '主编单位',
          key: 'chiefEditOrgName',
          align: 'center'
        },
        {
          title: '创建日期',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '状态',
          key: 'statusName',
          align: 'center'
        }
      ],
      planType: [],
      planQuery: {
        //查询条件
        planTypeId: null,
        planTypeName: '',
        name: '',
      },
      formCustom: {
        name: '',
        planTypeId: null,
        planTypeName: '',
        incidentTypeId: null,
        incidentTypeName: '',
        chiefEditOrg: null,
        chiefEditOrgName: '',
        regionId: null,
        regionName: '',
        keyWords: '',
        incidentLevelId: null
      },
      ruleCustom: {
        name: [
          { required: true, validator: validatePlanName, trigger: 'blur' }
        ],
        // incidentTypeId: [
        //   { validator: validateIncidentTypeId, trigger: 'blur' }
        // ],
        incidentLevelId: [
          { required: true, validator: validateIncidentLevelId, trigger: 'change' }
        ],
        // planTypeId: [
        //   { validator: validatepPlanTypeId, trigger: 'blur' }
        // ],
        chiefEditOrgName: [
          { required: true, validator: validateChiefEditOrg, trigger: 'blur' }
        ]
      },
      height: {
        height: ''
      },
      selectPlanNode: {}
    }
  },
  computed: {
      planIdInfo() {
        return this.$store.state.userCode.planId //planID
      },
      userCode() {
        return Cookies.get('userCode') //userCode
      },
      url() {
        return this.$store.state.userCode.url //url
      },
      pageTotal() {
        return this.$store.state.planContent.total
      },
      tableData() {
        return this.$store.state.planContent.list
      },
      status() {
        return this.$store.state.planContent.status
      },
      pageSize() {
        return this.$store.state.heightTable.tableInfo.numberBranches
      },
      tableHeight() {
        this.height.height = this.$store.state.heightTable.tableInfo.tableHeight
        return this.height.height
      }
  },
  created () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.setHeightContent(h)
    this.tableHeightMessage(162)
    this.searchInformation()
  },
  methods: {
    ...mapActions([
      'saveDemoData',//获取树结构
      'SetPlanId',//设置预案ID
      'setProcessArrowMenu',//设置导航箭头效果
      'setProcessArrowStatus',
      'setSearchInformation',
      'tableHeightMessage',
      'setHeightContent'
    ]),
    treeModalClose () {
      this.treeMode = false;
    },
    clearInformation() {
      this.pageNum = 1
      this.$refs['pages'].currentPage = 1;
      //清空查询
      this.planQuery = {
        planTypeName: '',
        name: ''
      }
      const parmas = {
        data: {
          planTypeName: '',
          name: '',
          pageNum: 1,
          pageSize: this.pageSize,
          userCode: this.userCode
        },
        url: this.url + '/plan/content/queryPlanByTypeAndName'
      }
      this.setSearchInformation(parmas);
    },
    openAddPlanType () {
      //打开预案增加预案类型弹窗
      let TreeInfo = {
        title: '预案类型',
        treeMultiple: false,
        additional: 'addPlanType',
        request: 'post',
        queryInfo: {
          userCode: this.userCode
        },
        searchShow: true,
        url: this.url + '/platform/public/queryPlanTypeTree4New'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    selectIncidentTypeId() {
      //打开事件类型查询弹窗
      let TreeInfo = {
        title: '事件类型',
        treeMultiple: false,
        additional: 'incidentType',
        request: 'post',
        queryInfo: {
          userCode: this.userCode
        },
        searchShow: true,
        noSelect: true,
        url: this.url + '/platform/public/queryIncidentTypeTree4New'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    selectOrg () {
      //打开单位查询弹窗
      let TreeInfo = {
        title: '主编单位',
        treeMultiple: false,
        additional: 'org',
        request: 'post',
        queryInfo: {
          userCode: this.userCode
        },
        searchShow: true,
        url: this.url + '/platform/public/queryOrgTree4New'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    selectArea() {
      let TreeInfo = {
        title: '适用区域',
        treeMultiple: false,
        additional: '2',
        request: 'post',
        queryInfo: {
          userCode: this.userCode
        },
        url: this.url + '/platform/public/queryRegionTree4New'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    selectPlanType () {
      //打开预案查询预案类型弹窗
      let TreeInfo = {
        title: '预案类型',
        treeMultiple: false,
        additional: 'searchPlanType',
        request: 'post',
        queryInfo: {
          userCode: this.userCode
        },
        searchShow: true,
        noSelect: true,
        url: this.url + '/platform/public/queryPlanTypeTree4New'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    treeModalSave (treeInfo,type) {
      if  (type === 'searchPlanType') {
        if ( treeInfo.length>0) {
          this.planQuery.planTypeName = treeInfo[0].title;
          this.planQuery.planTypeId = treeInfo[0].id;
        } else {
          this.planQuery.planTypeName = '';
          this.planQuery.planTypeId = null;
        }
        this.treeMode = false;
      }
      if ( type === 'planType') {
        //修改预案类型
        this.planQuery.planType = {
          id: treeInfo[0].id,
          name: treeInfo[0].title
        }
        this.treeMode = false;
      }
      if ( type === 'addPlanType') {
        this.formCustom.planTypeId = treeInfo[0].id;
        this.formCustom.planTypeName = treeInfo[0].title;
        this.treeMode = false;
      }
      if ( type === 'incidentType' ) {
        this.formCustom.incidentTypeId = treeInfo[0].id;
        this.formCustom.incidentTypeName = treeInfo[0].title;
        this.treeMode = false;
      }
      if ( type === 'org') {
        this.formCustom.chiefEditOrg = treeInfo[0].id;
        this.formCustom.chiefEditOrgName = treeInfo[0].title;
        this.$refs.formCustom.validateField('chiefEditOrgName', valid => {
                        
        });
        this.treeMode = false;
      }
      if( type === '2' ) {
        this.formCustom.regionId = treeInfo[0].id;
        this.formCustom.regionName = treeInfo[0].title;
        this.treeMode = false;
      }
    },
    searchInformation() {
      //预案列表查询
      const parmas = {
        data: {
          planTypeName: this.planQuery.planTypeName,
          name: this.planQuery.name,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userCode: this.userCode
        },
        url: this.url + '/plan/content/queryPlanBy4Edit'
      }
      this.setSearchInformation(parmas)
    },
    addPlan () {
      //预案新增
      //查询事件类型
      this.formCustom = {
        name: '',
        planTypeId: null,
        planTypeName: '',
        incidentTypeId: null,
        incidentTypeName: '',
        chiefEditOrg: null,
        chiefEditOrgName: '',
        regionId: null,
        regionName: '',
        keyWords: '',
        incidentLevelId: null
      }
      this.queryIncidentLevel();
      this.modal6 = true;
    },
    queryIncidentLevel () {
      const info = {
        userCode: this.userCode
      }
      axios({
          method: 'post',
          url: this.url + '/platform/incidentLevel/queryIncidentLevelMaintain?userCode=sys&start=1&size=20',
          data: info
      }).then(
          response => {
            if ( response.data.code === 200 ) {
              let list = response.data.data.list;
              let newList = [];
              for ( let i=0;i<list.length;i++ ) {
                newList.push({
                  value: list[i].id,
                  label: list[i].name
                })
              }
              this.$set(this,'incidentLevel',newList);
            }
          }
      ).catch(
          
      )
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const id = this.formCustom.id;
          if (id) {
            //edit
            const data = {
                userCode: this.userCode,
                id: this.formCustom.id,
                name: this.formCustom.name,
                keyWords: this.formCustom.keyWords,
                chiefEditOrg: this.formCustom.chiefEditOrg,
                incidentTypeId: this.formCustom.incidentTypeId,
                regionId: this.formCustom.regionId,
                planTypeId: this.formCustom.planTypeId,
                incidentLevelId: this.formCustom.incidentLevelId
            }
            const params = this.formCustom
            const url = this.url + '/plan/content/modifyPlan'
            axios({
                method: 'post',
                url: url,
                data: data
            }).then(
                response => {
                    if(response.data.code === 200) {
                        this.searchInformation();
                        this.modal6 = false;
                        this.$Message.info('保存成功')
                    } else {
                        this.$Message.error('保存失败')
                    }
                }
            ).catch(
                error => {
                    
                }
            )
          } else {
            //add
            const info = this.formCustom;
            info.userCode = this.userCode;
            axios({
                method: 'post',
                url: this.url + '/plan/content/addPlan',
                data: info
            }).then(
                response => {
                  if ( response.data.code === 200 ) {
                    this.$Message.success('操作成功!');
                    this.searchInformation();
                    this.modal6 = false
                  }
                }
            ).catch(
                error => {
                    this.$Message.error(error);
                }
            )
          }
          
        } else {
          this.$Message.error('操作失败！');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
      this.modal6 = false
    },
    slectPage (index) {
      //分页查询
      this.pageNum = index;
      this.searchInformation();
    },
    sendPlanIdInfo(parmas) {
      this.selectPlanNode = parmas;
      const planId = parmas.id
      let dat
      if(parmas.status > 30) {
        dat = ['s-cur', 's-cur-next', '', '', '']
        this.setProcessArrowStatus(1)
      } else {
        dat = ['s-finish', 's-finish', 's-finish', 's-finish', 's-finish']
        this.SetPlanId(planId)
        this.setProcessArrowStatus(0)
      }
      this.setProcessArrowMenu(dat)
    },
    editPlan () {
      this.queryIncidentLevel();
      const id = this.selectPlanNode.id;
      if (id) {
        const url = this.url + '/plan/content/getPlanDetail'
        axios({
            method: 'get',
            url: url,
            params: {
                userCode: this.userCode,
                id: id
            }
        }).then(
            response => {
                if(response.data.code === 200) {
                    const res = response.data.data
                    this.formCustom = res;
                }
            }
        ).catch(
            error => {
                
            }
        )
        this.modal6 = true;
      } else {
        this.$Message.warning('请先选择预案');
      }
    },
    
  },
  mounted() {
  }
}
</script>

<style>
.style-emergency>div {
  padding: 10px;
  margin-left: 20px;
}
.margin_20 {
  margin-left: 20px;
}
.margin_10 {
  margin-left: 10px;
}
</style>

