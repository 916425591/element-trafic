<template>
    <!-- 确认交接 -->
    <div>
        <modal v-model="transferModal" title="交接信息确认" :mask-closable="false" width="600" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                <i-form :model="transferInfo" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="接班人员： ">
                                <span>{{getUserCode}}</span>
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
                        <Table border highlight-row :columns="workHead" :data="workData"></Table>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveModal">确定</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                transferModal: true,
                transferInfo: {

                },
                personList: [
                    {
                        value: 0,
                        label: '张三'
                    }
                ],
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
                workData: []
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
            //查询确认交接信息
            this.queryTransfer();
        },
        methods: {
            queryTransfer () {
                //查询交接信息
                const queryO = {
                    userCode: this.getUserCode,
                }
                 axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/backlog/queryBacklog4Confirm',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.workData = response.data.data.backlogs;
                            this.transferInfo.attention = response.data.data.attention;
                        }
                    }
                ).catch(
                    
                )
            },
            deleteResource () {

            },
            saveModal () {
                const queryO = {
                    userCode: this.getUserCode,
                }
                 axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/backlog/handoverRecordInfoConfirm',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('交接接收成功');
                            this.closeModal();
                        }
                    }
                ).catch(
                    
                )
            },
            closeModal () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>

