<template>
    <div class="ds-hospital-table ds-widget-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>队伍信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="primary" @click="team_Edit_Save('formCustom')"  v-if="!ds_edit">提交</Button>
                    <Button type="warning" @click="change_edit" v-else>修改</Button>
                    <Button type="error" v-if="ds_edit" @click="deleteTeamBefore">删除</Button>
                    <Button type="ghost" v-else @click="close_team">取消</Button>
                    <Modal v-model="delate_info" title="确认删除" width="300">
                         <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否删除此条信息
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>
                            <Button size="large" type="primary" @click="team_delete">确定</Button>
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <i-form ref="formCustom" :model="team_info" :rules="ruleCustom" :label-width="90">
                <Row>
                    <i-col span="8">
                        <form-item label="队伍名称:" prop="name">
                            <span v-if="ds_edit">{{ team_info.name }}</span>
                            <span v-else>
                                <i-input v-model="team_info.name" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="行政区域:" prop="region">
                            <span v-if="ds_edit">{{ team_info.region ? team_info.region.name : ''}}</span>
                            <span v-else>
                                <i-input v-model="team_info.region.name" style="width:98%;" @on-focus="open_region"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="驻地位置:">
                            <span v-if="ds_edit">{{ team_info.location }}</span>
                            <span v-else>
                                <i-input v-model="team_info.location" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <row>
                    <i-col span="8">
                        <form-item label="组建日期:">
                            <span v-if="ds_edit">
                                {{ team_info.buildDate }}
                            </span>
                            <span v-else>
                                <DatePicker type="date" :value="team_info.buildDate" @on-change="setBuildDate" placeholder="" style="width: 98%"></DatePicker>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="人数来源:">
                            <span v-if="ds_edit">{{ team_info.personSource }}</span>
                            <span v-else>
                                <i-input v-model="team_info.personSource" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="集结时间:">
                            <span v-if="ds_edit">{{ team_info.concentrateTime }}</span>
                            <span v-else>
                                <i-input v-model="team_info.concentrateTime" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </row>
                <row>
                    <i-col span="24">
                        <form-item label="装备情况:">
                            <span v-if="ds_edit">{{ team_info.equipping }}</span>
                            <span v-else>
                                <i-input v-model="team_info.equipping" style="width:99%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </row>
                <row> 
                    <i-col span="24">
                        <form-item label="队伍职能:">
                            <span v-if="ds_edit">{{ team_info.function }}</span>
                            <span v-else>
                                <i-input v-model="team_info.function" style="width:99%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
            </i-form>
        </div>
        <tree v-if="treeModal" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import tree from '@/common/components/treeModal/tree'
    import Cookies from 'js-cookie';

    export default {
        components:{
            tree
        },
		 name: 'hospital_info',
		 data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入队伍名称'));
                } else {
                    callback()
                }
            };
            const validateRegion = (rule, value, callback) => {
                if (!value || !value.id) {
                    return callback(new Error('请选择队伍行政区域'));
                } else {
                    callback()
                }
            };
            return {
                treeModal: false,
                switch1: true,
                delate_info: false,
                ruleCustom: {
                    name: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ],
                    region: [
                        { required: true,validator: validateRegion, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getData() {
                return this.$store.state.team.resTypeId
            },
            ds_edit() {
                return this.$store.state.refuge.ds_edit
            },
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            team_info() {
                return this.$store.state.team.teamDetail
            }
        },
        methods: {
            ...mapActions([
				'saveDemoData',
                'changeEditStatus',
                'saveTeamDetailData'
		    ]),
            change_edit () {
                let teamInfo = this.team_info;
                if(!teamInfo.id){
                    this.$Message.error('请选择具体队伍进行编辑')
                } else{
                    this.changeEditStatus(false)
                }
            },
            // getTeamDetail (teamDetail) {
            //     if(!teamDetail.region){
            //         teamDetail.region = {
            //             "id": null,
            //             "name": ''
            //         }
            //     }
            //     if(!teamDetail.dutyOrg){
            //         teamDetail.dutyOrg = {
            //             "id": null,
            //             "name": ''
            //         }
            //     }
            //     if(!teamDetail.affiliationOrg){
            //         teamDetail.affiliationOrg = {
            //             "id": null,
            //             "name": ''
            //         }
            //     }
            //     //队伍详细数据绑定
            //     this.team_info = teamDetail;
            // },
            team_Edit_Save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //队伍信息保存修改
                        let teamEditInfo = this.team_info;
                        if(teamEditInfo.id){//修改
                            teamEditInfo.userCode = this.userCode;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/team/editTeam',
                                data: teamEditInfo
                            }).then(
                                response => {
                                    if ( response.data.code === 200 ) {
                                        this.$Message.info('修改成功')
                                        this.changeEditStatus(true)
                                        this.$emit('team-edit',teamEditInfo);
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$Message.error(error)
                                }
                            );
                        } else {//新增
                            let teamAddInfo = this.team_info;
                            teamAddInfo.userCode = this.userCode;
                            teamAddInfo.resTypeId = this.getData;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/team/addTeam',
                                data: teamAddInfo
                            }).then(
                                response => {
                                    if ( response.data.code === 200) {
                                        this.$Message.info('新增成功')
                                        this.changeEditStatus(true)
                                        this.$emit('team-save',response.data);
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$Message.error(error)
                                }
                            )
                        }
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })
            },
            deleteTeamBefore(){
                let teamInfo = this.team_info;
                if(!teamInfo.id){
                    this.$Message.error('请选择具体队伍删除')
                } else{
                    this.delate_info = true
                }
            },
            close_delete_model () {
                //关闭确认删除对话框
                this.delate_info = false;
            },
            team_delete () {
                //删除队伍信息
                let teamDeleteInfo = {
                    userCode: this.userCode,
                    id: this.team_info.id
                }
                axios({
                    method: 'get',
                    url: this.url + '/resource/team/removeTeam',
                    params: teamDeleteInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            //通知父组件重新查询数据
                            this.$emit('team-delete-sucess',teamDeleteInfo);
                            //成功消息提示
                            this.$Message.info('删除成功');
                            this.saveTeamDetailData('');//清空队伍详情缓存
                            this.delate_info = false;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error);
                    }
                );
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            close_team () {
                this.$refs['formCustom'].resetFields();
                if(!this.team_info.id){
                    this.changeEditStatus(true);
                    return
                }
                let teamInfo = {
                        userCode: this.userCode,
                        id: this.team_info.id
                    }
                    axios({
                        method: 'get',
                        url: this.url + '/resource/team/getTeamDetail',
                        params: teamInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                 //查询避险场所详情
                                this.changeEditStatus(true);
                                this.saveTeamDetailData(response.data.data);
                            }
                        }
                    ).catch(
                        error => {
                            this.$Message.error(error);
                        }
                    )
            },
            open_region(){
                let TreeInfo = {
                    title: '选择行政区域',
                    treeMultiple: false,
                    additional: 'area',
                    request: 'post',
                    queryInfo: {
                    userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryRegionTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeModal = true;
            },
             open_dutyOrg(){
                let TreeInfo = {
                    title: '选择单位',
                    treeMultiple: false,
                    additional: 'dutyOrg',
                    request: 'post',
                    queryInfo: {
                    userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryOrgTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeModal = true;
            },
             open_affiliationOrg(){
                let TreeInfo = {
                    title: '选择单位',
                    treeMultiple: false,
                    additional: 'affiliationOrg',
                    request: 'post',
                    queryInfo: {
                    userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryOrgTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeModal = true;
            },
            treeModalSave(data,type){
                if(type === 'area'){
                    this.team_info.region.id = data[0].id;
                    this.team_info.region.name = data[0].title;
                    this.$refs.formCustom.validateField('region', valid => {
                    });
                }else if(type === 'dutyOrg'){
                    this.team_info.dutyOrg.id = data[0].id;
                    this.team_info.dutyOrg.name = data[0].title;
                }else if(type === 'affiliationOrg'){
                    this.team_info.affiliationOrg.id = data[0].id;
                    this.team_info.affiliationOrg.name = data[0].title;
                }
                this.treeModalClose();
                
            },
            treeModalClose(){
                this.treeModal = false;
            },
            setBuildDate(data){
                this.team_info.buildDate = data;
            },
            resetFrom () {
                this.$refs['formCustom'].resetFields();
            }
        }
	}
</script>

<style>
    .ds-hospital-table{
        background: #fff;
        margin: 0 10px 0 10px;
    }
    .ds-hospital-table table thead tr{
        height: 40px;
        background: #f8f8f9;
    }
    .ds-hospital-table table tbody tr{
        height: 40px;
    }
    .ds-hospital-table td{
        width: 50%;
        padding-left: 10px;
    }
    .ivu-icon{
        font-size: 20px;
    }
    .ds-info-list{
        text-align: right;
        padding-right: 20px;
    }

    .ds-show-action{
        text-align:right;
        position: relative;
        padding-right: 20px;
        line-height: 30px;
    }
    .ds-show-more{
        position: absolute;
        animation:myshowmore 1s infinite;
        -webkit-animation:myshowmore 1s infinite;
    }
    @keyframes myshowmore
    {
    from {opacity: 1;top:-5px;}
    to {opacity: 0;top:5px;}
    }

    @-webkit-keyframes myshowmore /*Safari and Chrome*/
    {
    from {opacity: 1;top:-5px;}
    to {opacity: 0;top:5px;}
    }
    .ds-show-less{
        position: absolute;
        animation:myshowless 1s infinite;
        -webkit-animation:myshowless 1s infinite;
    }
    @keyframes myshowless
    {
    from {opacity: 1;top: 8px;}
    to {opacity: 0;top: -5px;}
    }

    @-webkit-keyframes myshowless /*Safari and Chrome*/
    {
    from {opacity: 1;top: 8px;}
    to {opacity: 0;top: -5px;}
    }
</style>