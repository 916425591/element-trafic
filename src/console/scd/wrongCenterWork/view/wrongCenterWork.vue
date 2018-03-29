<template>
    <div>
        <Row>
            <i-col span="5">
                <div class="ds-widget-box"   :data-height="tableHeight" :page-size="pageSize">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>新调度指令</h2>
                    </div>
                    <Scroll :distance-to-edge="10"  :height="scrollHeight" :on-reach-bottom="searchMoreNewCommand">
                        <Table border highlight-row :columns="dispatchHead" :data="dispatchData" @on-row-click="queryDispatchInfo" ref="dispatchTable"></Table>
                    </Scroll>
                </div>
                <div class="ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>突发事件列表</h2>
                    </div>
                    <Scroll :distance-to-edge="10"  :height="scrollHeight" :on-reach-bottom="handleReachBottom">
                        <Table border highlight-row :columns="incidentHead" :data="incidentData" @on-row-click="queryIncidentInfo" ref="incidentTable"></Table>
                    </Scroll>
                </div>
            </i-col>
            <i-col span="19">
                <dispatch-detail v-if="dispatchShow" @dispatch-setting="setStatus" ref="dispatchDetail"></dispatch-detail>
                <incident-info v-if="incidentShow" ref="incidentInfo"></incident-info>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import dispatchDetail from './dispatchDetail'
    import incidentInfo from '@/console/scd/centerWork/view/incidentInfo'
    import Cookies from 'js-cookie';

    export default {
        components: {
            incidentInfo,
            dispatchDetail,
            
        },
        data () {
            return {
                height: {
                    height: ''
                },
                dispatchShow: true,
                incidentShow: false,
                commandNum: 1,
                commandSize: null,
                pageNum: 1,
                closePlan: false,//关闭预案
                dispatchTableSelectNode: {},
                incidentTableSelectNode: {},
                dispatchHead: [
                    {
                        title: '调度内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'statusName',
                        width: 90,
                        align: 'center'
                    }
                ],
                dispatchData: [],
                incidentHead: [
                    {
                        title: '突发事件名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'states',
                        width: 80,
                        align: 'center'
                    }
                ],
                incidentData: [],
                scrollHeight: '',
                incidentHeight: ''
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            },
            pageSize() {
                const res = this.$store.state.heightTable.tableInfo.numberBranches
                this.commandSize = parseInt(res/2 + 1);
                return parseInt(res/2 + 1) /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfoIndex.tableHeight /*定义好的父框体高度*/
                this.height.height = height;
                this.scrollHeight = parseInt(height)/2;
                return this.height.height;
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.setHeightContent(h);
            this.tableHeightMessage(100); /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.tableHeightMessageIndex(100);
        },
        methods: {
            ...mapActions([
                'saveTableData',
                'saveData',
                'setHeightContent',
                'tableHeightMessage',
                'tableHeightMessageIndex'
            ]),
            queryNewCommond (type) {
                console.log(this.commandSize)
                //查询新调度指令
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.commandNum,
                    pageSize: this.commandSize
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/dispatch/queryDisPatchTasksNoCloseIncident',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const dataList = response.data.data.list || [];
                            if ( type === 'scroll') {
                                if (dataList.length < 1 ) {
                                    this.$Message.warning('没有更多了')
                                }
                                for ( let i=0;i<dataList.length;i++ ) {
                                    this.dispatchData.push(dataList[i]);
                                }
                            } else {
                                this.dispatchData = dataList;
                            }
                        }
                    }
                ).catch(
                    
                );
            },
            queryIncidentList (type) {
                //查询突发事件列表
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/incident/queryIncidents4NoClose',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const dataList = response.data.data.list;
                            console.log(dataList)
                            for ( let i=0;i<dataList.length;i++) {
                                if ( dataList[i].status === 10 ) {
                                    dataList[i].states = '未处置';
                                }
                                if ( dataList[i].status === 20 ) {
                                    dataList[i].states = '处置中';
                                }
                            }
                            if ( type === 'scroll') {
                                if (dataList.length < 1 ) {
                                    this.$Message.warning('没有更多了')
                                }
                                for ( let i=0;i<dataList.length;i++ ) {
                                    this.incidentData.push(dataList[i]);
                                }
                            } else {
                                this.incidentData = dataList;
                            }
                        }
                    }
                ).catch(
                    
                );
            },
            queryDispatchInfo (node, index) {
                this.dispatchShow = true;
                this.incidentShow = false;
                this.dispatchTableSelectNode = node;
                this.dispatchTableSelectNode.index = index;
                window.setTimeout(() => {
                    this.$refs.dispatchDetail.queryDetail(node);
                }, 100);
                this.$refs.incidentTable.clearCurrentRow();
            },
            queryIncidentInfo (node) {
                this.dispatchShow = false;
                this.incidentShow = true;
                this.incidentTableSelectNode = node;
                window.setTimeout(() => {
                    this.$refs.incidentInfo.queryIncident(node);
                }, 100);
                this.$refs.dispatchTable.clearCurrentRow();
            },
            searchMoreNewCommand() {
                //查询更多新调度指令
                this.commandNum = this.commandNum+1;
                this.queryNewCommond('scroll');
            },
            handleReachBottom () {
                //查询更多突发事件
                this.pageNum = this.pageNum+1;
                this.queryIncidentList('scroll');
            },
            setStatus (type, data) {
                const newData = this.dispatchTableSelectNode;
                const index = this.dispatchTableSelectNode.index;
                if ( type === 'receive' ) {
                    this.$Message.success('接收成功');
                    const index = this.dispatchTableSelectNode.index;
                    newData.status = data.newStatus;
                    newData.statusName = data.newStatusTitle;
                }
                if ( type === 'out' ) {
                    this.$Message.success('出动成功');
                    const index = this.dispatchTableSelectNode.index;
                    newData.status = 30;
                    newData.statusName = '已出动';
                }
                if ( type === 'feedback' ) {
                    this.$Message.success('反馈成功');
                    newData.status = 40;
                    newData.statusName = '已反馈';
                }
                this.$set(this.dispatchData,index,newData);
                this.outOperateModal = false;
            }
        },
        mounted () {
            this.queryNewCommond();
            //查询突发事件列表
            this.queryIncidentList();
        }
    }
</script>

<style scoped>

</style>

