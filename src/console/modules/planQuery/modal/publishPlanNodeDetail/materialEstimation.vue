<template>
    <div>
        <!-- 物资估算 -->
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>物资估算</h2>
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
                <row>
                    <i-col span="12">
                        <form-item label="物资类型" prop="resTypeName">
                            <i-input v-model="formCustom.resTypeName" placeholder="请输入物资类型"  @on-focus="selectMaterialType"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="规格型号" prop="mode">
                            <i-input v-model="formCustom.mode" placeholder="请输入规格型号"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="数量" prop="counts">
                            <i-input type="text" v-model="formCustom.counts"  placeholder="请输入数量"></i-input>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="计量单位" prop="unitId">
                            <i-select v-model="formCustom.unitId" placeholder="请选择计量单位">
                                <i-option v-for="item in unit" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="物资职能" prop="functions">
                            <i-input v-model="formCustom.functions" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入职能"></i-input>
                        </form-item>
                    </i-col>
                </row>
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
            //     console.log(value)
            //     callback(new Error('请输入物资类型'));
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
                    return callback(new Error('请输入物资职能'));
                } else {
                    callback()
                }
            };
            return {
                height: {
                    height: '',
                    'margin-left': '5px'
                },
                title: '新增物资估算信息',
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
                        title: '物资类型',
                        key: 'resTypeName'
                    },
                    {
                        title: '规格型号',
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
                        title: '物资职能',
                        key: 'functions',
                        align: 'center'
                    }
                ],
                tableData: [],
                formCustom: {
                    resTypeName: '',
                    mode: '',
                    counts: 0,
                    unitName: '',
                    unitId: null,
                    functions: ''
                },
                ruleCustom: {
                    // resTypeName: [
                    //   { validator: validateResTypeName, trigger: 'blur' }
                    // ],
                    mode: [
                        { validator: validateMode, trigger: 'blur' }
                    ],
                    // unitId: [
                    //   { validator: validateUnitName, trigger: 'change' }
                    // ],
                    counts: [
                        { type: 'number', validator: validateCounts, trigger: 'blur' }
                    ],
                    functions: [
                        { validator: validateFunctions, trigger: 'blur' }
                    ]
                },
                // ruleCustom: {
                //   resTypeName: [
                //     {  message: '请输入物资类型', trigger: 'blur' }
                //   ],
                //   mode: [
                //     { message: '请输入规格型号', trigger: 'blur' }
                //   ],
                //   counts: [
                //     { message: '请输入物资数量', trigger: 'blur'}
                //   ],
                //   // unitId: [
                //   //   { required: true, message: '请选择信息', trigger: 'change' }
                //   // ],
                //   functions: [
                //     { message: '请输入物资描述', trigger: 'blur' },
                //     // { type: 'string', min: 10, message: '物资描述不能低于10个字符', trigger: 'blur' }
                //   ]
                // },
                unit: [],
            };
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(75)
            this.materialQuery();
            //计量单位列表查询
            this.queryUnit();
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
            materialQuery () {
                //物资列表查询
                let info = {
                    userCode: this.userCode,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    planId: this.planId
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/content/queryFBPlanContent4ResMaterialPlanByPage',
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
            openSettingModal () {
                this.title = '新增物资估算信息'
                this.formCustom = {
                    id: null,
                    resTypeId: null,
                    resTypeName: '',
                    mode: '',
                    counts: 0,
                    unitName: '',
                    unitId: null,
                    functions: ''
                }
                this.eqModal = true;
            },
            edit (index) {
                //打开编辑弹框
                this.tableIndex = index
                this.title = '编辑物资估算信息'
                //装备详情查询
                let materialId = this.tableData[index].id;
                const info = {
                    userCode: this.userCode,
                    id: materialId
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/content/getPlanContent4ResMaterialDetail',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            console.log(response.data.data)
                            this.formCustom = response.data.data;
                        }
                    }
                ).catch(

                );
                this.eqModal = true;
            },
            deleteEstimation (data) {
                const index = data.index;
                const id = data.row.id;
                //删除物资信息
                const info = {
                    userCode: this.userCode,
                    id: id
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/content/removePlanContent4ResMaterial',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.materialQuery();
                        }
                    }
                ).catch(

                );
            },
            handleSubmit (name) {
                console.log(this.formCustom)
                const info = this.formCustom;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        info.userCode = this.userCode;
                        info.planId = this.planIdInfo
                        info.nodeId = this.contentNodeId
                        let url = '';
                        //判断是否新增或者修改
                        if (info.id === null) {
                            url = this.url + '/plan/content/addPlanContent4ResMaterial';
                        } else {
                            url = this.url + '/plan/content/modifyPlanContent4ResMaterial';
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
                                    this.materialQuery();
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
            selectMaterialType () {
                //打开查询物资类型弹窗
                let TreeInfo = {
                    title: '物资类型',
                    treeMultiple: false,
                    additional: 'materialType',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode,
                        category: 1
                    },
                    url: this.url + '/platform/public/queryResourceTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            treeModalSave (treeInfo,type) {
                //保存tree选择数据
                if ( type === 'materialType') {
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
                        this.unit = []
                        if ( response.data.code === 200 ) {
                            const list = response.data.data;
                            for ( let i=0;i<list.length;i++ ) {
                                this.unit.push({
                                    value: parseInt(list[i].key),
                                    label: list[i].value
                                })
                            }
                        }
                    }
                ).catch(

                )
            },
            slectPage (index) {
                //分页查询
                this.pageNum = index;
                this.materialQuery();
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
