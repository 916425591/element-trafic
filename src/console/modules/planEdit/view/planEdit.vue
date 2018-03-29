<template>
    <!-- 预案修订 -->
    <div class="ds-planEdit">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <Row class="ds-plan-search">
                <i-col span="6">
                    预案类型：
                    <i-input style="width: 200px;" v-model="planType" @on-focus="alertTree"></i-input>
                </i-col>
                <i-col span="6">
                    预案名称：
                    <i-input style="width: 200px;" v-model="planName"></i-input>
                </i-col>
                <i-col span="12">
                    <Button type="primary" @click="queryPlan">查询</Button>
                    <Button type="ghost" @click="clearPlan">清空查询</Button>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>预案列表</h2>
                <div class="ds-fload-right">
                    <Button type="success" @click="openHistory">修订历史</Button>
                </div>
            </div>
            <div class="ds-table-box">
                <Table border highlight-row :columns="planHead" :data="planData"></Table>
                <div class="ds-page-body" v-if="total > pageSize">
                    <Page ref="pages" :total="total" :page-size="pageSize" @on-change="handelClickPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>        
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios'
import { mapActions } from 'vuex'
import tree from '@/common/components/treeModal/tree'
    export default {
        components: {
            tree
        },
        data () {
            return {
                pageNum: 1,
                total: 0,
                name: '',
                planName: '',
                planType: '',
                treeMode: false,
                planHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '预案名称',
                        key: 'planName',
                        align: 'center'
                    },
                    {
                        title: '预案类型',
                        key: 'planType',
                        align: 'center'
                    },
                    {
                        title: '事件类型',
                        key: 'incidentType',
                        align: 'center'
                    },
                    {
                        title: '事件级别',
                        key: 'incidentLevel',
                        align: 'center'
                    },
                    {
                        title: '主编单位',
                        key: 'editorOrg',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'state',
                        align: 'center'
                    },
                    {
                        title: '查看历史详情',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showLog(params)
                                        }
                                    }
                                }, '详情')
                            ]);
                        }
                    }
                ],
                planData: [],
                planId: null,
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
                'saveDemoData',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            showLog() {},
            treeModalSave (treeInfo,type) {
                //保存tree选择数据
                this.expertType = treeInfo[0].title
                this.idStatus = treeInfo[0].id
                this.treeMode = false;
            },
            treeModalClose () {
            //关闭装备类型弹框
                this.treeMode = false;
            },
            alertTree() {
                let TreeInfo = {
                    title: '选择预案类型',
                    treeMultiple: true,
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode,
                        category: 6
                    },
                    url: this.url + '/platform/public/queryPlanTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            openHistory () {
                this.$router.push({
                    name: 'planEditHistory_index'
                });
            },
            handelClickPage (num) {
                //翻页功能
                this.pageNum = num;
                //翻页数据查询
                this.queryPlan()   // 调用获取方法
            },
            clearPlan() {
                this.planName = ''
                this.planType = ''
                this.$refs['pages'].currentPage = 1;
                this.pageNum = 1
                this.queryPlan()
            },
            queryPlan () {
                //预案元素库查询
                let info = {
                    userCode: this.userCode,
                    name: this.planName,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    type: this.planType
                }
                const url = this.url + '/plan/content/queryPlanBy4Edit'
                axios({
                    method: 'post',
                    url: url,
                    data: info
                }).then(
                    response => {
                        this.planData = []
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.total = parseInt(res.total)
                            res.list.forEach((v, i) => {
                                this.planData.push({
                                    id: v.id,
                                    editorOrg: v.chiefEditOrgName,
                                    planName: v.name,
                                    planType: v.planTypeName,
                                    incidentType: v.incidentTypeName,
                                    incidentLevel: v.incidentLevelName,
                                    state: v.state
                                })
                            })
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
        }
    }
</script>

<style scoped>

</style>

