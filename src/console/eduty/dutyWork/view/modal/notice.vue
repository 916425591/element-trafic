<template>
    <div>
        <modal v-model="noticeModal" title="发送通知" :mask-closable="false" width="600" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>通知详情</h2>
                </div>
                <div style="padding-top: 5px;">
                    <i-form ref="noticeInfo" :model="noticeInfo" :rules="noticeInfoCustom" :label-width="100">
                        <Row>
                            <i-col span="24">
                                <form-item label="通知标题： " prop="title">
                                    <i-input type="text" v-model="noticeInfo.title"></i-input>
                                </form-item>
                            </i-col>
                            <i-col span="24">
                                <form-item label="通知内容： " prop="content">
                                    <i-input type="textarea" :rows="4" v-model="noticeInfo.content"></i-input>
                                </form-item>
                            </i-col>
                        </Row>
                    </i-form>
                </div>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>设置单位</h2>
                    <div class="ds-fload-right">
                        <Button class="ds-white" type="ghost" size="small" @click="settingOrg">
                            <Icon type="ios-gear" size="20"></Icon>
                        </Button>
                    </div>
                </div>
                <div class="ds-table-box">
                    <Table border ref="selection" size="small" height="230" :columns="orgHead" :data="orgData"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveModal('noticeInfo')">确定</Button>
                <Button type="ghost" size="large" @click="closeModal">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        data () {
            const validateTitle = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择通知标题'));
                } else {
                    callback()
                }
            };
            const validateContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入通知内容'));
                } else {
                    callback()
                }
            };
            return {
                noticeModal: true,
                pageNum: 1,
                pageSize: 10,
                newManagement: [],
                noticeInfo: {

                },
                orgHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '预案名称',
                        key: 'name',
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
                                        vm.deleteOrg(params)
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
                orgData: [

                ],
                noticeInfoCustom: {
                    title: [
                        { required: true, validator: validateTitle, trigger: 'blur' }
                    ],
                    content: [
                        { required: true, validator: validateContent, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getTableDetail () {
                return this.$store.state.eduty.tableInfo
            },
            getUserCode () {
                return Cookies.get('userCode')
            },
            getUrl () {
                return this.$store.state.userCode.url
            }
        },
        created () {
           
        },
        methods: {
            closeModal () {
                this.$emit('close-modal');
            },
            searchMoreOrg () {
                this.pageNum = this.pageNum+1;
                this.queryOrg('scroll');
            },
            selectTable (data) {
                this.newManagement = data;
            },
            saveModal (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.orgData.length<1) {
                            this.$Message.warning('请设置通知单位')
                        } else {
                            const queryO = {
                                userCode: this.getUserCode,
                                title: this.noticeInfo.title,
                                content: this.noticeInfo.content,
                                orgs: this.orgData,
                                incidentId: this.getTableDetail.id
                            }
                            axios({
                                method: 'post',
                                url: this.getUrl+'/eduty/notice/saveNotice',
                                data:queryO 
                            }).then(
                                response => {
                                    if ( response.data.code === 200 ) {
                                        this.$Message.success('通知发送成功');
                                        this.$emit('save-modal');
                                    }
                                }
                            ).catch(
                                
                            );
                        }
                        
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
            },
            settingOrg () {
                this.$emit('open-modal');
            },
            addOrg (data) {
                for ( let i=0;i<data.length;i++ ) {
                    var flag = false;
                    for ( let j=0;j<this.orgData.length;j++ ) {
                        if ( this.orgData[j].id === data[i].id) {
                            flag = true;
                            break;
                        }
                    }
                    if(!flag) {
                        this.orgData.push(data[i])
                    }
                }
            },
            deleteOrg (data) {
                this.orgData.splice(data.index,1);
            }
        }
    }
</script>

<style scoped>
    .ds-manageList-box {
        height: 237px;
        overflow: auto;
    }
    .ds-manageList {
        display: inline-block;
        padding: 10px;
        margin: 5px;
        border: 1px solid #CDCDCD;
        border-radius: 4px;
    }
    .ds-white {
        background: #ffffff;
    }
</style>

