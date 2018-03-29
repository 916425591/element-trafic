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
                        <div >
                            <Icon class="ds-bg-icon" type="person"></Icon>
                            <p>专家组组长</p>
                        </div>
                        <!--<poptip placement="right" confirm title="您确认删除这条内容吗？" @on-ok="deleteMembers(leader.id)" style="margin-top: 5px;">
                            <Button type="error">删除</Button>
                        </poptip>-->
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
                        <div >
                            <Icon class="ds-bg-icon" type="person"></Icon>
                            <p>{{ item.title }}</p>
                        </div>
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
                <Row v-if="this.expertList.length===0">
                    <i-col span="3">
                        <div >
                            <Icon class="ds-bg-icon" type="person"></Icon>
                            <p >副组长</p>
                        </div>
                    </i-col>
                    <i-col span="21" style="text-align: left;">
                        暂无副组长
                    </i-col>
                </Row>
            </div>
        </div>
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>专家组成员</h2>
            </div>
            <div class="ds-expertMemberBody" :style='height' :data-json="tableHeight">
                <Table border :columns="columns1" :data="data1"></Table>
            </div>
        </div>
    </div>

</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';

    export default {
        name: 'expertGroup',
        components: {

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
                    }
                ],
                data1: [],
                chooseExpertStatus: 1,
                oldExpertId: 0,
                dutyStatus: 1
            }
        },
        computed: {
            nodeId () {
                return this.$store.state.planContent.publishNodeId; // nodeId
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
            getDataAboutExpertGroup() {
                const url = this.url + '/plan/PlanContent4Expert/queryFBPlanContent4Expert'
                const userCode = Cookies.get('userCode')
                axios({
                    method: 'post',
                    url: url,
                    data: { userCode,planId: this.planId}
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


