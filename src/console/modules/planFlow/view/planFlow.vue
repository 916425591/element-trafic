<template>
    <!-- 预案流程库 -->
    <div class="ds-planFlow">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>流程查询条件</h2>
            </div>
            <Row class="ds-plan-search">
                <i-col span="6">
                    节点名称：
                    <i-input style="width: 200px;" v-model="planName"></i-input>
                </i-col>
                <i-col span="12">
                    <Button type="primary" @click="queryPlan">查询</Button>
                    <Button type="ghost" @click="clearPlan">清空查询</Button>
                </i-col>
            </Row>
        </div>
        <Row>
            <i-col span="12">
                <div class="ds-widget-box" :style='height' :data-json="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>流程列表</h2>
                        <div class="ds-fload-right">
                            <Button type="success" @click="openAddModal">新增</Button>
                        </div>
                    </div>
                    <div class="ds-table-box">
                        <Table border highlight-row :columns="flowHead" :data="flowData" @on-row-click="getDataAboutJobs"></Table>
                        <div class="ds-page-body" v-if="total > pageSize" >
                            <Page ref="pages" :total="total" :page-size="pageSize" @on-change="planFlowPage" show-total class="ds-page-right"></Page>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col span="12">
                <div class="ds-widget-box" :style='height' :data-json="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>设置处置工作项</h2>
                        <div class="ds-fload-right">
                            <Button :disabled="disabledAboutCtrl" type="info" @click="openSettingModal">
                                设置
                            </Button>
                        </div>
                    </div>
                    <div class="ds-table-box">
                        <Table :height='parseInt(height)-150' border highlight-row :columns="settingHead" :data="settingData"></Table>
                    </div>
                </div>
            </i-col>
        </Row>
        <Modal v-model="maintainModal" :mask-closable="false" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                <span>工作项维护</span>
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
        <select-work-modal v-if="workModal" @close-work-modal="closeWorkModal"  @save-work-modal="saveWorkModal"></select-work-modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
    import axios from 'axios'
    import selectWorkModal from '@/common/components/selectWorkType/selectWorkType'
    import { mapActions } from 'vuex'

    export default {
        components: {
            selectWorkModal
        },
        data () {
            return {
                pageNum: 1,
                total: 0,
                name: '',
                planName: '',
                maintainModal: false,
                workModal: false,
                flowHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '流程节点名称',
                        key: 'elementName',
                        align: 'center'
                    },
                    {
                        title: '描述',
                        key: 'describe',
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
                flowData: [],
                settingHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '工作项',
                        key: 'workItem',
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'workType',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
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
                                        vm.deleteSettinglist(params)
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
                            ])
                        }
                    }
                ],
                settingData: [],
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
                idStatus: null,
                disabledAboutCtrl: true,
                height: {
                    height: ''
                }
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(110) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.queryPlan()
        },
        computed: {
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
            getDataAboutJobs(params) {
                this.disabledAboutCtrl = false
                this.idStatus = params.id
                this.getWork(this.idStatus)
            },
            ...mapActions([
                'getSelectFlowWork', //获取工作项
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            planFlowPage(num) {
                //翻页功能
                this.pageNum = num;
                //翻页数据查询
                this.queryPlan();
            },
            openAddModal () {
                this.maintainModal = true;
            },
            openEditModal () {
                this.maintainModal = true;
            },
            openSettingModal () {
                //打开选择处置工作项弹窗
                 const params = {
                    url: this.url + '/plan/processNodeBank/findTaskBank4excludeId',
                    params: {
                        userCode: this.userCode,
                        nodeId: this.idStatus
                    }
                }
                this.getSelectFlowWork(params)
                this.workModal = true;
            },
            closeWorkModal () {
                //关闭选择处置工作项弹框
                this.workModal = false;
            },
            clearPlan() {
                this.$refs['pages'].currentPage = 1;
                this.planName = ''
                this.pageNum = 1
                this.queryPlan()
            },
            deleteSettinglist(data) {
                const id = data.row.id
                const url = this.url + '/plan/processNodeBank/removeProcessTask'
                const params = {
                    taskId: id,
                    nodeId: this.idStatus,
                    userCode: this.userCode
                }
                axios({
                    method: 'get',
                    url: url,
                    params: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            this.settingData.splice(data.index ,1)
                            this.$Message.info('删除成功!')
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            deletelist (data) {
                const id = data.row.id
                const url = this.url + '/plan/processNodeBank/removeProcessNode'
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
                            this.flowData.splice(data.index ,1)
                            this.$Message.info('删除成功!')
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            editPlan (data) {
                this.formValidate = {
                    desc: data.row.describe,
                    name: data.row.elementName,
                    id: data.row.id
                }
                this.maintainModal = true;
            },
            queryPlan () {
                //预案元素库查询
                let info = {
                    userCode: this.userCode,
                    name: this.planName,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    type: this.planType
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/processNodeBank/findProcessNode',
                    data: info
                }).then(
                    response => {
                        this.flowData = []
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.total = parseInt(res.total)
                            res.list.forEach((v, i) => {
                                this.flowData.push({
                                    elementName: v.name,
                                    describe: v.description,
                                    id: v.id,
                                    // elementType: v.typeName,
                                    elementType: v.type
                                })
                            })
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            savePlanFlow(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let url
                        let info = {
                            userCode: this.userCode,
                            name: this.formValidate.name,
                            description: this.formValidate.desc,
                            open: 1
                        }
                        if(this.formValidate.id) {
                            url = this.url + '/plan/processNodeBank/modifyProcessNode'
                            info.id = this.formValidate.id
                        } else {
                            url = this.url + '/plan/processNodeBank/addProcessNode'
                        }
                        axios({
                            method: 'post',
                            url: url,
                            data: info
                        }).then(
                            response => {
                                if(response.data.code === 200) {
                                    this.queryPlan()
                                    this.$Message.success('操作成功!');
                                    this.maintainModal = false
                                } else {
                                    this.$Message.error(response.data.message);
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
            cancelPlanFlow(name) {
                this.$refs[name].resetFields();
                this.maintainModal = false
            },
            getWork(id) {
                const url = this.url + '/plan/processNodeBank/findTaskBank4incluedeId'
                let info = {
                    userCode: this.userCode,
                    nodeId: id
                }
                axios({
                    method: 'get',
                    url: url,
                    params: info
                }).then(
                    response => {
                        this.settingData = []
                        if(response.data.code === 200) {
                            const res = response.data.data
                            res.forEach((v, i) => {
                                this.settingData.push({
                                    workItem: v.name,
                                    workType: v.taskType,
                                    id: v.id
                                })
                            })
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            saveWorkModal(params){
                if(params && params.length > 0) {
                    let taskIdArr = []
                    params.forEach((v, i) => {
                        taskIdArr.push(v.id)
                    })
                    const url = this.url + '/plan/processNodeBank/setProcessTask'
                    const data = {
                        userCode: this.userCode,
                        nodeId: this.idStatus,
                        taskIds: taskIdArr
                    }
                    axios({
                        method: 'post',
                        url: url,
                        data: data
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                this.getWork(this.idStatus)
                                this.workModal = false
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
                    this.workModal = false
                }
            }
        }
    }
</script>

<style scoped>

</style>

