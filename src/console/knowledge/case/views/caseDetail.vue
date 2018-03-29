<template>
    <div>
        <Modal v-model="modalStatus" :mask-closable="false" width="900" on-visible-change="clickCloseModel" class-name="vertical-center-modal">
            <p slot="header" style="color:#f60;text-align:center">
                <span>典型案例详情</span>
            </p>
            <div class="ds-planEditHistory">
                <Row>
                    <i-col span="5">
                        <div class="ds-widget-box">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>处置历史</h2>
                            </div>
                            <div class="ds-timeLine-box">
                                <Scroll :distance-to-edge="10" height="400" :on-reach-bottom="handleReachBottom">
                                    <Timeline>
                                        <TimelineItem v-for="(item,index) in timeData" :key="index">
                                            <p class="time">{{ item.feedbackTime }}</p>
                                            <p class="content ds-pointer" @click="showDetail(item)">{{ item.feedbackerName }}</p>
                                            <span>{{ item.operateTypeTitle }}</span>
                                        </TimelineItem>
                                    </Timeline>
                                </Scroll>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="19">
                    <div class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>调度信息</h2>
                        </div>
                        <div class="ds-history-body">
                            <table style="width:100%;">
                                <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        案例名称：
                                    </td>
                                    <td>
                                        {{ disposeDetail.caseName }}
                                    </td>
                                    <td class="ds-table-left">
                                        调度人：
                                    </td>
                                    <td>
                                        {{ disposeDetail.dispatcherName }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        调度时间：
                                    </td>
                                    <td>
                                        {{ disposeDetail.dispatchTime }}
                                    </td>
                                    <td class="ds-table-left">
                                        事发时间：
                                    </td>
                                    <td>
                                        {{ caseBaseInfo.occurTime }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        创建单位：
                                    </td>
                                    <td>
                                        {{ caseBaseInfo.createOrgName }}
                                    </td>
                                    <td class="ds-table-left">
                                        创建人：
                                    </td>
                                    <td>
                                        {{ caseBaseInfo.createrName }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        事件类型：
                                    </td>
                                    <td>
                                        {{ caseBaseInfo.incidentTypeName }}
                                    </td>
                                    <td class="ds-table-left">
                                        事件等级：
                                    </td>
                                    <td>
                                        {{ caseBaseInfo.incidentLevelName }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        调度内容：
                                    </td>
                                    <td>
                                        {{ disposeDetail.dispatchContent }}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="ds-widget-box ds-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>出动 / 反馈信息</h2>
                        </div>
                        <div class="ds-history-body">
                            <table style="width:100%;">
                                <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        反馈时间：
                                    </td>
                                    <td>
                                        {{ disposeDetail.feedbackTime }}
                                    </td>
                                    <td class="ds-table-left">
                                        反馈单位：
                                    </td>
                                    <td>
                                        {{ disposeDetail.feedbackOrgName }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        反馈人员：
                                    </td>
                                    <td>
                                        {{ disposeDetail.feedbackerName }}
                                    </td>
                                    <td class="ds-table-left">
                                        事发区域：
                                    </td>
                                    <td>
                                        {{ caseBaseInfo.regionName }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        反馈内容：
                                    </td>
                                    <td>
                                        {{ disposeDetail.feedbackContent }}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </i-col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="primary" @click="clickConfirmBtn">确定</Button>
                <Button type="ghost" @click="clickCancelBtn">取消</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        name: 'planEditHistory_index',
        data () {
            return {
                modalStatus:false,
                timeList: [
                    {
                        time: '2017'
                    },
                    {
                        time: '5月21日',
                        content: '创建预案'
                    },
                    {
                        time: '6月5日',
                        content: '预案审核'
                    },
                    {
                        time: '6月8日',
                        content: '预案发布'
                    },
                    {
                        time: '2018年'
                    },
                    {
                        time: '4月10日',
                        content: '预案一次修订'
                    }
                ],
                planInfo: {
                    planName: '东山重大滑坡处置预案',
                    protect: '东山重大滑坡处置预案',
                    protectType: '自然灾害——山体滑坡',
                    protectLevel: '特别重大',
                    range: '自然灾害——山体滑坡',
                    manageOrg: '金海市市政府',
                    keyWord: '金海市、东山、特别重大、重大、自然灾害、山体滑坡'
                },
                planCreate: {
                    time: '2017-5-21 11:03:21',
                    org: '金海市应急办业务科',
                    member: '张奎发'
                },
                planExamine: {
                    submitTime: '2017-5-21 11:03:21',
                    submitPerson: '张奎发',
                    starTime: '张奎发',
                    auditor: '朱雀心',
                    result: '同意发布',
                    opinion: 'xxx',
                    releaseTime: '2017-05-22 16:23:44',
                    releasePerson: '朱雀心',
                    releaseVersion: '金【字】2017005号',
                    effectTime: '2017-6-1'
                },
                planEditInfo: {
                    editTime: '2017-5-21 11:03:21',
                    editNUm: '第一次修订',
                    editPerson: '张奎发',
                    editReason: '',
                    editContent: '',
                    editSuccessTime: '2017-5-21 11:03:21'
                },
                timeData:[],
                pageNum: 1,
                pageSize: 10,
                disposeDetail:{},
                caseBaseInfo:{}
            }
        },
        created () {
            //查询时间轴
           // this.queryTime();
        },
        methods: {
            queryTime (type) {
                //查询时间轴
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    caseId: this.caseBaseInfo.id,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/knowledgeBank/caseDispatch/queryCaseDispatchListByPage',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const timeList = response.data.data.list;
                            if ( timeList.length < 1 ) {

                            } else {
                                if ( type === 'scroll' ) {
                                    const addList = this.timeListAssemble(timeList);
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
            timeListAssemble (timeList) {
                //时间轴数据组装
                let firstDay = '';
                const newTimeList = [];
                for ( let i=0;i<timeList.length;i++ ) {
                    if ( i === 0 ) {
                        firstDay = timeList[i].feedbackTime.slice(0,10);
                        newTimeList.unshift({
                            state: true,
                            feedbackTime: timeList[i].feedbackTime.slice(0,10),
                            operateTypeTitle: '开始'
                        });
                        timeList[i].feedbackTime = timeList[i].feedbackTime.slice(11);
                        newTimeList.push(timeList[i]);
                    } else {
                        let day = timeList[i].feedbackTime.slice(0,10);
                        if ( day > firstDay) {
                            newTimeList.push({
                                state: true,
                                feedbackTime: day,
                                operateTypeTitle: '继续'
                            })
                        }
                        timeList[i].feedbackTime = timeList[i].feedbackTime.slice(11);
                        newTimeList.push(timeList[i]);
                    }
                }
                return newTimeList;
            },
            showDetail(data){
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    id:data.id
                }
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/knowledgeBank/caseDispatch/getCaseDispatchById ',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.disposeDetail = response.data.data;
                        }
                    }
                ).catch(

                );
            },
            clickCancelBtn(){
                this.modalStatus=false;
            },
            clickConfirmBtn(){
                this.modalStatus=false;
            },
            handleReachBottom () {
                //滚动加载
                this.pageNum = this.pageNum+1;
                this.queryTime('scroll');
            },
        }
        /*mounted(){

        },*/
    }
</script>

<style scoped>
    .ds-timeLine-box {
        padding: 10px 30px;
    }
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        padding-left: 5px;
    }
    .ds-history-body table td {
        padding: 5px 0 5px 20px;
    }
    .ds-table-left {
        width: 110px;
    }
    .ds-history-body{
        height: 191px;
    }
</style>
