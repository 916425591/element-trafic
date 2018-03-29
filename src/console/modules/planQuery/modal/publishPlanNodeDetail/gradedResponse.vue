<template>
    <!-- 分级响应 -->
    <div>
        <div class="ds-widget-box" style="margin-left:5px;">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>分级响应</h2>
            </div>
            <collapse v-model="value2" accordion>
                <panel name="1">
                    一级响应
                    <div slot="content" class="response-card">
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>响应指标
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>处置措施
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12">
                            <textarea v-model="textarea1" name="" id="" style="height:280px;width:100%" readonly></textarea>
                        </i-col>
                        <i-col span="12">
                            <Table border height="280" ref="currentRowTable" :columns="columns" :data="tableData"></Table>
                        </i-col>
                    </div>
                </panel>
                <panel name="2">
                    二级响应
                    <div slot="content" class="response-card">
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>响应指标
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>处置措施
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12">
                            <textarea v-model="textarea2" name="" id="" style="height:280px;width:100%" readonly></textarea>
                        </i-col>
                        <i-col span="12">
                            <Table border height="280" ref="currentRowTable" :columns="columns" :data="tableData1"></Table>
                        </i-col>
                    </div>
                </panel>
                <panel name="3">
                    三级响应
                    <div slot="content" class="response-card">
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>响应指标
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>处置措施
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12">
                            <textarea  v-model="textarea3"  name="" id="" style="height:280px;width:100%" readonly></textarea>
                        </i-col>
                        <i-col span="12">
                            <Table border height="280" ref="currentRowTable" :columns="columns" :data="tableData2"></Table>
                        </i-col>
                    </div>
                </panel>
                <panel name="4">
                    四级响应
                    <div slot="content" class="response-card">
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>响应指标
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12" class="title-bg">
                            <span class="ds-title-icon"></span>处置措施
                            <span style="float:right;margin-right:10px;">
                        </span>
                        </i-col>
                        <i-col span="12">
                            <textarea v-model="textarea4" name="" id="" style="height:280px;width:100%" readonly></textarea>
                        </i-col>
                        <i-col span="12">
                            <Table border height="280" ref="currentRowTable" :columns="columns" :data="tableData3"></Table>
                        </i-col>
                    </div>
                </panel>
            </collapse>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                modalStatus: false,
                value2: '1',
                columns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '处置信息',
                        key: 'content',
                        align: 'center'
                    }
                ],
                tableData: [],
                tableData1: [],
                tableData2: [],
                tableData3: [],
                gradedResponseStatus: [true, true, true, true],
                formInline: {
                    disposalMeasures: ''
                },
                ruleInline: {
                    disposalMeasures: [
                        { required: true, message: '处置措施不能为空', trigger: 'blur' }
                    ]
                },
                level: '',
                textarea4: '',
                textarea3: '',
                textarea2: '',
                textarea1: '',
                idStatus: [],
                ids: ''
            }
        },
        computed: {
        },
        created() {
            this.getGradeResponse()
        },
        computed: {
            nodeId () {
                return this.$store.state.planContent.publishNodeId; // nodeId
            },
            planId () {
                return this.$store.state.planContent.publishPlanId; // planID
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            }
        },
        methods: {
            getGradeResponse() {
                const params = {
                    userCode: this.userCode,
                    planId: this.planId,
                    type: 1,
                    level: this.level
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/gradeResponse/queryFBGradeResponse',
                    data: params
                }).then(
                    response => {
                        this.tableData = []
                        this.tableData1 = []
                        this.tableData2 = []
                        this.tableData3 = []
                        if ( response.data.code === 200 ) {
                            if(response.data.data) {
                                const res = response.data.data
                                for(let i = 0; i<res.length; i++) {
                                    if(res[i].level === 1) {
                                        this.textarea1 = res[i].content
                                        this.idStatus[0] = res[i].id
                                        if(res[i].measures) {
                                            for(let m1 = 0; m1 < res[i].measures.length; m1++) {
                                                this.tableData.push({
                                                    id: res[i].measures[m1].id,
                                                    content: res[i].measures[m1].content
                                                })
                                            }
                                        } else {
                                            this.tableData = []
                                        }
                                    }
                                    if(res[i].level === 2) {
                                        this.textarea2 = res[i].content
                                        this.idStatus[1] = res[i].id
                                        if(res[i].measures) {
                                            for(let m2 = 0; m2 < res[i].measures.length; m2++) {
                                                this.tableData1.push({
                                                    id: res[i].measures[m2].id,
                                                    content: res[i].measures[m2].content
                                                })
                                            }
                                        } else {
                                            this.tableData1 = []
                                        }
                                    }
                                    if(res[i].level === 3) {
                                        this.textarea3 = res[i].content
                                        this.idStatus[2] = res[i].id
                                        if(res[i].measures) {
                                            for(let m3 = 0; m3 < res[i].measures.length; m3++) {
                                                this.tableData2.push({
                                                    id: res[i].measures[m3].id,
                                                    content: res[i].measures[m3].content
                                                })
                                            }
                                        } else {
                                            this.tableData2 = []
                                        }
                                    }
                                    if(res[i].level === 4) {
                                        this.textarea4 = res[i].content
                                        this.idStatus[3] = res[i].id
                                        if(res[i].measures) {
                                            for(let m4 = 0; m4 < res[i].measures.length; m4++) {
                                                this.tableData3.push({
                                                    id: res[i].measures[m4].id,
                                                    content: res[i].measures[m4].content
                                                })
                                            }
                                        } else {
                                            this.tableData3 = [];
                                        }
                                    }
                                }
                            } else {
                                this.textarea1 = ''
                                this.textarea2 = ''
                                this.textarea3 = ''
                                this.textarea4 = ''
                            }
                        }
                    }
                ).catch(

                );
            }
        }
    };
</script>
<style scoped>
    .ivu-collapse .ivu-collapse-item .ivu-collapse-header i,
    .ivu-collapse .ivu-collapse-item .ivu-collapse-item-active .ivu-collapse-header>i {
        float: right;
        right: 30px;
    }
    textarea:disabled {
        background: rgba(241, 237, 237, 0.4)!important;
    }
</style>

<style>
    .response-card {
        height: 280px;
        max-height: 280px;
    }
    .title-bg {
        background-color: #f7f7f7;
        border: 1px solid #ccc;
        line-height: 35px;
    }
    .ivu-collapse-content {
        padding: 0px!important;
    }
    .ivu-collapse-content>.ivu-collapse-content-box {
        padding: 0px;
    }
</style>
