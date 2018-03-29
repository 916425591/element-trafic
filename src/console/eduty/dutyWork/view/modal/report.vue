<template>
    <!-- 请示汇报 -->
    <div>
        <modal v-model="reportModal" title="请示汇报" :mask-closable="false" width="900" @on-cancel="closeReport" class-name="vertical-center-modal">
            <div>
                <Row>
                    <i-col span="8">
                        <div class="ds-widget-box">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>请示记录</h2>
                            </div>
                            <div class="ds-table-box">
                                <Scroll :distance-to-edge="10" height="382" :on-reach-bottom="searchMoreReport">
                                    <Table border highlight-row :columns="recordHead" :data="recordData" @on-row-click="selectReport"></Table>
                                </Scroll>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="16">
                        <div class="ds-widget-box ds-box">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>请示内容：</h2>
                            </div>
                            <i-form ref="reportInfo" :model="reportInfo" :rules="reportInfoCustom" :label-width="100">
                                <div class="ds-table-box">
                                    <Row>
                                        <i-col span="12">
                                            <form-item label="请示时间： " prop="reportTime">
                                                <DatePicker v-model="reportTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="changeReportTime" style="width: 100%;"></DatePicker>
                                            </form-item>
                                        </i-col>
                                        <i-col span="12">
                                            <form-item label="请示领导： " prop="leaderName">
                                                <i-input type="text" v-model="reportInfo.leaderName" @on-focus="openLeader"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="24">
                                            <form-item label="请示内容： " prop="content">
                                                <i-input type="textarea" v-model="reportInfo.content"></i-input>
                                            </form-item>
                                        </i-col>
                                    </Row>
                                </div>
                                <div class="ds-widget-title">
                                    <span class="ds-title-icon"></span>
                                    <h2>批示内容</h2>
                                </div>
                                <div class="ds-table-box">
                                    <Row>
                                        <i-col span="12">
                                            <form-item label="批示时间： " prop="feedbackTime">
                                                <DatePicker v-model="feedbackTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="changeFeedbackTime" style="width: 100%;"></DatePicker>
                                            </form-item>
                                        </i-col>
                                        <i-col span="12">
                                            <form-item label="批示结果： " prop="status">
                                                <Select v-model="reportInfo.status">
                                                    <Option v-for="item in resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                                </Select>
                                            </form-item>
                                        </i-col>
                                        <i-col span="24">
                                            <form-item label="批示内容： " prop="feedbackContent">
                                                <i-input type="textarea" v-model="reportInfo.feedbackContent"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="24">
                                            <form-item label="附件： ">
                                                <Row>
                                                    <i-col span="12">
                                                        <Upload
                                                            :before-upload="handleUpload"
                                                            :action="url" :data="fileData">
                                                            <Button type="ghost" icon="ios-cloud-upload-outline">选择所需要的文件</Button>
                                                        </Upload>
                                                    </i-col>
                                                    <i-col span="12">
                                                        <div v-if="showPath">
                                                            <a :href="'http://'+reportInfo.fileHost+'/'+reportInfo.fileKey" target="_blank">{{reportInfo.fileName}}</a>
                                                        </div>
                                                        <div v-if="file !== null">{{ file.name }}</div>
                                                    </i-col>
                                                </Row>
                                            </form-item>
                                        </i-col>
                                    </Row>
                                </div>
                            </i-form>
                        </div>
                    </i-col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="uploadFile('reportInfo')">确定</Button>
                <Button  size="large" @click="closeReport">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        data () {
            const validateReportTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择请示时间'));
                } else {
                    callback()
                }
            };
            const validateLeaderName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择请示领导'));
                } else {
                    callback()
                }
            };
            const validateContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入请示内容'));
                } else {
                    callback()
                }
            };
            const validateFeedbackTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择批示时间'));
                } else {
                    callback()
                }
            };
            const validateStatus = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择批示结果'));
                } else {
                    callback()
                }
            };
            const validateFeedbackContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入批示内容'));
                } else {
                    callback()
                }
            };
            return {
                reportModal: true,
                file: null,
                oldFileName: '',
                loadingStatus: false,
                pageNum: 1,
                pageSize: 10,
                recordHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '请示时间',
                        key: 'reportTime',
                        align: 'center'
                    },
                    {
                        title: '领导',
                        key: 'leaderName',
                        width: 100,
                        align: 'center'
                    }
                ],
                recordData: [],
                reportInfo: {
                    reportTime: '',
                    leaderId: null,
                    leaderName: '',
                    content: '',
                    feedbackTime: '',
                    feedbackContent: '',
                    status: null,
                    fileName: '',
                    fileKey: ''
                },
                reportTime: '',
                feedbackTime: '',
                showPath: false,
                upload: false,
                resultList: [
                    {
                        value: 1,
                        label: '同意'
                    },
                    {
                        value: 2,
                        label: '不同意'
                    }
                ],
                selectNode: {},
                fileData: {},
                url: '',
                reportInfoCustom: {
                    reportTime: [
                        { required: true, validator: validateReportTime, trigger: 'change' }
                    ],
                    leaderName: [
                        { required: true, validator: validateLeaderName, trigger: 'blur' }
                    ],
                    content: [
                        { required: true, validator: validateContent, trigger: 'blur' }
                    ],
                    feedbackTime: [
                        { required: true, validator: validateFeedbackTime, trigger: 'change' }
                    ],
                    status: [
                        { required: true, validator: validateStatus, trigger: 'change' }
                    ],
                    feedbackContent: [
                        { required: true, validator: validateFeedbackContent, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getTableDetail () {
                return this.$store.state.eduty.tableInfo
            },
            getUserCode () {
                return Cookies.get('userCode')
            },
            getUrl () {
                return this.$store.state.userCode.url
            }
        },
        created () {
            //查询请示记录
            this.queryRecord();
        },
        methods: {
            handleUpload (file) {
                this.file = file;
                this.showPath = false;
                this.reportInfo.fileName = file.name;
                return false;
            },
            queryRecord (type) {
                const queryO = {
                    userCode: this.getUserCode,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    incidentId: this.getTableDetail.id
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/eduty/instruction/queryInstruction4Statistic',
                    data:queryO 
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const dataList = response.data.data.list; 
                            if ( type === 'scroll' ) {
                                if (dataList.length < 1 ) {
                                    this.$Message.warning('没有更多了')
                                    return;
                                }
                                for ( let i=0;i<dataList.length;i++ ) {
                                    this.recordData.push(dataList[i]);
                                }
                            } else {
                                this.recordData = dataList;
                            }
                        }
                    }
                ).catch(
                    
                );
            },
            closeReport () {
                this.$emit('close-modal')
            },
            selectReport (data) {
                //查询请示记录详情
                this.selectNode = data;
                const queryO = {
                    userCode: this.getUserCode,
                    id: data.id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/instruction/getInstructionById',
                    params: queryO 
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.reportInfo = response.data.data;
                            this.reportInfo.leaderId = response.data.data.leader.id;
                            this.reportInfo.leaderName = response.data.data.leader.name;
                            this.reportTime = response.data.data.reportTime;
                            this.feedbackTime = response.data.data.leader.feedbackTime;
                            if (response.data.data.fileKey) {
                                this.showPath = true;
                                this.oldFileName = response.data.data.fileKey;
                            } else {
                                this.showPath = false;
                                this.oldFileName = '';
                            }
                            this.$refs['reportInfo'].resetFields();
                        }
                    }
                ).catch(
                    
                );
            },
            changeReportTime (time) {
                this.reportInfo.reportTime = time;
            },
            changeFeedbackTime (time) {
                this.reportInfo.feedbackTime = time;
            },
            searchMoreReport () {
                //查询更多请示记录
                this.pageNum = this.pageNum+1;
                this.queryRecord('scroll');
            },
            uploadFile (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //上传附件
                        if ( this.file === null ) {
                            this.saveReport();
                        } else {
                            const formData = new FormData();
                            formData.append('userCode', this.getUserCode);
                            formData.append('file', this.file);
                            axios.post( this.getUrl+'/eduty/instruction/uploadFile', formData)
                            .then(
                                response => {
                                    if ( response.data.code === 200 ) {
                                        this.reportInfo.fileKey = response.data.data.fileKey;
                                        this.saveReport();
                                        if ( this.oldFileName !== '') {
                                            this.deleteOldFile();
                                        }
                                    }
                                }
                            )
                            .catch(
                                error => {
                                    this.$Message.warning('附件上传失败');
                                }
                            );
                        }
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
                
            },
            deleteOldFile () {
                //删除旧文件
                const queryO = {
                    userCode: this.getUserCode,
                    fileKey: this.oldFileName
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/instruction/deleteFile',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            
                        }else{
                            this.$Message.warning('旧附件未删除');
                        }
                    }
                ).catch(
                    
                );
            },
            saveReport () {
                //保存请示汇报
                const queryO = this.reportInfo;
                queryO.leader = {
                    id: this.reportInfo.leaderId,
                    name: this.reportInfo.leaderName
                }
                queryO.incidentId = this.getTableDetail.id;
                queryO.userCode = this.getUserCode;
                axios({
                    method: 'post',
                    url: this.getUrl+'/eduty/instruction/addInstruction',
                    data: queryO 
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('请示记录保存成功');
                            this.$emit('save-modal')
                        }
                    }
                ).catch(
                    
                );
            },
            openLeader () {
                //选择领导
                this.$emit('open-modal')
            },
            settingLeader (data) {
                console.log(data)
                this.reportInfo.leaderId = data.id;
                this.reportInfo.leaderName = data.name;
                this.$refs.reportInfo.validateField('leaderName', valid => {

                });
            }
        }
    }
</script>

<style scoped>

</style>


