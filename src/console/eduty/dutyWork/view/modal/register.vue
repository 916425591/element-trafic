<template>
    <!-- 待办事项录入 -->
    <div>
        <modal v-model="registerModal" title="待办事项录入" :mask-closable="false" width="600" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                <i-form ref="registerInfo" :model="registerInfo" :rules="registerInfoCustom" :label-width="100">
                    <Row>
                        <i-col span="12">
                            <form-item label="事项来源： " prop="source">
                                <i-input type="text" v-model="registerInfo.source"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="紧急程度： " prop="urgent">
                                <Select v-model="registerInfo.urgent">
                                    <Option v-for="item in urgentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事项内容： " prop="content">
                                <i-input type="textarea" :rows="5" v-model="registerInfo.content"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="截止时间： " prop="finishTime">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="changeFinishTime" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveModal('registerInfo')">确定</Button>
                <Button size="large"  @click="closeModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        data () {
            const validateSource = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入事项来源'));
                } else {
                    callback()
                }
            };
            const validateUrgent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择紧急程度'));
                } else {
                    callback()
                }
            };
            const validateContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入事项内容'));
                } else {
                    callback()
                }
            };
            const validateFinishTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择截止时间'));
                } else {
                    callback()
                }
            };
            return {
                registerModal: true,
                registerInfo: {
                    source: '',
                    urgent: null,
                    content: '',
                    finishTime: ''
                },
                incidentSources: [],
                urgentList: [
                    {
                        value: 1,
                        label: '紧急'
                    },
                    {
                        value: 2,
                        label: '一般'
                    }
                ],
                registerInfoCustom: {
                    source: [
                        { required: true, validator: validateSource, trigger: 'blur' }
                    ],
                    urgent: [
                        { required: true, validator: validateUrgent, trigger: 'change' }
                    ],
                    content: [
                        { required: true, validator: validateContent, trigger: 'blur' }
                    ],
                    finishTime: [
                        { required: true, validator: validateFinishTime, trigger: 'change' }
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
            }
        },
        created () {
            //查询来源
            // this.querySource();
        },
        methods: {
            closeModal () {
                this.$emit('close-modal');
            },
            querySource () {
                const data = {
                    userCode: Cookies.get('userCode')
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/eIncident/queryIncidentSources',
                    params: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let list = response.data.data;
                            let newList = [];
                            for ( let i=0;i<list.length;i++ ) {
                                newList.push({
                                value: list[i].id,
                                label: list[i].name
                                })
                            }
                            this.$set(this,'incidentSources',newList);
                        }
                    }
                ).catch(
                    
                )
            },
            changeFinishTime (time) {
                this.registerInfo.finishTime = time;
            },
            saveModal (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const data = this.registerInfo;
                        data.userCode = this.getUserCode;
                        axios({
                            method: 'post',
                            url: this.getUrl+'/eduty/backlog/saveBacklog',
                            data: data
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.success('待办事项登记成功');
                                    this.$emit('save-modal');
                                }
                            }
                        ).catch(
                            
                        )
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
                
            }
        }
    }
</script>

<style scoped>

</style>
