<template>
    <div>
        <div class="ds-widget-box ds-box" :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>处置进度信息</h2>
            </div>
            <Row>
                <i-col span="5" class="ds-border-right">
                    <!-- 544 -->
                    <Scroll :distance-to-edge="10" :height="scollHeight" :on-reach-bottom="handleReachBottom">
                        <div class="ds-time-box">
                            <Timeline>
                                <TimelineItem v-for="(item, index) in timeData" :key="item.id">
                                    <Icon v-if="item.state" type="ios-clock" slot="dot" style="font-size:48px;"></Icon>
                                    <span v-else class="ds-time-title" slot="dot">{{ item.simpleTitle }}</span>
                                    <span class="ds-pointer" @click="seeProcess(item, index)">{{ item.operateTypeTitle }}</span>
                                    <span class="ds-time">{{ item.operateTime }}</span>
                                </TimelineItem>
                            </Timeline>
                        </div>
                    </Scroll>
                </i-col>
                <i-col span="19" class="ds-process-box" :style="height">
                    <div class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>操作信息</h2>
                        </div>
                        <i-form :model="actionInfo" :label-width="100">
                            <Row>
                                <i-col span="12">
                                    <form-item label="操作人： ">
                                        <span>{{ actionInfo.operater }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="操作时间： ">
                                        <span>{{ actionInfo.time }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="操作类型： ">
                                        <span>{{ actionInfo.operateTypeTitle }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                    </div>
                    <div v-if="showState === 100" class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>事件登记信息</h2>
                        </div>
                        <i-form :model="incidentInfo" :label-width="100">
                            <Row>
                                <i-col span="24">
                                    <form-item label="事发时间： ">
                                        <span>{{ incidentInfo.occurTime }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="事发区域： ">
                                        <span>{{ incidentInfo.regionName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="事发地址： ">
                                        <span>{{ incidentInfo.address }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="事件类型： ">
                                        <span>{{ incidentInfo.typeName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="事件等级： ">
                                        <span>{{ incidentInfo.levelName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事件描述： ">
                                        <span>{{ incidentInfo.description }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                    </div>
                    <div v-if="showState === 110" class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>启动预案详情</h2>
                        </div>
                        <i-form ref="planDetail" :model="planDetail" :label-width="100">
                            <Row>
                                <i-col span="12">
                                    <form-item label="预案名称： ">
                                        <span>{{ planDetail.name }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="启动时间： ">
                                        <span>{{ planDetail.startTime }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="通知内容： ">
                                        <span>{{ planDetail.content }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                        <div v-if="showState === 110" class="ds-widget-box">
                            <div class="ds-widget-title">
                                <h2>成员单位列表</h2>
                            </div>
                            <div class="ds-table-box">
                                <Table border highlight-row :columns="memberHead" :data="memberData"></Table>
                            </div>
                        </div>
                    </div>
                    <div v-if="showState === 120" class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>下发通知详情</h2>
                        </div>
                        <i-form :model="noticeDetail" :label-width="100">
                            <Row>
                                <i-col span="24">
                                    <form-item label="通知时间： ">
                                        <span>{{ noticeDetail.time }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="通知标题： ">
                                        <span>{{ noticeDetail.title }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="通知内容： ">
                                        <span>{{ noticeDetail.content }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="通知单位： ">
                                        <span>{{ noticeDetail.org }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                    </div>
                    <div v-if="showState === 200" class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>指挥调度详情</h2>
                        </div>
                        <i-form :model="dispatchInfo" :label-width="100">
                            <Row>
                                <i-col span="24">
                                    <form-item label="执行者类型： ">
                                        <span>{{ dispatchInfo.executorTypeName}}</span>
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
                                    <form-item label="任务内容： ">
                                        <span>{{ dispatchInfo.content }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="注意事项： ">
                                        <span>{{ dispatchInfo.attention }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                        <div class="ds-resource-box">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>所需资源</h2>
                            </div>
                            <div class="ds-table-box">
                                <Table border ref="selection" highlight-row size="small" height="237" :columns="dispatchHead" :data="dispatchData"></Table>
                            </div>
                        </div>
                    </div>
                    <div v-if="showState === 220" class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>出动信息详情</h2>
                        </div>
                        <i-form :model="outInfoDetail" :label-width="100">
                            <Row>
                                <i-col span="24">
                                    <form-item label="执行单位： ">
                                        <span>{{ outInfoDetail.operateOrgName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="执行人员： ">
                                        <span>{{ outInfoDetail.operater }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="出动时间： ">
                                        <span>{{ outInfoDetail.feedbackTime }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="简要内容： ">
                                        <span>{{ outInfoDetail.content }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>携带资源</h2>
                        </div>
                        <div class="ds-table-box">
                            <Table border ref="selection" highlight-row :columns="outInfoHead" :data="outInfoData"></Table>
                        </div>
                    </div>
                    <div v-if="showState === 230" class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>反馈详情</h2>
                        </div>
                        <i-form :model="feedbackInfo" :label-width="100">
                            <Row>
                                <i-col span="24">
                                    <form-item label="反馈单位： ">
                                        <span>{{ feedbackInfo.feedbackOrgName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="反馈人员： ">
                                        <span>{{ feedbackInfo.feedbacker }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="反馈时间： ">
                                        <span>{{ feedbackInfo.feedbackTime }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="反馈内容： ">
                                        <span>{{ feedbackInfo.content }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                    </div>
                </i-col>
            </Row>
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
                showState: 1,
                urlData: {},
                pageNum: 1,
                timeList: [],
                timeData: [],
                actionInfo: {},
                planDetail: {
                    planName: '预案1',
                    startTime: '2018-1-9',
                    content: ''
                },
                memberHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '单位名称',
                        key: 'orgName',
                        align: 'center'
                    },
                    {
                        title: '单位职责',
                        key: 'duty',
                        align: 'center'
                    }
                ],
                memberData: [//成员单位列表
                    {
                        name: '金海市公安局',
                        duty: '维持现场秩序'
                    },
                    {
                        name: '金海市公安局',
                        duty: '维持现场秩序'
                    },
                    {
                        name: '金海市公安局',
                        duty: '维持现场秩序'
                    }
                ],
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
                dispatchData: [],
                noticeDetail: {
                    //下发通知详情
                    time: '2018-01-10',
                    title: '通知',
                    content: '这是通知内容',
                    org: '上海市公安局'
                },
                commontDetail: {
                    //指令详情
                    time: '',
                    org: '',
                    content: ''
                },
                outInfoDetail: {},
                outInfoHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源名称',
                        key: 'resName',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'count',
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unit',
                        align: 'center'
                    }
                ],
                outInfoData: [],
                feedbackInfo: {},
                height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                },
                scollHeight: ''
            }
        },
        computed:{
            incidentInfo () {
                return this.$store.state.scd.detail;
            },
            getUrl () {
                return this.$store.state.userCode.url;
            },
            pageSize() {
                const res = this.$store.state.heightTable.tableInfo.numberBranches;
                const numberBranches = parseInt(res- 1);
                return numberBranches; /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                const res = this.$store.state.heightTable.tableInfo.tableHeight;
                this.scollHeight = parseInt(res) - 94;
                this.height.height = parseInt(res) - 94 + 'px';
                return this.height.height;
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(35)
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryTime (type) {
                //查询时间轴
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    incidentId: this.urlData.incidentId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    orgId: this.urlData.orgId
                }
                if ( this.urlData.eduty ) {
                    queryO.sourceType = 'eduty';
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/operate/queryOperateRecords4Incident',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const timeList = response.data.data.list;
                            if ( timeList.length < 1 ) {
                                this.$Message.warning('暂无更多数据')
                            } else {
                                if ( type === 'scroll' ) {
                                    const addList = this.timeListAssemble(timeList, type);
                                    for ( let i=0;i<addList.length;i++ ) {
                                        this.timeData.push(addList[i])
                                    }
                                } else {
                                    this.timeData = this.timeListAssemble(timeList);
                                }
                            }
                        }
                    }
                ).catch(
                    
                );
            },
            timeListAssemble (timeList, type) {
                //时间轴数据组装
                let firstDay = '';
                const newTimeList = [];
                for ( let i=0;i<timeList.length;i++ ) {
                    timeList[i].time = timeList[i].operateTime;
                    if ( i === 0 && type !== 'scroll') {
                        firstDay = timeList[i].operateTime.slice(0,10);
                        newTimeList.unshift({
                            state: true,
                            operateTime: timeList[i].operateTime.slice(0,10),
                            operateTypeTitle: '开始',
                        });
                        timeList[i].operateTime = timeList[i].operateTime.slice(11);
                        newTimeList.push(timeList[i]);
                    } else {
                        let day = timeList[i].operateTime.slice(0,10);
                        if ( day > firstDay) {
                            newTimeList.push({
                                state: true,
                                operateTime: day,
                                operateTypeTitle: '继续'
                            })
                        }
                        timeList[i].operateTime = timeList[i].operateTime.slice(11);
                        newTimeList.push(timeList[i]);
                    }
                }
                return newTimeList;
            },
            seeProcess (data, index) {
                if (!data.state) {
                    this.actionInfo = data;
                    this.showState = data.operateType;
                    if (data.operateType === 110) {
                        this.queryStartDetail(data.operateObjId);
                    }
                    if (data.operateType === 200) {
                        this.queryDispatchDetail(data.operateObjId);
                    }
                    if (data.operateType === 210) {
                        this.showState = 200;
                        this.queryDispatchDetail(data.operateObjId);
                    }
                    if (data.operateType === 220) {
                        this.queryOutInfo(data.operateObjId);
                    }
                    if (data.operateType === 230) {
                        this.queryFeedbackInfo(data.operateObjId);
                    }
                }
            },
            queryStartDetail (operateObjId) {
                //查询启动详情
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    planInstanceId: operateObjId,
                    orgId: this.urlData.orgId
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/planInstance/getStartPlanDetail ',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.planDetail = response.data.data || {};
                            this.memberData = response.data.data.orgs || [];
                        }
                    }
                ).catch(
                    
                );
            },
            queryDispatchDetail (id) {
                //查询指挥调度详情
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    dispatchId: id,
                    orgId: this.urlData.orgId
                }
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
            },
            queryOutInfo (id) {
                //查询出动信息
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    feedbackId: id,
                    orgId: this.urlData.orgId
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/feedback//getFeedbackDetail',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.outInfoDetail = response.data.data || {};
                            this.outInfoData = response.data.data.ress || [];
                        }
                    }
                ).catch(
                    
                );
            },
            queryFeedbackInfo (id) {
                //查询反馈信息
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    feedbackId: id,
                    orgId: this.urlData.orgId
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/feedback/getFeedbackDetail',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.feedbackInfo = response.data.data;
                        }
                    }
                ).catch(
                    
                );
            },
            handleReachBottom () {
                //滚动加载
                this.pageNum = this.pageNum+1;
                this.queryTime('scroll');
            },
            getUrlData () {
                //获取url参数
                const url = window.location.href;
                const data = url.split('?')[1];
                const arrList = data.split('&');
                const dataObj = {};
                for ( let i=0;i<arrList.length;i++ ) {
                    dataObj[arrList[i].split("=")[0]] = unescape(arrList[i].split("=")[1]);
                }
                this.urlData = dataObj;
            }
        },
        mounted(){
            //获取url参数
            this.getUrlData();
            //查询时间轴
            this.queryTime();
        }
    }
</script>

<style scoped>
    /* .ds-border-right {
        border-right: 1px solid #ccc;
    }
    .ds-time-box {
        padding: 20px 10px 20px 90px;
    }
    .ds-time-title {
        display: inline-block;
        width: 27px;
        height: 27px;
        padding: 5px;
        border: 2px solid #ccc;
        border-radius: 50%;
    }
    .ds-time {
        display: inline-block;
        width: 85px;
        position: absolute;left: -95px;
        text-align: right;
    } */
    
    .ds-process-box {
        overflow: auto;
    }
    .ivu-form-item {
        margin-bottom: 10px;
    }
    .ds-resource-box {
        border-top: 1px solid #ccc;
    }
</style>

