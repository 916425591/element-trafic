<template>
    <div>
        <!-- 出动信息 -->
        <modal v-model="outInfoModal" title="出动信息" :mask-closable="false" width="600" @on-cancel="closeOutInfoModal" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="outInfo" :model="outInfo" :rules="outInfoCustom" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="出动单位： " prop="feedbackOrgName">
                                <i-input type="text" v-model="outInfo.feedbackOrgName" @on-focus="openOrgModal"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="出动人员： " prop="feedbacker">
                                <i-input type="text" v-model="outInfo.feedbacker" @on-focus="openOutPersonModal"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="出动时间： " prop="feedbackTime">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" @on-change="changeOutInfoTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="简要内容： " prop="content">
                                <i-input type="textarea" v-model="outInfo.content"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>携带资源</h2>
                    <div class="ds-fload-right">
                        <Button type="ghost" size="small" style="background: #fff;" @click="addResourceModal">
                            <Icon type="android-add" size="20"></Icon>
                        </Button>
                        <Button type="ghost" size="small" style="background: #fff;" @click="editResourceModal">
                            <Icon type="edit" size="20"></Icon>
                        </Button>
                    </div>
                </div>
                <div class="ds-table-box">
                    <Table border ref="selection" highlight-row size="small" height="237" :columns="outInfoHead" :data="outInfoData" @on-row-click="registerResourceTableSelect"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveOutInfoModal('outInfo')">确定</Button>
                <Button size="large"  @click="closeOutInfoModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'

    export default {
        data () {
            const validateFeedbackOrgName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择执行单位'));
                } else {
                    callback()
                }
            };
            const validateFeedbacker = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择执行人员'));
                } else {
                    callback()
                }
            };
            const validateFeedbackTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择出动时间'));
                } else {
                    callback()
                }
            };
            const validateContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入简要内容'));
                } else {
                    callback()
                }
            };
            return {
                outInfoModal: true,
                outInfo: {
                    feedbackOrgId: null,
                    feedbackOrgName: '',
                    queryCode: '',
                    feedbackerId: null,
                    feedbacker: '',
                    feedbackTime: '',
                    content: ''
                },
                selectTableNode: {},
                outInfoHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源名称',
                        key: 'resName',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'count',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        width: 100,
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
                outInfoData: [],
                outInfoCustom: {
                    feedbackOrgName: [
                        { required: true, validator: validateFeedbackOrgName, trigger: 'blur' }
                    ],
                    feedbacker: [
                        { required: true, validator: validateFeedbacker, trigger: 'blur' }
                    ],
                    feedbackTime: [
                        { required: true, validator: validateFeedbackTime, trigger: 'change' }
                    ],
                    content: [
                        { required: true, validator: validateContent, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            ...mapActions([
                'saveResourceData'
            ]),
            openOrgModal () {
                //打开执行单位
                this.$emit('open-modal', 'org');
            },
            openOutPersonModal () {
                if (!this.outInfo.feedbackOrgId) {
                    this.$Message.warning('请先选择出动单位')
                } else {
                    this.$emit('open-modal', 'person', this.outInfo.queryCode); 
                }
            },
            changeOutInfoTime (time) {
                this.outInfo.feedbackTime = time;
            },
            addResourceModal () {
                //打开增加资源弹窗
                const node = {
                    type: 'add'
                }
                this.saveResourceData(node);
                this.$emit('open-modal', 'resourceModal');
            },
            editResourceModal () {
                //打开修改资源弹窗
                if ( !this.selectTableNode.resName ) {
                    this.$Message.warning('请先选择携带资源记录')
                } else {
                    const node = this.selectTableNode;
                    node.type = 'edit';
                    this.saveResourceData(node);
                    this.$emit('open-modal', 'editResource');
                }
            },
            deleteResource (params) {
                //删除资源
                this.outInfoData.splice(params.index,1);
            },
            saveOutInfoModal (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const queryO = this.outInfo;
                        queryO.ress = this.outInfoData;
                        this.$emit('save-out-info',queryO);
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
            },
            closeOutInfoModal () {
                this.$emit('close-out-modal');
            },
            settingOrg (data) {
                //设置单位
                this.outInfo.feedbackOrgId = data[0].id;
                this.outInfo.feedbackOrgName = data[0].title;
                this.outInfo.queryCode = data[0].queryCode;
                this.$refs.outInfo.validateField('feedbackOrgName', valid => {
                    
                });
            },
            settingPerson (data) {
                this.outInfo.feedbackerId = data.id;
                this.outInfo.feedbacker = data.name;
                this.$refs.outInfo.validateField('feedbacker', valid => {
                    
                });
            },
            registerResourceTableSelect (data, index) {
                this.selectTableNode = data;
                this.selectTableNode.index = index;
            },
            settingResource (data) {
                this.outInfoData.push(data);
                this.selectTableNode = {};
            },
            editResource (data) {
                this.$set(this.outInfoData,data.index,data);
                this.selectTableNode = {};
            }
        }
    }
</script>

<style scoped>

</style>

