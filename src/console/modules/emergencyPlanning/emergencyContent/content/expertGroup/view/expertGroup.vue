<template>
    <div class="icon_error">
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>专家组</h2>
            </div>
            <div class="ds-expertBody" style="height: 305px; overflow-y: scroll;">
                <Row>
                    <i-col span="3">
                        <div @click="treeModalOpen(1, leader.id)">
                            <Icon class="ds-bg-icon" type="person"></Icon>
                            <p>专家组组长</p>
                        </div>
                        <poptip placement="right" confirm title="您确认删除这条内容吗？" @on-ok="deleteMembers(leader.id)" style="margin-top: 5px;">
                            <Button type="error">删除</Button>
                        </poptip>
                    </i-col>
                    <i-col span="7" class="ds-expert-list">
                        <div>
                            <span>姓名:</span>
                            <span>
                                {{ leader.name }}
                            </span>
                        </div>
                        <div>
                            <span>职称:</span>
                            <span>{{ leader.duty }}</span>
                        </div>
                        <div>
                            <span>经验:</span>
                            <span>{{ leader.experience }}</span>
                        </div>
                    </i-col>
                    <i-col span="7" class="ds-expert-list">
                        <div>
                            <span>原单位职务:</span>
                            <span>{{ leader.dutyName }}</span>
                        </div>
                        <div>
                            <span>
                                个人专长:
                            </span>
                            <span>{{ leader.expertise }}</span>
                        </div>
                    </i-col>
                    <i-col span="7" class="ds-expert-list">
                        <div>
                            <span>联系电话:</span>
                            <span>{{ leader.mobile }}</span>
                        </div>
                    </i-col>
                </Row>
                <Row v-for="(item) in expertList" :key="item.id">
                    <i-col span="3">
                        <div @click="treeModalOpen(2, item.id)">
                            <Icon class="ds-bg-icon" type="person"></Icon>
                            <p>{{ item.title }}</p>
                        </div>
                        <poptip placement="right" confirm title="您确认删除这条内容吗？" @on-ok="deleteMembers(item.id)" style="margin-top: 5px;">
                            <Button type="error">删除</Button>
                        </poptip>
                    </i-col>
                    <i-col span="7" class="ds-expert-list">
                        <div>
                            <span>姓名:</span>
                            <span>
                                {{ item.name }}
                            </span>
                        </div>
                        <div>
                            <span>职称:</span>
                            <span>{{ item.duty }}</span>
                        </div>
                        <div>
                            <span>经验:</span>
                            <span>{{ item.experience }}</span>
                        </div>
                    </i-col>
                    <i-col span="7" class="ds-expert-list">
                        <div>
                            <span>原单位职务:</span>
                            <span>{{ item.dutyName }}</span>
                        </div>
                        <div>
                            <span>
                                个人专长:
                            </span>
                            <span>{{ item.expertise }}</span>
                        </div>
                    </i-col>
                    <i-col span="7" class="ds-expert-list">
                        <div>
                            <span>联系电话:</span>
                            <span>{{ item.mobile }}</span>
                        </div>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="3">
                        <div @click="addTreeModalOpen(2, '新增副组长')">
                            <Icon class="ds-bg-icon" type="person-add"></Icon>
                            <p>副组长</p>
                        </div>
                    </i-col>
                    <i-col span="21"></i-col>
                </Row>
            </div>
        </div>
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>专家组成员</h2>
                <div class="ds-fload-right">
                    <Button type="success" @click="addExpertMembers">新增</Button>
                </div>
            </div>
            <div class="ds-expertMemberBody" :style='height' :data-json="tableHeight">
                <Table border :columns="columns1" :data="data1"></Table>
            </div>
        </div>
        <expert-add-modal v-if="addModal" @modal-save="expertSave" @modal-close="expertModalClose"></expert-add-modal>
    </div>
    
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import expertAddModal from './expertGroupAddModal'
    import Cookies from 'js-cookie';

    export default {
        name: 'expertGroup',
        components: {
            expertAddModal
        },
        data () {
            return {
                 height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则新增此样式*/
                },
                addModal: false,
                leader: {
                    id: '',
                    name: '',
                    duty: '',
                    mobile: '',
                    type: '',
                    expertise: '',
                    dutyName: '',
                    title: '专家组组长',
                    experience: ''
                },
                expertList: [],
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'mobile',
                        align: 'center'
                    },
                    {
                        title: '职称',
                        key: 'duty',
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '专长',
                        key: 'expertise',
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
                                            vm.deleteMembers(params.row.id, params.index)
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
                data1: [],
                chooseExpertStatus: 1,
                oldExpertId: 0,
                dutyStatus: 1
            }
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
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(455)
            this.getDataAboutExpertGroup()
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            treeModalOpen (index, id) {
                this.oldExpertId = id
                this.chooseExpertStatus = 1
                this.dutyStatus = index
                this.addModal = true;
            },
            addExpertMembers () {
                this.chooseExpertStatus = 2
                this.dutyStatus = 3
                this.addModal = true;
            },
            addTreeModalOpen () {
                this.dutyStatus = 2
                this.addModal = true;
            },
            expertSave (treeInfo,type) {
                const url = this.url + '/plan/PlanContent4Expert/addPlanContent4Expert'
                const parmas = {
                    id: treeInfo.id,
                    name: treeInfo.name,
                    duty: treeInfo.dutyTitle,
                    mobile: treeInfo.mobile,
                    type: treeInfo.type,
                    expertise: treeInfo.expertise
                }
                let data = {}
                if (this.chooseExpertStatus === 1) {
                    data = {
                        oldExpertId: this.oldExpertId,
                        expertId: treeInfo.id,
                        expertName: treeInfo.name,
                        dutyType: this.dutyStatus,
                        planId: this.planIdInfo,
                        nodeId: this.contentNodeId,
                        userCode: Cookies.get('userCode')
                    }
                } else {
                    data = {
                        expertId: treeInfo.id,
                        expertName: treeInfo.name,
                        dutyType: this.dutyStatus,
                        planId: this.planIdInfo,
                        nodeId: this.contentNodeId,
                        userCode: Cookies.get('userCode')
                    }
                }
                axios({
                    method: 'post',
                    url: url,
                    data: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('添加成功');
                            this.addModal = false
                            this.getDataAboutExpertGroup()
                        } else {
                            this.$Message.error('添加失败')
                        }
                    }
                ).catch(
                );
            },
            expertModalClose () {
                //关闭专家选择弹出
                this.addModal = false;
            },
            deleteMembers(id, index) {
                const url = this.url + '/plan/PlanContent4Expert/deletedContent4Expert'
                const userCode = Cookies.get('userCode')
                axios({
                    method: 'get',
                    url: url,
                    params: { userCode, id }
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            // this.data1.splice(index, 1);
                            this.getDataAboutExpertGroup()
                            this.$Message.info('删除成功')
                        }
                    }
                ).catch(
                );
            },
            getDataAboutExpertGroup() {
                const url = this.url + '/plan/PlanContent4Expert/queryPlanContent4Expert'
                const userCode = Cookies.get('userCode')
                axios({
                    method: 'post',
                    url: url,
                    data: { userCode,planId: this.planIdInfo }
                }).then(
                    response => {
                        this.expertList = []
                        this.data1 = []
                        this.leader = {
                            id: '',
                            name: '',
                            duty: '',
                            mobile: '',
                            type: '',
                            expertise: '',
                            dutyName: '',
                            title: '专家组组长',
                            experience: ''
                        }
                        if ( response.data.code === 200 ) {
                            if(response.data.data.length > 0) {
                                response.data.data.forEach((v, i) => {
                                    let expert
                                    if(v.dutyType === 1) {
                                        expert = '组长'
                                        this.leader = {
                                            id: v.id,
                                            name: v.expertName,
                                            duty: v.duty,
                                            mobile: v.mobile,
                                            type: v.expertType,
                                            expertise: v.expertise,
                                            dutyName: v.profTitme,
                                            title: '专家组组长',
                                            experience: v.experience
                                        }
                                    } else if(v.dutyType === 2) {
                                        expert = '副组长'
                                        this.expertList.push({
                                            id: v.id,
                                            name: v.expertName,
                                            duty: expert,
                                            mobile: v.mobile,
                                            type: v.expertType,
                                            expertise: v.expertise,
                                            dutyName: v.profTitme,
                                            title: '副组长',
                                            experience: v.experience
                                        })
                                    } else {
                                        expert = '成员'
                                        this.data1.push({
                                            id: v.id,
                                            name: v.expertName,
                                            duty: v.profTitme,
                                            mobile: v.mobile,
                                            type: v.expertType,
                                            expertise: v.expertise,
                                            dutyName: v.duty
                                        })
                                    }
                                })
                            } else {
                                this.expertList = [{
                                    name: '',
                                    duty: '',
                                    mobile: '',
                                    type: '',
                                    expertise: '',
                                    dutyName: '',
                                    title: '专家组组长',
                                    experience: ''
                                }]
                                this.data1 = []
                            }
                        }
                    }
                ).catch(
                );
            }
        }
    }
</script>

<style scoped>
    .ds-expertBody {
        text-align: center;
    }
    .ds-bg-icon {
        font-size: 50px;
    }
    .ds-expert-list {
        line-height: 24px;
    }
    
</style>
<style>
    .icon_error .ivu-poptip-confirm .ivu-poptip-body .ivu-icon{
        position: static!important;
    }
</style>


