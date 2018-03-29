<template>
    <!-- 预案模版 -->
    <div class="ds-planTemplate">
        <row>
            <i-col span="7">
                <div class="ds-widget-box"  :style='height' :data-json="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>预案模板列表</h2>
                        <div class="ds-fload-right">
                            <Button type="success" @click="addTemplateTable">新增</Button>
                            <Button type="warning" @click="editTemplateTable">修改</Button>
                            <Poptip confirm title="您确认删除这条内容吗？" @on-ok="deleteTempalateTable" placement="bottom-start">
                                <Button :disabled="deleteTempalateTableStatus" type="error">删除</Button>
                            </Poptip>
                        </div>
                    </div>
                    <div class="ds-search-left" style="margin-top:5px;margin-bottom:5px;">
                        <row>
                            <i-col span="24">
                                <i-input icon="ios-search" v-model="templateName" @on-click="searchTemplate" @on-enter="searchTemplate" style="width: 100%;"></i-input>
                            </i-col>
                        </row>
                        <div class="ds-table-box">
                            <Table border highlight-row :columns="planTemplateHead" :data="planTemplateData" @on-row-click="getInfoAboutDetails"></Table>
                            <div class="ds-page-body" v-if="total > pageSize">
                                <Page ref="pages" :total="total" :page-size="pageSize" @on-change="handelClickPage" show-total class="ds-page-right"></Page>
                            </div>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col span="17">
                <!-- <row class="addNodeContent">
                    <i-col span="24">
                        <div class="ds-widget-box">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>新增内容节点</h2>
                            </div>
                            <div class="ds-search-left" style="margin-top:10px;margin-bottom:10px;">
                                <row>
                                    <i-col span="24">
                                        <span>模板名称:</span>
                                        <i-input :disabled='contorlStatus' v-model="name" placeholder="请输入模板名称" style="width: 200px;"></i-input>
                                        <span>事件类型:</span>
                                        <i-input :disabled='contorlStatus' v-model="typeName" placeholder="请输入事件类型" style="width: 200px;"  @on-focus="selectEditType"></i-input>
                                        <i-button :disabled='contorlStatus' type="primary" @click="handleSubmit">保存</i-button>
                                    </i-col>
                                </row>
                            </div>
                        </div>
                    </i-col>
                </row> -->
                <row>
                    <i-col span="8">
                        <div class="ds-widget-box" :style="height2">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>处置内容节点</h2>
                                <div class="ds-fload-right">
                                    <Button :disabled='contorlStatus' size="small" style="background:#fff" @click="openContentModal">
                                        <Icon type="android-add" size="20"></Icon>
                                    </Button>
                                    <Poptip confirm title="您确认删除这条内容吗？" @on-ok="deleteContent" placement="left-end">
                                        <Button :disabled='editStatus' size="small" style="background:#fff">
                                            <Icon type="trash-a"></Icon>
                                        </Button>
                                    </Poptip>
                                    <Button :disabled='editStatus' size="small" style="background:#fff" @click="editContent">
                                        <Icon type="edit" size="20"></Icon>
                                    </Button>
                                </div>
                            </div>
                            <div class="ds-search-left">
                                <i-input icon="ios-search" @on-click="searchNodeName" @on-enter="searchNodeName" v-model="nodeName" style="width:100%"></i-input>
                            </div>
                            <div class="ds-tree-left ds-resources-listBox">
                                <Tree :data="memberOrgTree" @on-select-change="selectAboutTree" ref="tree"></Tree>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="16">
                        <div>
                            <div class="ds-widget-box ds-box">
                                <div class="ds-widget-title">
                                    <span class="ds-title-icon"></span>
                                    <h2>处置流程</h2>
                                    <div class="ds-fload-right">
                                        <Button :disabled='contorlStatus' type="info" @click="openFlowModal">
                                            设置
                                        </Button>
                                        <Poptip confirm title="您确认删除这条内容吗？" @on-ok="deleteArrow" placement="left-end">
                                            <Button :disabled='deleteContorlStatus' type="error">
                                                删除
                                            </Button>
                                        </Poptip>
                                    </div>
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
                            <div class="ds-widget-box ds-box" :style="height3">
                                <div class="ds-widget-title">
                                    <span class="ds-title-icon"></span>
                                    <h2>处置工作项</h2>
                                    <div class="ds-fload-right">
                                        <Button :disabled='deleteContorlStatus' type="info" @click="openSettingModal">
                                            设置
                                        </Button>
                                    </div>
                                </div>
                                <div class="ds-table-box">
                                    <Table border highlight-row :columns="templateHead" :data="templateData"></Table>
                                </div>
                            </div>
                        </div>
                    </i-col>
                </row>
            </i-col>
        </row>
        <Modal v-model="templateAddModal" :mask-closable="false" width="500">
            <p slot="header" style="color:#f60;text-align:center">
                <span>新增模板信息</span>
            </p>
            <div style="text-align:left;max-height:400px;over-flow:auto;">
                <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <form-item label="模板名称:" prop="name">
                        <i-input style="" v-model="formValidate.name"></i-input>
                    </form-item>
                    <form-item label="事件类型:" prop="type">
                        <i-input style="" v-model="formValidate.type" @on-focus="selectOtherType"></i-input>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
                <Button size="large" type="primary" @click="saveTemplateInfo('formValidate')">确定</Button>
                <Button size="large" type="ghost" @click="cancelTemplateInfo('formValidate')">取消</Button>
            </div>
        </Modal>
        <Modal v-model="editModal" :mask-closable="false" width="500">
            <p slot="header" style="color:#f60;text-align:center">
                <span>修改处置内容节点信息</span>
            </p>
            <div style="text-align:left;max-height:400px;over-flow:auto;">
                <i-form ref="formValidateNode" :model="formValidateNode" :rules="ruleValidateNode" :label-width="120">
                    <form-item label="节点名称:" prop="name">
                        <i-input style="" v-model="formValidateNode.name"></i-input>
                    </form-item>
                    <form-item label="上级节点名称:" prop="type">
                        <i-input style="" v-model="formValidateNode.type" @on-focus="selectNodeParentType"></i-input>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
                <Button size="large" type="primary" @click="saveTemplateNodeInfo('formValidateNode')">确定</Button>
                <Button size="large" type="ghost" @click="cancelTemplateNodeInfo('formValidateNode')">取消</Button>
            </div>
        </Modal>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
        <select-content-modal v-if="contentModal"  @close-content-modal="closeContentModal" @save-content-modal="saveContentModal"></select-content-modal>
        <select-work-modal v-if="workModal" @close-work-modal="closeWorkModal" @save-work-modal="saveWorkModal"></select-work-modal>
        <select-flow-modal v-if="flowModal" @close-node-modal="closeFlowModal" @save-node-modal="saveNodeModal"></select-flow-modal>
    </div>
</template>

<script>
    import selectContentModal from '@/common/components/selectContent/selectContent'
    import selectWorkModal from '@/common/components/selectWorkType/selectWorkType'
    import selectFlowModal from '@/common/components/selectFlowNode/selectFlowNode'
    import processArrow from '@/common/components/process-arrow/index'
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import tree from '@/common/components/treeModal/tree'
    import Cookies from 'js-cookie';

    export default {
        components: {
            selectContentModal,
            selectWorkModal,
            selectFlowModal,
            processArrow,
            tree
        },
        data () {
            return {
                detailsId: null,
                deleteContorlStatus: true,
                deleteTempalateTableStatus: true,
                height: {
                    height: ''
                },
                height2: {
                    height: '',
                    'overflow-y': 'scroll'
                },
                height3: {
                    height: '',
                    'overflow-y': 'scroll'
                },
                selectTemplateNode: {},
                editModal: false,
                editStatus: true,
                nodeContent: {},
                processNodes: null,
                boxData: [],
                className: 'ds-active',
                nodeName: '',
                typeName: '',
                typeNameId: '',
                treeMode: false,
                total: 0,
                pageNum: 1,
                name: '',
                contorlStatus: true,
                contentModal: false,
                workModal: false,
                flowModal: false,
                memberOrgTree: [],
                planTemplateHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '模板名称',
                        key: 'name',
                        align: 'center'
                    }
                ],
                planTemplateData: [],
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
                        title: '类型',
                        key: 'workType',
                        align: 'center'
                    },
                    {
                        title: '重要性',
                        key: 'importantce',
                        align: 'center'
                    },
                    {
                        title: '处置措施',
                        key: 'management',
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
                                            vm.deleteTeam(params)
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
                templateData: [],
                templateName: '',
                templateId: null,
                nodeId: null,
                templateAddModal: false,
                formValidate: {
                    type: '',
                    incidentTypeId: '',
                    name: ''
                },
                formValidateNode: {
                    type: '',
                    typeId: '',
                    name: ''
                },
                ruleValidateNode: {
                    name: [
                        { required: true, message: '请输入节点名称', trigger: 'blur' }
                    ],
                    // type: [
                    //     { required: true, message: '请输入上级节点名称', trigger: 'blur' }
                    // ]
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入模板名称', trigger: 'blur' }
                    ],
                    // type: [
                    //     { required: true, message: '请输入事件类型', trigger: 'blur' }
                    // ]
                },
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(30)
            this.searchTemplate()
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
                const height =  this.$store.state.heightTable.tableInfo.tableHeight
                this.height2.height = (parseInt(height))  + 'px'
                this.height3.height = (parseInt(height) - 187)  + 'px'
                this.height.height = height /*定义好的父框体高度*/
            }
        },
        methods: {
            saveTemplateNodeInfo(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const url = this.url + '/plan/template/modifyTemplateContentNode'
                        const params = {
                            userCode: this.userCode,
                            id: this.formValidateNode.nameId,
                            name: this.formValidateNode.name,
                            parent: {
                                id: this.formValidateNode.typeId
                            }
                        }
                        axios({
                            method: 'post',
                            url: url,
                            data: params
                        }).then(
                            response => {
                                if(response.data.code === 200) {
                                    this.$Message.info('修改成功！')
                                    this.getProcessNode()
                                    this.editModal = false
                                    //清空父节点ID缓存
                                    this.nodeId = null
                                }
                            }
                        ).catch(
                            error => {
                            }
                        )
                    } else {
                    }
                })
            },
            cancelTemplateNodeInfo(name) {
                if(!this.detailsId) {
                    this.$refs[name].resetFields();
                }
                this.editModal = false
            },
            selectNodeParentType() {
                let TreeInfo = {
                    title: '内容节点信息',
                    treeMultiple: false,
                    additional: '3',
                    request: 'get',
                    queryInfo: {
                        userCode: this.userCode,
                        templateId: this.templateId,
                        nodeName: '',
                        nodeId: this.nodeId
                    },
                    noSelect: true,
                    url: this.url + '/plan/template/findTemplateContentNodes'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            editContent() {
                this.editModal = true
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
                this.processNodes = id
                this.className = '';
                this.clearProcessBg();
                this.boxData[index].className = 'ds-active';
                this.deleteContorlStatus = false
                this.checkWork()
            },
            queryIncident () {
                //事件信息查询
                const queryO = {
                    userCode: this.userCode,
                    templateId: this.templateId
                }
                axios({
                    method: 'get',
                    url: this.url+'/plan/template/findProcessNode',
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
            selectAboutTree(data) {
                if(data[0]){
                    this.nodeContent = data[0]
                    this.nodeId = data[0].id
                    this.formValidateNode.name = data[0].title
                    this.formValidateNode.nameId = data[0].id
                    if (data[0].parent) {
                        this.formValidateNode.typeId = data[0].parent.id
                        this.formValidateNode.type = data[0].parent.name
                    } else {
                        this.formValidateNode.typeId = null
                        this.formValidateNode.type = ''
                    }
                    this.editStatus = false
                } else {
                    //清空父节点ID缓存
                    this.nodeId = null;
                    this.editStatus = true
                    return
                }
            },
            deleteContent() {
                if(this.nodeId){
                    const url = this.url + '/plan/template/removeTemplateContentNode'
                    const params = {
                        userCode: this.userCode,
                        id: this.nodeId
                    }
                    axios({
                        method: 'get',
                        url: url,
                        params: params
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.info('删除成功')
                                this.getProcessNode()
                                this.editStatus = true
                                //清空父节点ID缓存
                                this.nodeId = null
                            } else {
                                this.$Message.error(response.data.message)
                            }
                        }
                    ).catch(
                        error => {
                        }
                    );
                } else {
                    return
                }
            },
            getProcessNode() {
                const url = this.url + '/plan/template/findTemplateContentNodes'
                const params = {
                    userCode: this.userCode,
                    templateId: this.templateId,
                    nodeName: this.nodeName
                }
                axios({
                    method: 'get',
                    url: url,
                    params: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.memberOrgTree = res
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            searchNodeName() {
                this.getProcessNode()
            },
            getInfoAboutDetails(params) {
                this.detailsId = params.id
                this.selectTemplateNode = params;
                this.editStatus = true;
                if (this.detailsId !== '') {
                    this.deleteTempalateTableStatus = false
                    this.contorlStatus = false
                    this.deleteContorlStatus = true
                    this.templateData = []
                    const url = this.url + '/plan/template/findTemplate'
                    const info = {
                        userCode: this.userCode,
                        id: this.detailsId
                    }
                    axios({
                        method: 'get',
                        url: url,
                        params: info
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                const res = response.data.data
                                this.typeName = res.incidentTypeName
                                this.typeNameId = res.incidentTypeId
                                this.name = res.name
                                this.templateId = res.id
                                this.getProcessNode()
                                this.queryIncident()
                            }
                        }
                    ).catch(
                        error => {
                            
                        }
                    )
                } else {
                    this.contorlStatus = true
                    this.detailsId = null
                }
            },
            treeModalClose() {
                this.treeMode = false
            },
            treeModalSave (treeInfo,type) {
                if (type === '1') {
                    // console.log('1',treeInfo)
                    this.formValidate.type = treeInfo[0].title
                    this.formValidate.incidentTypeId = treeInfo[0].id
                } else if(type === '2'){
                    // console.log('2',treeInfo)
                    this.typeName = treeInfo[0].title
                    this.typeNameId = treeInfo[0].id
                } else {
                    if (treeInfo.length>0) {
                        this.formValidateNode.type = treeInfo[0].title
                        this.formValidateNode.typeId = treeInfo[0].id
                    } else {
                        this.formValidateNode.type = '';
                        this.formValidateNode.typeId = null;
                    }
                    
                    //清空父节点ID
                    // console.log('3',treeInfo)
                    // this.formValidateNode.typeId = null
                    // this.formValidateNode.type = ''
                }
                this.treeMode = false;
            },
            selectOtherType () {
                let TreeInfo = {
                    title: '事件类型',
                    treeMultiple: false,
                    additional: '1',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode
                    },
                    searchShow: true,
                    url: this.url + '/platform/public/queryIncidentTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            selectEditType() {
                let TreeInfo = {
                    title: '事件类型',
                    treeMultiple: false,
                    additional: '2',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryIncidentTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            saveTemplateInfo(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const id = this.formValidate.id;
                        let url = null;
                        let message = '预案模板新增成功'
                        const params = {
                            userCode: this.userCode,
                            name: this.formValidate.name,
                            incidentTypeId: this.formValidate.incidentTypeId
                        }
                        if (id) {
                            params.id = id;
                            url = this.url + '/plan/template/modifyTemplate';
                            message = '预案模板修改成功';
                        } else {
                            url = this.url + '/plan/template/addTemplate'
                        }
                        axios({
                            method: 'post',
                            url: url,
                            data: params
                        }).then(
                            response => {
                                if(response.data.code === 200) {
                                    this.$Message.info(message);
                                    this.selectTemplateNode = {};
                                    this.searchTemplate();
                                    this.templateAddModal = false;
                                }
                            }
                        ).catch(
                            error => {
                            }
                        )
                    } else {
                    }
                })
            },
            cancelTemplateInfo(name) {
                const id = this.selectTemplateNode.id;
                if (!id) {
                    this.$refs[name].resetFields();
                    
                } 
                this.templateAddModal = false
            },
            addTemplateTable() {
                this.formValidate = {
                    type: '',
                    incidentTypeId: '',
                    name: ''
                }
                this.templateAddModal = true
            },
            editTemplateTable () {
                const id = this.selectTemplateNode.id;
                if (id) {
                    this.formValidate = this.selectTemplateNode;
                    this.formValidate.type = this.selectTemplateNode.incidentTypeName;
                    this.templateAddModal = true;
                } else {
                    this.$Message.warning('请先选择预案模板');
                }
            },
            searchTemplate() {
                const userCode = this.userCode
                const url = this.url + '/plan/template/queryTemplates'
                const params = {
                    userCode,
                    name: this.templateName,
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
                axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.total = parseInt(res.total)
                            this.planTemplateData = res.list
                        }
                    }
                ).catch(
                    error => {
                    }
                )
            },
            deleteTempalateTable() {
                const id = this.templateId
                const url = this.url + '/plan/template/deleteTemplate'
                axios({
                    method: 'get',
                    url: url,
                    params: { id, userCode: this.userCode }
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            this.searchTemplate()
                            this.$Message.info('删除成功')
                        } else {
                            this.$Message.error(response.data.message)
                        }
                    }
                ).catch(
                    error => {
                    }
                )
            },
            handelClickPage(num) {
                this.pageNum = num
                this.searchTemplate()
            },
            handleSubmit () {
                if (this.name !== '' && this.typeName !== '') {
                    const params = {
                        id: this.templateId,
                        incidentTypeId: this.typeNameId,
                        name: this.name,
                        userCode: this.userCode
                    }
                    const url = this.url + '/plan/template/modifyTemplate'
                    axios({
                        method: 'post',
                        url: url,
                        data: params
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.searchTemplate()
                                this.$Message.info('修改成功')
                            } else {
                                this.$Message.error(response.data.message)
                            }
                        }
                    ).catch(
                        error => {
                        }
                    );
                } else {
                    this.$Message.error('请完善好模板名和事件类型!');
                }
            },
            ...mapActions([
                'getProcessArrow',//流程图方法
                'getSelectFlowNode',//获取节点
                'getSelectFlowWork', //获取工作项
                'getSelectFlowCOntent',
                'saveDemoData',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            checkWork() {
                const url = this.url + '/plan/template/findProcessTask'
                const data = {
                    nodeId: this.processNodes,
                    templateId: this.templateId,
                    userCode: this.userCode
                }
                axios({
                    method: 'get',
                    url: url,
                    params: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.templateData = []
                            const res = response.data.data
                            if(res.length > 0){
                                res.forEach((v, i) => {
                                    this.templateData.push({
                                        id: v.id,
                                        workName: v.name,
                                        workType: v.taskTypeName,
                                        workTypeId: v.taskType,
                                        importantce: v.importanceName,
                                        importantceId: v.importantce,
                                        management: v.measures
                                    })
                                });
                            }
                        } else {
                            this.$Message.error(response.data.message)
                        }
                    }
                ).catch(
                );
            },
            openSettingModal () {
                //打开选择处置工作项弹窗
                const params = {
                    url: this.url + '/plan/template/findTaskBankNodeToSel',
                    params: {
                        userCode: this.userCode,
                        templateId: this.templateId,
                        nodeId: this.processNodes
                    }
                }
                this.getSelectFlowWork(params)
                this.workModal = true;
            },
            closeWorkModal () {
                //关闭选择处置工作项弹窗
                this.workModal = false;
            },
            openFlowModal () {
                //打开选择流程节点
                const params = {
                    url: this.url + '/plan/template/findProcessBankNodeToSel',
                    params: {
                        userCode: this.userCode,
                        templateId: this.templateId
                    }
                }
                this.getSelectFlowNode(params)
                this.flowModal = true;
            },
            closeFlowModal () {
                //关闭选择流程节点
                this.flowModal = false
            },
            openContentModal () {
                //打开选择内容弹窗
                const data = {
                    url: this.url + '/plan/elementBank/findPlanElement',
                    params: {
                        userCode: this.userCode,
                        templateId: this.templateId
                    },
                    parentId: this.nodeId
                }
                this.getSelectFlowCOntent(data)
                this.contentModal = true;
            },
            closeContentModal () {
                //关闭选择内容弹窗
                this.contentModal = false;
            },
            deleteTeam(params) {
                const url = this.url + '/plan/template/removeProcessTask'
                const data = {
                    userCode: this.userCode,
                    id: params.row.id
                }
                axios({
                    method: 'get',
                    url: url,
                    params: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                           this.$Message.info('删除成功')
                           this.templateData.splice(params.index, 1)
                        } else {
                            this.$Message.error(response.data.message)
                        }
                    }
                ).catch(
                    error => {
                    }
                );
            },
            deleteArrow() {
                const id = this.processNodes
                if(!id) {
                    this.$Message.error('请选择需要删除流程')
                    return
                } else {
                    const url = this.url + '/plan/template/removeProcessNode'
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
                    let nodeIdArr = []
                    params.forEach((v, i) => {
                        nodeIdArr.push(v.id)
                    })
                    const url = this.url + '/plan/template/setProcessNodes'
                    const data = {
                        userCode: this.userCode,
                        nodeIds:nodeIdArr,
                        id: this.templateId
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
                                this.$Message.info('保存成功')
                            } else {
                                this.$Message.error(response.data.message)
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
            saveWorkModal(params) {
                if(params && params.length > 0) {
                    let nodeIdArr = []
                    params.forEach((v, i) => {
                        nodeIdArr.push(v.id)
                    })
                    const url = this.url + '/plan/template/setProcessTasks'
                    const data = {
                        userCode: this.userCode,
                        id: this.processNodes,
                        taskIds: nodeIdArr
                    }
                    axios({
                        method: 'post',
                        url: url,
                        data: data
                    }).then(
                        response => {
                            if(response.data.code === 200) {
                                this.workModal = false
                                this.$Message.info('保存成功')
                                this.checkWork()
                            } else {
                                this.$Message.error(response.data.message)
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
            saveContentModal(params){
                if(params && params.length > 0) {
                    let nodeIdArr = []
                    params.forEach((v, i) => {
                        nodeIdArr.push(v.id)
                    })
                    const url = this.url + '/plan/template/setContentNodes'
                    const data = {
                        userCode: this.userCode,
                        nodeIds: nodeIdArr,
                        id: this.templateId,
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
                                this.getProcessNode()
                                this.$Message.info('保存成功')
                                this.nodeId = null
                            } else {
                                this.$Message.error(response.data.message)
                            }
                        }
                    ).catch(
                        error => {
                            
                        }
                    )
                } else {
                    this.contentModal = false
                }
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .ds-flow-content {
        height: 150px;
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
</style>

