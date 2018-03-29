<template>
    <div>
        <!-- 预案详情 -->
        <modal v-model="endPlanModal" class-name="vertical-center-modal" title="预案详情" :mask-closable="false" width="90%" @on-cancel="closeModal">
            <div>
                <Tabs type="card">
                    <TabPane label="预案内容">
                        <plan-content></plan-content>
                    </TabPane>
                    <TabPane label="处置流程">
                        <plan-process></plan-process>
                    </TabPane>
                </Tabs>
            </div>
            <div slot="footer">
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    import planContent from './planContent'
    import planProcess from './planProcess'

    export default {
        components: {
            planContent,
            planProcess
        },
        data () {
            return {
                endPlanModal: true,
                formCustom: {}
            }
        },
        computed: {
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            planInfo () {
                return this.$store.state.planContent.planDetail
            }
        },
        created () {
            this.queryDetail();
            console.log(this.planInfo)
        },
        methods: {
            closeModal () {
                this.$emit('close-modal');
            },
            queryDetail(){
                const url = this.url + '/plan/content/getFBPlanDetail'
                axios({
                    method: 'get',
                    url: url,
                    params: {
                       userCode: this.userCode,
                       id: this.planInfo.id
                    }
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.formCustom = {
                                id: res.id,
                                name: res.name,
                                type: res.incidentTypeName,
                                typeId: res.incidentTypeId,
                                org: res.chiefEditOrgName,
                                orgId: res.chiefEditOrg,
                                keyWords: res.keyWords,
                                area: res.regionName,
                                areaId: res.regionId,
                                planType: res.planTypeName,
                                planTypeId: res.planTypeId,
                                incidentLevelName: res.incidentLevelName,
                                incidentLevelId: res.incidentLevelId
                            }
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            }
        }
    }
</script>

<style scoped>
    .ivu-form-item {
        margin-bottom: 0!important;
    }
</style>

