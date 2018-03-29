<template>
    <div>
        <div class="ds-widget-box ds-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>组织机构</h2>
            </div>
            <div>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        指挥中心成员
                    </p>
                    <div>
                        <Table border :columns="commandCenterHead" :data="commandCenter"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        前线指挥部
                    </p>
                    <div>
                        <Table border :columns="headQuartersHead" :data="headQuarters"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        成员单位
                    </p>
                    <div>
                        <Table border :columns="memberOrgHead" :data="memberOrg"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        专家组
                    </p>
                    <div>
                        <Table border :columns="expertGroupHead" :data="expertGroup"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        保障救援小组
                    </p>
                    <div>
                        <Table border :columns="groupHead" :data="group"></Table>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                height: {
                    height: '',
                    'overflow-y': 'scroll'
                },
                commandCenterHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '职务',
                        key: 'duty',
                        align: 'center'
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
                        title: '职责',
                        key: 'function',
                        align: 'center'
                    }
                ],
                headQuartersHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '职务',
                        key: 'duty',
                        align: 'center'
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
                        title: '职责',
                        key: 'function',
                        align: 'center'
                    }
                ],
                memberOrgHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '单位名称',
                        key: 'duty',
                        align: 'center'
                    },
                    {
                        title: '负责人',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'mobile',
                        align: 'center'
                    },
                    {
                        title: '职责',
                        key: 'function',
                        align: 'center'
                    }
                ],
                expertGroupHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '姓名',
                        key: 'expertName',
                        align: 'center'
                    },
                    {
                        title: '职务',
                        key: 'duty',
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'mobile',
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'expertType',
                        align: 'center'
                    },
                    {
                        title: '专长',
                        key: 'expertise',
                        align: 'center'
                    }
                ],
                groupHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '名称',
                        key: 'expertName',
                        align: 'center'
                    },
                    {
                        title: '负责人',
                        key: 'personName',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '小组职务',
                        key: 'dutyType',
                        align: 'center'
                    }

                ],
                commandCenter: [],
                headQuarters: [],
                memberOrg: [],
                expertGroup: [],
                group: []
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(75) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.queryOrganization()
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
            queryOrganization() {
                const url = this.url + '/plan/organization/queryFBOrganization'
                const userCode = this.userCode
                const planId = this.planId
                axios({
                    method: 'get',
                    url: url,
                    params: {
                        userCode,
                        planId
                    }
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const res = response.data.data
                            /**前线指挥部 */
                            if(res && res.frontLineHeadquarters) {
                                const frontLineHeadquarters = res.frontLineHeadquarters
                                let frontData = []
                                for (let i = 0; i < frontLineHeadquarters.length; i++) {
                                    let f
                                    if(frontLineHeadquarters[i].duty === 1) {
                                        f = '指挥官'
                                    } else if(frontLineHeadquarters[i].duty === 2) {
                                        f = '副指挥官'
                                    } else {
                                        f = '成员'
                                    }
                                    frontData.push({
                                        duty: f,
                                        name: frontLineHeadquarters[i].member.name,
                                        identity: frontLineHeadquarters[i].member.duty,
                                        mobile: frontLineHeadquarters[i].member.mobile,
                                        function: frontLineHeadquarters[i].function
                                    })
                                }
                                this.headQuarters  = frontData
                            } else {
                                this.headQuarters = []
                            }
                            /*指挥中心成员*/
                            if(res && res.headquarters) {
                                const headquarters = res.headquarters
                                let leader = []
                                for (let i = 0; i < headquarters.length; i++) {
                                    let fff
                                    if(headquarters[i].duty === 1) {
                                        fff = '指挥官'
                                    } else if(headquarters[i].duty === 2) {
                                        fff = '副指挥官'
                                    } else {
                                        fff = '成员'
                                    }
                                    leader.push({
                                        duty: fff,
                                        name: headquarters[i].member.name,
                                        identity: headquarters[i].member.duty,
                                        mobile: headquarters[i].member.mobile,
                                        function: headquarters[i].function
                                    })
                                }
                                this.commandCenter = leader
                            } else {
                                this.commandCenter = []
                            }
                            /*成员单位*/
                            if(res && res.memberOrg) {
                                const memberOrg = res.memberOrg
                                let memberOrgleader = []
                                for (let i = 0; i < memberOrg.length; i++) {
                                    memberOrgleader.push({
                                        duty: memberOrg[i].orgName,
                                        name: memberOrg[i].personName,
                                        identity: memberOrg[i].personDuty,
                                        mobile: memberOrg[i].mobile,
                                        function: memberOrg[i].orgDuty
                                    })
                                }
                                this.memberOrg = memberOrgleader
                            } else {
                                this.memberOrg = []
                            }
                            /**专家组 */
                            if(res && res.expertGroup) {
                                const expertGroup = res.expertGroup
                                let expertGroupleader = []
                                for (let i = 0; i < expertGroup.length; i++) {
                                    expertGroupleader.push({
                                        duty: expertGroup[i].duty,
                                        expertName: expertGroup[i].expertName,
                                        expertType: expertGroup[i].expertType,
                                        mobile: expertGroup[i].mobile,
                                        expertise: expertGroup[i].expertise
                                    })
                                }
                                this.expertGroup = expertGroupleader
                            } else {
                                this.expertGroup = []
                            }
                            /** 应急救援小组*/
                            if(res && res.securityGroup) {
                                const securityGroup = res.securityGroup
                                let groupleader = []
                                for (let i = 0; i < securityGroup.length; i++) {
                                    groupleader.push({
                                        dutyType: securityGroup[i].duty,
                                        expertName: securityGroup[i].name,
                                        expertType: securityGroup[i].expertType,
                                        personName: securityGroup[i].personName,
                                        expertise: securityGroup[i].expertise
                                    })
                                }
                                this.group = groupleader
                            } else {
                                this.group = []
                            }
                        }
                    }
                ).catch(

                )
            }
        }
    }
</script>

<style scoped>
    .ds-org-card {
        margin: 5px;
    }
</style>

