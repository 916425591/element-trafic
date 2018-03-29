<template>
    <div>
        <Row>
            <i-col span="5">
                <div class="ds-widget-box" :style="height" :data-height="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>事件信息</h2>
                    </div>
                    <div class="ds-incident-box">
                        <i-form :model="incidentInfo" :label-width="100">
                            <Row>
                                <i-col span="24">
                                    <form-item label="处置预案： ">
                                        <span>{{ incidentInfo.name }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="启动时间： ">
                                        <span>{{ incidentInfo.startTime }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事发时间： ">
                                        <span>{{ incidentInfo.occurTime }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事发区域： ">
                                        <span>{{ incidentInfo.regionName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事件类型： ">
                                        <span>{{ incidentInfo.typeName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事件等级： ">
                                        <span>{{ incidentInfo.levelName }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事发地址： ">
                                        <span>{{ incidentInfo.address }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事件描述： ">
                                        <span>{{ incidentInfo.description }}</span>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="已采措施： ">
                                        <span>{{ incidentInfo.measures }}</span>
                                    </form-item>
                                </i-col>
                            </Row>
                        </i-form>
                    </div>
                </div>
            </i-col>
            <i-col span="19">
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>处置流程信息</h2>
                    </div>
                    <div class="ds-flow-content">
                        <div class="box-content" style="">
                            <span class="ds-process-box" :class="className" @click="seeAllProcess">过程总览</span>
                            <span v-for="(item, index) in boxData" :key="index">
                                <div class="ds-process-box" :class="item.className" @click="seeProcess(index)">{{item.name}}</div>
                                <span class="ds-point" v-if="item.point">
                                    <Icon type="arrow-right-c"></Icon>
                                </span>
                            </span>
                            <span class="ds-process-box" :class="closePlanClass" @click="closePlan">结束处置</span>
                        </div>
                    </div>
                </div>
                <div>
                    <incident-process-info v-if="showProcess"></incident-process-info>
                    <incident-flow v-if="showFlow" ref="incidentFlow"></incident-flow>
                </div>
            </i-col>
        </Row>
        <end-plan v-if="endPlanModal" @close-modal="closeEndPlan" @save-modal="saveEndPlan"></end-plan>
    </div>
</template>

<script>
    import '../../../../common/assets/styles/template.css'
    import '../../../../common/assets/styles/common.css'
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import incidentProcessInfo from './incidentProcessInfo'
    import incidentFlow from './incidentFlow'
    import processArrow from '@/common/components/process-arrow/index'
    import endPlan from '@/console/scd/modal/closePlan'
    import Cookies from 'js-cookie';

export default {
        components: {
            incidentProcessInfo,
            incidentFlow,
            processArrow,
            endPlan
        },
        data () {
            return {
                endPlanModal: false,
                showProcess: true,
                showFlow: false,
                className: 'ds-active',
                closePlanClass: '',
                urlData: {},
                incidentInfo: {
                    name: '',
                    startTime: '',
                    occurTime: '',
                    regionName: '',
                    typeName: '',
                    levelName: '',
                    address: '',
                    description: '',
                    measures: ''
                },
                boxData: [],
                height: {
                    height: ''
                }
            }
        },
        computed:{
            incidentDetail () {
                return this.$store.state.scd.detail;
            },
            getUrl () {
                return this.$store.state.userCode.url;
            },
            planIdInfo() {
                return this.$store.state.userCode.planId //planID预案ID
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfo.tableHeight; /*定义好的父框体高度*/
                this.height.height = parseInt(height) + 80 + 'px';
                // return this.height.height;
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(35) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
        },
        methods: {
            ...mapActions([
                'saveIncidentDetail',
                'saveNodes',
                'getProcessArrow',//流程图方法
                'saveStartPlanDetail',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryIncident () {
                //事件信息查询
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    incidentId: this.urlData.incidentId,
                    orgId: this.urlData.orgId
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/planInstance/continueDispose',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.incidentInfo = response.data.data || {};
                            this.saveIncidentDetail(response.data.data);
                            this.saveStartPlanDetail(response.data.data);
                            const nodes = response.data.data.nodes;
                            for ( let i=0;i<nodes.length;i++) {
                                nodes[i].point = true;
                            }
                            this.boxData = nodes;
                        }
                    }
                ).catch(
                    
                );
            },
            queryEdutyIncident () {
                //应急职守查询
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    sourceId: this.urlData.incidentId,
                    sourceType: 'eduty'
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/planInstance/outIncidentContinueDispose',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.incidentInfo = response.data.data || {};
                            this.saveIncidentDetail(response.data.data);
                            this.saveStartPlanDetail(response.data.data);
                            const nodes = response.data.data.nodes || [];
                            for ( let i=0;i<nodes.length;i++) {
                                nodes[i].point = true;
                            }
                            this.boxData = nodes;
                        }
                    }
                ).catch(
                    
                )
            },
            seeAllProcess () {
                this.showProcess = true;
                this.showFlow = false;
                this.clearProcessBg();
                this.className = 'ds-active';
                this.closePlanClass = '';
            },
            closePlan () {
                this.closePlanClass = 'ds-active';
                this.clearProcessBg();
                this.className = '';
                if (this.urlData.show !== '1') {
                    this.endPlanModal = true;
                }
            },
            seeProcess (index) {
                this.className = '';
                this.closePlanClass = '';
                this.clearProcessBg();
                this.boxData[index].className = 'ds-active';
                this.showProcess = false;
                this.saveNodes(this.incidentInfo.nodes[index]);
                this.showFlow = true;
                window.setTimeout(() => {
                    this.$refs.incidentFlow.queryWorkItem();
                    this.$refs.incidentFlow.clearRecord();
                },100);
            },
            clearProcessBg () {
                const nodes = this.boxData;
                for ( let i=0;i<nodes.length;i++) {
                    this.$set(this.boxData[i], 'className' , '');
                }
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
            },
            closeEndPlan () {
                this.endPlanModal = false;
            },
            saveEndPlan () {
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    incidentId: this.incidentInfo.id
                };
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/incident/closeIncident',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('处置完毕');
                        } else {
                            this.$Message.warning(response.data.message);
                        }
                        this.closeEndPlan();
                    }
                ).catch(
                    
                );
            }
        },
        mounted(){
            //获取url参数
            this.getUrlData();
            if (this.urlData.eduty) {
                //应急职守查询
                this.queryEdutyIncident();
            } else {
                //查询事件信息
                this.queryIncident();
            }
            
        }
    }
</script>

<style>
</style>

<style scoped>
    .ds-process-box {
        border:1px solid #ccc;
        padding:10px 20px;
        margin: 10px 5px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
    }
    .ds-active {
        background: #2d90e6;
        color: #fff;
    }
    .ds-point {
        padding-right: 5px;
    }
    .ds-point .ivu-icon {
        vertical-align: middle;
        color: #ccc;
    }
    .ivu-form-item {
        margin-bottom: 10px;
    }
    .ds-incident-box {
        margin-right: 10px;
    }
    .box-content {
        height: 100px;
        overflow: auto;
        padding:20px 0;
    }
</style>

