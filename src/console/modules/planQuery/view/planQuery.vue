<template>
    <!-- 预案查询 -->
    <div class="ds-planQuery">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <Row class="ds-plan-search">
                <i-col span="6">
                    预案类型：
                    <i-input style="width: 200px;" v-model="planType" placeholder="请输入预案类型"></i-input>
                </i-col>
                <i-col span="6">
                    预案名称：
                    <i-input style="width: 200px;" v-model="planName" placeholder="请输入预案名称"></i-input>
                </i-col>
                <i-col span="12">
                    <Button type="primary" @click="queryPlan">查询</Button>
                    <Button type="ghost" @click="clearQueryPlan">清空查询</Button>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
                <div class="ds-fload-right">
                    <Button type="primary" @click="seePlanDetail">预案详情</Button>
                    <!-- <Button type="ghost" @click="" style="background: #fff;">预案实例</Button> -->
                </div>
            </div>
            <div>
                <Table border highlight-row :columns="queryHead" :data="queryData" @on-row-click="selectTable"></Table>
                <div class="ds-page-body" v-if="total > pageSize">
                    <Page :total="total" :page-size="pageSize" @on-change="planLibraryPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <plan-detail v-if="planDetailModal" @close-modal="closePlanModal"></plan-detail>
    </div>
</template>

<script>
    import axios from 'axios' 
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    import planDetail from '../modal/planDetail'
    export default {
        components: {
            planDetail
        },
        data () {
            return {
                total: 0,
                pageNum: 1,
                planType: '',
                planName: '',
                incidentType: [],
                queryHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '预案名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '预案类型',
                        key: 'planTypeName',
                        align: 'center'
                    },
                    {
                        title: '事件类型',
                        key: 'incidentTypeName',
                        align: 'center'
                    },
                    {
                        title: '关键字',
                        key: 'keyWords',
                        align: 'center'
                    },
                    {
                        title: '事件级别',
                        key: 'incidentLevelName',
                        align: 'center'
                    },
                    {
                        title: '主编单位',
                        key: 'chiefEditOrgName',
                        align: 'center'
                    },
                    {
                        title: '最新版本',
                        key: 'version',
                        align: 'center'
                    }
                ],
                queryData: [],
                selectNode: {},
                planDetailModal: false,
                height: {
                    height: ''
                }
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(110)
            this.queryPlan()
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
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent',/*将获取到的可读高度 存放到VUEX中进行换算*/
                'savePlanCaseInfo',
                'savePublishPlanId'
            ]),
            planLibraryPage(num) {
                //翻页功能
                this.pageNum = num;
                //翻页数据查询
                this.queryPlan();
            },
            clearQueryPlan() {
                this.planName = ''
                this.planType = ''
            },
            queryPlan() {
                const parmas = {
                    planTypeName: this.planType,
                    name: this.planName,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    userCode: this.userCode
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/content/queryPlanBy4Publish',
                    data: parmas
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.total = parseInt(response.data.data.total);
                            this.queryData = response.data.data.list;
                        }
                    }
                ).catch(
                    
                )
            },
            selectTable (data) {
                this.selectNode = data;
                this.savePlanCaseInfo(data);
                this.savePublishPlanId(data.id);
            },
            seePlanDetail () {
                console.log(this.selectNode)
                if (this.selectNode.id) {
                    this.planDetailModal = true;
                } else {
                    this.$Message.warning('请先选择预案')
                }
            },
            closePlanModal () {
                this.planDetailModal = false;
            }
        }
    }
</script>

<style scoped>
    .ds-widget-box {
        background: #ffffff;
    }
</style>

