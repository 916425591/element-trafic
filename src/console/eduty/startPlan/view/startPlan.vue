<template>
    <!-- 预案启动查询 -->
    <div>
        <div class="ds-widget-box" :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <div class="ds-search-box">
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="6">
                            <form-item label="启动日期： ">
                                <DatePicker v-model="searchInfo.startTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="事件类型： ">
                                <Select v-model="searchInfo.typeId">
                                    <Option v-for="item in incidentType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="预案名称： ">
                                <i-input type="text" v-model="searchInfo.planName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="">
                                <Button type="primary" @click="clickQueryBtn">查询</Button>
                                <Button type="ghost" @click="clickCleanBtn">清空查询</Button>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
        </div>
        <div class="ds-widget-box" :style="height">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
                <div class="ds-fload-right">
                    <Button type="ghost" style="background: #fff;" @click="openModal">
                        详情
                    </Button>
                </div>
            </div>
            <div class="ds-table-box">
                <Table border highlight-row :columns="searchHead" :data="planData" @on-row-click="clickTableRow"></Table>
                <div class="ds-page-body">
                    <Page v-if="totalSize > pageSize" :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="detailModal" title="预案启动详情" :mask-closable="false" width="600" class-name="vertical-center-modal">
            <i-form :model="searchInfo" :label-width="100">
                <Row>
                    <i-col span="12">
                        <form-item label="预案名称： ">
                            <span>{{planDetail.name}}</span>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="启动时间： ">
                            <span>{{planDetail.startTime}}</span>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="响应等级： ">
                            <span>{{planDetail.levelName}}</span>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="通知内容： ">
                            <span>{{planDetail.content}}</span>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="事件描述： ">
                            <span>{{planDetail.description}}</span>
                        </form-item>
                    </i-col>
                </Row>
            </i-form>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>通知的成员单位</h2>
                </div>
                <div class="ds-table-box">
                    <Table border highlight-row :columns="memberHead" :data="orgData"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="closeModal">确定</Button>
                <Button size="large"  @click="closeModal">关闭</Button>
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
                detailModal: false,
                searchInfo: {
                    typeId:'null'
                },
                incidentType: [],
                searchHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '启动时间',
                        key: 'startTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '预案名称',
                        key: 'planName',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '启动通知',
                        key: 'notice',
                        align: 'center'
                    },
                    {
                        title: '事件类型',
                        key: 'typeName',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '事件等级',
                        key: 'levelName',
                        width: 120,
                        align: 'center'
                    }
                ],
                searchData: [
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    },
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    },
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    },
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    },
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    },
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    },
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    },
                    {
                        time: '2018-01-20 08:30:25',
                        name: '金海市群体性应急预案',
                        notice: '各成员单位，我市紧急启动三级应急群体性预案，请单位立即采取相应…',
                        type: '群体性事件',
                        level: '三级'
                    }
                ],
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
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '单位职责',
                        key: 'duty',
                        align: 'center'
                    }
                ],
                memberData: [
                    {
                        name: '金海市公安局',
                        duty: '负责现场安全保障'
                    },
                    {
                        name: '金海市公安局',
                        duty: '负责现场安全保障'
                    },
                    {
                        name: '金海市公安局',
                        duty: '负责现场安全保障'
                    }
                ],
                planData:[],
                totalSize: null,
                pageNum: 1,
                planInfo:{},
                planDetail:{},
                orgData:[],
                height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                }
            }
        },
        computed: {
            pageSize() {
                const res = this.$store.state.heightTable.tableInfo.numberBranches
                const numberBranches = parseInt(res)
                return numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                const res = this.$store.state.heightTable.tableInfo.tableHeight
                this.height.height = parseInt(res) + 10 + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(154);

            this.queryPlanStart4Statistic();
            this.queryIncidentTypeList();
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getStartPlanDetail(){
                let info = {
                    userCode: Cookies.get('userCode'),
                    planInstanceId:this.planInfo.id
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/scd/planInstance/getStartPlanDetail',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.planDetail=response.data.data;
                            this.orgData=response.data.data.orgs?response.data.data.orgs:[];
                        }
                    }
                ).catch(

                )
            },
            queryIncidentTypeList(){
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/platform/incidentType/queryAllIncidentTypeTree',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let total = response.data.data.total;
                            this.totalSize = response.data.data.total;
                            console.log(total)
                            if ( total > this.pageSize ) {
                                this.pageShow = true;
                            } else {
                                this.pageShow = false;
                            }
                            this.incidentType = response.data.data;
                            this.incidentType.unshift({id:'null',name:'---请选择---'})
                        }
                    }
                ).catch(

                )
            },
            clickQueryBtn(){
                this.planInfo={};
                this.pageNum=1;
                this.queryPlanStart4Statistic();
            },
            clickCleanBtn(){
                this.planInfo={};
                this.searchInfo={typeId:'null'};
                this.pageNum=1;
                this.queryPlanStart4Statistic();
            },
            queryPlanStart4Statistic(){
                //列表查询
                let info = this.searchInfo;
                info.userCode=Cookies.get('userCode');
                info.pageNum=this.pageNum;
                info.pageSize=this.pageSize;
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/eduty/disposalPlan/queryPlanStart4Statistic',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.totalSize = response.data.data.total;
                            this.planData = response.data.data.list;
                        }
                    }
                ).catch(

                )
            },
            clickTableRow(data){
                this.planInfo=data;
            },
            clickPage (num){//点击分页
                this.pageNum=num;
                this.queryPlanStart4Statistic();
            },
            openModal () {
                if(this.planInfo.id){
                    this.getStartPlanDetail();
                    this.detailModal = true;
                }else{
                    this.$Message.error('请选择某一请示.');
                }
            },
            closeModal(){
                this.detailModal=false;
            }
        }
    }
</script>

<style scoped>

</style>


