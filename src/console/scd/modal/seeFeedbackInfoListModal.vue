<template>
    <div>
        <modal class-name="vertical-center-modal" v-model="feedbackModal" title="反馈信息" :mask-closable="false" width="800" @on-cancel="closefeedbackInfoModal">
            <div class="ds-search-body">
                <div class="ds-table-box">
                    <Table border height="350" :columns="feedbackInfoHead" :data="feedbackInfoData"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button size="large"  @click="closefeedbackInfoModal">关闭</Button>
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
                feedbackModal: true,
                feedbackInfo: {},
                feedbackInfoHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '反馈单位',
                        key: 'operateOrgName',
                        align: 'center'
                    },
                    {
                        title: '反馈人员',
                        key: 'operater',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '反馈时间',
                        key: 'feedbackTime',
                        align: 'center'
                    },
                    {
                        title: '反馈内容',
                        key: 'content',
                        width: 250,
                        align: 'center'
                    }
                ],
                feedbackInfoData: []
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            }
        },
        methods: {
            queryOutInfo (id) {
                //查看出动信息和反馈信息
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    dispatchId: id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/feedback/queryFeedbackDetail4Dispatch',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.feedbackInfoData = response.data.data || [];
                        }
                    }
                ).catch(
                    
                );
            },
            closefeedbackInfoModal () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>
    
</style>
