<template>
    <!-- 处置流程 -->
  <div class="ds-planTemplate">
    <div>
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>处置流程</h2>
                <!-- <div class="ds-fload-right">
                    <Button type="info" @click="openFlowModal">设置</Button>
                    <Poptip confirm title="您确认删除这条内容吗？" @on-ok="deleteArrow" placement="bottom-end">
                        <Button type="error">删除</Button>
                    </Poptip>
                </div> -->
            </div>
            <div class="ds-flow-content">
                <span v-if="!boxData[0]" class="ds-process-box" @click="seeAllProcess">暂无数据</span>
                <span v-else v-for="(item, index) in boxData" :key="index">
                    <div class="ds-process-box" :class="item.className" @click="seeProcess(index, item.id)">{{item.name}}</div>
                    <span class="ds-point" v-if="item.point">
                        <Icon type="arrow-right-c"></Icon>
                    </span>
                </span>
            </div>
        </div>
    </div>
    <div>
      <!-- <Row> -->
        <i-col span="10">
          <div class="ds-widget-box">
              <div class="ds-widget-title">
                  <span class="ds-title-icon"></span>
                  <h2>处置工作项</h2>
                  <!-- <div class="ds-fload-right">
                    <Button type="info" @click="openSettingModal" :disabled="contrl_dis">设置</Button>
                  </div> -->
              </div>
              <div class="ds-table-box">
                  <Table border highlight-row height="475" :columns="templateHead" :data="getTemplateData" @on-row-click="clickRowsData"></Table>
              </div>
          </div>
        </i-col>
        <i-col span="14">
          <div class="ds-widget-box ds-box">
              <div class="ds-widget-title">
                  <span class="ds-title-icon"></span>
                  <h2>处置措施</h2>
                  <!-- <div class="ds-fload-right">
                      <Button v-if="disStatus" type="warning"  @click="editdisInfo" :disabled="contrl_disable">修改</Button>
                      <Button v-else type="ghost" size="small" style="background: #fff;" @click="savedisInfo">
                          保存
                      </Button>
                  </div> -->
              </div>
              <div class="ds-table-box">
                  <i-input v-model="infoValue" type="textarea" :rows="6" placeholder="请输处置措施" :readonly="disStatus"></i-input>
              </div>
          </div>
          <div class="ds-widget-box ds-box">
              <div class="ds-widget-title">
                  <span class="ds-title-icon"></span>
                  <h2>资源准备</h2>
                  <!-- <div class="ds-fload-right">
                      <Button type="ghost" size="small" style="background: #fff;" @click="openReadyModal" :disabled="contrl_disable">
                          <Icon type="android-settings"></Icon>
                      </Button>
                  </div> -->
              </div>
              <div class="ds-table-box">
                  <Table height="292" border highlight-row :columns="columns1" :data="readyData"></Table>
              </div>
          </div>
        </i-col>
      <!-- </Row> -->
    </div>
    <select-content-modal v-if="contentModal"  @close-work-modal="closeContentModal"></select-content-modal>
    <select-work-modal v-if="workModal" @close-work-modal="closeWorkModal" @save-work-modal="saveWorkModal"></select-work-modal>
    <select-flow-modal v-if="flowModal" @close-node-modal="closeFlowModal"  @save-node-modal="saveNodeModal"></select-flow-modal>
    <modal v-model="eqModal" :title="title" :mask-closable="false" width="600" class-name="vertical-center-modal">
      <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <Row>
          <i-col span="12">
            <form-item label="资源类型" prop="resTypeName">
              <i-input type="text" v-model="formCustom.resTypeName" @on-focus="selectOtherType"></i-input>
            </form-item>
          </i-col>
          <i-col span="12">
            <form-item label="资源名称" prop="name">
              <i-input type="text" v-model="formCustom.name"></i-input>
            </form-item>
          </i-col>
          <i-col span="12">
            <form-item label="规格型号" prop="mode">
              <i-input type="text" v-model="formCustom.mode"></i-input>
            </form-item>
          </i-col>
          <i-col span="12">
            <form-item label="资源数量" prop="counts">
              <i-input type="text" v-model="formCustom.counts"></i-input>
            </form-item>
          </i-col>
          <i-col span="12">
            <form-item label="计量单位" prop="unitName">
              <Select v-model="formCustom.unitId" style="width:200px">
                <Option v-for="item in unit" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </form-item>
          </i-col>
          <i-col span="24">
            <form-item label="资源职能" prop="functions">
              <i-input v-model="formCustom.functions" type="textarea" placeholder="请输入资源职能"></i-input>
            </form-item>
          </i-col>
        </Row>
      </i-form>
      <div slot="footer">
        <Button size='large' type="primary"  @click="handleSubmit('formCustom')">保存</Button>
        <Button  size='large' @click="handleReset('formCustom')">取消</Button>
      </div>
    </modal>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </div>
</template>

<script>
    import selectContentModal from '@/common/components/selectContent/selectContent'
    import selectWorkModal from '@/common/components/selectWorkType/selectWorkType'
    import selectFlowModal from '@/common/components/selectFlowNode/selectFlowNode'
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie'
    import tree from '@/common/components/treeModal/tree'

    export default {
        components: {
            selectContentModal,
            selectWorkModal,
            selectFlowModal,
            tree
        },
        data () {
             // const validateResTypeName = (rule, value, callback) => {
            //   if (!value) {
            //     callback(new Error('请输入资源类型'));
            //   } else {
            //     callback()
            //   }
            // };
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入资源名称'));
                } else {
                    callback()
                }
            };
            const validateMode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入规格型号'));
                } else {
                    callback()
                }
            };
            const validateCounts = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入数量'));
                } else {
                    callback()
                }
            };
            // const validateUnitName = (rule, value, callback) => {
            //     if (!value) {
            //         return callback(new Error('请输入计量单位'));
            //     } else {
            //         callback()
            //     }
            // };
            const validateFunctions = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入资源职能'));
                } else {
                    callback()
                }
            };
            return {
                contrl_dis: true,
                contrl_disable: true,
                height: {
                    height: ''
                },
                height2: {
                    height: '200px',
                    'overflow-y': 'scroll'
                },
                boxData: [],
                treeMode: false,
                unit: [],
                title: '增加资源信息',
                eqModal:false,
                disStatus: true,
                contentModal: false,
                workModal: false,
                flowModal: false,
                templateHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '工作项',
                        key: 'workName',
                        align: 'center'
                    },
                    {
                        title: '重要性',
                        key: 'importantce',
                        width: 80,
                        align: 'center'
                    },
                    // {
                    //     title: '操作',
                    //     key: 'action',
                    //     width: 80,
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         return h('div', [
                    //             h('Poptip', {
                    //               props: {
                    //               confirm: true,
                    //               title: '您确定要删除这条数据吗?',
                    //               transfer: true
                    //               },
                    //               on: {
                    //                   'on-ok': () => {
                    //                       let vm = this
                    //                       vm.deleteProcess(params)
                    //                   }
                    //               }
                    //           }, [
                    //               h('Button', {
                    //               style: {
                    //                   marginRight: '5px'
                    //               },
                    //               props: {
                    //                   size: 'small',
                    //                   placement: 'top'
                    //               }
                    //               }, '删除')
                    //           ])
                    //         ]);
                    //     }
                    // }
                ],
                templateData: [],
                columns1: [
                    {
                        title: '资源名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '资源数量',
                        key: 'count',
                        align: 'center'
                    },
                    {
                        title: '资源职能',
                        key: 'function',
                        align: 'center'
                    }],
                readyData: [],
                infoValue: '',
                formCustom: {
                    resTypeName: '',
                    mode: '',
                    counts: '',
                    unitName: '',
                    unitId: '',
                    functions: '',
                    name: '',
                    category: ''
                },
                ruleCustom: {
                    // resTypeName: [
                    //   { validator: validateResTypeName, trigger: 'blur' }
                    // ],
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    mode: [
                        { validator: validateMode, trigger: 'blur' }
                    ],
                    // unitId: [
                    //     { validator: validateUnitName, trigger: 'change' }
                    // ],
                    counts: [
                        { validator: validateCounts, trigger: 'blur' }
                    ],
                    functions: [
                        { validator: validateFunctions, trigger: 'blur' }
                    ]
                },
                rowId: null,
                processArrowId: null
            }
        },
        computed: {
            getTemplateData() {
                return this.$store.state.processArrow.data
            },
            planIdInfo() {
                return this.$store.state.planContent.planDetail.id //planID
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            }
        },
        created() {
            this.queryIncident()
        },
        methods: {
            clickRowsData(params) {
                const taskId = params.id
                this.rowId = taskId
                const userCode = this.userCode
                const url2 = this.url + '/plan/planProcessNode/findFBPlanTaskResource'//查询任务资源
                const nodeId = this.processArrowId
                this.queryTask(taskId);
                //接口任务资源
                axios({
                    method: 'POST',
                    url: url2,
                    data: {
                        nodeId,
                        taskId,
                        userCode
                    }
                }).then(
                    response => {
                        if (response.data.code === 200 ) {
                            this.contrl_disable = false
                            const res = response.data.data
                            this.readyData = []
                            if(res.list && res.list.length > 0) {
                                res.list.forEach((v, i) => {
                                    this.readyData.push({
                                        name: v.name,
                                        id: v.id,
                                        function: v.function,
                                        count: v.counts
                                    })
                                })
                            }
                        } else {
                            this.$Message.error('请求失败')
                        }
                    }
                ).catch(
                    error => {
                    }
                );
            },
            queryTask (id) {
                const data = {
                    id: id,
                    userCode: this.userCode
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/processTask/getFBProcessTask',
                    params: data
                }).then(
                    response => {
                        if (response.data.code === 200 ) {
                            this.infoValue = response.data.data.measures;
                        }
                    }
                ).catch(
                    error => {
                    }
                );
            },
            rowData() {
                const url2 = this.url + '/plan/planProcessNode/findPlanTaskResource'
                axios({
                    method: 'POST',
                    url: url2,
                    data: {
                        nodeId: this.processArrowId,
                        taskId: this.rowId,
                        userCode: this.userCode
                    }
                }).then(
                    response => {
                        if (response.data.code === 200 ) {
                            const res = response.data.data
                            this.readyData = []
                            if(res.list && res.list.length > 0) {
                                res.list.forEach((v, i) => {
                                    this.readyData.push({
                                        name: v.name,
                                        id: v.id,
                                        function: v.function,
                                        count: v.counts
                                    })
                                })
                            }
                        } else {
                            this.$Message.error('请求失败')
                        }
                    }
                ).catch(
                    error => {
                    }
                );
            },
            ...mapActions([
                'getSelectFlowNode',//获取节点
                'getSelectFlowWork', //获取工作项
                'getNewDisposalList',
                'saveDemoData',
                'getNewDisposalList',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            openSettingModal () {
                //打开选择处置工作项弹窗
                 const params = {
                    url: this.url + '/plan/planProcessNode/findTaskBankNodeToSel',
                    params: {
                        userCode: this.userCode,
                        planId: this.planIdInfo,
                        nodeId: this.processArrowId
                    }
                }
                this.getSelectFlowWork(params)
                this.workModal = true;
            },
            closeWorkModal () {
                //关闭选择处置工作项弹窗
                this.workModal = false
            },
            openFlowModal () {
                //打开选择流程节点
                const params = {
                    url: this.url + '/plan/planProcessNode/findProcessBankNodeToSel',
                    params: {
                        userCode: this.userCode,
                        planId: this.planIdInfo
                    }
                }
                this.getSelectFlowNode(params)
                this.flowModal = true;
            },
            closeFlowModal () {
                this.flowModal = false
                //关闭选择流程节点
            },
            openContentModal () {
                //打开选择内容弹窗
                this.contentModal = true;
            },
            closeContentModal () {
                //关闭选择内容弹窗
                this.contentModal = false;
            },
            deleteProcess(data) {
                const id = data.row.id
                const url = this. url + '/plan/processTask/removeProcessTask'
                const params = {
                    id,
                    userCode: this.userCode
                }
                axios({
                    method: 'get',
                    url: url,
                    params: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            this.getTemplateData.splice(data.index ,1)
                            this.$Message.info('删除成功!')
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            deleteReadyProcess(data) {
                const id = data.row.id
                const url = this.url + '/plan/planProcessNode/removeTaskResource'
                const params = {
                    id,
                    userCode: this.userCode
                }
                axios({
                    method: 'get',
                    url: url,
                    params: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            this.readyData.splice(data.index ,1)
                            this.$Message.info('删除成功!')
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            deleteArrow() {
                const id = this.processArrowId
                if(!id) {
                    this.$Message.error('请选择需要删除流程')
                    return
                } else {
                    const url = this.url + '/plan/planProcessNode/removeProcessNode'
                    const data = {
                        userCode: this.userCode,
                        id
                    }
                    axios({
                        method: 'get',
                        url: url,
                        params: data
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.info('删除成功')
                                this.queryIncident()
                            } else {
                                this.$Message.error(response.data.message)
                            }
                        }
                    ).catch(
                        error => {
                        }
                    );
                }
            },
            saveNodeModal(params) {
                if(params && params.length > 0) {
                    let nodeIds = []
                    params.forEach((v, i) => {
                        nodeIds.push(v.id)
                    })
                    const url = this.url + '/plan/planProcessNode/setProcessNodes'
                    const data = {
                        userCode: this.userCode,
                        planId: this.planIdInfo,
                        nodeIds
                    }
                    axios({
                        method: 'post',
                        url: url,
                        data: data
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                this.flowModal = false
                                this.queryIncident()
                            } else {
                                this.$Message.info('保存失败')
                            }
                        }
                    ).catch(
                        error => {
                            
                        }
                    )
                } else {
                    this.flowModal = false
                }
            },
            saveWorkModal(params){
                if(params && params.length > 0) {
                    let taskIds = []
                    params.forEach((v, i) => {
                        taskIds.push(v.id)
                    })
                    const url = this.url + '/plan/processTask/setProcessTask'
                    const data = {
                        userCode: this.userCode,
                        taskIds,
                        nodeId: this.processArrowId
                    }
                    axios({
                        method: 'post',
                        url: url,
                        data: data
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                this.workModal = false
                                const data = {
                                    url: this.url + '/plan/processTask/findFBProcessTask',
                                    data: {
                                        userCode: this.userCode,
                                        nodeId: this.processArrowId
                                    }
                                }
                                this.getNewDisposalList(data)
                            } else {
                                this.$Message.info('保存失败')
                            }
                        }
                    ).catch(
                        error => {
                            
                        }
                    )
                } else {
                    this.workModal = false
                }
            },
            editdisInfo() {
                this.disStatus = false
            },
            savedisInfo() {
                const url = this.url + '/plan/processTask/modifyProcessTask'
                const info = {
                    userCode: this.userCode,
                    measures: this.infoValue,
                    id: this.rowId
                }
                axios({
                    method: 'post',
                    url: url,
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('操作成功!');
                            this.disStatus = true
                        }
                    }
                ).catch(
                    
                );
            },
            openReadyModal() {
                this.title = '增加资源信息'
                this.formCustom = {
                    resTypeId: '',
                    resTypeName: '',
                    mode: '',
                    counts: '',
                    unitName: '',
                    unitId: '',
                    functions: '',
                    name: '',
                    category: ''
                }
                //计量单位列表查询
                this.queryUnit();
                this.eqModal = true
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const par = this.formCustom;
                        const info = {
                            category: par.category,
                            counts: par.counts,
                            function: par.functions,
                            mode: par.mode,
                            name: par.name,
                            nodeId: this.processArrowId,
                            taskId: this.rowId,
                            unitId: par.unitId,
                            userCode: this.userCode,
                            resTypeId: par.resTypeId,
                            resTypeName: par.resTypeName
                        }
                        const url = this.url + '/plan/planProcessNode/addTaskResource';
                        axios({
                            method: 'post',
                            url: url,
                            data: info
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.success('操作成功!');
                                    //重新查询列表
                                    this.rowData();
                                    this.eqModal = false;
                                }
                            }
                        ).catch(
                            
                        );
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
                this.eqModal = false
            },
            selectOtherType () {
                //打开查询类型弹窗
                let TreeInfo = {
                    title: '物资类型',
                    treeMultiple: false,
                    additional: 'otherType',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryResourceTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            treeModalClose () {
                this.treeMode = false;
            },
            treeModalSave (treeInfo,type) {
                this.formCustom.resTypeId = treeInfo[0].id;
                this.formCustom.resTypeName = treeInfo[0].title;
                this.formCustom.category = treeInfo[0].parentId;
                this.treeMode = false;
            },
            queryUnit () {
                //计量单位列表查询
                let unitInfo = {
                    userCode: this.userCode,
                    type: 'RESOURCE_UNIT'
                }
                axios({
                    method: 'get',
                    url: this.url + '/platform/dictionary/getDictionaryByType',
                    params: unitInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                        const list = response.data.data;
                        const newList = [];
                        for ( let i=0;i<list.length;i++ ) {
                            newList.push({
                                value: parseInt(list[i].key),
                                label: list[i].value
                            })
                        }
                        this.unit = newList;
                        }
                    }
                ).catch(
                    
                )
            },
            seeAllProcess () {
                this.clearProcessBg();
                this.className = 'ds-active';
            },
            clearProcessBg () {
                const nodes = this.boxData;
                for ( let i=0;i<nodes.length;i++) {
                    this.$set(this.boxData[i], 'className' , '');
                }
            },
            seeProcess (index, id) {
                this.processArrowId = id
                this.className = '';
                this.clearProcessBg();
                this.boxData[index].className = 'ds-active';
                this.contrl_dis = false
                this.queryGetTemplateData();
                this.clearProcess();
            },
            clearProcess () {
                this.infoValue = '';
                this.readyData = [];
            },
            queryIncident () {
                //事件信息查询
                const queryO = {
                    userCode: this.userCode,
                    planId: this.planIdInfo
                }
                axios({
                    method: 'get',
                    url: this.url+'/plan/planProcessNode/findFBProcessNode',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.incidentInfo = response.data.data;
                            const nodes = response.data.data;
                            for ( let i=0;i<nodes.length;i++) {
                                nodes[i].point = true;
                                if ( i === nodes.length -1 ) {
                                    nodes[i].point = false;
                                }
                            }
                            this.boxData = nodes;
                        }
                    }
                ).catch(
                    
                );
            },
            queryGetTemplateData() {
                const data = {
                    url: this.url + '/plan/processTask/findFBProcessTask',
                    data: {
                        userCode: this.userCode,
                        nodeId: this.processArrowId
                    }
                }
                this.getNewDisposalList(data)
            }
        }
    }
</script>

<style scoped>
  .ds-flow-content {
    height: 50px;
  }
  textarea.ivu-input {
    height: 200px!important;
  }
  .ds-flow-content {
        height: 60px;
    }
    .addNodeContent {
        /* height:150px; */
        height: auto;
        border:1px solid #ccc;
        background:#FFF;
    }
    .ds-process-box {
        border:1px solid #ccc;
        padding:10px 20px;
        margin: 10px 5px;
        display: inline-block;
        /* width: 100px; */
        text-align: center;
        cursor: pointer;
    }
    .ds-active {
        background: #2d90e6;
        color: #fff;
    }
    .ds-point {
        padding-right: 5px;
    }
    .ds-point .ivu-icon {
        vertical-align: middle;
        color: #ccc;
    }
    .ivu-form-item {
        margin-bottom: 10px;
    }
    .ds-incident-box {
        margin-right: 10px;
    }
    .box-content {
        height: 100px;
        overflow: auto;
        padding:20px 0;
    }
</style>

