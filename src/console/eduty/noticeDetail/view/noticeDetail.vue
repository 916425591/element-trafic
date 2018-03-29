<template>
    <!-- 回执信息查询 -->
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
                            <form-item label="通知日期： ">
                                <DatePicker v-model="searchInfo.noticeStartTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker v-model="searchInfo.noticeEndTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="通知内容： ">
                                <i-input v-model="searchInfo.noticeContent" type="text"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="下发单位： ">
                                <i-input v-model="searchInfo.sendOrgName" type="text"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="回执日期： ">
                                <DatePicker v-model="searchInfo.feedbackStartTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker v-model="searchInfo.feedbackEndTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="回执内容： ">
                                <i-input v-model="searchInfo.feedbackContent" type="text"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="回执单位： ">
                                <i-input v-model="searchInfo.feedbackOrgName" type="text"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="" style="text-align: right;">
                                <Button type="primary" size="large" @click="clickQueryBtn">查询</Button>
                                <Button type="ghost" size="large" @click="clickCleanBtn">清空查询</Button>
                            </form-item>
                            
                        </i-col>
                    </Row>
                </i-form>
            </div>
        </div>
        <div class="ds-widget-box" :style='height'>
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
                <Table border highlight-row :columns="searchHead" :data="noticeData" @on-row-click="clickRow"></Table>
                <div class="ds-page-body">
                    <Page v-if="totalSize > pageSize" :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="detailModal" title="通知回执详情" :mask-closable="false" width="600" class-name="vertical-center-modal">
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>通知内容</h2>
                </div>
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="通知标题： ">
                                <span>启动金海市最高级别群体性事件应急预案</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="下发单位： ">
                                <span>金海市人民政府</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="通知时间： ">
                                <span>2018-01-20 12:35:20</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="通知内容： ">
                                <span></span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>回执内容</h2>
                </div>
                <i-form :model="noticeInfo" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="回执人员： ">
                                <span>{{noticeInfo.feedbacker}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="回执时间： ">
                                <span>{{noticeInfo.feedbackTime}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="回执内容： ">
                                <span>{{noticeInfo.feedbackContente}}</span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary"  @click="closeModel">确定</Button>
                <Button  @click="closeModel">关 闭</Button>
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

                },
                searchHead: [
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
                        title: '回执时间',
                        key: 'feedbackTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '回执内容',
                        key: 'feedbackContnt',
                        align: 'center'
                    },
                    {
                        title: '回执人',
                        key: 'feedbackerName',
                        width: 200,
                        align: 'center'
                    }
                ],
                noticeData: [],
                totalSize: null,
                pageNum: 1,
                noticeInfo:{},
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
                this.height.height = parseInt(res) + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(254);

            this.queryNotice4Statistic();
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            closeModel(){
                this.detailModal=false;
            },
            clickQueryBtn(){
                this.noticeInfo={};
                this.pageNum=1;
                this.queryNotice4Statistic();
            },
            clickCleanBtn(){
                this.noticeInfo={};
                this.searchInfo={};
                this.pageNum=1;
                this.queryNotice4Statistic();
            },
            clickPage (num){//点击分页
                this.pageNum=num;
                this.queryNotice4Statistic();
            },
            openModal () {
                if(this.noticeInfo.id){
                    this.getNoticeDetail();
                    this.detailModal = true;
                }else{
                    this.$Message.error('请选择某一请示.');
                }
            },
            getNoticeDetail(){
                let info = {
                    userCode: Cookies.get('userCode'),
                    id:this.noticeInfo.id
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/eduty/notice/getNoticeOrgDetail',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.noticeInfo = response.data.data;
                        }
                    }
                ).catch(

                )
            },
            clickRow(data){
                this.noticeInfo = data;
                console.log(data)
            },
            queryNotice4Statistic(){
                //列表查询
                let info = this.searchInfo;
                info.userCode=Cookies.get('userCode');
                info.pageNum=this.pageNum;
                info.pageSize=this.pageSize;
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/eduty/notice/queryNotice4Statistic',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.totalSize = response.data.data.total;
                            this.noticeData = response.data.data.list;
                        }
                    }
                ).catch(

                )
            },
        }
    }
</script>

<style scoped>

</style>


