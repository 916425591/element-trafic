<template>
    <!-- 回执处理 -->
    <div>
        <modal v-model="handleNotice" :title="title" :mask-closable="false" width="600" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                <i-form ref="notice" :model="notice" :rules="noticeCustom" :label-width="100">
                    <form-item label="回执内容： " prop="feedbackContente">
                        <i-input :disabled="disabled" type="textarea" :rows="5" v-model="notice.feedbackContente"></i-input>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
                <Button v-if="seeShow" type="primary" size="large" @click="saveModal('notice')">确定</Button>
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
            const validateContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入回执内容'));
                } else {
                    callback()
                }
            };
            return {
                title: '回执处理',
                handleNotice: true,
                notice: {
                    feedbackContente: ''
                },
                seeShow: true,
                disabled: false,
                noticeCustom: {
                    feedbackContente: [
                        { required: true, validator: validateContent, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getUserCode () {
                return Cookies.get('userCode')
            },
            getNotice () {
                return this.$store.state.eduty.notice;
            },
            getUrl () {
                return this.$store.state.userCode.url
            },
            seeShow () {
                return this.$store.state.eduty.notice.seeShow;
            }
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                const seeShow = this.getNotice.seeShow;
                if (seeShow) {
                    this.seeShow = true;
                } else {
                    this.title = '回执信息';
                    this.seeShow = false;
                    this.disabled = true;
                    this.queryNotice();
                }
            },
            queryNotice () {
                const queryO = {
                    userCode: this.getUserCode,
                    id: this.getNotice.id
                };
                axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/notice/getNoticeOrgDetail',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.notice.feedbackContente =  response.data.data.feedbackContente;
                        }
                    }
                ).catch(
                    
                );
            },
            saveModal (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const queryO = this.notice;
                        queryO.userCode = this.getUserCode;
                        queryO.id = this.getNotice.id;
                        axios({
                            method: 'post',
                            url: this.getUrl+'/eduty/notice/feedbackNotice',
                            data: queryO
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$emit('change-status', response.data.data);
                                    this.closeModal();
                                }
                            }
                        ).catch(
                            
                        );
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
