<template>
  <div>
    <Row>
      <i-col span="5">
        <div class="ds-widget-box">
          <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>预案内容结构</h2>
          </div>
          <div class="plan_content_search">
            <i-input icon="ios-search" v-model="nodeName" @on-click="queryNodes" @on-enter="queryNodes" style="width: 100%"></i-input>
          </div>
          <div class="ds-tree-left ds-content-listBox ">
            <Tree :data="memberOrgTree" @on-select-change="seletNode" ref="tree"></Tree>
          </div>
        </div>
      </i-col>
      <i-col span="19">
        <div v-if="contentStatus === 0" style="padding-left: 10px;">
          <div :style='height2'>
            <div style="width: 100%;text-align:center;padding-top:100px;font-size:26px;height: 617px;">请选择预案内容查看详情</div>
          </div>
        </div>
        <div v-if="contentStatus === 1">
          <perplanTextInfo></perplanTextInfo>
        </div>
        <div v-if="contentStatus === 20">
          <org-anization></org-anization>
        </div>
        <div v-if="contentStatus === 21">
          <head-quarters></head-quarters>
        </div>
        <div v-if="contentStatus === 22">
          <font-head-quarters></font-head-quarters>
        </div>
        <div v-if="contentStatus === 23">
          <scene-head-quarters></scene-head-quarters>
        </div>
        <div v-if="contentStatus === 24">
          <fen-head-quarters></fen-head-quarters>
        </div>
        <div v-if="contentStatus === 25">
          <member-org></member-org>
        </div>
        <div v-if="contentStatus === 26">
          <expert-group></expert-group>
        </div>
        <div v-if="contentStatus === 27">
          <security-group></security-group>
        </div>
        <div v-if="contentStatus === 40">
          <gradedResponse></gradedResponse>
        </div>
        <div v-if="contentStatus === 50">
          <fourColorEarlyWarning></fourColorEarlyWarning>
        </div>
        <div v-if="contentStatus === 30">
          <preliminaryDisposalScheme></preliminaryDisposalScheme>
        </div>
        <div v-if="contentStatus === 60">
          <resourcesReady></resourcesReady>
        </div>
        <div v-if="contentStatus === 62">
          <equipmentEstimation></equipmentEstimation>
        </div>
        <div v-if="contentStatus === 61">
          <materialEstimation></materialEstimation>
        </div>
        <div v-if="contentStatus === 63">
          <professionalVehicles></professionalVehicles>
        </div>
        <div v-if="contentStatus === 64">
          <disposalTeam></disposalTeam>
        </div>
        <div v-if="contentStatus === 69">
          <otherResources></otherResources>
        </div>
        <div v-if="contentStatus === 65">
          <safeHaven></safeHaven>
        </div>
      </i-col>
    </Row>
    <Modal v-model="templateAddModal" :mask-closable="false" width="500">
      <p slot="header" style="color:#f60;text-align:center">
        <span>新增内容节点信息</span>
      </p>
      <div style="text-align:left;max-height:400px;over-flow:auto;">
        <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
          <form-item label="预案元素类型:" prop="elementType">
            <Select v-model="formValidate.elementType">
                <Option v-for="item in elementType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </form-item>
          <form-item label="预案内容:" prop="name">
            <i-input style="" v-model="formValidate.name"></i-input>
          </form-item>
          <form-item label="预案上级内容:">
            <i-input style="" v-model="formValidate.type" @on-focus="selectOtherType"></i-input>
          </form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button size='large' type="primary" @click="saveContentInfo('formValidate')">确定</Button>
        <Button size='large' type="ghost" @click="cancelContentInfo('formValidate')">取消</Button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal v-model="editNodes" :mask-closable="false" width="500">
        <p slot="header" style="color:#f60;text-align:center">
            <span>设置节点内容</span>
        </p>
        <div style="text-align:left;max-height:400px;over-flow:auto;">
            <i-form ref="formValidateNodes" :model="formValidateNodes" :rules="ruleValidateNodes" :label-width="120">
                <form-item label="预案内容:" prop="name">
                    <i-input style="" v-model="formValidateNodes.name"></i-input>
                </form-item>
                <form-item label="预案上级内容:" prop="type">
                  <i-input style="" v-model="formValidateNodes.parentName" @on-focus="selectParentType"></i-input>
                </form-item>
            </i-form>
        </div>
        <div slot="footer">
            <Button size='large' type="primary" @click="saveContentNodes('formValidateNodes')">确定</Button>
            <Button size='large' type="ghost" @click="cancelContentNodes('formValidateNodes')">取消</Button>
        </div>
    </Modal>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    <select-content-modal v-if="contentModal"  @close-content-modal="closeContentModal" @save-content-modal="saveContentModal"></select-content-modal>
  </div>
</template>

<script>
import preliminaryDisposalScheme from './publishPlanNodeDetail/preliminaryDisposalScheme'
import headQuarters from './publishPlanNodeDetail/headQuarters'
import fontHeadQuarters from './publishPlanNodeDetail/fontHeadQuarters'
import sceneHeadQuarters from './publishPlanNodeDetail/sceneHeadQuarters'
import fenHeadQuarters from './publishPlanNodeDetail/fenHeadQuarters'
import memberOrg from './publishPlanNodeDetail/memberOrg'
import expertGroup from './publishPlanNodeDetail/expertGroup'
import securityGroup from './publishPlanNodeDetail/securityGroup'
import orgAnization from './publishPlanNodeDetail/orgAnization'
import fourColorEarlyWarning from './publishPlanNodeDetail/fourColorEarlyWarning'
import perplanTextInfo from './publishPlanNodeDetail/perplanTextInfo'
import gradedResponse from './publishPlanNodeDetail/gradedResponse'
/**资源 */
import resourcesReady from './publishPlanNodeDetail/resourcesReady';
import otherResources from './publishPlanNodeDetail/otherResources'
import disposalTeam from './publishPlanNodeDetail/disposalTeam'
import equipmentEstimation from './publishPlanNodeDetail/equipmentEstimation'
import materialEstimation from './publishPlanNodeDetail/materialEstimation'
import professionalVehicles from './publishPlanNodeDetail/professionalVehicles'
/*避险场所*/
import safeHaven from './publishPlanNodeDetail/safeHaven'
import { mapActions } from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie';
import tree from '@/common/components/treeModal/tree'
import selectContentModal from '@/common/components/selectContent/selectContent'


export default {
  components: {
    safeHaven,
    otherResources,
    disposalTeam,
    equipmentEstimation,
    materialEstimation,
    professionalVehicles,
    preliminaryDisposalScheme,
    perplanTextInfo,
    fourColorEarlyWarning,
    headQuarters,
    memberOrg,
    expertGroup,
    securityGroup,
    orgAnization,
    gradedResponse,
    resourcesReady,
    tree,
    selectContentModal,
    fontHeadQuarters,
    sceneHeadQuarters,
    fenHeadQuarters
  },
  computed: {
    planIdInfo() {
      return this.$store.state.planContent.planDetail.id //planID
    },
    userCode() {
      return Cookies.get('userCode') //userCode
    },
    url() {
      return this.$store.state.userCode.url //url
    },
    pageSize() {
      return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
    },
    tableHeight() {
      const height = this.$store.state.heightTable.tableInfoIndex.tableHeight
      this.height.height = height /*定义好的父框体高度*/
      this.height2.height = height
      return this.height.height
    }
  },
  data () {
    return {
      height: {
        height: '200px',
        'min-width': '240px',
        // 'overflow-y': 'scroll'
      },
      height2: {
        height: '',
        width: '100%',
        border: '1px solid #ccc',
        background: '#fff'
      },
      contentModal: false,
      nodeName: '',
      status: true,
      editNodes: false,
      nodeContentId: null,
      name: '',
      treeMode: false,
      contentStatus: 0,
      memberOrgTree: [],
      name: '',
      templateAddModal: false,
      formValidate: {
        elementType: null,
        type: '',
        parentId: null,
        parentName: '',
        name: ''
      },
      formValidateNodes: {
        name: '',
        id: null,
        typeId: null,
        typeName: ''
      },
      ruleValidate: {
        name: [
            { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        elementType: [
            { required: true, message: '请选择预案元素类型', trigger: 'blur' }
        ]
      },
      ruleValidateNodes: {
        name: [
            { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        // type: [
        //     { required: true, message: '请输入上级节点名称', trigger: 'blur' }
        // ]
      },
      elementType: [],
      nodeElementType: null
    };
  },
  created() {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.setHeightContent(h)
    this.tableHeightMessageIndex(75) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
    this.getTreeAboutContent();
    this.getPlanLibraryTypes();
  },
  methods: {
        ...mapActions([
            'setContentNodeId',
            'saveDemoData',
            'getSelectFlowCOntent',
            'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
            'setHeightContent',/*将获取到的可读高度 存放到VUEX中进行换算*/
            'setQuarteryType',
            'savePublishNodeId'
        ]),
    deleteNodes() {
      const url = this.url + '/plan/planContentNode/removePlanContentNode'
      const data = {
        userCode: this.userCode,
        id: this.nodeContentId
      }
      axios({
        method: 'get',
        url: url,
        params: data
      }).then(
        response => {
          if(response.data.code === 200) {
            this.getTreeAboutContent()
            this.status = true
            this.nodeContentId = null
            this.clearNode();
            this.$Message.info('删除成功')
            this.contentStatus = 0
          } else {
            this.$Message.error(response.data.message)
          }
        }
      ).catch(
        error => {
        }
      )
    },
    saveContentModal(params){
      if(params && params.length > 0) {
        let nodeIdArr = []
        params.forEach((v, i) => {
          nodeIdArr.push(v.id)
        })
        const url = this.url + '/plan/planContentNode/setContentNodes'
        const data = {
          userCode: this.userCode,
          nodeIds: nodeIdArr,
          id: this.planIdInfo,
          parentId: params.parentId
        }
        axios({
          method: 'post',
          url: url,
          data: data
        }).then(
          response => {
            if(response.data.code === 200) {
              this.contentModal = false
              this.getTreeAboutContent()
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
        this.contentModal = false
      }
    },
    setNodesInfo () {
      //打开选择内容弹窗
      const data = {
        url: this.url + '/plan/elementBank/findPlanElement',
        params: {
          userCode: this.userCode,
          planId: this.planIdInfo
        },
        parentId: this.nodeContentId
      }
      this.getSelectFlowCOntent(data)
      this.contentModal = true;
    },
    closeContentModal () {
      //关闭选择内容弹窗
      this.contentModal = false;
    },
    saveContentNodes(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const url = this.url + '/plan/planContentNode/modifyPlanContentNode'
          const params = {
            name: this.formValidateNodes.name,
            id: this.formValidateNodes.id,
            userCode: this.userCode,
            planId: this.planIdInfo,
            parent: {
              id: this.formValidateNodes.parentId
            },
            elementType: this.nodeElementType
          }
          axios({
            method: 'post',
            url: url,
            data: params
          }).then(
            response => {
              if ( response.data.code === 200 ) {
                this.$Message.info('修改成功')
                this.getTreeAboutContent()
                this.status = true
                this.editNodes = false
              } else {
                this.$Message.error('修改失败')
              }
            }
          ).catch(
          );
        } else {
        }
      })
    },
    cancelContentNodes(name) {
      this.editNodes = false
    },
    editNodesInfo() {
      this.editNodes = true
    },
    saveContentInfo(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const url = this.url + '/plan/planContentNode/addPlanContentNode'
          const params = {
            name: this.formValidate.name,
            userCode: this.userCode,
            planId: this.planIdInfo,
            parent: {
              id: this.formValidate.typeId
            },
            elementType: this.formValidate.elementType
          }
          axios({
            method: 'post',
            url: url,
            data: params
          }).then(
            response => {
              if ( response.data.code === 200 ) {
                this.$Message.info('添加成功')
                this.getTreeAboutContent()
                this.templateAddModal = false
              } else {
                this.$Message.error('添加失败')
              }
            }
          ).catch(
          );
        } else {
        }
      })
    },
    cancelContentInfo(name) {
      this.$refs[name].resetFields();
      this.templateAddModal = false
    },
    treeModalClose() {
      this.treeMode = false
    },
    treeModalSave (treeInfo,type) {
      if ( type === '1') {
        this.formValidate.type = treeInfo[0].title
        this.formValidate.typeId = treeInfo[0].id 
      }
      if ( type === 'parentNode' ) {
        if (treeInfo.length<1) {
          this.formValidateNodes.parentId = null;
          this.formValidateNodes.parentName = null;
        } else {
          this.formValidateNodes.parentId = treeInfo[0].id;
          this.formValidateNodes.parentName = treeInfo[0].title;
        }
      }
      this.treeMode = false;
    },
    selectOtherType () {
      let TreeInfo = {
        title: '上级内容节点',
        treeMultiple: false,
        additional: '1',
        request: 'get',
        queryInfo: {
          userCode: this.userCode,
          planId: this.planIdInfo
        },
        url: this.url + '/plan/planContentNode/findPlanContentNodes'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    selectParentType () {
      let TreeInfo = {
        title: '上级内容节点',
        treeMultiple: false,
        additional: 'parentNode',
        request: 'get',
        queryInfo: {
          userCode: this.userCode,
          planId: this.planIdInfo,
          nodeId: this.nodeContentId
        },
        noSelect: true,
        url: this.url + '/plan/planContentNode/findPlanContentNodes'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    queryNodes() {
      this.getTreeAboutContent()
    },
    addNodes() {
      this.formValidate = {
        type: '',
        typeId: '',
        name: ''
      }
      const formValidate = this.formValidateNodes;
      if ( formValidate.id ) {
        this.formValidate.typeId = this.formValidateNodes.id;
        this.formValidate.type = this.formValidateNodes.name;
      }
      this.templateAddModal = true
    },
    seletNode (node) {
      if (node[0]) {
        this.status = false
        localStorage.perplanTextInfo = ''
        localStorage.preliminary = ''
        this.setContentNodeId(node[0].id)
          this.savePublishNodeId(node[0].id)
        this.formValidateNodes.id = node[0].id
        this.nodeContentId = node[0].id
        this.formValidateNodes.name = node[0].title
        if (node[0].parent) {
          this.formValidateNodes.parentId = node[0].parent.id;
          this.formValidateNodes.parentName = node[0].parent.name;
        } else {
          this.formValidateNodes.parentId = null;
          this.formValidateNodes.parentName = '';
        }
        this.name = node[0].title
        this.contentStatus = node[0].elementType;
        this.setQuarteryType(this.contentStatus)
      } else {  
        this.status = true
        return
      }
    },
    getTreeAboutContent() {
      const url = this.url + '/plan/planContentNode/findFBPlanContentNodes'
      const params = {
        userCode: this.userCode,
        planId: this.planIdInfo,
        name: this.nodeName
      }
      axios({
        method: 'get',
        url: url,
        params: params
      }).then(
        response => {
          if ( response.data.code === 200 ) {
            this.memberOrgTree = response.data.data
          }
        }
      ).catch(
      );
    },
     getPlanLibraryTypes() {
       //查询预案类型
        const url = this.url + '/platform/dictionary/getDictionaryByType'
        const data = {
            userCode: this.userCode,
            type: 'plan_element_type'
        }
        axios({
            method: 'get',
            url: url,
            params: data
        }).then(
            response => {
                this.elementType = []
                if(response.data.code === 200) {
                    const res = response.data.data
                    res.forEach((v) => {
                        this.elementType.push({
                            value: v.key,
                            label: v.value
                        })
                    });
                }
            }
        ).catch(
            
        )
    },
    clearNode () {
      this.formValidateNodes = {};
    }
  },
  mounted () {
  },
  destroyed () {
  }
};
</script>

<style scoped>
  .ds-search {
    padding: 10px 5px;
  }
  .ds-flex {
    display: flex;
  }
  .ds-btnList {
    flex-shrink: 0;
    width: 135px;
    text-align: center;
    line-height: 30px;
    margin-left: 5px;
  }
  .plan_content_group_btn {
    float:right;
    margin-right:5px;
    margin-top:5px;
  }
  .plan_content_search {
    margin: 5px 5px 0 5px;
  }
  .ds-content-listBox {
    height: 545px;
    overflow-y: auto;
  }
</style>