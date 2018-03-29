<template>
    <div>
        <!-- 其他资源 -->
        <div class="ds-widget-box" :style="height" :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>避险场所</h2>
                <!--<div class="ds-fload-right">
                    <Button type="success" @click="openSettingModal">
                        新增
                    </Button>
                </div>-->
            </div>
            <div class="ds-table-box">
                <Table border highlight-row ref="currentRowTable" :columns="columns" :data="tableData"></Table>
                <div class="ds-page-body" v-if="totalSize > pageSize">
                    <Page :total="totalSize" :page-size="pageSize" @on-change="slectPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="eqModal" :title="title" :mask-closable="false" width="600" class-name="vertical-center-modal">
            <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                <Row>
                    <i-col span="12">
                        <form-item label="场所类型" prop="resTypeName">
                            <i-input type="text" v-model="formCustom.resTypeName" @on-focus="selectOtherType"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="场所名称" prop="name">
                            <i-input type="text" v-model="formCustom.name"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="场所面积" prop="area">
                            <i-input type="text" v-model="formCustom.area"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="容纳人数" prop="count">
                            <i-input type="text" v-model="formCustom.count"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="场所职能" prop="function">
                            <i-input v-model="formCustom.function" type="textarea" placeholder="请输入资源职能"></i-input>
                        </form-item>
                    </i-col>
                </Row>
            </i-form>
            <div slot="footer">
                <Button size="large" type="primary"  @click="handleSubmit('formCustom')">保存</Button>
                <Button size="large" @click="handleReset('formCustom')">取消</Button>
            </div>
        </modal>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
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
                    return callback(new Error('请输入场所名称'));
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
            const validateArea = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入场所面积'));
                } else {
                    callback()
                }
            };
            const validateFunctions = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入资源职能'));
                } else {
                    callback()
                }
            };
            return {
                height: {
                    height: '',
                    'margin-left': '5px'
                },
                title: '新增场所信息',
                pageShow: false,
                totalSize: null,
                pageNum: 1,
                treeMode: false,
                eqModal: false,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '场所类型',
                        key: 'resTypeName',
                        align: 'center'
                    },
                    {
                        title: '场所名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '场所面积',
                        key: 'area',
                        align: 'center'
                    },
                    {
                        title: '可容纳人数',
                        key: 'count',
                        align: 'center'
                    },
                    {
                        title: '职能',
                        key: 'function',
                        align: 'center'
                    }
                ],
                tableData: [],
                formCustom: {
                    resTypeName: '',
                    mode: '',
                    count: '',
                    area: '',
                    unitName: '',
                    unitId: '',
                    function: '',
                    name: ''
                },
                ruleCustom: {
                    // resTypeName: [
                    //   { validator: validateResTypeName, trigger: 'blur' }
                    // ],
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    area: [
                        { validator: validateArea, trigger: 'blur' }
                    ],
                    count: [
                        { validator: validateCounts, trigger: 'blur' }
                    ],
                    function: [
                        { validator: validateFunctions, trigger: 'blur' }
                    ]
                },
                unit: []
            };
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(75)
            this.refugeQuery();
        },
        computed: {
            contentNodeId() {
                return this.$store.state.userCode.contentNodeId //nodeId
            },
            planId () {
                return this.$store.state.planContent.publishPlanId; // planID
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
                'saveDemoData',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            refugeQuery () {
                //其他列表查询
                let info = {
                    userCode: this.userCode,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    planId: this.planId
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/refuge/queryFBPlanResRefuge',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let total = response.data.data.total;
                            this.totalSize = response.data.data.total;
                            if ( total > this.pageSize ) {
                                this.pageShow = true;
                            } else {
                                this.pageShow = false;
                            }
                            this.tableData = response.data.data.list;
                        }
                    }
                ).catch(

                );
            },
            treeModalClose () {
                this.treeMode = false;
            },
            selectIncidentTypeId() {
                this.treeMode = true;
            },
            openSettingModal () {
                this.title = '新增资源信息'
                this.formCustom = {
                    id: '',
                    resTypeId: '',
                    resTypeName: '',
                    mode: '',
                    count: '',
                    area: '',
                    unitName: '',
                    unitId: '',
                    function: ''
                }

                this.eqModal = true;
            },
            edit (index) {
                //打开编辑弹框
                this.tableIndex = index
                this.title = '编辑资源信息'

                //详情查询
                let id = this.tableData[index].id;
                const info = {
                    userCode: this.userCode,
                    id: id
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/refuge/getPlanResRefuge',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.formCustom = response.data.data;
                        }
                    }
                ).catch(

                );
                this.eqModal = true;
            },
            deleteSafeHaven (data) {
                const index = data.index;
                const id = data.row.id;
                //删除车辆信息
                const info = {
                    userCode: this.userCode,
                    id: id
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/refuge/removePlanResRefuge',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.refugeQuery();
                        }
                    }
                ).catch(

                );
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const info = this.formCustom;
                        info.userCode = this.userCode;
                        info.plan = { id: this.planIdInfo }
                        info.node = { id: this.contentNodeId }
                        let url = this.url + '/plan/refuge/savePlanResRefuge';
                        //提交估算信息
                        axios({
                            method: 'post',
                            url: url,
                            data: info
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.success('操作成功!');
                                    //重新查询列表
                                    this.refugeQuery();
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
                    title: '场所类型',
                    treeMultiple: false,
                    additional: 'otherType',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode,
                        category: 3
                    },
                    url: this.url + '/platform/public/queryResourceTypeTree4New'//'/platform/public/queryResourceTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            treeModalSave (treeInfo,type) {
                //保存tree选择数据
                if ( type === 'otherType') {
                    this.formCustom.resTypeId = treeInfo[0].id;
                    this.formCustom.resTypeName = treeInfo[0].title;
                    this.treeMode = false;
                }
            },
            slectPage (index) {
                //分页查询
                this.pageNum = index;
                this.refugeQuery();
            }
        },
        mounted () {
        },
        destroyed () {
        }
    };
</script>

<style scoped>
    .ivu-input-type textarea {
        height: 80px!important;
    }
</style>
