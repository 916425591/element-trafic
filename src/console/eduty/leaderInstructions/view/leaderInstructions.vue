<template>
    <!-- 领导批示查询 -->
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
                            <form-item label="请示领导： ">
                                <i-input type="text" v-model="searchInfo.leaderName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="请示时间： ">
                                <DatePicker v-model="searchInfo.startTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker v-model="searchInfo.endTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="请示内容： ">
                                <i-input type="text" v-model="searchInfo.content"></i-input>
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
                <Table border highlight-row :columns="searchHead" :data="instructionData" @on-row-click="clickRow"></Table>
                <div class="ds-page-body">
                    <Page v-if="totalSize > pageSize" :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="detailModal" title="请示汇报详情" :mask-closable="false" width="600" class-name="vertical-center-modal">
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>请示内容</h2>
                </div>
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="12">
                            <form-item label="请示时间： ">
                                <span>{{instructionInfo.reportTime}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="请示领导： ">
                                <span>{{instructionInfo.leader?instructionInfo.leader.name:''}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="请示内容： ">
                                <span>{{instructionInfo.content}}</span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>批示内容</h2>
                </div>
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="12">
                            <form-item label="批示时间： ">
                                <span>{{instructionInfo.leader?instructionInfo.leader.feedbackTime:''}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="批示结果： ">
                                <span>{{instructionInfo.leader?instructionInfo.leader.feedbackContent:''}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="批示示内容： ">
                                <span>{{instructionInfo.leader?instructionInfo.leader.feedbackContent:''}}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="批示文件： ">
                                <a :href="'http://'+instructionInfo.fileHost+'/'+instructionInfo.fileKey" target="_blank">{{instructionInfo.fileName}}</a>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary"  @click="closeModal">确定</Button>
                <Button  @click="closeModal">关闭</Button>
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
                        title: '请示时间',
                        key: 'reportTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '请示领导',
                        key: 'leaderName',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '请示内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '批示时间',
                        key: 'feedbackTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '批示结果',
                        key: 'feedbackContent',
                        width: 120,
                        align: 'center'
                    }
                ],
                instructionData:[],
                instructionInfo:{},
                totalSize: null,
                pageNum: 1,
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
            this.tableHeightMessage(200);

            this.queryInstruction4Statistic();
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            clickQueryBtn(){
                this.instructionInfo={};
                this.pageNum=1;
                this.queryInstruction4Statistic();
            },
            clickCleanBtn(){
                this.instructionInfo={};
                this.searchInfo={};
                this.pageNum=1;
                this.queryInstruction4Statistic();
            },
            clickPage (num){//点击分页
                this.pageNum=num;
                this.queryInstruction4Statistic();
            },
            queryInstruction4Statistic(){
                //列表查询
                let info = this.searchInfo;
                info.userCode=Cookies.get('userCode');
                info.pageNum=this.pageNum;
                info.pageSize=this.pageSize;
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/eduty/instruction/queryInstruction4Statistic',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.totalSize = response.data.data.total;
                            this.instructionData = response.data.data.list;
                        }
                    }
                ).catch(

                )
            },
            closeModal(){
                this.detailModal = false;
            },
            openModal () {
                if(this.instructionInfo.id){
                    this.getInstructionDetail();
                    this.detailModal = true;
                }else{
                    this.$Message.error('请选择某一请示.');
                }
            },
            clickRow(data){
                this.instructionInfo = data;
                console.log(data)
            },
            getInstructionDetail(){
                let info = {
                    userCode: Cookies.get('userCode'),
                    id:this.instructionInfo.id
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/eduty/instruction/getInstructionById',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.instructionInfo = response.data.data;
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


