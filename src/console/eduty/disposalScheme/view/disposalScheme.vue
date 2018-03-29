<template>
    <!-- 处置方案查询 -->
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
                            <form-item label="方案名称： ">
                                <i-input type="text" v-model="searchInfo.title"></i-input>
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
                            <form-item label="生成日期： ">
                                <DatePicker v-model="searchInfo.startTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker v-model="searchInfo.endTime" type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="" style="text-align: right;">
                                <Button type="primary" @click="clickQueryBtn">查询</Button>
                                <Button type="ghost" @click="clickCleanBtn">清空查询</Button>
                            </form-item>
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
                <Table border highlight-row :columns="searchHead" :data="disposalData" @on-row-click="clickRow"></Table>
                <div class="ds-page-body"  v-if="totalSize > pageSize">
                    <Page :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="detailModal" title="处置方案详情" :mask-closable="false" width="800" class-name="vertical-center-modal">
            <!--<row>-->
                <!--<i-col span="24">-->
                    <!--<textarea class='tinymce-textarea' id="tinymceEditer"></textarea>-->
                <!--</i-col>-->
            <!--</row>-->
            <Card shadow>
                <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
            </Card>
            <Spin fix v-if="spinShow">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>加载中...</div>
            </Spin>
            <div slot="footer">
                <Button type="primary"  @click="saveDisposalPlan">确定</Button>
                <Button  @click="closeModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import tinymce from 'tinymce'
    import Cookies from 'js-cookie';
    
    export default {
        data () {
            return {
                spinShow: true,
                detailModal: false,
                searchInfo: {
                    typeId:'null',
                },
                disposalInfo:{},
                incidentType: [],
                searchHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '方案生成时间',
                        key: 'createTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '方案名称',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '所属预案',
                        key: 'publishPlanName',
                        align: 'center'
                    },
                    {
                        title: '事件类型',
                        key: 'typeName',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '事件等级',
                        key: 'levelName',
                        width: 120,
                        align: 'center'
                    }
                ],
                disposalData: [],
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
                this.height.height = parseInt(res) - 20 + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(215)

            this.queryIncidentTypeList();
            this.queryDisposalPlan4Statistic();

        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            init () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = 300;
                    tinymce.init({
                        selector: '#tinymceEditer',
                        branding: false,
                        elementpath: false,
                        height: height,
                        language: 'zh_CN.GB2312',
                        plugins: [
                            'advlist autolink lists link image charmap print preview imagetools',
                        ],
                        toolbar1: 'undo redo | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                        autosave_interval: '20s',
                        image_advtab: true,
                        images_upload_url: '',
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                                if (localStorage.editorContentPlan) {
                                    tinymce.get('tinymceEditer').setContent(localStorage.editorContentPlan);
                                }
                            });
                            editor.on('keydown', function (e) {
                                localStorage.editorContentPlan = tinymce.get('tinymceEditer').getContent();
                            });
                        }
                    });
                });
            },
            saveDisposalPlan(){
                localStorage.editorContentPlan = tinymce.get('tinymceEditer').getContent();
                this.updateDisposalPlan();
            },
            updateDisposalPlan(){
                let info = {
                    userCode:Cookies.get('userCode'),
                    id:this.disposalInfo.id,
                    content:localStorage.editorContentPlan
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/eduty/disposalPlan/saveDisposalPlan',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success("保存成功");
                            this.detailModal = false;
                        }else{
                            this.$Message.error("保存失败，请稍后再试");
                        }
                    }
                ).catch(

                )
            },
            closeModal(){
                this.detailModal = false;
            },
            clickPage(num){
                this.pageNum=num;
                this.queryDisposalPlan4Statistic();
            },
            clickQueryBtn(){
                this.pageNum=1;
                this.disposalInfo={};
                this.queryDisposalPlan4Statistic();
            },
            clickCleanBtn(){
                this.pageNum=1;
                this.disposalInfo={};
                this.searchInfo={typeId: null};
                this.queryDisposalPlan4Statistic();
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
            queryDisposalPlan4Statistic(){
                // 查询处置记录
                let info = {
                    userCode:Cookies.get('userCode'),
                    typeId:this.searchInfo.id,
                    startTime:this.searchInfo.startTime,
                    endTime:this.searchInfo.endTime,
                    pageNum:this.pageNum,
                    title:this.searchInfo.title,
                    pageSize:this.pageSize
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/eduty/disposalPlan/queryDisposalPlan4Statistic',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.totalSize = response.data.data.total;
                            this.disposalData = response.data.data.list;
                        }
                    }
                ).catch(

                )
            },
            openModal () {
                if(this.disposalInfo.id){
                    tinymce.get('tinymceEditer').setContent("");
                    this.getDisposalPlan();
                    this.detailModal = true;
                }else{
                    this.$Message.error('请选择某一处置方案.');
                }
            },
            /**
             * 点击每行
             * @param data
             */
            clickRow(data){
                this.disposalInfo = data;
                console.log(data)
            },
            getDisposalPlan(){
                let info = {
                    userCode:Cookies.get('userCode'),
                    id:this.disposalInfo.id
                };
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/eduty/disposalPlan/getDisposalPlan',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.disposalInfo=response.data.data;
                            localStorage.editorContentPlan=response.data.data.content;
                            tinymce.get('tinymceEditer').setContent(localStorage.editorContentPlan);
                        }
                    }
                ).catch(

                )
            }
        },
        mounted () {
            this.init();
        }
    }
</script>

<style scoped>

</style>


