<template>
    <div>
        <modal v-model="outInfoModal" title="出动信息" :mask-closable="false" width="600" @on-cancel="closeOutInfoModal" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form :model="feedbackInfo" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="出动单位： ">
                                <span>{{ feedbackInfo.feedbackOrgName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="出动人员： ">
                                <span>{{ feedbackInfo.feedbacker }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="出动时间： ">
                                <span>{{ feedbackInfo.feedbackTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="简要内容： ">
                                <span>{{ feedbackInfo.content }}</span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>携带资源</h2>
                </div>
                <div class="ds-table-box">
                    <Table border ref="selection" highlight-row size="small" height="237" :columns="outInfoHead" :data="outInfoData"></Table>
                </div>
            </div>
            <div slot="footer">
                <!-- <Button type="primary"  @click="closeOutInfoModal">确定</Button> -->
                <Button size="large"  @click="closeOutInfoModal">关闭</Button>
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
                outInfoModal: true,
                feedbackInfo: {},
                outInfoHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '资源名称',
                        key: 'resName',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'count',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unit',
                        width: 100,
                        align: 'center'
                    }
                ],
                outInfoData: []
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            }
        },
        methods: {
            queryOutInfo (id) {
                //查看出动信息
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    dispatchId: id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/feedback/getSetoutDetail4Dispatch',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.feedbackInfo = response.data.data || {};
                            this.outInfoData = response.data.data.ress || [];
                        }
                    }
                ).catch(
                    
                );
            },
            closeOutInfoModal () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>
