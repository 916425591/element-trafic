<template>
    <!-- 值班交接 -->
    <div>
        <modal v-model="transferModal" title="值班交接" :mask-closable="false" width="600" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                <i-form ref="transferInfo" :model="transferInfo" :rules="transferInfoCustom" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="接班人员： " prop="toerName">
                                <i-input type="text" v-model="transferInfo.toerName" @on-focus="openPerson"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="注意事项： " prop="attention">
                                <i-input type="textarea" :rows="5" v-model="transferInfo.attention"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
                <div class="ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>待办事项</h2>
                    </div>
                    <div class="ds-table-box">
                        <Table border height="230" highlight-row :columns="workHead" :data="workData"></Table>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveModal('transferInfo')">确定</Button>
                <Button  @click="closeModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';

    export default {
        data () {
            const validateToerName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择接班人员'));
                } else {
                    callback()
                }
            };
            const validateAttention = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入注意事项'));
                } else {
                    callback()
                }
            };
            return {
                transferModal: true,
                transferInfo: {
                    toerId: null,
                    toerName: '',
                    attention: ''
                },
                workHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '登记',
                        key: 'simpleTime',
                        width: 80,
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
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '来源',
                        key: 'source',
                        width: 100,
                        align: 'center'
                    }
                ],
                workData: [],
                transferInfoCustom: {
                    toerName: [
                        { required: true, validator: validateToerName, trigger: 'blur' }
                    ],
                    attention: [
                        { required: true, validator: validateAttention, trigger: 'blur' }
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
            this.queryBacklog();
        },
        methods: {
            queryBacklog () {
                //查询代办列表
                const queryO = {
                    userCode: this.getUserCode,
                }
                 axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/backlog/queryBacklog4Tranfer',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.workData = response.data.data;
                        }
                    }
                ).catch(
                    
                )
            },
            openPerson () {
                //打开接班人员
                this.$emit('open-modal');
            },
            settingPerson (data) {
                this.transferInfo.toerId = data.id;
                this.transferInfo.toerName = data.name;
                this.$refs.transferInfo.validateField('toerName', valid => {
                    
                })
            },
            deleteResource () {

            },
            saveModal (name) {
                //保存交班记录
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const queryO = this.transferInfo;
                        queryO.userCode = this.getUserCode;
                        axios({
                            method: 'post',
                            url: this.getUrl+'/eduty/backlog/backlogTransfer',
                            data: queryO
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.success('交班成功')
                                    this.$emit('close-modal');
                                }
                            }
                        ).catch(
                            
                        )
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
                
            },
            closeModal () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>

