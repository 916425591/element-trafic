<template>
    <!-- 待办事项处理 -->
    <div>
        <modal v-model="handleModal" title="待办事项处理" :mask-closable="false" width="600" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                <i-form ref="handleInfo" :model="handleInfo" :rules="handleInfoCustom" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="处理内容： " prop="content">
                                <i-input type="textarea" :rows="5" v-model="handleInfo.content"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="处理结果： " prop="status">
                                <Select v-model="handleInfo.status">
                                    <Option v-for="item in resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveModal('handleInfo')">确定</Button>
                <Button size="large" @click="closeModal('handleInfo')">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';

    export default {
        data () {
            const validateContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入处理内容'));
                } else {
                    callback()
                }
            };
            const validateStatus = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择处理结果'));
                } else {
                    callback()
                }
            };
            return {
                handleModal: true,
                handleInfo: {
                    content: '',
                    status: null,
                    state: null
                },
                resultList: [
                    {
                        value: 2,
                        label: '处置中'
                    },
                    {
                        value: 3,
                        label: '已完成'
                    }
                ],
                handleInfoCustom: {
                    content: [
                        { required: true, validator: validateContent, trigger: 'blur' }
                    ],
                    status: [
                        { required: true, validator: validateStatus, trigger: 'change' }
                    ]
                }
            }
        },
        computed: {
            getUserCode () {
                return Cookies.get('userCode')
            },
            getUrl () {
                return this.$store.state.userCode.url
            },
            getDetail () {
                return this.$store.state.eduty.wrokItem
            }
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                //初始化处理结果（新事项不显示）
                const incidentStatus = this.getDetail.status;
                this.handleInfo = this.getDetail;
                if ( incidentStatus === 1 ) {
                    this.handleInfo.status = null;
                }
            },
            saveModal (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = this.handleInfo;
                        data.userCode = this.getUserCode;
                        data.id = this.getDetail.id;
                        axios({
                            method: 'post',
                            url: this.getUrl+'/eduty/backlog/saveBacklog',
                            data: data
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.success('代办事项处理成功');
                                    this.$emit('save-modal');
                                }
                            }
                        ).catch(
                            
                        )
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
            },
            closeModal (name) {
                this.$refs[name].resetFields();
                this.$emit('close-modal')
            }
        }
    }
</script>

<style scoped>

</style>
