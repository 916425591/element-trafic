<template>
    <!-- 处置流程 -->
  <div class="ds-planTemplate">
    <div>
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>处置流程</h2>
                <div class="ds-fload-right">
                    <Button type="success" @click="openFlowModel">新增</Button>
                    <Button type="info" @click="openFlowModal">设置</Button>
                    <Button type="warning" @click="openSortModel">排序</Button>
                    <Poptip confirm title="您确认删除这条内容吗？" @on-ok="deleteArrow" placement="bottom-end">
                        <Button type="error">删除</Button>
                    </Poptip>
                </div>
            </div>
            <div class="ds-flow-content">
                <span v-if="!boxData[0]" class="ds-process-box" @click="seeAllProcess">暂无数据</span>
                <span v-else v-for="(item, index) in boxData" :key="index">
                    <div class="ds-process-box" :class="item.className" @click="seeProcess(index, item)">{{item.name}}</div>
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
          <div class="ds-widget-box ds-box" :style='height' :data-json="tableHeight">
              <div class="ds-widget-title">
                  <span class="ds-title-icon"></span>
                  <h2>处置工作项</h2>
                  <div class="ds-fload-right">
                    <Button type="success" @click="oepnWorkItemModel" :disabled="contrl_dis">新增</Button>
                    <Button type="warning"  @click="editWorkItem" :disabled="contrl_dis">修改</Button>
                    <Button type="info" @click="openSettingModal" :disabled="contrl_dis">设置</Button>
                  </div>
              </div>
              <div class="ds-table-box">
                  <Table border highlight-row :columns="templateHead" :data="workItemData" @on-row-click="clickRowsData"></Table>
              </div>
          </div>
        </i-col>
        <i-col span="14">
          <div class="ds-widget-box ds-box">
              <div class="ds-widget-title">
                  <span class="ds-title-icon"></span>
                  <h2>处置措施</h2>
                  <div class="ds-fload-right">
                      <Button v-if="disStatus" type="warning"  @click="editdisInfo" :disabled="contrl_disable">修改</Button>
                      <Button v-else type="ghost" size="small" style="background: #fff;" @click="savedisInfo">
                          保存
                      </Button>
                  </div>
              </div>
              <div class="ds-table-box">
                  <i-input v-model="infoValue" type="textarea" :rows="6" placeholder="请输处置措施" :readonly="disStatus"></i-input>
              </div>
          </div>
          <div class="ds-widget-box ds-box" :style="height2">
              <div class="ds-widget-title">
                  <span class="ds-title-icon"></span>
                  <h2>资源准备</h2>
                  <div class="ds-fload-right">
                      <Button type="info" @click="openReadyModal" :disabled="contrl_disable">设置</Button>
                  </div>
              </div>
              <div class="ds-table-box">
                  <Table height="300" border highlight-row :columns="columns1" :data="readyData"></Table>
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
    <modal v-model="sortModel" title="处置流程排序" :mask-closable="false" width="600" class-name="vertical-center-modal">
      <div class="ds-sort-box">
          <Table border :columns="sortHead" :data="sortData"></Table>
      </div>
      <div slot="footer">
      </div>
    </modal>
    <Modal v-model="maintainModal" :mask-closable="false" width="600" @on-cancel="cancelPlanFlow('formValidate')">
        <p slot="header" style="color:#f60;text-align:center">
            <span>流程节点维护</span>
        </p>
        <div style="text-align:left;max-height:400px;over-flow:auto;">
            <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                <form-item label="节点名称：" prop="name">
                    <i-input style="" v-model="formValidate.name"></i-input>
                </form-item>
                <form-item label="节点描述：" prop="desc">
                    <i-input v-model="formValidate.desc" type="textarea" :rows="4" placeholder="请输入预案元素描述"></i-input>
                </form-item>
            </i-form>
        </div>
        <div slot="footer">
            <Button type="primary" @click="savePlanFlow('formValidate')">确定</Button>
            <Button type="ghost" @click="cancelPlanFlow('formValidate')">取消</Button>
        </div>
    </Modal>
    <Modal v-model="workItemModal" :mask-closable="false" width="600" @on-cancel="cancelPlanLibrary('workItemInfo')">
        <p slot="header" style="color:#f60;text-align:center">
            <span>工作项维护</span>
        </p>
        <div style="text-align:left;max-height:400px;over-flow:auto;">
            <i-form ref="workItemInfo" :model="workItemInfo" :rules="workItemCustom" :label-width="110">
                <Row>
                <i-col span="12">
                    <form-item label="工作项类型：" prop="taskType">
                        <Select v-model="workItemInfo.taskType">
                            <Option v-for="(item, index) in workType" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                    </form-item>
                </i-col>
                <i-col span="12">
                    <form-item label="重要程度：" prop="importance">
                        <Select v-model="workItemInfo.importance">
                            <Option v-for="(item, index) in importanceType" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                    </form-item>
                </i-col>
                <i-col span="12">
                    <form-item label="工作项名称：" prop="name">
                        <i-input type="text" v-model="workItemInfo.name" placeholder="请输入工作项名称"></i-input>
                    </form-item>
                </i-col>
                <i-col span="12">
                    <form-item label="执行者类型：" prop="executorType">
                    <Select v-model="workItemInfo.executorType">
                        <Option v-for="(item, index) in executorTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                    </form-item>
                </i-col>
                <i-col span="24">
                    <form-item label="处置措施：" prop="measures">
                        <i-input v-model="workItemInfo.measures" :rows="4" type="textarea" placeholder="请输入处置措施"></i-input>
                    </form-item>
                </i-col>
                </Row>
            </i-form>
        </div>
        <div slot="footer">
            <Button type="primary" @click="savePlanLibrary('workItemInfo')">确定</Button>
            <Button type="ghost" @click="cancelPlanLibrary('workItemInfo')">取消</Button>
        </div>
    </Modal>
    <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
    import selectContentModal from '@/common/components/selectContent/selectContent'
    import selectWorkModal from '@/common/components/selectWorkType/selectWorkType'
    import selectFlowModal from '@/common/components/selectFlowNode/selectFlowNode'
    import axios from 'axios'
    import { mapActions } from 'vuex'
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
            const validatetaskType = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请选择工作项类型'));
                } else {
                    callback()
                }
            };
            const validateimportance = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择重要程度'));
                } else {
                    callback()
                }
            };
            const validatename = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入工作项名称'));
                } else {
                    callback()
                }
            };
            const validateexecutorType = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择执行者类型'));
                } else {
                    callback()
                }
            };
            const validatemeasures = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入处置措施'));
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
                    height: '',
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
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '重要性',
                        key: 'importanceName',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
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
                                          vm.deleteProcess(params)
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
                workItemData: [],
                templateData: [],
                columns1: [
                    {
                        title: '资源名称',
                        key: 'name',
                        align: 'center',
                    },
                    {
                        title: '资源数量',
                        key: 'count',
                        align: 'center',
                    },
                    {
                        title: '资源职能',
                        key: 'function',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
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
                                          vm.deleteReadyProcess(params)
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
                        { required: true, validator: validateName, trigger: 'blur' }
                    ],
                    mode: [
                        { required: true, validator: validateMode, trigger: 'blur' }
                    ],
                    // unitId: [
                    //     { validator: validateUnitName, trigger: 'change' }
                    // ],
                    counts: [
                        { required: true, validator: validateCounts, trigger: 'blur' }
                    ],
                    functions: [
                        { required: true, validator: validateFunctions, trigger: 'blur' }
                    ]
                },
                rowId: null,
                processArrowId: null,
                sortModel: false,
                sortHead: [
                    {
                        title: '流程节点',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '排序',
                        key: 'action',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                  h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        size: 'small',
                                        placement: 'top',
                                        icon: "arrow-up-c"
                                    },
                                    on: {
                                        click: () => {
                                            this.sortUp(params);
                                        }
                                    }
                                  }),
                                  h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        size: 'small',
                                        placement: 'top',
                                        icon: "arrow-down-c"
                                    },
                                    on: {
                                        click: () => {
                                            this.sortDown(params);
                                        }
                                    }
                                  })
                            ]);
                        }
                    }
                ],
                sortData: [
                    
                ],
                maintainModal: false,
                formValidate: {
                    desc: '',
                    name: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入预案名称', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入预案元素描述', trigger: 'blur' }
                    ]
                },
                workItemModal: false,
                workItemInfo: {
                    taskType: '',
                    importance: '',
                    name: '',
                    executorType: '',
                    measures: ''
                },
                workType: [],
                importanceType: [],
                executorTypeList: [],
                selectworkItemNode: [],
                workItemCustom: {
                    taskType: [
                        { required: true, validator: validatetaskType, trigger: 'change' }
                    ],
                    importance: [
                        { required: true, validator: validateimportance, trigger: 'change' }
                    ],
                    name: [
                        { required: true, validator: validatename, trigger: 'blur' }
                    ],
                    executorType: [
                        { required: true, validator: validateexecutorType, trigger: 'change' }
                    ],
                    measures: [
                        { required: true, validator: validatemeasures, trigger: 'blur' }
                    ]
                },
                selectFlowNode: {}
            }
        },
        computed: {
            getTemplateData() {
                return this.$store.state.processArrow.data
            },
            planIdInfo() {
                return this.$store.state.userCode.planId //planID
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
                const height = this.$store.state.heightTable.tableInfo.tableHeight
                this.height.height = height /*定义好的父框体高度*/
                this.height2.height = (parseInt(height) - 185) + 'px'
                return this.height.height
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(170) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.queryIncident()
        },
        methods: {
            clickRowsData(params, index) {
                this.selectworkItemNode = params;
                this.selectworkItemNode.index = index;
                const taskId = params.id
                this.rowId = taskId
                const userCode = this.userCode
                const url2 = this.url + '/plan/planProcessNode/findPlanTaskResource'//查询任务资源
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
                    url: this.url + '/plan/processTask/getProcessTask',
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
                            this.workItemData.splice(data.index ,1);
                            this.addSuccessClear();
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
                                this.$Message.info('删除成功');
                                this.queryIncident();
                                this.clearSelectFlow();
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
                        method: 'POST',
                        url: url,
                        data: data
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                this.workModal = false
                                // const data = {
                                //     url: this.url + '/plan/processTask/findProcessTask',
                                //     data: {
                                //         userCode: this.userCode,
                                //         nodeId: this.processArrowId
                                //     }
                                // }
                                // this.getNewDisposalList(data)
                                this.getNewDisposalLists();
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
                    searchShow: true,
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
                    this.$set(this.boxData[i], 'see' , false);
                }
            },
            seeProcess (index, params) {
                if ( !params.see) {
                    this.selectFlowNode = params;
                    this.selectFlowNode.index = index;
                    this.processArrowId = params.id
                    this.className = '';
                    this.clearProcessBg();
                    this.boxData[index].see = true;
                    this.boxData[index].className = 'ds-active';
                    this.contrl_dis = false
                    this.queryGetTemplateData();
                    this.clearProcess();
                } else {
                    this.selectFlowNode = {};
                    this.boxData[index].see = false;
                    this.boxData[index].className = '';
                    this.clearSelectFlow();
                    this.clearProcess();
                }
            },
            clearSelectFlow () {
                this.contrl_dis = true;
                this.workItemData = [];
            },
            clearProcess () {
                this.infoValue = '';
                this.readyData = [];
                this.contrl_disable = true;
            },
            queryIncident () {
                //事件信息查询
                const queryO = {
                    userCode: this.userCode,
                    planId: this.planIdInfo
                }
                axios({
                    method: 'get',
                    url: this.url+'/plan/planProcessNode/findProcessNode',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.incidentInfo = response.data.data;
                            const nodes = response.data.data;
                            this.sortData = [];
                            for ( let i=0;i<nodes.length;i++) {
                                nodes[i].point = true;
                                nodes[i].see = false;
                                if ( i === nodes.length -1 ) {
                                    nodes[i].point = false;
                                }
                                this.sortData.push(nodes[i]);
                            }
                            this.boxData = nodes;
                        }
                    }
                ).catch(
                    
                );
            },
            queryGetTemplateData() {
                // const data = {
                //     url: this.url + '/plan/processTask/findProcessTask',
                //     data: {
                //         userCode: this.userCode,
                //         nodeId: this.processArrowId
                //     }
                // }
                // this.getNewDisposalList(data)
                this.getNewDisposalLists();
            },
            getNewDisposalLists () {
                const data = {
                    userCode: this.userCode,
                    nodeId: this.processArrowId
                }
                console.log(this.processArrowId)
                axios({
                    method: 'get',
                    url: this.url + '/plan/processTask/findProcessTask',
                    params: data
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            this.workItemData = response.data.data
                        }
                    }
                ).catch( 
                    error => {
                        
                    }
                )
            },
            openSortModel () {
                this.sortModel = true;
            },
            saveSortModel () {
                const nodes = this.sortData;
                for ( let i=0;i<nodes.length;i++) {
                    nodes[i].point = true;
                    nodes[i].see = false;
                    if ( i === nodes.length -1 ) {
                        nodes[i].point = false;
                    }
                }
                this.boxData = nodes;
            },
            closeSortModel () {
                this.sortModel = false;
            },
            sortUp (params) {
                const index = params.index;
                if (index === 0) {
                    return
                } else {
                    const data = {
                        userCode: this.userCode,
                        preId: params.row.id,
                        suffId: this.sortData[index-1].id
                    }
                    axios({
                        method: 'get',
                        url: this.url + '/plan/planProcessNode/switchPlanProcessNodeOrders',
                        params: data
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                this.sortData[index] = this.sortData.splice(index-1, 1, this.sortData[index])[0];
                                this.saveSortModel();
                            }
                        }
                    ).catch( 
                        error => {
                            
                        }
                    )
                    
                }
            },
            sortDown (params) {
                const index = params.index;
                const lastIndex = this.sortData.length-1;
                if (index === lastIndex) {
                    return
                } else {
                    const data = {
                        userCode: this.userCode,
                        preId: params.row.id,
                        suffId: this.sortData[index+1].id
                    }
                    axios({
                        method: 'get',
                        url: this.url + '/plan/planProcessNode/switchPlanProcessNodeOrders',
                        params: data
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                this.sortData[index] = this.sortData.splice(index+1, 1, this.sortData[index])[0];
                                this.saveSortModel();
                            }
                        }
                    ).catch( 
                        error => {
                            
                        }
                    )
                    
                }
            },
            openFlowModel () {
                this.maintainModal = true;
            },
            savePlanFlow (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const afterNodeId = this.selectFlowNode.id;
                        const data = {
                            userCode: this.userCode,
                            afterNodeId: this.selectFlowNode.id,
                            description: this.formValidate.desc,
                            name: this.formValidate.name,
                            plan: {
                                id: this.planIdInfo
                            }
                        }
                        axios({
                            method: 'post',
                            url: this.url + '/plan/planProcessNode/insertProcessNode',
                            data: data
                        }).then(
                            response => {
                                if(response.data.code === 200) {
                                    const newInfo = response.data.data;
                                    if (afterNodeId) {
                                        const newNode = {
                                            id: newInfo.id,
                                            name: newInfo.name,
                                            orders: newInfo.orders,
                                            point: true,
                                            see: false
                                        }
                                        const index = this.selectFlowNode.index;
                                        this.boxData.splice(index, 0, newNode);
                                    } else {
                                        const lastIndex = this.boxData.length;
                                        this.boxData[lastIndex-1].point = true;
                                        this.boxData.push({
                                            id: newInfo.id,
                                            name: newInfo.name,
                                            orders: newInfo.orders,
                                            point: false,
                                            see: false
                                        })
                                    }
                                    this.cancelPlanFlow('formValidate');
                                    this.sortData = [];
                                    for ( let i=0;i<this.boxData.length;i++ ) {
                                        this.sortData.push(
                                            this.boxData[i]
                                        )
                                    }
                                }
                            }
                        ).catch( 
                            error => {
                                
                            }
                        )
                        
                        
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            cancelPlanFlow (name) {
                this.$refs[name].resetFields();
                this.maintainModal = false
            },
            oepnWorkItemModel () {
                this.getPlanLibraryTypes();
                this.getPlanExecutorTypes();
                this.getPlanImportanceTypes();
                this.workItemModal = true;
            },
            savePlanLibrary (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let url
                        const info = this.workItemInfo;
                        info.userCode = this.userCode;
                        info.afterTaskId = this.selectworkItemNode.id;
                        info.processNode = {
                            id: this.selectFlowNode.id
                        }
                        info.plan = {
                            id: this.planIdInfo
                        }
                        if(this.workItemInfo.id) {
                            url = this.url + '/plan/processTask/modifyProcessTask'
                        } else {
                            url = this.url + '/plan/processTask/addProcessTask'
                        }
                        console.log(info)
                        axios({
                            method: 'post',
                            url: url,
                            data: info
                        }).then(
                            response => {
                                this.$Message.success('操作成功!');
                                this.getNewDisposalLists();
                                this.addSuccessClear();
                                this.cancelPlanLibrary('workItemInfo');
                            }
                        ).catch(
                            error => {
                                
                            }
                        )
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            addSuccessClear () {
                this.selectworkItemNode = {};
                this.contrl_disable = true;
                this.infoValue = '';
                this.readyData = [];
            },
            cancelPlanLibrary(name) {
                this.$refs[name].resetFields();
                this.workItemModal = false;
            },
            getPlanLibraryTypes() {
                const url = this.url + '/platform/dictionary/getDictionaryByType'
                const data = {
                    userCode: this.userCode,
                    type: 'plan_task_type'
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
                                this.workType.push({
                                    value: v.key,
                                    label: v.value
                                })
                            });
                        }
                    }
                ).catch(
                    
                )
            },
            getPlanExecutorTypes() {
                const url = this.url + '/platform/dictionary/getDictionaryByType'
                const data = {
                    userCode: this.userCode,
                    type: 'plan_executor_type'
                }
                axios({
                    method: 'get',
                    url: url,
                    params: data
                }).then(
                    response => {
                        this.executorTypeList = []
                        if(response.data.code === 200) {
                            const res = response.data.data
                            res.forEach((v) => {
                                this.executorTypeList.push({
                                    value: v.key,
                                    label: v.value
                                })
                            });
                        }
                    }
                ).catch(
                    
                )
            },
            getPlanImportanceTypes() {
                const url = this.url + '/platform/dictionary/getDictionaryByType'
                const data = {
                    userCode: this.userCode,
                    type: 'plan_task_importance'
                }
                axios({
                    method: 'get',
                    url: url,
                    params: data
                }).then(
                    response => {
                        this.importanceType = []
                        if(response.data.code === 200) {
                            const res = response.data.data
                            res.forEach((v) => {
                                this.importanceType.push({
                                    value: v.key,
                                    label: v.value
                                })
                            });
                        }
                    }
                ).catch(
                    
                )
            },
            editWorkItem () {
                const id = this.selectworkItemNode.id;
                if (id) {
                    this.getPlanLibraryTypes();
                    this.getPlanExecutorTypes();
                    this.getPlanImportanceTypes();
                    console.log(this.selectworkItemNode)
                    this.queryWorkInfo();
                    this.workItemModal = true;
                } else {
                    this.$Message.warning('请先选择处置工作项')
                }
            },
            queryWorkInfo (){
                const data = {
                    userCode: this.userCode,
                    id: this.selectworkItemNode.id
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/processTask/getProcessTask',
                    params: data
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            this.workItemInfo = response.data.data;
                        }
                    }
                ).catch(
                    
                )
            }
        }
    }
</script>

<style scoped>
  .ds-flow-content {
    height: 50px;
    overflow-y: auto;
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
    /* .ivu-form-item {
        margin-bottom: 10px;
    } */
    .ds-incident-box {
        margin-right: 10px;
    }
    .box-content {
        height: 100px;
        overflow: auto;
        padding:20px 0;
    }
    .ds-sort-box {
        height: 400px;
        overflow-y: auto;
    }
</style>

