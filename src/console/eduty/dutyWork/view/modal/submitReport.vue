<template>
    <!-- 上报 -->
    <div>
        <modal v-model="submitReportModal" title="信息上报" :mask-closable="false" width="400" @on-cancel="closeReport" class-name="vertical-center-modal">
            <div>
                <i-form ref="report" :model="report" :rules="reportCustom" :label-width="100">
                    <form-item label="上级单位： " prop="superiorOrgId">
                        <i-input v-model="report.superiorOrgName" @on-focus="selectOrg"></i-input>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveReport('report')">确定</Button>
                <Button  @click="closeReport">取消</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        data () {
            const validatesuperiorOrgId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择上级单位'));
                } else {
                    callback()
                }
            };
            return {
                submitReportModal: true,
                report: {
                    superiorOrgId: null,
                    superiorOrgName: ''
                },
                reportCustom: {
                    superiorOrgId: [
                        { required: true, validator: validatesuperiorOrgId, trigger: 'blur' }
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
        methods: {
            selectOrg () {
                this.$emit('open-modal')
            },
            settingOrg (data) {
                this.report.superiorOrgId = data[0].id;
                this.report.superiorOrgName = data[0].title;
                this.$refs.report.validateField('superiorOrgId', valid => {

                })
            },
            saveReport (name) {
                //保存上报
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const queryO = {
                            userCode: this.getUserCode,
                            incidentId: this.getTableDetail.id,
                            superiorOrgId: this.report.superiorOrgId
                        }
                        axios({
                            method: 'post',
                            url: this.getUrl+'/eduty/report/saveReport',
                            data:queryO 
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.success('上报成功');
                                    this.$emit('save-modal');
                                } else {
                                    this.$Message.warning(response.data.message);
                                    this.closeReport();
                                }
                            }
                        ).catch(
                            error => {
                                // this.$Message.success(error);
                            }
                        );
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
            },
            closeReport () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>
