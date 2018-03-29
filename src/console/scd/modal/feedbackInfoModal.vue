<template>
    <div>
        <modal v-model="feedbackModal" title="反馈信息" :mask-closable="false" width="600" @on-cancel="closefeedbackInfoModal" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="feedbackInfo" :model="feedbackInfo" :rules="feedbackInfoCustom" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="反馈单位： " prop="feedbackOrgName">
                                <i-input type="text" v-model="feedbackInfo.feedbackOrgName" @on-focus="openOrgModal"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="反馈人员： " prop="feedbacker">
                                <i-input type="text" v-model="feedbackInfo.feedbacker" @on-focus="openPersonModal"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="反馈时间： " prop="feedbackTime">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" @on-change="changeFeedbackTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="反馈内容： " prop="content">
                                <i-input type="textarea" v-model="feedbackInfo.content"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="savefeedbackInfoModal('feedbackInfo')">确定</Button>
                <Button size="large"  @click="closefeedbackInfoModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    export default {
        data () {
            const validateFeedbackOrgName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择反馈单位'));
                } else {
                    callback()
                }
            };
            const validateFeedbacker = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择反馈人员'));
                } else {
                    callback()
                }
            };
            const validateFeedbackTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择反馈时间'));
                } else {
                    callback()
                }
            };
            const validateContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入反馈内容'));
                } else {
                    callback()
                }
            };
            return {
                feedbackModal: true,
                feedbackInfo: {
                    queryCode: '',
                    feedbackOrgId: null,
                    feedbackOrgName: '',
                    feedbackerId: null,
                    feedbacker: '',
                    feedbackTime: '',
                    content: ''
                },
                feedbackInfoCustom: {
                    feedbackOrgName: [
                        { required: true, validator: validateFeedbackOrgName, trigger: 'blur' }
                    ],
                    feedbacker: [
                        { required: true, validator: validateFeedbacker, trigger: 'blur' }
                    ],
                    feedbackTime: [
                        { required: true, validator: validateFeedbackTime, trigger: 'change' }
                    ],
                    content: [
                        { required: true, validator: validateContent, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            openOrgModal () {
                //打开反馈单位
                this.$emit('open-modal', 'feedbackOrg');
            },
            openPersonModal () {
                //打开反馈人员
                if (!this.feedbackInfo.feedbackOrgId) {
                    this.$Message.warning('请先选择出动单位')
                } else {
                    this.$emit('open-modal', 'feedbackExecutor', this.feedbackInfo.queryCode); 
                }
            },
            settingInput (data, type) {
                //设置弹窗修改input值
                if ( type === 'feedbackOrg') {
                    this.feedbackInfo.feedbackOrgId = data[0].id;
                    this.feedbackInfo.feedbackOrgName = data[0].title;
                    this.feedbackInfo.queryCode = data[0].queryCode;
                    this.$refs.feedbackInfo.validateField('feedbackOrgName', valid => {
                    
                    });
                }
                if ( type === 'feedbackExecutor' ) {
                    this.feedbackInfo.feedbacker = data.name;
                    this.feedbackInfo.feedbackerId = data.id;
                    this.$refs.feedbackInfo.validateField('feedbacker', valid => {
                    
                    });
                }
            },
            savefeedbackInfoModal (name) {
                //确定保存
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('save-modal', this.feedbackInfo);
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
            },
            closefeedbackInfoModal () {
                //确定关闭
                this.$emit('close-modal');
            },
            changeFeedbackTime (time) {
                this.feedbackInfo.feedbackTime = time;
            },
        }
    }
</script>

<style scoped>

</style>
