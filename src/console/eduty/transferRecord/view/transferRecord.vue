<template>
    <!-- 交接班记录查询 -->
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
                            <form-item label="交班日期： ">
                                <DatePicker type="date" style="width: 100%;"  :value="searchInfo.shiftTime" @on-change="setShiftTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="交班负责人： ">
                                <i-input type="text" v-model="searchInfo.fromerName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="接班负责人： ">
                                <i-input type="text" v-model="searchInfo.toerName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="">
                                <Button type="primary" size="large" @click="queryTransferRecord">查询</Button>
                                <Button type="ghost" size="large" @click="clearQuery()">清空查询</Button>
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
                <Table border highlight-row :columns="searchHead" :data="searchData" @on-row-click="selectTransferRecord"></Table>
                <div class="ds-page-body" v-if="total > searchInfo.pageSize">
                    <Page :total="total" :page-size="searchInfo.pageSize" @on-change="pagesChange" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="detailModal" title="预案启动详情" :mask-closable="false" width="800" class-name="vertical-center-modal">
            <i-form :model="searchInfo" :label-width="100">
                <Row>
                    <i-col span="12">
                        <form-item label="交班负责人： ">
                            <span>{{ transferRecordDetail.fromer }}</span>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="交班时间： ">
                            <span>{{ transferRecordDetail.shiftTime }}</span>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="接班负责人： ">
                            <span>{{ transferRecordDetail.toer }}</span>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="接班确认时间： ">
                            <span>{{ transferRecordDetail.confirmTime }}</span>
                        </form-item>
                    </i-col>
                    <i-col span="24">
                        <form-item label="交接注意事项： ">
                            <span>{{ transferRecordDetail.attention }}</span>
                        </form-item>
                    </i-col>
                </Row>
            </i-form>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>请示内容</h2>
                </div>
                <div class="ds-table-box">
                    <Table border highlight-row :columns="memberHead" :data="transferRecordDetail.items"></Table>
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
                total: 0,
                detailModal: false,
                searchInfo: {
                    shiftTime: '',  //交班日期
                    fromerName: '', //交班负责人
                    toerName: '',    //接班负责人
                    userCode: '',
                    pageNum: 1,
                    pageSize: 10
                },
                incidentType: [
                    {
                        value: 0,
                        label: '刑事案件'
                    }
                ],
                searchHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '交班日期',
                        key: 'shiftTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '值班单位',
                        key: 'orgName',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '交班负责人',
                        key: 'fromerName',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '值班负责人',
                        key: 'toerName',
                        align: 'center'
                    }
                ],
                searchData: [
                ],
                memberHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '登记',
                        key: 'createTime',
                        align: 'center'
                    },
                    {
                        title: '待办事项',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '紧急',
                        key: 'urgentTitle',
                        align: 'center'
                    },
                    {
                        title: '来源',
                        key: 'source',
                        align: 'center'
                    }
                ],
                transferRecordDetail: {
                    fromer: '',
                    toer: '',
                    confirmTime: '',
                    shiftTime: '',
                    attention: '',
                    items: []
                },
                selectedRowId: null,
                height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                }
            }
        },
        computed: {
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
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
            this.tableHeightMessage(144);

            this.queryTransferRecord();
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            pagesChange(num) {
                this.searchInfo.pageNum = num;
                this.queryTransferRecord()
            },
            setShiftTime(data){
                this.searchInfo.shiftTime = data;
            },
            clearQuery(){
                this.searchInfo.shiftTime = '';
                this.searchInfo.fromerName = '';
                this.searchInfo.toerName = '';
                this.queryTransferRecord();
            },
            queryTransferRecord(){
                this.searchInfo.userCode = this.userCode;
                axios({
                    method: 'POST',
                    url: this.url + '/eduty/backlog/queryHandoverRecord4Statistic',
                    data: this.searchInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const res = response.data.data;
                            this.searchData = res.list;
                            this.total = parseInt(res.total);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error);
                    }
                );
            },
            openModal () {
                const handoverRecordInfo = {
                    userCode: this.userCode,
                    id: this.selectedRowId
                }
                axios({
                    method: 'GET',
                    url: this.url + '/eduty/backlog/getBacklogRecord',
                    params: handoverRecordInfo
                }).then(
                    response => {
                        console.log(response.data)
                        if ( response.data.code === 200 ) {
                            this.transferRecordDetail = response.data.data;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error);
                    }
                );
                this.detailModal = true;
            },
            selectTransferRecord(data){
                this.selectedRowId = data.id;
            },
            closeModal(){
                this.detailModal = false;
            }
        }
    }
</script>

<style scoped>

</style>


