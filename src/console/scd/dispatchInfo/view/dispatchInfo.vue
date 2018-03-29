<template>
    <!-- 调度信息查询 -->
    <div>
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <div class="ds-search-box">
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="6">
                            <form-item label="执行者类型： ">
                                <Select v-model="searchInfo.executorType">
                                    <Option v-for="item in executorType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="执行者： ">
                                <i-input type="text" v-model="searchInfo.executor" @on-focus="openType"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="调度时间： ">
                                <DatePicker type="date" v-model="startTime" style="width: 100%;" @on-change="changeStartTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker type="date" v-model="endTime" style="width: 100%;" @on-change="changeEndTime"></DatePicker>
                            </form-item>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="12">
                            <form-item label="调度内容： ">
                                <i-input type="text" v-model="searchInfo.content" @on-focus="openType"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12" class="ds-manage-btnBox">
                            <Button type="primary" size="large" @click="queryDispatchList">查询</Button>
                            <Button type="ghost" size="large" @click="clearSearch">清空查询</Button>
                        </i-col>
                    </Row>
                </i-form>
            </div>
        </div>
        <div class="ds-widget-box" :data-height="tableHeight" :style="height">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
                <div class="ds-fload-right">
                    <Button type="info" @click="seeDetail">查看详情</Button>
                </div>
            </div>
            <div class="ds-table-box">
                <Table border ref="selection" highlight-row :columns="listHead" :data="listData" @on-row-click="tableSelect"></Table>
                <div class="ds-page-body" v-if="pageTotal > pageSize">
                    <Page :total="pageTotal" :page-size="pageSize" :current="pageNum" @on-change="slectPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <!-- 调度信息 -->
        <modal v-model="dispatchModal" title="调度信息" :mask-closable="false" width="600" @on-cancel="closeDispatchModal" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form :model="dispatchInfo" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="执行者类型： ">
                                <span>{{ dispatchInfo.executorTypeName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="执行者： ">
                                <span>{{ dispatchInfo.executor }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="当前状态： ">
                                <span>{{ dispatchInfo.statusName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="调度时间： ">
                                <span>{{ dispatchInfo.dispatchTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="调度内容： ">
                                <span>{{ dispatchInfo.content }}</span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box" v-if="dispatchData.length > 0">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>所需资源</h2>
                </div>
                <div class="ds-table-box">
                    <Table border ref="selection" highlight-row size="small" height="237" :columns="dispatchHead" :data="dispatchData"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button  size="large" @click="closeDispatchModal">关闭</Button>
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
            return {
                height: {
                    height: ''
                },
                dispatchModal: false,
                startTime: '',
                endTime: '',
                pageShow: false,
                pageNum: 1,
                pageTotal: 1,
                tableSelectNode: {},
                searchInfo: {
                    taskInstanceId: null,
                    executorType: null,
                    executor: '',
                    content: '',
                    dispatchStartTime: '',
                    dispatchEndTime: ''
                },
                listHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '调度时间',
                        key: 'dispatchTime',
                        align: 'center'
                    },
                    {
                        title: '执行者',
                        key: 'executor',
                        align: 'center'
                    },
                    {
                        title: '执行者类型',
                        key: 'executorTypeName',
                        align: 'center'
                    },
                    {
                        title: '调度内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '突发事件',
                        key: 'incidentName',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'statusName',
                        width: 80,
                        align: 'center'
                    }
                ],
                listData: [],
                taskType: [],
                executorType: [],
                dispatchInfo: {},
                dispatchHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源名称',
                        key: 'resTypeName',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'count',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        width: 120,
                        align: 'center'
                    }
                ],
                dispatchData: []
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            },
            //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
            pageSize() {
                return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height;
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.setHeightContent(h);
            this.tableHeightMessage(200); /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            //查询任务类型
            this.queryTaskType();
            //查询执行者类型
            this.queryExecutorType();
            //调度信息列表查询
            this.queryDispatchList();
        },
        methods: {
            ...mapActions([
                'setHeightContent',
                'tableHeightMessage'
            ]),
            queryTaskType () {
                //查询工作项类型
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    type: 'PLAN_TASK_TYPE'
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/platform/dictionary/getDictionaryByType',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const data = response.data.data;
                            const list = [];
                            for ( let i=0; i<data.length;i++ ) {
                                list.push({
                                    value: parseInt(data[i].key),
                                    label: data[i].value
                                })
                            }
                            this.taskType = list;
                        }
                    }
                ).catch(
                    
                );
            },
            queryExecutorType () {
                //查询执行者类型
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    type: 'PLAN_EXECUTOR_TYPE'
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/platform/dictionary/getDictionaryByType',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const data = response.data.data;
                            const list = [];
                            for ( let i=0; i<data.length;i++ ) {
                                list.push({
                                    value: parseInt(data[i].key),
                                    label: data[i].value
                                })
                            }
                            this.executorType = list;
                        }
                    }
                ).catch(
                    
                );
            },
            queryDispatchList () {
                //查询调度列表
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    content: this.searchInfo.content,
                    taskInstanceId: this.searchInfo.taskInstanceId,
                    executorType: this.searchInfo.executorType,
                    executor: this.searchInfo.executor,
                    dispatchStartTime: this.searchInfo.dispatchStartTime,
                    dispatchEndTime: this.searchInfo.dispatchEndTime
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/dispatch/queryDispatchRecords',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.tableSelectNode = {};
                            this.pageTotal = response.data.data.total;
                            this.listData = response.data.data.list;            
                        }
                    }
                ).catch(
                    
                );
            },
            changeStartTime (time) {
                this.searchInfo.dispatchStartTime = time;
            },
            changeEndTime (time) {
                this.searchInfo.dispatchEndTime = time + ' ' + '23:59:59';
            },
            clearSearch () {
                this.searchInfo = {
                    taskType: '',
                    executorType: '',
                    executor: '',
                    content: '',
                    startTime: '',
                    endTime: ''
                }
                this.startTime = '';
                this.endTime = '';
                this.pageNum = 1;
                this.queryDispatchList();
            },
            tableSelect (node) {
                //选择table列表
                this.tableSelectNode = node;
            },
            seeDetail () {
                //查询详情
                const id = this.tableSelectNode.id;
                if ( !id ) {
                    this.$Message.warning('请先选择列表数据')
                } else {
                    const queryO = {
                        userCode: Cookies.get('userCode'),
                        dispatchId: id
                    }
                    //查询调度信息
                    axios({
                        method: 'get',
                        url: this.getUrl+'/scd/dispatch/getDispatchRecordDetail',
                        params: queryO
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.dispatchInfo = response.data.data || {};
                                this.dispatchData = response.data.data.ress || [];
                            }
                        }
                    ).catch(
                        
                    );
                    this.dispatchModal = true;
                }
            },
            closeDispatchModal () {
                this.dispatchInfo = {};
                this.dispatchData = [];
                this.dispatchModal = false;
            },
            slectPage (index) {
                this.pageNum = index;
                this.queryDispatchList();
            },
            openType () {

            }
        }
    }
</script>

<style scoped>
    .ds-search-box {
        padding-top: 20px;
        margin-right: 20px;
    }
    .ds-manage-btnBox {
        padding-left: 20px;
    }
</style>

