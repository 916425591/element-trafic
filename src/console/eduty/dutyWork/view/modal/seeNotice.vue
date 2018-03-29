<template>
    <!-- 通知详情查看 -->
    <div>
        <modal v-model="seeNotice" title="通知查看" :mask-closable="false" width="600" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                <div>
                    {{org}},在{{time}}下达{{title}}通知,内容如下:
                </div>
                <div class="ds-content">
                    {{content}}
                </div>
            </div>
            <div slot="footer">
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
            return {
                seeNotice: true,
                org: '',
                time: '',
                title: '',
                content: ''
            }
        },
        computed: {
            getNotice () {
                return this.$store.state.eduty.notice;
            },
            getUrl () {
                return this.$store.state.userCode.url
            },
        },
        created () {
            this.init();
            this.receiveNotice();
        },
        methods: {
            init () {
                //初始化
                const notice = this.getNotice;
                this.org = notice.sendOrgName;
                this.time = notice.noticeTime;
                this.title= notice.title;
                this.content = notice.content;
            },
            receiveNotice () {
                //查看通知
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    id: this.getNotice.id
                }
                axios({
                    method: 'get',
                    url: this.getUrl+'/eduty/notice/receiveNotice',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$emit('change-status', response.data.data);
                        }
                    }
                ).catch(
                    
                );
            },
            closeModal () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>
    .ds-content {
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        height: 150px;
        line-height: 22px;
        text-indent: 35px;
        overflow-y: auto;
    }
</style>
