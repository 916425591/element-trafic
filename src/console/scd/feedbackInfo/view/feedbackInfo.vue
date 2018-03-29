<template>
    <!-- 反馈信息查询 -->
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
                            <form-item label="反馈类型： ">
                                <Select v-model="searchInfo.type">
                                    <Option v-for="item in feedbackType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="反馈单位： ">
                                <i-input type="text" v-model="searchInfo.operateOrgName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="反馈人员： ">
                                <i-input type="text" v-model="searchInfo.feedbacker"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="反馈内容： ">
                                <i-input type="text" v-model="searchInfo.content"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="6">
                            <form-item label="反馈时间： ">
                                <DatePicker type="date" v-model="searchInfo.feedbackEndTime" style="width: 100%;" @on-change="changeStartTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker type="date" v-model="searchInfo.feedbackStartTime" style="width: 100%;" @on-change="changeEndTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="12" class="ds-manage-btnBox">
                            <Button type="primary" size="large" @click="queryFeedbackList">查询</Button>
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
        <!-- 出动信息 -->
        <see-out-info v-if="outInfoModal" @close-modal="closeOutInfoModal" ref="seeOutInfo"></see-out-info>
        <!-- 反馈信息 -->
        <see-feedback v-if="feedbackModal" @close-modal="closefeedbackInfoModal" ref="seeFeedback"></see-feedback>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import seeOutInfo from '@/console/scd/modal/seeOutInfoModal'
    import seeFeedback from '@/console/scd/modal/seeFeedbackInfoModal'
    import Cookies from 'js-cookie';

    export default {
        components: {
            seeOutInfo,
            seeFeedback
        },
        data () {
            return {
                height: {
                    height: ''
                },
                pageShow: false,
                pageTotal: null,
                pageNum: 1,
                outInfoModal: false,
                feedbackModal: false,
                startTime: '',
                endTime: '',
                tableSelectNode: {},
                searchInfo: {
                    type: null,
                    operateOrgName: '',
                    feedbacker: '',
                    content: '',
                    feedbackStartTime: '',
                    feedbackEndTime: ''
                },
                feedbackType: [
                    {
                        value: 10,
                        label: '出动信息'
                    },
                    {
                        value: 20,
                        label: '办结反馈'
                    }
                ],
                listHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '反馈时间',
                        key: 'feedbackTime',
                        align: 'center'
                    },
                    {
                        title: '反馈类型',
                        key: 'typeName',
                        width: 120,
                        align: 'center'
                    }
                    ,
                    {
                        title: '反馈单位',
                        key: 'operateOrgName',
                        align: 'center'
                    },
                    {
                        title: '反馈人',
                        width: 120,
                        key: 'feedbacker',
                        align: 'center'
                    },
                    {
                        title: '反馈内容',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '突发事件',
                        key: 'incidentName',
                        align: 'center'
                    }
                ],
                listData: [],
                outInfo: {},
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
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unit',
                        width: 100,
                        align: 'center'
                    }
                ],
                outInfoData: [],
                feedbackInfo: {}
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
            this.tableHeightMessage(190); /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            //查询反馈列表
            this.queryFeedbackList();
        },
        methods: {
            ...mapActions([
                'setHeightContent',
                'tableHeightMessage'
            ]),
            changeStartTime (time) {
                this.searchInfo.feedbackStartTime = time;
            },
            changeEndTime (time) {
                this.searchInfo.feedbackEndTime = time + ' ' + '23:59:59';
            },
            queryFeedbackList () {
                //查询反馈列表
                const queryO = this.searchInfo;
                queryO.userCode = Cookies.get('userCode');
                queryO.pageSize = this.pageSize;
                queryO.pageNum = this.pageNum;
                console.log(queryO)
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/feedback/queryFeedbacks',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.tableSelectNode = {};
                            this.pageTotal = response.data.data.total;
                            this.listData = response.data.data.list || [];            
                        }
                    }
                ).catch(
                    
                );
            },
            clearSearch () {
                //清空查询
                this.searchInfo = {
                    type: null,
                    operateOrgName: '',
                    feedbacker: '',
                    content: '',
                    feedbackStartTime: '',
                    feedbackEndTime: ''
                };
                this.pageNum = 1;
                this.feedbackStartTime = '';
                this.feedbackEndTime = '';
                this.queryFeedbackList();
            },
            slectPage (index) {
                this.pageNum = index;
                this.queryFeedbackList();
            },
            tableSelect (node) {
                //table选择
                this.tableSelectNode = node;
            },
            seeDetail () {
                const id = this.tableSelectNode.id;
                if ( !id ) {
                    this.$Message.warning('请先选择列表数据')
                } else {
                    const type = this.tableSelectNode.type;
                    if ( type === 10 ) {
                        //出动信息查询
                        this.outInfoModal = true;
                        window.setTimeout(() => {
                            this.$refs.seeOutInfo.queryOutInfo(id);
                        }, 100);
                    }
                    if ( type === 20 ) {
                        //反馈信息查询
                        this.feedbackModal = true;
                        window.setTimeout(() => {
                            this.$refs.seeFeedback.queryOutInfo(id);
                        }, 100);
                    }
                }
            },
            closeOutInfoModal () {
                this.outInfoModal = false;
            },
            closefeedbackInfoModal () {
                this.feedbackModal = false;
            }
        }
    }
</script>

<style scoped>
    
</style>

