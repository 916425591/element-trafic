<template>
    <!-- 预案元素库 -->
    <div class="ds-planLibrary">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <Row class="ds-plan-search">
                <i-col span="6">
                    元素类型：
                    <Select style="width: 200px;" v-model="planType">
                        <Option v-for="item in elementType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </i-col>
                <i-col span="6">
                    元素名称：
                    <i-input style="width: 200px;" v-model="planName"></i-input>
                </i-col>
                <i-col span="12">
                    <Button type="primary" @click="queryPlan">查询</Button>
                    <Button type="ghost" @click="clearPlan">清空查询</Button>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>元素列表</h2>
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
                <span>预案元素维护</span>
            </p>
            <div style="text-align:left;max-height:400px;over-flow:auto;">
                <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <form-item label="预案元素类型" prop="modalSelect">
                        <Select  v-model="formValidate.modalSelect">
                            <Option v-for="item in elementType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </form-item>
                    <form-item label="预案元素名称" prop="name">
                        <i-input style="" v-model="formValidate.name"></i-input>
                    </form-item>
                    <form-item label="预案元素描述" prop="desc">
                        <i-input v-model="formValidate.desc" type="textarea" :rows="4" placeholder="请输入预案元素描述"></i-input>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="savePlanLibrary('formValidate')">确定</Button>
                <Button type="ghost" @click="cancelPlanLibrary('formValidate')">取消</Button>
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
            return {
                pageNum: 1,
                total: 0,
                name: '',
                planName: '',
                planType: '',
                describeInfo: '',
                formValidate: {
                    modalSelect: '',
                    desc: '',
                    name: ''
                },
                maintainModal: false,
                elementType: [],
                libraryHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '元素名称',
                        key: 'elementName',
                        align: 'center'
                    },
                    {
                        title: '元素类型',
                        key: 'elementType',
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
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editPlan(params)
                                    }
                                }
                            }, '编辑'),
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
                                        placement: 'top'
                                    }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                libraryData: [],
                ruleValidate: {
                    name: [
                        { required: true, message: '请输入预案名称', trigger: 'blur' }
                    ],
                    modalSelect: [
                        { required: true, message: '请选择预案元素类型', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入预案元素描述', trigger: 'blur' }
                    ]
                },
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
            getPlanLibraryTypes() {
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
            openAddModal () {
                this.formValidate = {
                    modalSelect: '',
                    desc: '',
                    name: ''
                }
                this.maintainModal = true;
            },
            deletelist (data) {
                const id = data.row.id
                const url = this.url + '/plan/elementBank/removePlanElement'
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
                            this.queryPlan()
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
                    modalSelect: data.row.type,
                    desc: data.row.describe,
                    name: data.row.elementName,
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
                    url: this.url + '/plan/elementBank/findPlanElement',
                    data: info
                }).then(
                    response => {
                        this.libraryData = []
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.total = parseInt(res.total)
                            res.list.forEach((v, i) => {
                                this.libraryData.push({
                                    elementName: v.name,
                                    describe: v.description,
                                    id: v.id,
                                    elementType: v.typeName,
                                    type: v.type
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
                            name: this.formValidate.name,
                            type: this.formValidate.modalSelect,
                            description: this.formValidate.desc,
                            open: 1
                        }
                        if(this.formValidate.id) {
                            url = this.url + '/plan/elementBank/modifyPlanElement'
                            info.id = this.formValidate.id
                        } else {
                            url = this.url + '/plan/elementBank/addPlanElement'
                        }
                        axios({
                            method: 'post',
                            url: url,
                            data: info
                        }).then(
                            response => {
                                this.$Message.success('操作成功!');
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
    
</style>

