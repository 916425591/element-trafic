<template>
    <div :data-height="tableHeight">
        <div class="ds-widget-box" style="margin-left: 10px;">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>预案文本信息</h2>
                <span style="float:right;margin-right:10px;">
           <!-- <Button type="primary" @click="saveperplan">保存</Button>-->
        </span>
            </div>
            <Card shadow>
                <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
            </Card>
            <Spin fix v-if="spinShow">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>加载中...</div>
            </Spin>
        </div>
    </div>
</template>

<script>
    import tinymce from 'tinymce';
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    export default {
        // name: 'text-editor',
        data () {
            return {
                spinShow: true,
                idStatus: null,
                height: ''
            };
        },
        computed: {
            nodeId () {
                return this.$store.state.planContent.publishNodeId; // nodeId
            },
            planId () {
                return this.$store.state.planContent.publishPlanId; // planID
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfo.tableHeight
                this.height = (parseInt(height) - 173) + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(75) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.getPerplanContent()
        },
        watch: {
            nodeId (curVal, oldVal){
    　　　　　　 this.getPerplanContent()
    　　　　 }
        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getPerplanContent() {
                const url = this.url + '/plan/text/getFBPlanText4Node'
                const params = {
                    userCode: this.userCode,
                    nodeId: this.nodeId
                }
                axios({
                    method: 'get',
                    url: url,
                    params: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            const res = response.data.data
                            if (res) {
                                localStorage.perplanTextInfo = res.content;
                                this.idStatus = res.id
                            } else {
                                localStorage.perplanTextInfo = '';
                                
                                this.idStatus = null;
                            }
                                tinymce.get('tinymceEditer').setContent(localStorage.perplanTextInfo);
                            }
                    }
                ).catch(
                    error => {

                    }
                )
            },
            saveperplan() {
                const url = this.url + '/plan/text/savePlanText'
                const params = {
                    id: this.idStatus,
                    content: localStorage.perplanTextInfo,
                    node: {
                        id: this.nodeId
                    },
                    plan: {
                        id: this.planId
                    },
                    userCode: this.userCode
                }
                axios({
                    method: 'post',
                    url: url,
                    data: params
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            this.$Message.info('保存成功')
                            this.idStatus = response.data.data.id
                        } else {
                            this.$Message.error(response.data.message)
                        }
                    }
                ).catch(
                    error => {

                    }
                )
            },
            init () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = this.height
                    tinymce.init({
                        selector: '#tinymceEditer',
                        branding: false,
                        elementpath: false,
                        height: height,
                        language: 'zh_CN.GB2312',
                        plugins: [
                            'advlist autolink lists link image charmap print preview imagetools',
                        ],
                        toolbar1: 'undo redo | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                        autosave_interval: '20s',
                        image_advtab: true,
                        images_upload_url: '',
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                                if (localStorage.perplanTextInfo) {
                                    tinymce.get('tinymceEditer').setContent(localStorage.perplanTextInfo);
                                }
                            });
                            editor.on('keydown', function (e) {
                                localStorage.perplanTextInfo = tinymce.get('tinymceEditer').getContent();
                            });
                        }
                    });
                });
            }
        },
        mounted () {
            this.init();
        },
        destroyed () {
            tinymce.get('tinymceEditer').destroy();
        }
    };
</script>

<style>

</style>
