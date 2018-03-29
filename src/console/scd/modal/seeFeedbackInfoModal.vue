<template>
    <div>
        <modal v-model="feedbackModal" title="反馈信息" :mask-closable="false" width="600" @on-cancel="closefeedbackInfoModal" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form :model="feedbackInfo" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="反馈单位： ">
                                <span>{{ feedbackInfo.operateOrgName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="反馈人员： ">
                                <span>{{ feedbackInfo.operater }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="反馈时间： ">
                                <span>{{ feedbackInfo.feedbackTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="反馈内容： ">
                                <span>{{ feedbackInfo.content }}</span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
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
                feedbackInfo: {}
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
                    feedbackId: id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/feedback/getFeedbackDetail',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.feedbackInfo = response.data.data || [];
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
