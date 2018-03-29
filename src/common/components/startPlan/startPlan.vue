<template>
    <div>
        <modal v-model="startPlanModal" title="启动预案" :mask-closable="false" width="800" @on-cancel="startPlanClose" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="noticeInfo" :model="noticeInfo" :rules="ruleCustom" :label-width="100">
                    <form-item label="通知内容: " prop="content">
                        <i-input v-model="noticeInfo.content" type="textarea" :rows="4"></i-input>
                    </form-item>
                </i-form>
            </div>
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>通知成员单位</h2>
                    <div class="ds-fload-right">
                        <Button type="ghost" size="small" style="background: #fff;" @click="settingOrg">
                            <Icon type="android-settings"></Icon>
                        </Button>
                    </div>
                </div>
                <div>
                    <Row>
                        <i-col span="12">
                            <Table border highlight-row size="small" height="245" :columns="memberHead" :data="memberData" @on-row-click="selectTableRow"></Table>
                        </i-col>
                        <i-col span="12" class="ds-member-box">
                            <div class="ds-widget-box">
                                <div class="ds-widget-title">
                                    <span class="ds-title-icon"></span>
                                    <h2>成员单位职责</h2>
                                </div>
                                <div class="ds-table-box" style="height: 208px;">
                                    <i-input v-if="textSHow" v-model="memberData[dutyIndex].duty" type="textarea" :rows="9" placeholder="请输入成员单位职责"></i-input>
                                </div>
                            </div>
                        </i-col>
                    </Row>
                </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="startPlan('noticeInfo')">确定</Button>
                <Button size="large"  @click="startPlanClose">取消</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';

    export default {
        data () {
            const validateNotice = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入通知内容'));
                } else {
                    callback()
                }
            };
            return {
                startPlanModal: true,
                noticeInfo: {
                    content: ''
                },
                orgDuty: '',//成员单位职责
                textSHow: false,
                memberHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '单位名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 80,
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
                                        vm.memberData.splice(params.index, 1)
                                        this.textSHow = false;
                                    }
                                }
                            }, [
                                h('Button', {
                                    props: {
                                            size: 'small',
                                            placement: 'top'
                                        }
                                    },  [
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
                memberData: [],
                dutyIndex: 0,
                ruleCustom: {
                    content: [
                        { required: true, validator: validateNotice, trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{
            getIncidentDetail () {
                console.log('detail', this.$store.state.startPlan.detail)
                return this.$store.state.startPlan.detail;
            },
            getUrl () {
                return this.$store.state.userCode.url;
            }
        },
        created () {
            //查询成员单位
            console.log(this.getIncidentDetail,'dasdsa')
            this.queryMemberOrg ();
        },
        methods: {
            settingOrg () {
                this.$emit('open-member')
            },
            startPlan (name) {
                //启动预案
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if ( this.memberData.length < 1) {
                            this.$Message.warning('请先选择成员单位');
                        } else {
                            //启动预案
                            const memberList = [];
                            for (let i=0; i<this.memberData.length;i++) {
                                memberList.push({
                                    orgId: this.memberData[i].id,
                                    orgName: this.memberData[i].name,
                                    duty: this.memberData[i].duty
                                })
                            }
                            const publishPlanId = this.getIncidentDetail.publishPlanId;
                            const queryO = {
                                userCode: Cookies.get('userCode'),
                                orgs: memberList,
                                content: this.noticeInfo.content,
                                publishPlanId: publishPlanId
                            };
                            this.$emit('start-plan-save', queryO);
                        }
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
            },
            settingMember (memberInfo) {
                //设置成员单位数据
                this.memberData.push(
                    {
                        id: memberInfo[0].id,
                        name: memberInfo[0].title,
                        duty: ''
                    }
                )
            },
            startPlanClose () {
                this.$emit('start-plan-close')
            },
            selectTableRow (data, index) {
                //选择单位操作单位职责
                this.dutyIndex = index;
                this.textSHow = true;
            },
            queryMemberOrg () {
                //查询成员单位
                const incidentDetail = this.getIncidentDetail;
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    name: '',
                    publishPlanId: incidentDetail.publishPlanId
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/plan/publish/queryMemberOrgs',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.memberData = response.data.data;
                            this.textSHow = true;
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            }
        }
    }
</script>

<style scoped>
    .ds-search-body {
        margin-bottom: 16px;
    }
</style>

