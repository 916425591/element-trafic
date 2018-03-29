<template>
    <!-- 值守信息查询 -->
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
                            <form-item label="事件类型： ">
                                <Select v-model="searchInfo.incidentTypeId">
                                    <Option v-for="item in incidentType" :value="item.id" :key="item.id">{{ item.name}}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="事件等级： ">
                                <Select v-model="searchInfo.incidentLevelId">
                                    <Option v-for="item in incidengLevel" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="信息来源： ">
                                <Select v-model="searchInfo.source">
                                    <Option v-for="item in resourceFrom" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="信息关键字： ">
                                <i-input type="text" v-model="searchInfo.discription"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="6">
                            <form-item label="登记日期： ">
                                <DatePicker v-model="searchInfo.startTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker type="date" style="width: 100%;" v-model="searchInfo.endTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="事发地址： ">
                                <i-input type="text" v-model="searchInfo.address"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6" class="ds-manage-btnBox">
                            <Button type="primary" size="large" @click="clickQueryBtn">查询</Button>
                            <Button type="ghost" size="large" @click="clearSearch">清空查询</Button>
                        </i-col>
                    </Row>
                </i-form>
            </div>
        </div>
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
                <div class="ds-fload-right">
                    <Button type="ghost" style="background: #fff;" @click="openModal">
                        详情
                    </Button>
                </div>
            </div>
            <div class="ds-table-box" :style='height'>
                <Table border highlight-row :columns="searchHead" :data="incidentData" @on-row-click="clickIncidentRow"></Table>
                <div class="ds-page-body">
                    <Page v-if="totalSize > pageSize" :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="detailModal" title="信息详情" :mask-closable="false" width="800" class-name="vertical-center-modal">
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>信息内容</h2>
                </div>
                <i-form :model="incidentInfo" :label-width="100">
                    <Row>
                        <i-col span="8">
                            <form-item label="登记时间： ">
                                <span>{{incidentInfo.reportTime}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事件类型： ">
                                <span>{{incidentInfo.levelName}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事件等级： ">
                                <span>{{incidentInfo.typeName}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="信息来源： ">
                                <span>{{incidentInfo.sourceTitle}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="16">
                            <form-item label="事发地址： ">
                                <span>{{incidentInfo.address}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="信息内容： ">
                                <span>{{incidentInfo.description}}</span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>处理记录</h2>
                </div>
                <div class="ds-table-box">
                    <Table border highlight-row :columns="detaiHead" :data="detailData"></Table>
                </div>
                <div class="ds-page-body">
                    <Page v-if="recordTotalSize > recordPageSize" :total="recordTotalSize" :current="recordPageNum" :page-size="recordPageSize" @on-change="clickRecordPage" show-total class="ds-page-right"></Page>
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
                    incidentTypeId: null,
                    incidentLevelId: null,
                    source: null
                },
                incidentType: [],
                incidengLevel: [],
                resourceFrom: [],
                searchHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'statusTitle',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '登记时间',
                        key: 'reportTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '信息描述',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'statusTitle',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '等级',
                        key: 'levelName',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '事发地址',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '来源',
                        key: 'sourceTitle',
                        width: 120,
                        align: 'center'
                    }
                ],
                incidentData: [],
                incidentInfo:{},
                detaiHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'typeTitle',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '处理时间',
                        key: 'disposalTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '经办人',
                        key: 'disposaler',
                        width: 120,
                        align: 'center'
                    }
                ],
                detailData: [],
                pageShow:false,
                totalSize: null,
                pageNum: 1,
                recordTotalSize: null,
                recordPageSize:4,
                recordPageNum:1,
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
                this.height.height = parseInt(res) - 20 + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(215)

            this.queryIncidentTypeList();
            this.queryIncidentLevelList();
            this.queryIncident4Statistic();
            this.querySourceList();
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            closeModal(){
                this.recordPageNum=1;
                this.detailModal=false;
            },
            getIncidentDetail(){
                let info = {
                    userCode: Cookies.get('userCode'),
                    id:this.incidentInfo.id
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/eduty/eIncident/getIncident',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.incidentInfo = response.data.data;
                        }
                    }
                ).catch(

                )
            },
            /**
             * 点击每行
             * @param data
             */
            clickIncidentRow(data){
                this.incidentInfo = data;
            },
            clickQueryBtn(){
                this.incidentInfo={};
                this.pageNum=1;
                this.queryIncident4Statistic();
            },
            clickPage (num){//点击分页
                this.pageNum=num;
                this.queryIncident4Statistic();
            },
            clearSearch(){
                this.incidentInfo={};
                this.searchInfo={
                    incidentTypeId: null,
                    incidentLevelId: null,
                    source: null
                };
                this.pageNum=1;
                this.queryIncident4Statistic();
            },
            /**
             * 打开弹窗
             */
            openModal () {
                if(this.incidentInfo.id){
                    this.getIncidentDetail();
                    this.queryDisposalRecord();
                    this.detailModal = true;
                }else{
                    this.$Message.error('请选择某一事件.');
                }

            },
            clickRecordPage(num){
                this.recordPageNum=num;
                this.queryDisposalRecord();
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
                            response.data.data.unshift({id: 'null', name:'---请选择---'})
                            this.incidentType = response.data.data;
                        }
                    }
                ).catch(

                )
            },
            querySourceList(){
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/eduty/eIncident/queryIncidentSources',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            response.data.data.unshift({id: 'null', name:'---请选择---'})
                            this.resourceFrom = response.data.data;
                        }
                    }
                ).catch(

                )
            },
            queryIncidentLevelList(){
                //列表查询
                let info = {
                    userCode: Cookies.get('userCode'),
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/platform/public/queryIncidentLevel',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            response.data.data.unshift({id: 'null' ,name:'---请选择---'})
                            this.incidengLevel = response.data.data;
                        }
                    }
                ).catch(

                )
            },
            queryIncident4Statistic(){
                //列表查询
                let info = this.searchInfo;
                info.userCode=Cookies.get('userCode');
                info.pageNum=this.pageNum;
                info.pageSize=this.pageSize;
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/eduty/eIncident/queryIncident4Statistic',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.totalSize = response.data.data.total;
                            this.incidentData = response.data.data.list;
                        }
                    }
                ).catch(

                )
            },
            queryDisposalRecord(){
                // 查询处置记录
                let info = {
                    userCode:Cookies.get('userCode'),
                    incidentId:this.incidentInfo.id,
                    pageNum:this.recordPageNum,
                    pageSize:this.recordPageSize
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/eduty/disposalRecord/queryDisposalRecord',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.recordTotalSize = response.data.data.total;
                            this.detailData = response.data.data.list;
                        }
                    }
                ).catch(

                )
            }
        }
    }
</script>

<style scoped>

</style>


