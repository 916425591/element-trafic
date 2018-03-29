<template>
    <!-- 处置方案 -->
    <div>
        <modal v-model="managementPlanModal" title="处置方案" :mask-closable="false" width="800" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                <i-form ref="info" :model="info" :rules="infoCustom" :label-width="100">
                    <Row>
                        <i-col span="12">
                            <form-item label="方案标题： " prop="title">
                                <i-input type="text" v-model="info.title"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="领导： " prop="leaderName">
                                <i-input type="text" v-model="info.leaderName" @on-focus="openManageLeader"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div>
                <Card shadow>
                    <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
                </Card>
                <Spin fix v-if="spinShow">
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
            </div>
            <div slot="footer">
                <Button v-if="showReport" type="primary" size="large"  @click="saveManagementPlan('info')">上报领导</Button>
                <Button  size="large" @click="closeModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import tinymce from 'tinymce';
    import Cookies from 'js-cookie';
    export default {
        data () {
            const validateTitle = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入方案标题'));
                } else {
                    callback()
                }
            };
            const validateLeaderName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择领导'));
                } else {
                    callback()
                }
            };
            return {
                spinShow: true,
                managementPlanModal: true,
                showReport: true,
                info: {
                    title: '',
                    leaderId: null,
                    leaderName: ''
                },
                detial: {},
                content: '',
                infoCustom: {
                    title: [
                        { required: true, validator: validateTitle, trigger: 'blur' }
                    ],
                    leaderName: [
                        { required: true, validator: validateLeaderName, trigger: 'blur' }
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
            },
            getPlanInfo () {
                return this.$store.state.eduty.planInfo
            }
        },
        created () {

        },
        methods: {
            init () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = document.body.offsetHeight - 450;
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
                                if (localStorage.editorContentPlan) {
                                    tinymce.get('tinymceEditer').setContent(localStorage.editorContentPlan);
                                }
                            });
                            editor.on('keydown', function (e) {
                                localStorage.editorContentPlan = tinymce.get('tinymceEditer').getContent();
                            });
                        }
                    });
                });
            },
            saveManagementPlan (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //保存处置方案 
                        const queryO = this.info;
                        queryO.userCode = Cookies.get('userCode');
                        queryO.incidentId = this.getTableDetail.id;
                        queryO.planId = this.detial.planId;
                        queryO.publishPlanId = this.detial.publishPlanId;
                        queryO.content = localStorage.editorContentPlan;
                        axios({
                            method: 'post',
                            url: this.getUrl+'/eduty/disposalPlan/saveDisposalPlan',
                            data: queryO
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    localStorage.editorContentPlan = '';
                                    this.$Message.success('处置方案保存成功');
                                    this.$emit('save-modal');
                                }
                            }
                        ).catch(
                            
                        )
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
                
            },
            closeModal () {
                localStorage.editorContentPlan = '';
                this.$emit('close-modal');
            },
            openManageLeader () {
                this.$emit('open-modal');
            },
            settingLeader (data) {
                this.info.leaderId = data.id;
                this.info.leaderName = data.name;
                this.$refs.info.validateField('leaderName', valid => {

                });
            },
            judgePlanInfo () {
                const info = this.getPlanInfo;
                console.log(info)
                if ( info.content && info.id ) {
                    this.initPlanInfo(info);
                    this.showReport = false;
                } else if (info.content && !info.id ) {
                    this.initPlanInfo(info);
                    this.showReport = true;
                } else if (info.centers && info.id ) {
                    this.installPlanInfo(info);
                    this.showReport = false;
                } else if ( info.centers && !info.id ) {
                    this.installPlanInfo(info);
                    this.showReport = true;
                } else {
                    localStorage.editorContentPlan = '';
                }
            },
            initPlanInfo (planInfo) {
                this.info.id = planInfo.id;
                this.info.title = planInfo.title;
                this.info.leaderId=planInfo.leaderId;
                this.info.leaderName=planInfo.leaderName;
                localStorage.editorContentPlan = planInfo.content;
            },
            installPlanInfo (planInfo) {
                this.detial = planInfo;
                this.info.title = planInfo.planame;
                let content = '';
                let num = 1;
                const centersList = planInfo.centers || [];
                let dcontent = '';
                let mcontent = '';
                for ( let i=0;i<centersList.length;i++ ) {
                    const deputyCommander = centersList[i].deputyCommander || [];
                    const member = centersList[i].member || [];
                    for ( let j=0;j<deputyCommander.length;j++ ) {
                        dcontent += deputyCommander[j].name+ '、';
                    }
                    for ( let k=0;k<member.length;k++ ) {
                        mcontent += member[k].name + '、';
                    }
                    content = num + '、' + '成立' +centersList[i].typeName+'<br>'+'指挥长：'+centersList[i].commander.name+'<br>'+ '副指挥长: ' +dcontent+'<br>'+'指挥部成员: '+mcontent+'<br>';
                    num = num;
                }
                const memberOrg = planInfo.orgs || [];
                let moContent = '';
                for ( let i=0;i<memberOrg.length;i++ ) {
                    moContent += memberOrg[i].orgName+'、';
                }
                content += num+1 + '、' + '成员单位' +'<br>'+ moContent+'<br>';
                const deputyLeader = planInfo.experts.deputyLeader || [];
                let dLeaderContent = '';
                for ( let i=0;i<deputyLeader.length;i++ ) {
                    dLeaderContent += deputyLeader[i].expertName+'、';
                }
                content += num+2 + '、' + '专家组' +'<br>'+'组长: '+ planInfo.experts.leader.expertName+'<br>'+'副组长: '+dLeaderContent+'<br>';
                const experts = planInfo.experts.members || [];
                let eContent = '';
                for ( let i=0;i<experts.length;i++ ) {
                    eContent += '成员: '+experts[i].expertName+'、';
                }
                content += eContent + '<br>';
                content += num+3+'、'+'成立安全保障小组'+'<br>';
                const groups = planInfo.groups || [];
                for ( let i=0;i<groups.length;i++ ) {
                    let gMemberContent = '';
                    for ( let j=0;j<groups[i].members.length;j++ ) {
                        gMemberContent += groups[i].members[j].name+'、';
                    }
                    content += num+3+'-'+ (i+1) +groups[i].groupName+'<br>'+gMemberContent+'<br>';
                }
                content += num+4+'、'+'应急响应'+'<br>';
                const measure = planInfo.measure.contents || [];
                let measureContent = '';
                for ( let i=0;i<measure.length;i++ ) {
                    measureContent += measure[i]+'<br>';
                }
                content += '建议启动'+planInfo.measure.level+'级预案响应'+'<br>'+'处置措施如下：'+'<br>'+measureContent;
                localStorage.editorContentPlan = content;
            }
        },
        mounted () {
            this.init();
            //判断是否有处置方案
            this.judgePlanInfo();
        },
        destroyed () {
            tinymce.get('tinymceEditer').destroy();
        }
    }
</script>

<style scoped>

</style>


