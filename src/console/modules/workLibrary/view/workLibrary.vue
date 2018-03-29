<template>
    <!-- 工作项库 -->
    <div class="ds-workLibrary">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <Row class="ds-plan-search">
                <i-col span="24">
                    执行者类型：
                    <Select style="width: 200px;" v-model="executorType">
                        <Option v-for="item in executorTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    工作项名称：
                    <i-input style="width: 200px;" v-model="planName"></i-input>
                    <Button type="primary" @click="queryPlan">查询</Button>
                    <Button type="ghost" @click="clearPlan">清空查询</Button>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>工作项列表</h2>
                <div class="ds-fload-right">
                    <Button type="success" @click="openAddModal">新增</Button>
                </div>
            </div>
            <div>
                <Table border highlight-row :columns="libraryHead" :data="libraryData"></Table>
                <div class="ds-page-body" v-if="total > pageSize">
                    <Page ref="pages" :total="total" :page-size="pageSize" @on-change="planLibraryPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <Modal v-model="maintainModal" :mask-closable="false" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                <span>工作项维护</span>
            </p>
            <div style="text-align:left;max-height:400px;over-flow:auto;">
                <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100">
                    <Row>
                    <i-col span="12">
                        <form-item label="工作项类型：" prop="taskType">
                            <Select v-model="formCustom.taskType">
                                <Option v-for="item in workType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="重要程度：" prop="importance">
                            <Select v-model="formCustom.importance">
                                <Option v-for="item in importanceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="工作项名称：" prop="name">
                            <i-input type="text" v-model="formCustom.name" placeholder="请输入工作项名称"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="执行者类型：" prop="executorType">
                        <Select v-model="formCustom.executorType">
                            <Option v-for="item in executorTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="处置措施：" prop="measures">
                            <i-input v-model="formCustom.measures" :rows="4" type="textarea" placeholder="请输入处置措施"></i-input>
                        </form-item>
                    </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="savePlanLibrary('formCustom')">确定</Button>
                <Button type="ghost" @click="cancelPlanLibrary('formCustom')">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    export default {
        data () {
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
                pageNum: 1,
                total: 0,
                name: '',
                planName: '',
                executorType: '',
                maintainModal: false,
                workType: [],
                importanceTypeVal: '',
                importanceType: [],
                formCustom: {
                    taskType: '',
                    importance: '',
                    name: '',
                    executorType: '',
                    measures: ''
                },
                ruleCustom: {
                    taskType: [
                        { validator: validatetaskType, trigger: 'change' }
                    ],
                    importance: [
                        { validator: validateimportance, trigger: 'change' }
                    ],
                    name: [
                        { validator: validatename, trigger: 'blur' }
                    ],
                    executorType: [
                        { validator: validateexecutorType, trigger: 'change' }
                    ],
                    measures: [
                        { validator: validatemeasures, trigger: 'blur' }
                    ]
                },
                executorTypeList: [],
                libraryHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '工作项名称',
                        key: 'workName',
                        align: 'center'
                    },
                    {
                        title: '执行者类型',
                        key: 'executorType',
                        align: 'center'
                    },
                    {
                        title: '处置措施',
                        key: 'management',
                        align: 'center'
                    },
                    {
                        title: '重要程度',
                        key: 'importance',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    // type: 'warning'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editPlan(params)
                                    }
                                }
                            }, '修改'),
                            h('Poptip', {
                                props: {
                                confirm: true,
                                title: '您确定要删除这条数据吗?',
                                transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        let vm = this
                                        vm.deletelist(params)
                                    }
                                }
                            }, [
                                h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        size: 'small',
                                        placement: 'top',
                                        // type: 'error'
                                    }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                libraryData: [],
                height: {
                    height: ''
                }
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(110)
            this.getPlanLibraryTypes()
            this.queryPlan()
            this.getPlanExecutorTypes()
            this.getPlanImportanceTypes()
        },
        computed: {
            contentNodeId() {
            return this.$store.state.userCode.contentNodeId //nodeId
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
            this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
            return this.height.height
            }
        },
        methods: {
             ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            planLibraryPage(num) {
                //翻页功能
                this.pageNum = num;
                //翻页数据查询
                this.queryPlan();
            },
            openAddModal () {
                this.formCustom = {
                    taskType: '',
                    importance: '',
                    name: '',
                    executorType: '',
                    measures: ''
                }
                this.maintainModal = true;
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
            deletelist (data) {
                const id = data.row.id
                const url = this.url + '/plan/taskBank/removeTask'
                const params = {
                    id,
                    userCode: Cookies.get('userCode')
                }
                axios({
                    method: 'get',
                    url: url,
                    params: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            // this.libraryData.splice(data.index ,1)
                            this.$Message.info('删除成功!')
                            this.queryPlan()
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            editPlan (data) {
                this.formCustom = {
                    taskType: data.row.workTypeVal,
                    importance: data.row.importanceVal,
                    measures: data.row.management,
                    name: data.row.workName,
                    executorType: data.row.executorType,
                    id: data.row.id
                }
                this.maintainModal = true;
            },
            clearPlan() {
                this.$refs['pages'].currentPage = 1;
                this.planName = ''
                this.planType = ''
                this.pageNum = 1
                this.queryPlan()
            },
            queryPlan () {
                let info = {
                    userCode: this.userCode,
                    name: this.planName,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    executorType: this.executorType
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/taskBank/findTask',
                    data: info
                }).then(
                    response => {
                        this.libraryData = []
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.total = parseInt(res.total)
                            res.list.forEach((v, i) => {
                                this.libraryData.push({
                                    workName: v.name,
                                    workType: v.taskTypeName,
                                    workTypeVal: v.taskType,
                                    management: v.measures,
                                    id: v.id,
                                    importance: v.importanceName,
                                    importanceVal: v.importance,
                                    executorType: v.executorType
                                })
                            })
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            savePlanLibrary(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let url
                        let info = {
                            userCode: this.userCode,
                            taskType: this.formCustom.taskType,
                            importance: this.formCustom.importance,
                            measures: this.formCustom.measures,
                            name: this.formCustom.name,
                            executorType: this.formCustom.executorType,
                            open: 1
                        }
                        if(this.formCustom.id) {
                            url = this.url + '/plan/taskBank/modifyTask'
                            info.id = this.formCustom.id
                        } else {
                            url = this.url + '/plan/taskBank/addTask'
                        }
                        axios({
                            method: 'post',
                            url: url,
                            data: info
                        }).then(
                            response => {
                                this.$Message.success('操作成功!');
                                this.pageSize = 10
                                this.pageNum = 1
                                this.queryPlan()
                                this.maintainModal = false
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
            cancelPlanLibrary(name) {
                this.$refs[name].resetFields();
                this.maintainModal = false
            }
        }
    }
</script>

<style scoped>
    .ds-maintain-left {
        padding-left: 5px;
    }
</style>

