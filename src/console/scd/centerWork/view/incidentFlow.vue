<template>
    <div>
        <Row>
            <i-col span="10">
                <div class="ds-widget-box ds-box" :style="height" :data-json="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>处置工作项</h2>
                        <div v-if="workBtnShow" class="ds-fload-right">
                            <Button type="success" @click="addWorkItem">
                                新增
                            </Button>
                            <Button type="warning" @click="editWorkItem">
                                修改
                            </Button>
                            <Button type="error" @click="deleteWorkItem">删除</Button>
                        </div>
                    </div>
                    <div class="ds-table-box">
                        <Table border :height="workHeight" highlight-row :columns="workHead" :data="workData" @on-row-click="workSelectTable"></Table>
                    </div>
                </div>
            </i-col>
            <i-col span="14">
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>处置措施</h2>
                    </div>
                    <div class="ds-measures">{{ measures }}</div>
                </div>
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>调度记录</h2>
                        <div v-if="registerBtnShow" class="ds-fload-right">
                            <Button type="success" @click="openRegisterModal">
                                调度
                            </Button>
                            <Button type="primary" @click="showDispatchModal">
                                详情
                            </Button>
                            <Button type="warning" @click="openOutInfoModal">
                                查看出动
                            </Button>
                            <Button type="info" @click="openFeedbackModal">
                                查看反馈
                            </Button>
                        </div>
                    </div>
                    <div class="ds-table-box">
                        <Table border :height="dispatchHeight" highlight-row :columns="recordHead" :data="recordData" @on-row-click="dispatchSelectTable"></Table>
                    </div>


                    <!--大刀阔斧的改开始-->
                    <el-table :data="recordData" border style="width: 100%;background: #000">
                        <!--下拉-->
                        <el-table-column prop="dispatchTime" label="调度时间" width=""></el-table-column>
                        <el-table-column prop="content" label="调度内容" width=""></el-table-column>
                        <el-table-column prop="content" label="状态" width=""></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--大刀阔斧修改结束-->

                </div>
            </i-col>
        </Row>
        <!-- 调度信息 -->
        <modal v-model="dispatchModal" title="调度信息" :mask-closable="false" width="600" @on-cancel="closeDispatchModal" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form :model="dispatchInfo" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="执行者类型： ">
                                <span>{{ dispatchInfo.executorTypeName}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="执行者： ">
                                <span>{{ dispatchInfo.executor }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="当前状态： ">
                                <span>{{ dispatchInfo.statusName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="调度时间： ">
                                <span>{{ dispatchInfo.dispatchTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="任务内容： ">
                                <span>{{ dispatchInfo.content }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="注意事项： ">
                                <span>{{ dispatchInfo.attention }}</span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>所需资源</h2>
                </div>
                <div class="ds-table-box">
                    <Table border ref="selection" highlight-row size="small" height="237" :columns="dispatchHead" :data="dispatchData"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" v-if="showReceive"  @click="receiveDispatch">辅助接收</Button>
                <Button size="large"  @click="closeDispatchModal">关闭</Button>
            </div>
        </modal>
        <!-- 出动信息 -->
        <see-out-info v-if="outInfoModal" @close-modal="closeOutInfoModal" ref="seeOutInfo"></see-out-info>
        <!-- 反馈信息 -->
        <see-feedback v-if="feedbackModal" @close-modal="closefeedbackInfoModal" ref="seeFeedback"></see-feedback>
        <!-- 调度登记 -->
        <modal v-model="registerModal" title="调度登记" :mask-closable="false" width="600" @on-cancel="closeregisterModal('register')" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="register" :model="register" :rules="registerCustom" :label-width="110">
                    <Row>
                        <i-col span="24">
                            <form-item label="执行单位： " prop="executorOrgName">
                                <i-input type="text" v-model="register.executorOrgName" @on-focus="openOrgModal"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="执行者类型： " prop="executorType">
                                <Select v-model="register.executorType">
                                    <Option v-for="item in executorTypeList" :value="item.value" :key="item.key">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="执行者： " prop="executor">
                                <i-input type="text" v-model="register.executor" @on-focus="openTableModal"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="任务描述： " prop="content">
                                <i-input type="textarea" :rows="3" v-model="register.content"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="注意事项： " prop="attention">
                                <i-input type="textarea" :rows="3" v-model="register.attention"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
                <div class="ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>所需资源</h2>
                        <div class="ds-fload-right">
                            <Button type="success" @click="openAddregisterResourceModal">
                                新增
                            </Button>
                            <Button type="warning" @click="openEditregisterResourceModal">
                                修改
                            </Button>
                        </div>
                    </div>
                    <div class="ds-table-box">
                        <Table border ref="selection" highlight-row size="small" height="200" :columns="resourceHead" :data="resourceData" @on-row-click="registerSelectTable"></Table>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveRegister('register')">确定</Button>
                <Button size="large"  @click="closeregisterModal('register')">关闭</Button>
            </div>
        </modal>
        <!-- 所需资源登记 -->
        <modal v-model="registerResourceModal" title="所需资源登记" :mask-closable="false" width="400" @on-cancel="closeregisterResourceModal('registerResource')" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="registerResource" :model="registerResource" :rules="registerResourceCustom" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="资源类型： " prop="resTypeName">
                                <i-input type="text" v-model="registerResource.resTypeName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="资源数量： " prop="count">
                                <i-input type="text" v-model="registerResource.count"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="计量单位： " prop="unitName">
                                <i-input type="text" v-model="registerResource.unitName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="资源说明： " prop="description">
                                <i-input type="textarea" v-model="registerResource.description" :rows="3"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveregisterResource('registerResource')">确定</Button>
                <Button size="large"  @click="closeregisterResourceModal('registerResource')">关闭</Button>
            </div>
        </modal>
        <!-- 工作项维护 -->
        <modal v-model="workItemModal" title="自定义工作项" :mask-closable="false" width="600" @on-cancel="closeWorkModal" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="workInfo" :model="workInfo" :rules="workCustom" :label-width="110">
                    <Row>
                        <i-col span="12">
                            <form-item label="工作项类型： " prop="taskType">
                                <Select v-model="workInfo.taskType">
                                    <Option v-for="item in workType" :value="item.value" :key="item.key">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                             <form-item label="重要程度：" prop="taskType">
                                <Select v-model="workInfo.importance">
                                    <Option v-for="item in workImportance" :value="item.value" :key="item.key">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="工作项名称： " prop="name">
                                <i-input type="text" v-model="workInfo.name"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="处置措施： " prop="measures">
                                <i-input type="textarea" v-model="workInfo.measures" :rows="3"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="执行者类型： " prop="executorType">
                                <Select v-model="workInfo.executorType">
                                    <Option v-for="item in executorTypeList" :value="item.value" :key="item.key">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="执行者描述： " prop="executorDesc">
                                <i-input type="textarea" v-model="workInfo.executorDesc" :rows="3"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveWorkItem('workInfo')">确定</Button>
                <Button size="large"  @click="closeWorkModal('workInfo')">关闭</Button>
            </div>
        </modal>
        <!-- 删除 -->
        <modal v-model="deleteModal" title="删除工作项" :mask-closable="false" width="300" @on-cancel="closeDeleteModal" class-name="vertical-center-modal">
            <div>
                是否确认删除
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="workItemDelete">确定</Button>
                <Button size="large" @click="closeDeleteModal">取消</Button>
            </div>
        </modal>
        <!-- 带查询功能list -->
        <table-list v-if="tableListModal" @table-search-close="closeSearchModal" @table-search-save="saveSearchModal"></table-list>
        <!-- 出动信息操作弹窗 -->
        <out-info-modal v-if="outOperateModal" @close-out-modal="closeOutOperate" @save-out-info="submitOutInfo" @open-modal="OutSettingModal" ref="outInfoModal"></out-info-modal>
        <!-- 反馈信息 -->
        <feedback-info v-if="feedbackOperateModal" @close-modal="closefeedbackModal" @save-modal="savefeedbackModal" @open-modal="settingFeedbackModal" ref="feedbackInfo"></feedback-info>
        <!-- 所需资源弹窗 -->
        <out-register-resource v-if="outRegisterResourceModal" @close-modal="outResourceClose" @save-resource="outSaveResource"></out-register-resource>
        <!-- 树结构弹窗 -->
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import verify from '@/common/utils/verify'
    import tableList from '@/common/components/tableSearchModal/tableSearchModal'
    import outInfoModal from '@/console/scd/modal/outInfoModal'
    import feedbackInfo from '@/console/scd/modal/feedbackInfoModal'
    import seeOutInfo from '@/console/scd/modal/seeOutInfoModal'
    import seeFeedback from '@/console/scd/modal/seeFeedbackInfoListModal'
    import outRegisterResource from '@/console/scd/modal/registerResourceModal'
    import tree from '@/common/components/treeModal/tree'
    export default {
        components: {
            tableList,
            outInfoModal,
            feedbackInfo,
            seeOutInfo,
            seeFeedback,
            outRegisterResource,
            tree
        },
        data () {
            const validateTaskType = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择工作项类型'));
                } else {
                    callback()
                }
            };
            const validateImportance = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择重要程度'));
                } else {
                    callback()
                }
            };
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入工作项名称'));
                } else {
                    callback()
                }
            };
            const validateMeasures = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入处置措施'));
                } else {
                    callback()
                }
            };
            const validateExecutorType = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择执行者类型'));
                } else {
                    callback()
                }
            };
            const validateExecutorDesc = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入执行者描述'));
                } else {
                    callback()
                }
            };
            const registerExecutorOrgName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择执行单位'));
                } else {
                    callback()
                }
            };
            const registerExecutorType = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择执行者类型'));
                } else {
                    callback()
                }
            };
            const registerExecutor = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择执行者'));
                } else {
                    callback()
                }
            };
            const registerContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入任务描述'));
                } else {
                    callback()
                }
            };
            const registerAttention = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入注意事项'));
                } else {
                    callback()
                }
            };
            const registerResourceResTypeName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入资源类型'));
                } else {
                    callback()
                }
            };
            const registerResourceCount = (rule, value, callback) => {
                const reg = verify.num;
                if (!value) {
                    return callback(new Error('请输入资源数量'));
                } else if (!reg.test(value)) {
                    return callback(new Error('资源数量只能输入数字'));
                } else {
                    callback()
                }
            };
            const registerResourceUnitName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入计量单位'));
                } else {
                    callback()
                }
            };
            const registerResourceDescription = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入资源说明'));
                } else {
                    callback()
                }
            };
            return {
                workBtnShow: false,
                registerBtnShow: false,
                showReceive: false,
                treeMode: false,
                outRegisterResourceModal: false,
                dispatchModal: false,//调度信息
                outInfoModal: false,//出动信息
                outOperateModal: false,//出动操作弹窗
                feedbackOperateModal: false,
                feedbackModal: false,//反馈信息
                registerModal: false,//调度登记
                registerResourceModal: false,//所需资源登记
                tableListModal: false,
                workItemModal: false,//工作项维护
                selectRegisterNode: {},//选择调度登记——所需资源表格数据
                selectDispatchNode: {},//选择调度记录表格数据
                selectRegisterNodeIndex: null,
                addWork: false,
                deleteModal: false,
                selectWorkNodeNode: {},//选择处置工作项表格数据
                urlData: {},
                workHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '工作项',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '重要性',
                        key: 'importanceName',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '执行状态',
                        key: 'statusName',
                        width: 90,
                        align: 'center'
                    }
                ],
                workData: [],
                recordHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '调度时间',
                        key: 'dispatchTime',
                        width: 110,
                        align: 'center'
                    },
                    {
                        title: '调度内容',
                        key: 'content',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'statusName',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'statusName',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {

                                    },
                                    on: {
                                        click: () => {
                                            this.showState(params)
                                        }
                                    }
                                }, params.row.action)
                            ])
                        }
                    }
                ],
                measures: '',
                recordData: [],
                dispatchInfo: {},
                dispatchHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源名称',
                        key: 'resTypeName',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'count',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        width: 120,
                        align: 'center'
                    }
                ],
                dispatchData: [],
                outInfo: {},
                outInfoData: [],
                feedbackInfo: {},
                register: {
                    executorOrgId: null,
                    executorOrgName: '',
                    executorType: null,
                    executorId: null,
                    executor: '',
                    content: '',
                    attention: ''
                },
                resourceHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源类型',
                        key: 'resTypeName',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'count',
                        width: 70,
                        align: 'center'
                    },
                     {
                        title: '单位',
                        key: 'unitName',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源说明',
                        key: 'description',
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
                                        vm.deleteResource(params)
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
                                    }, [
                                    h('icon',{
                                        props: {
                                            type: 'trash-a'
                                        }
                                    })
                                ])
                                ])
                            ]);
                        }
                    }
                ],
                resourceData: [],
                addResource: false,
                registerResource: {
                    resTypeName: '',
                    count: '',
                    unitName: '',
                    description: ''

                },
                workInfo: {
                    taskType: null,
                    importance: null,
                    name: '',
                    measures: '',
                    executorType: null,
                    executorDesc: ''
                },
                workType: [],
                workImportance: [
                    {
                        value: 1,
                        label: '重要'
                    },
                    {
                        value: 2,
                        label: '一般'
                    }
                ],
                executorType: [],
                executorTypeList: [],
                height: {
                    height: ''
                },
                workHeight: '',
                dispatchHeight: '',
                workCustom: {
                    taskType: [
                        { required: true, validator: validateTaskType, trigger: 'change' }
                    ],
                    importance: [
                        { required: true, validator: validateImportance, trigger: 'change' }
                    ],
                    name: [
                        { required: true, validator: validateName, trigger: 'blur' }
                    ],
                    measures: [
                        { required: true, validator: validateMeasures, trigger: 'blur' }
                    ],
                    executorType: [
                        { required: true, validator: validateExecutorType, trigger: 'change' }
                    ],
                    executorDesc: [
                        { required: true, validator: validateExecutorDesc, trigger: 'blur' }
                    ]
                },
                registerCustom: {
                    executorOrgName: [
                        { required: true, validator: registerExecutorOrgName, trigger: 'blur' }
                    ],
                    executorType: [
                        { required: true, validator: registerExecutorType, trigger: 'change' }
                    ],
                    executor: [
                        { required: true, validator: registerExecutor, trigger: 'blur' }
                    ],
                    content: [
                        { required: true, validator: registerContent, trigger: 'blur' }
                    ],
                    attention: [
                        { required: true, validator: registerAttention, trigger: 'blur' }
                    ]
                },
                registerResourceCustom: {
                    resTypeName: [
                        { required: true, validator: registerResourceResTypeName, trigger: 'blur' }
                    ],
                    count: [
                        { required: true, validator: registerResourceCount, trigger: 'blur' }
                    ],
                    unitName: [
                        { required: true, validator: registerResourceUnitName, trigger: 'blur' }
                    ],
                    description: [
                        { required: true, validator: registerResourceDescription, trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{
            getNodes() {//获取调用组件传入的参数信息
                return this.$store.state.scd.nodes;
            },
            getUrl () {
                return this.$store.state.userCode.url;
            },
            getDeatil () {
                return this.$store.state.scd.detail;
            },
            tableHeight() {
                const res = this.$store.state.heightTable.tableInfo.tableHeight;
                this.workHeight = parseInt(res) - 104;
                this.dispatchHeight = parseInt(res) - 231;
                return res;
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(35)
            //获取url参数
            this.getUrlData();
            //是否显示操作按钮
            if ( this.urlData.show === '0' ) {
                this.workBtnShow = true;
                this.registerBtnShow = true;
            } else {
                this.workBtnShow = false;
                this.registerBtnShow = false;
            }
            //查询处置工作项
            // this.queryWorkItem();
            //查询工作项类型
            this.queryWorkType();
            //查询执行者类型
            this.queryExcutorType ();
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'saveTableData',
                'saveData',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            clearRecord () {
                this.measures = '';
                this.selectWorkNodeNode = {};
                this.selectDispatchNode = {};
                this.recordData = [];
            },
            queryWorkItem () {
                //查询处置工作项
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    nodeInstanceId: this.getNodes.nodeInstanceId
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/taskInstance/queryTaskInstances',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const workList = response.data.data;
                            const newList = [];
                            for ( let i=0; i<workList.length;i++ ) {
                                if ( workList[i].importance === 1) {
                                    workList[i].importanceName = '重要';
                                }
                                if ( workList[i].importance === 2 ) {
                                    workList[i].importanceName = '一般';
                                }
                            }
                            this.workData = response.data.data;
                        }
                    }
                ).catch(

                );
            },
            addWorkItem () {
                //增加工作项
                this.workInfo = {
                    taskType: null,
                    importance: null,
                    name: '',
                    measures: '',
                    executorType: null,
                    executorDesc: ''
                };
                this.addWork = true;
                this.workItemModal = true;
            },
            editWorkItem () {
                //修改工作项
                console.log('editWorkItem', this.selectWorkNodeNode.executorType)
                if ( !this.selectWorkNodeNode.id) {
                    this.$Message.warning('请先选择工作项')
                } else {
                    this.addWork = false;
                    this.workInfo = this.selectWorkNodeNode;
                    console.log('workInfo', this.selectWorkNodeNode)
                    this.workItemModal = true;
                }
            },
            deleteWorkItem () {
                //打开删除工作项弹窗
                if ( !this.selectWorkNodeNode.id) {
                    this.$Message.warning('请先选择工作项')
                } else {
                    this.deleteModal = true;
                }
            },
            workItemDelete () {
                //删除工作项
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    id: this.selectWorkNodeNode.id
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/taskInstance/removeCustomTask',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.workData.splice(this.selectWorkNodeNode.index,1);
                            this.selectWorkNodeNode = {};
                            this.closeDeleteModal();
                        }
                    }
                ).catch(

                );
            },
            closeDeleteModal () {
                //关闭删除弹窗
                this.deleteModal = false;
            },
            workSelectTable (data, index) {
                //选择处置工作项table
                this.selectWorkNodeNode = data;
                this.selectWorkNodeNode.index = index;
                const id = data.id;
                console.log('selectWorkNodeNode', this.selectWorkNodeNode)
                //处置措施
                this.measures = this.workData[index].measures;
                this.queryDispatchRecord();


            },
            queryDispatchRecord () {
                //查询调度记录
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    taskInstanceId: this.selectWorkNodeNode.id,
                    pageNum: 1,
                    pageSize: 10
                };
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/dispatch/queryDispatchRecords',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const list = response.data.data.list;
                            for (let i=0;i<list.length;i++) {
                                if (list[i].status === 10) {
                                    list[i].action = '接收'
                                };
                                if (list[i].status === 20) {
                                    list[i].action = '出动'
                                };
                                if (list[i].status === 30 || list[i].status === 40) {
                                    list[i].action = '反馈'
                                };
                            }
                            this.recordData = list;
                            console.log(list)
                        }
                    }
                ).catch(

                );
            },
            showDispatchModal () {
                //打开调度信息
                const data = this.selectDispatchNode;
                if ( !data.id ) {
                    this.$Message.warning('请先选择调度记录')
                } else {
                    const queryO = {
                        userCode: Cookies.get('userCode'),
                        dispatchId: data.id
                    }
                    //查询调度信息
                    axios({
                        method: 'get',
                        url: this.getUrl+'/scd/dispatch/getDispatchRecordDetail',
                        params: queryO
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.dispatchInfo = response.data.data || {};
                                this.dispatchData = response.data.data.ress || [];
                            }
                        }
                    ).catch(

                    );
                    this.dispatchModal = true;
                }
            },
            openReciveModal (data) {
                //打开接收调度信息
                const id = data.row.id;
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    dispatchId: id
                }
                //查询调度信息
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/dispatch/getDispatchRecordDetail',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.dispatchInfo = response.data.data || {};
                            this.dispatchData = response.data.data.ress || [];
                        }
                    }
                ).catch(

                );
                this.dispatchModal = true;
            },
            closeDispatchModal () {
                //关闭调度信息
                this.dispatchInfo = {};
                this.dispatchData = [];
                this.showReceive = false;
                this.dispatchModal = false;
            },
            receiveDispatch () {
                //接收信息
                const newData = this.selectDispatchNode;
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    dispatchId: this.selectDispatchNode.id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/dispatch/receiveDispatchRecord',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('接收成功')
                            const index = this.selectDispatchNode.index;
                            newData.status = response.data.data.newStatus;
                            newData.statusName = response.data.data.newStatusTitle;
                            this.$set(this.recordData,index,newData);
                            this.closeDispatchModal();
                        }
                    }
                ).catch(

                );


            },
            openOutInfoModal () {
                //查看出动信息
                const dispatchData = this.selectDispatchNode;
                console.log(this.selectDispatchNode)
                if ( !dispatchData.id ) {
                    this.$Message.warning('请先选择调度记录');
                } else {
                    const stateId = dispatchData.status;
                    if ( stateId === 30 || stateId === 40 ) {
                        //打开出动信息弹窗
                        this.outInfoModal = true;
                        window.setTimeout(() => {
                            this.$refs.seeOutInfo.queryOutInfo(this.selectDispatchNode.id);
                        }, 100);
                    } else {
                        this.$Message.warning('暂无出动信息');
                    }
                }
            },
            openFeedbackModal () {
                //查看反馈信息
                const dispatchData = this.selectDispatchNode;
                if ( !dispatchData.id ) {
                    this.$Message.warning('请先选择调度记录');
                } else {
                    const stateId = dispatchData.status;
                    console.log(stateId)
                    if ( stateId === 40) {
                        //打开反馈信息弹窗
                        this.feedbackModal = true;
                        window.setTimeout(() => {
                            this.$refs.seeFeedback.queryOutInfo(this.selectDispatchNode.id);
                        }, 100);
                    }  else {
                        this.$Message.warning('暂无反馈信息');
                    }
                }
            },
            showState (data) {
                if (this.urlData.show === '0') {
                    const stateId = data.row.status;
                    if ( stateId === 10) {
                        this.showReceive = true;
                        this.openReciveModal(data);
                    }
                    if ( stateId === 20 ) {
                        this.outOperateModal = true;
                    }
                    if ( stateId === 30 || stateId === 40 ) {
                        this.feedbackOperateModal = true;
                    }
                }
            },
            closeOutInfoModal () {
                //关闭出动信息弹窗
                this.outInfoModal = false;
            },
            closefeedbackInfoModal () {
                //关闭反馈信息弹窗
                this.feedbackModal = false;
            },
            openOrgModal () {
                //打开执行单位弹窗
                let TreeInfo = {
                    title: '设置执行单位',
                    treeMultiple: false,
                    additional: 'settingOrg',
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.getUrl+'/platform/public/queryOrgTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            treeModalSave (data, type) {
                //tree弹窗确定保存
                if ( type === 'settingOrg' ) {
                    this.register.executorOrgId = data[0].id;
                    this.register.executorOrgName = data[0].title;
                    this.$refs.register.validateField('executorOrgName', valid => {

                    });
                }
                if ( type === 'outOrg') {
                    this.$refs.outInfoModal.settingOrg(data);
                }
                if ( type === 'feedbackOrg' ) {
                    this.$refs.feedbackInfo.settingInput(data, type);
                }
                this.treeModalClose();
            },
            treeModalClose () {
                //关闭tree弹窗
                this.treeMode = false;
            },
            openRegisterModal () {
                //调度登记
                if ( !this.selectWorkNodeNode.id) {
                    this.$Message.warning('请先选择处置工作项');
                } else {
                    //查询执行者类型
                    this.queryExcutorType();

                    //查询所需资源
                    this.queryResource();
                    this.registerModal = true;
                }
            },
            queryResource () {
                //查询所需资源
                // const queryO = {
                //     userCode: Cookies.get('userCode'),
                // }
                // axios({
                //     method: 'post',
                //     url: 'http://192.168.0.29:8080/plan/content/queryPlanContent4ResEquipmentPlanByPage',
                //     data: queryO
                // }).then(
                //     response => {
                //         if ( response.data.code === 200 ) {
                //             this.executorType = response.data.data;
                //         }
                //     }
                // ).catch(

                // );
            },
            closeregisterModal (name) {
                //关闭调度登记弹窗
                this.$refs[name].resetFields();
                this.registerModal = false;
            },
            openTableModal () {
                //打开table弹窗
                const executorType = this.register.executorType;
                console.log(executorType)
                if ( executorType === null ) {
                    this.$Message.warning('请先选择执行者类型');
                } else {
                    const tableInfo = {
                        title: '',
                        multiple: false,
                        url: '',
                        name: '',
                        type: 'executor',
                        request: '',
                        queryInfo: {
                            userCode: Cookies.get('userCode'),
                            name: '',
                            publishPlanId: this.getDeatil.publishPlanId
                        }
                    }
                    if ( executorType === 10) {
                        tableInfo.url = this.getUrl+'/plan/publish/queryHeadQuarters';
                        tableInfo.request = 'get';
                        tableInfo.title = '指挥部';
                        tableInfo.name = '指挥部名称';
                        tableInfo.searchShow = false;
                    }
                    if ( executorType === 20) {
                         tableInfo.url = this.getUrl+'/plan/publish/querySecurityGroups';
                         tableInfo.request = 'get';
                         tableInfo.title = '应急救援小组';
                         tableInfo.name = '应急救援小组名称';
                         tableInfo.searchShow = true;
                    }
                    if ( executorType === 30) {
                         tableInfo.url = this.getUrl+'/plan/publish/queryMemberOrgs';
                         tableInfo.request = 'get';
                         tableInfo.title = '成员单位';
                         tableInfo.name = '成员单位名称';
                         tableInfo.searchShow = true;
                    }
                    if ( executorType === 40) {
                         tableInfo.url = this.getUrl+'/plan/publish/queryExperts';
                         tableInfo.request = 'get';
                         tableInfo.title = '专家';
                         tableInfo.name = '专家名称';
                         tableInfo.searchShow = true;
                    }
                    if ( executorType === 50) {
                         tableInfo.url = this.getUrl+'/resource/team/teamQuery';
                         tableInfo.request = 'post';
                         tableInfo.title = '处置队伍';
                         tableInfo.name = '处置队伍';
                         tableInfo.searchShow = true;
                    }
                    if ( executorType === 60) {
                         tableInfo.url = this.getUrl+'/platform/public/queryPersonBase4Page';
                         tableInfo.request = 'post';
                         tableInfo.title = '人员列表';
                         tableInfo.name = '人员名称';
                         tableInfo.searchShow = true;
                    }
                    this.saveTableData(tableInfo);
                    this.tableListModal = true;
                }
            },
            closeSearchModal () {
                //关闭table弹窗
                this.tableListModal = false;
            },
            saveSearchModal (data,type) {
                //table数据保存
                if ( type === 'executor' ) {
                    this.register.executorId = data.id;
                    this.register.executor = data.name;
                    this.$refs.register.validateField('executor', valid => {

                    });
                }
                if ( type === 'person' ) {
                    this.$refs.outInfoModal.settingPerson(data);
                }
                if ( type === 'feedbackExecutor' ) {
                    this.$refs.feedbackInfo.settingInput(data, type);
                }
                this.tableListModal = false;
            },
            saveRegister (name) {
                //保存调度登记
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const queryO = this.register;
                        queryO.ress = this.resourceData;
                        queryO.userCode = Cookies.get('userCode');
                        queryO.taskInstanceId = this.selectWorkNodeNode.id;
                        console.log(queryO)
                        axios({
                            method: 'post',
                            url: this.getUrl+'/scd/dispatch/sendTask',
                            data: queryO
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.register = {};
                                    this.resourceData = [];
                                    this.queryDispatchRecord();
                                    this.registerModal = false;
                                }
                            }
                        ).catch(

                        );
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
            },
            registerSelectTable (data,index) {
                //调度登记table选择数据
                this.selectRegisterNode = data;
                this.selectRegisterNodeIndex = index;
            },
            openAddregisterResourceModal () {
                //打开所需资源登记弹窗
                this.registerResource = {};
                this.addResource = true;
                this.registerResourceModal = true;
            },
            openEditregisterResourceModal () {
                const resourceType = this.selectRegisterNode.resTypeName;
                if ( !resourceType ) {
                    this.$Message.warning('请先选择所需资源');
                } else {
                    this.registerResource = this.selectRegisterNode;
                    this.registerResourceModal = true;
                }
            },
            saveregisterResource (name) {
                //保存所需资源登记
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if ( this.addResource ) {
                            this.resourceData.push(this.registerResource);
                            this.addResource = false;
                        } else {
                            this.$set(this.resourceData,this.selectRegisterNodeIndex,this.selectRegisterNode);
                        }
                        this.selectRegisterNode = {};
                        this.registerResourceModal = false;
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
            },
            closeregisterResourceModal (name) {
                //关闭所需资源登记弹窗
                if (!this.addResource) {
                    const newResource = {};
                    newResource.resTypeName = this.selectRegisterNode.resTypeName;
                    newResource.count = this.selectRegisterNode.count;
                    newResource.unitName = this.selectRegisterNode.unitName;
                    newResource.description = this.selectRegisterNode.description;
                    newResource.selectRegisterNodeIndex = this.selectRegisterNode.selectRegisterNodeIndex;
                    this.selectRegisterNode = newResource;
                }
                this.$refs[name].resetFields();
                this.registerResourceModal = false;
            },
            deleteResource (data) {
                //删除所需资源
                console.log(data)
                this.resourceData.splice(data.index,1);
                // const id = data.row.id;
                // const queryO = {
                //     userCode: Cookies.get('userCode'),
                //     id: id
                // }
                // queryO.userCode = Cookies.get('userCode');
                // axios({
                //     method: 'post',
                //     url: 'http://192.168.0.29:8080/plan/content/queryPlanContent4ResEquipmentPlanByPage',
                //     data: queryO
                // }).then(
                //     response => {
                //         if ( response.data.code === 200 ) {
                //             //查询所需资源
                //             this.$Message.warning('删除成功');
                //             this.resourceData.splice(data.index,1);
                //         }
                //     }
                // ).catch(

                // );
            },
            saveWorkItem (name) {
                //保存工作项
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if ( this.addWork ) {
                            const addInfo = this.workInfo;
                            addInfo.nodeInstanceId = this.getNodes.nodeInstanceId;
                            addInfo.userCode = Cookies.get('userCode');
                            axios({
                                method: 'post',
                                url: this.getUrl+'/scd/taskInstance/addCustomTask',
                                data: addInfo
                            }).then(
                                response => {
                                    if ( response.data.code === 200 ) {
                                        const workItemInfo = this.workInfo;
                                        if ( workItemInfo.importance === 1 ) {
                                            workItemInfo.importanceName = '重要';
                                        }
                                        if ( workItemInfo.importance === 2 ) {
                                            workItemInfo.importanceName = '一般';
                                        }
                                        workItemInfo.id = response.data.data;
                                        workItemInfo.status = 10;
                                        workItemInfo.statusName = '未执行';
                                        this.workData.push(workItemInfo);
                                        this.workItemModal = false;
                                    }
                                }
                            ).catch(

                            );

                        } else {
                            const editInfo = this.workInfo;
                            editInfo.nodeInstanceId = this.getNodes.nodeInstanceId;
                            editInfo.userCode = Cookies.get('userCode');
                            editInfo.id = this.workInfo.id;
                            axios({
                                method: 'post',
                                url: this.getUrl+'/scd/taskInstance/modifyCustomTask',
                                data: editInfo
                            }).then(
                                response => {
                                    if ( response.data.code === 200 ) {

                                        const workItemInfo = this.workInfo;
                                        if ( workItemInfo.importance === 1 ) {
                                            workItemInfo.importanceName = '重要';
                                        }
                                        if ( workItemInfo.importance === 2 ) {
                                            workItemInfo.importanceName = '一般';
                                        }
                                        this.$set(this.workData, workItemInfo.index,workItemInfo)
                                        this.workItemModal = false;
                                    }
                                }
                            ).catch(

                            );
                        }
                        this.selectWorkNodeNode = {};
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })

            },
            closeWorkModal (name) {
                //关闭工作项弹窗
                if (!this.addWork) {
                    const newNode = {};
                    newNode.id = this.selectWorkNodeNode.id;
                    newNode.taskType = this.selectWorkNodeNode.taskType;
                    newNode.importance = this.selectWorkNodeNode.importance;
                    newNode.name = this.selectWorkNodeNode.name;
                    newNode.measures = this.selectWorkNodeNode.measures;
                    newNode.executorType = this.selectWorkNodeNode.executorType;
                    newNode.executorDesc = this.selectWorkNodeNode.executorDesc;
                    newNode.index = this.selectWorkNodeNode.index;

                    this.selectWorkNodeNode = newNode;
                }
                this.$refs[name].resetFields();
                this.workItemModal = false;
            },
            queryWorkType () {
                //查询工作项类型
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    type: 'PLAN_TASK_TYPE'
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/platform/dictionary/getDictionaryByType',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const data = response.data.data;
                            const list = [];
                            for ( let i=0; i<data.length;i++ ) {
                                list.push({
                                    value: parseInt(data[i].key),
                                    label: data[i].value
                                })
                            }
                            this.workType = list;
                        }
                    }
                ).catch(

                );
            },
            queryExcutorType () {
                //查询执行者类型
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    type: 'PLAN_EXECUTOR_TYPE'
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/platform/dictionary/getDictionaryByType',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const data = response.data.data;
                            const list = [];
                            for ( let i=0; i<data.length;i++ ) {
                                list.push({
                                    value: parseInt(data[i].key),
                                    label: data[i].value
                                })
                            }
                            this.executorTypeList = list;
                        }
                    }
                ).catch(

                );
            },
            dispatchSelectTable (data, index) {
                //选择调度记录表格内容
                this.selectDispatchNode = data;
                this.selectDispatchNode.index = index;
            },
            closeOutOperate () {
                //关闭出动信息弹窗
                this.outOperateModal = false;
            },
            OutSettingModal (type,data) {
                //打开出动信息个弹窗设置
                if ( type === 'org') {
                    //打开事件类型弹窗
                    let TreeInfo = {
                        title: '事件类型',
                        treeMultiple: false,
                        additional: 'outOrg',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode')
                        },
                        url: this.getUrl+'/platform/public/queryOrgTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeMode = true;
                }
                if ( type === 'person' ) {
                    let tableInfo = {
                        title: '执行人员',
                        multiple: false,
                        name: '人员名称',
                        type: 'person',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode'),
                            publishPlanId: this.getDeatil.publishPlanId
                        },
                        url: this.getUrl+'/platform/public/queryPersonBase4Page'
                    }
                    this.saveTableData(tableInfo);
                    this.tableListModal = true;
                }
                if ( type === 'resourceModal' ) {
                    this.outRegisterResourceModal = true;
                }
                if ( type === 'editResource') {
                    this.outRegisterResourceModal = true;
                }
            },
            outResourceClose () {
                //关闭出动信息携带资源弹窗
                this.outRegisterResourceModal = false;
            },
            outSaveResource (type, data) {
                //携带资源登记
                if ( type === 'add' ) {
                    this.$refs.outInfoModal.settingResource(data);
                } else {
                    this.$refs.outInfoModal.editResource(data);
                }
                this.outRegisterResourceModal = false;
            },
            submitOutInfo (data) {
                //提交出动信息
                console.log(data)
                const newData = this.selectDispatchNode;
                const queryO = data;
                queryO.userCode = Cookies.get('userCode');
                queryO.incidentId = this.getDeatil.id;
                queryO.planInstanceId = this.getDeatil.planInstanceId;
                queryO.dispatchId = this.selectDispatchNode.id;
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/feedback/setoutRegister',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('出动成功')
                            const index = this.selectDispatchNode.index;
                            newData.status = response.data.data.status;
                            newData.statusName = response.data.data.statusTitle;
                            this.$set(this.recordData,index,newData);
                            this.outOperateModal = false;
                        }
                    }
                ).catch(

                );

            },
            settingFeedbackModal (type) {
                //设置反馈信息弹窗
                if ( type === 'feedbackOrg' ) {
                    //打开执行单位弹窗
                    let TreeInfo = {
                        title: '设置反馈单位',
                        treeMultiple: false,
                        additional: 'feedbackOrg',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode')
                        },
                        url: this.getUrl+'/platform/public/queryOrgTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeMode = true;
                }
                if ( type === 'feedbackExecutor' ) {
                    //打开反馈人员
                    const tableInfo = {
                        title: '执行人员',
                        multiple: false,
                        url: this.getUrl+'/platform/public/queryPersonBase4Page',
                        name: '执行者名称',
                        type: 'feedbackExecutor',
                        request: 'post',
                        searchShow: true,
                        queryInfo: {
                            userCode: Cookies.get('userCode'),
                            name: ''
                        }
                    }
                    this.saveTableData(tableInfo);
                    this.tableListModal = true;
                }
            },
            savefeedbackModal (data) {
                //保存反馈信息
                const queryO = data;
                queryO.userCode = Cookies.get('userCode');
                queryO.dispatchId = this.selectDispatchNode.id;
                queryO.incidentId = this.getDeatil.id;
                queryO.planInstanceId = this.getDeatil.planInstanceId;
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/feedback/endFeedback',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('反馈成功');
                            const index = this.selectDispatchNode.index;
                            const newData = this.selectDispatchNode;
                            newData.status = response.data.data.status;
                            newData.statusName = response.data.data.statusTitle;
                            this.$set(this.recordData,index,newData);
                            this.closefeedbackModal ();
                        }
                    }
                ).catch(

                );
            },
            closefeedbackModal () {
                this.feedbackOperateModal = false;
            },
            getUrlData () {
                //获取url参数
                const url = window.location.href;
                const data = url.split('?')[1];
                const arrList = data.split('&');
                const dataObj = {};
                for ( let i=0;i<arrList.length;i++ ) {
                    dataObj[arrList[i].split("=")[0]] = unescape(arrList[i].split("=")[1]);
                }
                this.urlData = dataObj;
            },
            //新添加的方法
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            }
        },
        mounted(){
        }
    }
</script>

<style scoped>
    .ds-measures {
        height: 90px;
        padding: 10px;
        overflow: auto;
    }
</style>

