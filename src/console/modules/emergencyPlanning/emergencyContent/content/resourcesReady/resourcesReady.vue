<template>
    <div>
        <div class="ds-widget-box ds-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>资源需求</h2>
            </div>
            <div>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        装备估算
                    </p>
                    <div>
                        <Table border :columns="commandCenterHead" :data="commandCenter"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        物资估算
                    </p>
                    <div>
                        <Table border :columns="headQuartersHead" :data="headQuarters"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        专业车辆
                    </p>
                    <div>
                        <Table border :columns="memberOrgHead" :data="memberOrg"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        专业抢险队
                    </p>
                    <div>
                        <Table border :columns="expertGroupHead" :data="expertGroup"></Table>
                    </div>
                </Card>
                <Card class="ds-org-card" dis-hover>
                    <p slot="title">
                        其它资源
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
                        title: '装备类型',
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
                        title: '物资类型',
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
                        title: '车辆类型',
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
                        title: '队伍类型',
                        key: 'resTypeName',
                        align: 'center'
                    },
                    {
                        title: '职能',
                        key: 'functions',
                        align: 'center'
                    },
                    {
                        title: '人员数量',
                        key: 'counts',
                        align: 'center'
                    },
                    {
                        title: '装备情况',
                        key: 'equipment',
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
                        title: '资源类型',
                        key: 'resTypeName',
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
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryOrganization() {
                const url = this.url + '/plan/resource/queryResource'
                const userCode = this.userCode
                const planId = this.planIdInfo
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
                            /**装备  */
                            if(res && res.resourceEquipment) {
                                const resourceEquipment = res.resourceEquipment
                                this.commandCenter = []
                                resourceEquipment.forEach((v, i) => {
                                    this.commandCenter.push({
                                        id: v.id,
                                        counts: v.counts,
                                        mode: v.mode,
                                        resTypeName: v.resTypeName,
                                        unitName: v.unitName,
                                        functions: v.functions
                                    })
                                })
                            } else {
                                this.commandCenter = []
                            }
                            /** resourceMaterial 物资 */
                            if(res && res.resourceMaterial) {
                                const resourceMaterial = res.resourceMaterial
                                this.headQuarters = []
                                resourceMaterial.forEach((v, i) => {
                                    this.headQuarters.push({
                                        id: v.id,
                                        counts: v.counts,
                                        mode: v.mode,
                                        resTypeName: v.resTypeName,
                                        unitName: v.unitName,
                                        functions: v.functions
                                    })
                                })
                            } else {
                                this.headQuarters = []
                            }
                            // memberOrg resourceVehicle 车辆
                            if(res && res.resourceVehicle) {
                                const resourceVehicle = res.resourceVehicle
                                this.memberOrg = []
                                resourceVehicle.forEach((v, i) => {
                                    this.memberOrg.push({
                                        id: v.id,
                                        counts: v.counts,
                                        mode: v.mode,
                                        resTypeName: v.resTypeName,
                                        unitName: v.unitName,
                                        functions: v.functions
                                    })
                                })
                            } else {
                                this.memberOrg = []
                            }
                            //resourceTeam expertGroup 专业抢险车队
                            if(res && res.resourceTeam) {
                                const resourceTeam = res.resourceTeam
                                this.expertGroup = []
                                resourceTeam.forEach((v, i) => {
                                    this.expertGroup.push({
                                        id: v.id,
                                        counts: v.count,
                                        equipment: v.equipment,
                                        resTypeName: v.resTypeName,
                                        unitName: v.unitName,
                                        functions: v.function
                                    })
                                })
                            } else {
                                this.expertGroup = []
                            }
                            //resourceOther group 其它资源
                            if(res && res.resourceOther) {
                                const resourceOther = res.resourceOther
                                this.group = []
                                resourceOther.forEach((v, i) => {
                                    this.group.push({
                                        id: v.id,
                                        counts: v.counts,
                                        mode: v.mode,
                                        resTypeName: v.resTypeName,
                                        unitName: v.unitName,
                                        functions: v.functions
                                    })
                                })
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

