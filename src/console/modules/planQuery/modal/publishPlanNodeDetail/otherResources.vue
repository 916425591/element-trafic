<template>
    <div>
        <!-- 其他资源 -->
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>其他资源</h2>
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
                        <form-item label="资源类型" prop="resTypeName">
                            <i-input type="text" v-model="formCustom.resTypeName" @on-focus="selectOtherType"></i-input>
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
            const validateUnitName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入计量单位'));
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
                title: '新增资源信息',
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
                        title: '资源类型',
                        key: 'resTypeName',
                        align: 'center'
                    },
                    {
                        title: '规格',
                        key: 'mode',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'counts',
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        align: 'center'
                    },
                    {
                        title: '职能',
                        key: 'functions',
                        align: 'center'
                    }
                ],
                tableData: [],
                formCustom: {
                    resTypeName: '',
                    mode: '',
                    counts: '',
                    unitName: '',
                    unitId: '',
                    functions: '',
                    name: ''
                },
                ruleCustom: {
                    // resTypeName: [
                    //   { validator: validateResTypeName, trigger: 'blur' }
                    // ],
                    mode: [
                        { validator: validateMode, trigger: 'blur' }
                    ],
                    unitId: [
                        { validator: validateUnitName, trigger: 'change' }
                    ],
                    counts: [
                        { type: 'number',validator: validateCounts, trigger: 'blur' }
                    ],
                    functions: [
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
            this.otherQuery();
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
            otherQuery () {
                //其他列表查询
                let info = {
                    userCode: this.userCode,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    planId: this.planId
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/content/queryFBPlanContent4ResOtherByPage',
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
                    counts: '',
                    unitName: '',
                    unitId: '',
                    functions: ''
                }
                //计量单位列表查询
                this.queryUnit();

                this.eqModal = true;
            },
            edit (index) {
                //打开编辑弹框
                this.tableIndex = index
                this.title = '编辑资源信息'

                //计量单位列表查询
                this.queryUnit();

                //装备详情查询
                let id = this.tableData[index].id;
                const info = {
                    userCode: this.userCode,
                    id: id
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/content/getPlanContent4ResOtherDetail',
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
            deleteOtherResources (data) {
                const index = data.index;
                const id = data.row.id;
                //删除车辆信息
                const info = {
                    userCode: this.userCode,
                    id: id
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/content/removePlanContent4ResOther',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.otherQuery();
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
                        info.planId = this.planIdInfo
                        info.nodeId = this.contentNodeId
                        let url = '';
                        //判断是否新增或者修改
                        if ( info.id === '') {
                            url = this.url + '/plan/content/addPlanContent4ResOther';
                        } else {
                            url = this.url + '/plan/content/modifyPlanContent4ResOther';
                        }
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
                                    this.otherQuery();
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
                    title: '其它类型',
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
            treeModalSave (treeInfo,type) {
                //保存tree选择数据
                if ( type === 'otherType') {
                    this.formCustom.resTypeId = treeInfo[0].id;
                    this.formCustom.resTypeName = treeInfo[0].title;
                    this.treeMode = false;
                }
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
            slectPage (index) {
                //分页查询
                this.pageNum = index;
                this.otherQuery();
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
