<template>
    <div class="ds-widget-box ds-hospital-table">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>队伍管理信息</h2>
        </div>
        <Row  class="ds-person-table" :style='height' :data-json="tableHeight">
            <i-col span="12" style="padding:5px;">
                <Row>
                    <i-col span="12" class="">
                        <div v-if="show_team_no_competent" class="ds-content-box ds-align-center" @click="openTreeOrgModal">
                            <Row class="ds-content-person">
                                <i-col span="24" class="ds-content-title">
                                    主管单位
                                </i-col>
                            </Row>
                            <div class="ds-content-main" :style="height1">
                                <Icon type="ios-home-outline" class="ds-bg-icon ds-green" size="33"></Icon>
                                <p class="ds-person-p">您还没有设置主管单位</p>
                            </div>
                        </div>
                        <div v-if="show_team_competent">
                            <div>
                                <div class="ds-content-box ds-pointer" @click="openTreeOrgModal">
                                    <Row class="ds-content-person">
                                        <i-col span="24" class="ds-content-title">
                                            主管单位
                                        </i-col>
                                    </Row>
                                    <div class="ds-content-main">
                                        <Icon type="ios-home-outline" class="ds-bg-icon ds-green" size="33"></Icon>
                                        <p>{{ team_competent }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="12" class="">
                        <div v-if="show_team_no_leader" class="ds-align-center ds-content-box" @click="openTablePrincipalModal">
                            <Row class="ds-content-person">
                                <i-col span="24" class="ds-content-title">
                                    负责人
                                </i-col>
                            </Row>
                            <div class="ds-content-main" :style="height1">
                                <Icon type="person" class="ds-bg-icon ds-orange" size="33"></Icon>
                                <p class="ds-person-p">您还没有设置负责人</p>
                            </div>
                        </div>
                        <div v-if="show_team_leader">
                            <div class="ds-content-box ds-pointer" @click="openTablePrincipalModal">
                                <Row class="ds-content-person">
                                    <i-col span="24" class="ds-content-title">
                                        负责人
                                    </i-col>
                                </Row>
                                <div class="ds-content-main">
                                    <Icon type="person" class="ds-bg-icon ds-orange" size="33"></Icon>
                                    <p>{{ team_manager_name }}</p>
                                    <p>{{ team_manager_tel }}</p>
                                </div>
                            </div>
                        </div>
                    </i-col>
                </Row>
                <div class="ds-align ds-person-box ds-charge-bottom">
                    <div class="ds-content-box">
                        <Row class="ds-content-person">
                            <div class="ds-content-title">
                                联络员列表
                                <Button type="success" @click="openTableContacterModal" style="float:right;margin:2px 2px;">新增</Button>
                            </div>
                        </Row>
                        <div class="ds-contenter-list">
                            <div class="ds-contenter-list" :style="height2">
                                <Table border :columns="contactersColumns" :data="content_person_list" highlight-row></Table>
                            </div>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col span="12">
                <div style="margin: 10px;" :style="height3">
                    <Row class="ds-content-person">
                        <div class="ds-align-center">
                            队伍成员列表
                            <div style="float:right;margin:2px 2px;">
                                <i-input v-model="teamMemberName" icon="ios-search" @on-enter="search_teamMember" @on-click="search_teamMember" style="width: 200px;"></i-input>
                                <Button type="success" @click="openTableMembersModal">新增</Button>
                            </div>
                        </div>
                    </Row>
                    <Table border :columns="columns7" :data="teamMember" ref="table" highlight-row @on-row-dblclick="check_person" v-if="show_person_list"></Table>
                    <div class="ds-page-body" v-if="totalNum > pageSize">
                        <Page :total="totalNum" :page-size="pageSize" @on-change="pageSearch" show-total class="ds-page-right"></Page>
                    </div>
                </div>
                <Modal v-model="person_edit" :mask-closable="false" width="800">
                    <p slot="header" style="color:#f60;text-align:center">
                        <span>{{ person_title }}</span>
                    </p>
                    <div style="text-align:center">
                        <team-person-edit @member-delete="memberDelete" ref="teamPersonEdit"></team-person-edit>
                    </div>
                    <div slot="footer">

                    </div>
                </Modal>
                <Modal v-model="person_add" :mask-closable="false" width="800">
                    <p slot="header" style="color:#f60;text-align:center">
                        <span>人员新增</span>
                    </p>
                    <div style="text-align:center">
                        <team-person-add @close-modal="close_modal" ref="teamPersonAdd"></team-person-add>
                    </div>
                    <div slot="footer">

                    </div>
                </Modal>
                <Modal v-model="person_charge" :mask-closable="false" width="800">
                    <p slot="header" style="color:#f60;text-align:center">
                        <span>{{ person_setting_title }}</span>
                    </p>
                    <div style="text-align:center">
                        <team-setting-company v-if="team_setting_company" v-bind="company_setting_info" ref="teamSettingCompany" @company-save-sucess="team_save_sucess"></team-setting-company>
                        <team-setting-person v-if="team_setting_person" ref="teamSettingPerson" v-bind="setting_info" @person-save-sucess="team_save_sucess"></team-setting-person>
                    </div>
                    <div slot="footer" class="ds-align-center">
                        <Button size="large" type="ghost" @click="close_manage_modal">取消</Button>
                        <Button size="large" type="primary" @click="save_manage">确定</Button>
                    </div>
                </Modal>
            </i-col>
        </Row>
        <team-tree v-if="treeModal" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave" @on-cancel="tableModalClose"></team-tree>
        <team-list v-if="tableMode" @table-close-Modal="tableModalClose" @table-save-Modal="tableModalSave"  @on-cancel="tableModalClose"></team-list>

    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import teamPersonAdd from '../person/person_add'
    import teamPersonEdit from '../person/person_edit'
    import teamSettingCompany from '../person/person_setting_company'
    import teamSettingPerson from '../person/person_setting_management'
    import teamTree from '@/common/components/treeModal/tree'
    import teamList from '@/common/components/tableModal/tableList'
    import Cookies from 'js-cookie';

    export default {
        components: {
            teamPersonAdd,
            teamPersonEdit,
            teamSettingCompany,
            teamSettingPerson,
            teamTree,
            teamList
        },
        data () {
            return {
                height: {
                    height: ''
                },
                height1: {
                    height: ''
                },
                height2: {
                    height: '',
                    'overflow-y': 'scroll'
                },
                height3:{
                     height: ''
                },
                delate_contacter: false,
                team_id: '',
                pageNum: 1,
                totalNum: null,
                pageShow: false,
                show_no_person: false,//是否展示无人员提示
                show_person_list: true,//是否展示人员列表
                treeModal: false,//是否展示tree弹框
                tableMode: false,//是否展示table弹框
                person_edit: false,
                person_add: false,
                person_charge: false,
                charge_cover: false,
                secondary_charge_cover: false,
                first_charge_cover: false,
                charge_cover: false,
                show_team_no_competent: true,//是否显示无主管单位
                show_team_no_leader: true,//是否显示无负责人
                show_team_competent: false,//是否显示主管单位
                show_team_leader: false,//是否显示负责人
                team_competent: '',
                team_manager_name: '',
                team_manager_tel: '',
                team_setting_company: false,
                team_setting_person: false,
                save_type: '',
                currentPage: 1,
                teamId: null,
                teamMemberName: '',
                content_person_list: [],
                person_title: '人员修改',
                person_setting_title: '',
                columns7: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'personName',
                        align: 'center'
                    },
                    {
                        title: '职务',
                        key: 'duty',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 70,
                        render: (h, params) => {
                            return h('div', [
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除这条数据吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        let vm = this
                                        vm.deleteTeamMember(params)
                                    }
                                }
                            }, [
                                h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        size: 'small',
                                        placement: 'top'
                                    }
                                    }, [
                                    h('icon',{
                                        props: {
                                            type: 'trash-a'
                                        }
                                    })
                                ])
                                ])
                            ]);
                        }
                    }
                ],
                contactersColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '手机号码',
                        key: 'mobile',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 70,
                        render: (h, params) => {
                            return h('div', [
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除这条数据吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        console.log('params',params);
                                        this.content_delete(params.row.resourceId)
                                    }
                                }
                            }, [
                                h('Button', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    props: {
                                        size: 'small',
                                        placement: 'top'
                                    }
                                    }, [
                                    h('icon',{
                                        props: {
                                            type: 'trash-a'
                                        }
                                    })
                                ])
                                ])
                            ]);
                        }
                    }
                ],
                setting_info: {},
                company_setting_info: {
                    company_url: 'http://192.168.0.19:8080/getCompany',
                    save_url: 'http://192.168.0.19:8080/teamCompany'
                },
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(351)
        },
        computed: {
            getDetail () {
                return this.$store.state.team.teamDetail
            },
            getData() {
                return this.$store.state.team.resTypeId
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            teamMember() {
                return  this.$store.state.team.memberList
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfo.tableHeight
                console.log('height',height);
                this.height.height = height + '!important' /*定义好的父框体高度*/
                this.height1.height = (parseInt(height) -80)/4 + 'px'
                this.height2.height = (parseInt(height) -120)/4*3-35 + 'px'
                this.height3.height = (parseInt(height)-150)+ 'px'
                return this.height.height
            },
            pageSize() {
                return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
            },
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'setTabelModalInfo',
                'savePersonId',
                'saveTeamDutyOrgId',
                'getTeamMemberList',
                'setHeightContent',
                'tableHeightMessage'
            ]),
            setTeamId (teamId) {
                this.teamId = teamId;
            },
            getTeamMember (memberName,pageNum) {
                //队伍成员查询
                if ( pageNum ) {
                    this.pageNum = pageNum;
                }
                if ( memberName ) {
                    this.teamMemberName = memberName;
                }
                let memberInfo = {
                    userCode: this.userCode,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    name: this.teamMemberName,
                    teamId: this.getDetail.id
                }
                axios({
                    method: 'post',
                    url: this.url + '/resource/team/teamMembersQuery',
                    data: memberInfo
                }).then(
                    response => {
                        if ( response.data.code === 200) {
                            console.log(response)
                            const memberList = response.data.data.list;
                            this.getTeamMemberList(memberList)
                            this.totalNum = response.data.data.total
                        }
                    }
                ).catch(
                    error => {

                    }
                );
            },
            setTotalNumNull() {
                this.totalNum = 0;
            },
            search_teamMember () {
                //查询队伍成员
                let memberName = this.memberName;
                this.getTeamMember(memberName);
            },
            openTreeOrgModal () {
                const teamDetail = this.getDetail;
                if(teamDetail && teamDetail.id){
                    //打开tree弹框
                    let TreeInfo = {
                        title: '设置主管单位',
                        treeMultiple: false,
                        additional: 'companyOrg',
                        request: 'post',
                        queryInfo: {
                            userCode: this.userCode
                        },
                        url: this.url + '/platform/public/queryOrgTree4New'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeModal = true;
                } else{
                    this.$Message.error('请先添加队伍基本信息');
                }
            },
            openTablePrincipalModal () {
                const teamDetail = this.getDetail;
                console.log("teamDetail",teamDetail);
                if(teamDetail.dutyOrg && teamDetail.dutyOrg.id){
                    //打开table弹框
                    let tableInfo = {
                        url: this.url + '/platform/person/queryPerson4Maintain',
                        title:"设置负责人",
                        params:{userCode: this.userCode,orgId: teamDetail.dutyOrg.id},
                        additional:"principal",
                        multipleStatus: false
                    }
                    this.setTabelModalInfo(tableInfo);
                    this.tableMode = true;
                } else{
                    this.$Message.error('请先设置队伍主管单位');
                }
            },
            openTableContacterModal () {
                const teamDetail = this.getDetail;
                if(teamDetail.dutyOrg && teamDetail.dutyOrg.id){
                    let tableInfo = {
                        url: this.url + '/platform/person/queryPerson4Maintain',
                        title:"设置联络人",
                        params:{userCode: this.userCode,orgId: teamDetail.dutyOrg.id},
                        additional:"contacter",
                        multipleStatus:true,
                    }
                    this.setTabelModalInfo(tableInfo);
                    this.tableMode = true;
                } else{
                    this.$Message.error('请先设置队伍主管单位');
                }
            },
            treeModalClose () {
                //关闭tree弹框
                this.treeModal = false;
            },
            tableModalClose () {
                //关闭table弹框
                this.tableMode = false;
            },
            treeModalSave (treeInfo) {
                //保存主管单位
                let teamDetail = this.getDetail;
                let teamId = teamDetail.id;
                let dutyOrgInfo = {
                    userCode: this.userCode,
                    id: teamId,
                    dutyOrg: {
                        id: treeInfo[0].id
                    }
                }
                axios({
                    method: 'post',
                    url: this.url + '/resource/team/setDutyOrg',
                    data: dutyOrgInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('主管单位设置成功');
                            this.team_competent = treeInfo[0].title;
                            this.show_team_no_competent = false;
                            this.show_team_competent = true;
                            this.company_setting_info.id = this.team_id;
                            this.treeModal = false;
                            this.saveTeamDutyOrgId(treeInfo[0].id);
                        }
                    }
                ).catch(
                    error => {

                    }
                );
            },
            openTableMembersModal () {
                const teamDetail = this.getDetail;
                if(teamDetail && teamDetail.id){
                    //打开table弹框
                    let tableInfo = {
                        url: this.url + '/platform/person/queryPerson4Maintain',
                        title:"新增队伍人员",
                        params:{userCode: this.userCode,orgId: teamDetail.dutyOrg.id},
                        additional:"members",
                        multipleStatus: true
                    }
                    this.setTabelModalInfo(tableInfo);
                    this.tableMode = true;
                } else{
                    this.$Message.error('请先添加队伍基本信息');
                }
            },
            tableModalSave (tableInfo,type) {
                if (type === 'principal') {
                    let teamDetail = this.getDetail;
                    let teamId = teamDetail.id;
                    let orgInfo = {
                        userCode: this.userCode,
                        id: teamId,
                        principal: {
                            id: tableInfo[0].id,
                            name: tableInfo[0].name,
                            mobile: tableInfo[0].mobile
                        }
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/resource/team/setPrincipal',
                        data: orgInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.error('负责人设置成功');
                                this.show_team_no_leader = false;
                                this.show_team_leader = true;
                                this.team_manager_name = tableInfo[0].name;
                                this.team_manager_tel = tableInfo[0].mobile;
                                this.tableMode = false;
                            }

                        }
                    ).catch(
                        error => {
                            this.$Message.error(error);
                        }
                    );
                }
                if ( type === 'contacter') {
                    let teamDetail = this.getDetail;
                    let teamId = teamDetail.id;
                    let personIdList = [];
                    for (let i=0;i<tableInfo.length;i++) {
                        personIdList.push(tableInfo[i].id);
                    }
                    let contactersInfo = {
                        userCode: this.userCode,
                        teamId: teamId,
                        contacters: personIdList
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/resource/team/setContacters',
                        data: contactersInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.info('联系人员设置成功');
                                let contactersList = this.content_person_list || [];
                                let children = this.content_person_list || [];
                                for(var i = 0; i < tableInfo.length; i++) {
                                    var flag = false;
                                    for(var j = 0; j < contactersList.length; j++) {
                                        if(contactersList[j].resourceId == tableInfo[i].id) {
                                            flag = true;
                                            break;
                                        }
                                    }
                                    if(!flag) {
                                        children.push({
                                            mobile: tableInfo[i].mobile,
                                            name: tableInfo[i].name,
                                            resourceId: tableInfo[i].id,
                                            id: tableInfo[i].id
                                        });
                                    }
                                }
                                this.$set(this,'content_person_list',children);
                                this.tableMode = false;
                            }
                        }
                    ).catch(
                        error => {

                        }
                    )
                }
                if ( type === 'members') {
                    let teamDetail = this.getDetail;
                    let teamId = teamDetail.id;
                    let personIdList = [];
                    for (let i=0;i<tableInfo.length;i++) {
                        personIdList.push(tableInfo[i].id);
                    }
                    let membersInfo = {
                        userCode: this.userCode,
                        teamId: teamId,
                        members: personIdList
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/resource/team/addTeamPersons',
                        data: membersInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.info('设置成功');
                                this.getTeamMember();
                                this.tableMode = false;
                            }
                        }
                    ).catch(
                        error => {

                        }
                    )
                }
            },
            charge () {
                this.person_setting_title = '设置主管单位';
                this.team_setting_company = true;
                this.team_setting_person = false;
                this.person_charge = true;
                this.save_type = 'company';
                this.company_setting_info.id = this.team_id;
            },
            first_charge () {
                this.person_setting_title = '设置负责人';
                this.person_charge = true;
                this.team_setting_company = false;
                this.team_setting_person = true;
                this.save_type = 'manager';
                this.setting_info = {
                    id: this.team_id,
                    get_url: 'http://192.168.0.19:8080/PersonList',
                    save_url: 'http://192.168.0.19:8080/teamSetManager'
                }
            },
            secondary_charge () {
                this.person_setting_title = '设置联络人员';
                this.person_charge = true;
                this.team_setting_company = false;
                this.team_setting_person = true;
                this.save_type = 'contenter';
                this.setting_info = {
                    id: this.team_id,
                    get_url: 'http://192.168.0.19:8080/PersonList',
                    save_url: 'http://192.168.0.19:8080/teamSetContenter'
                }
            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            personAdd () {
                this.$refs.teamPersonAdd.setTeamId(this.teamId);
                this.person_edit = false;
                this.person_add = true;
            },
            exportPerson () {
                this.$refs.table.exportCsv({
                    filename: '人员信息'
                });
            },
            check_person (data,index) {
                console.log('data',data)
                this.person_edit = true;
                this.person_title = '人员详情';
                this.savePersonId(data);
                this.$refs.teamPersonEdit.queryMember(data);
            },
            close_modal () {
                this.person_add = false;
            },
            charge_add_cover () {
                this.charge_cover = true;
            },
            charge_remove_cover () {
                this.charge_cover = false;
            },
            first_charge_add_cover () {
                this.first_charge_cover = true;
            },
            first_charge_remove_cover () {
                this.first_charge_cover = false;
            },
            secondary_charge_add_cover () {
                this.secondary_charge_cover = true;
            },
            secondary_charge_remove_cover () {
                this.secondary_charge_cover = false;
            },
            getTeam_mangement_info (teamDetail) {
                //展示管理信息
                var teamMangeInfo = teamDetail;
                console.log(teamMangeInfo)
                if ( !teamMangeInfo.dutyOrg ) {
                    this.show_team_no_competent = true;
                    this.show_team_competent = false;
                } else {
                    let dutyOrgName =  teamMangeInfo.dutyOrg.name || '';
                    this.show_team_no_competent = false;
                    this.team_competent = dutyOrgName;
                    this.show_team_competent = true;
                };
                if ( !teamMangeInfo.principal ) {
                    this.show_team_no_leader = true;
                    this.show_team_leader = false;
                } else {
                    let principalName = teamMangeInfo.principal.name || '';
                    let principalMobile = teamMangeInfo.principal.mobile || '';
                    this.show_team_no_leader = false;
                    this.team_manager_name = principalName;
                    this.team_manager_tel = principalMobile;
                    this.show_team_leader = true;
                };
                if ( teamMangeInfo.contacters ) {
                    this.content_person_list = teamMangeInfo.contacters;
                } else {
                    this.content_person_list = teamMangeInfo.contacters || [];
                }
            },
            close_delete_model(){
                this.delate_contacter = false;
            },
            content_delete (contentId) {
                //删除联系人员
                let teamDetail = this.getDetail;
                let teamId = teamDetail.id;
                axios({
                    method: 'post',
                    url: this.url + '/resource/team/removeContacters',
                    data: {
                        userCode: this.userCode,
                        id: contentId,//联系人id
                        resourceId: teamId//队伍id
                    }
                }).then(
                    response => {
                        if ( response.data.code === 200) {
                            this.$Message.info('删除成功');
                            this.delate_contacter = false;
                            let content_person_list = this.content_person_list;
                            for (var i = 0; i<content_person_list.length;i++) {
                                if ( content_person_list[i].resourceId == contentId) {
                                    content_person_list.splice(i,1);
                                }
                            }
                        }
                    }
                ).catch(
                    error => {

                    }
                );

            },
            close_manage_modal () {
                //关闭设置模态窗口
                this.person_charge = false;
            },
            save_manage () {
                if ( this.save_type == 'company' ) {
                    this.$refs.teamSettingCompany.save_company();
                } else if ( this.save_type == 'manager' || this.save_type == 'contenter' ) {
                    this.$refs.teamSettingPerson.save_manager();
                }
            },
            team_save_sucess (companyData) {
                if ( this.save_type == 'company' ) {
                    this.show_team_no_competent = false;
                    this.team_competent = companyData.name;
                    this.show_team_competent = true;
                    this.person_charge = false;
                } else if ( this.save_type == 'manager' ) {
                    this.show_team_no_leader = false;
                    this.team_manager_name = companyData.name;
                    this.team_manager_tel = companyData.phone;
                    this.show_team_leader = true;
                    this.person_charge = false;
                } else if ( this.save_type == 'contenter' ) {
                    this.person_charge = false;
                    //添加联络新联络人员
                    let contentPersonList = this.content_person_list;
                    contentPersonList.push({
                        id: companyData.id,
                        name: companyData.name,
                        tel: companyData.phone
                    })
                    this.$set(this, 'content_person_list', contentPersonList);
                }
            },
            memberDelete (deleteInfo) {
                //成员删除成功
                this.person_edit = false;
                this.getTeamMember();
                // let membersList = this.teamMember;
                // for ( let i = 0; i < membersList.length;i++) {
                //     if ( membersList[i].personId === deleteInfo.personId ) {
                //         console.log(membersList[i])
                //         membersList.splice(i,1);
                //     }
                // }
                // this.person_edit = false;
                // this.teamMember = membersList;
            },
            pageSearch (pageNum) {
                //分页查询
                this.getTeamMember('',pageNum);
            },
            addCompanyInfo () {
                //隐藏管理信息展示
                this.show_team_no_competent = true;
                this.show_team_competent = false;
                this.show_team_no_leader = true;
                this.show_team_leader = false;
                this.getTeamMemberList([])
                this.pageShow  = false;
            },
            deleteTeamMember(params){
                console.log(params)
                //删除了人员
                let personInfo = {
                    userCode: this.userCode,
                    teamId: params.row.teamId,
                    personId: params.row.personId
                }
                axios({
                    method: 'post',
                    url: this.url + '/resource/team/removeTeamPerson',
                    data: personInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('删除成功');
                            this.teamMember.splice(params.index,1);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error);
                    }
                );
            }
        }
    }
</script>

<style>
    .ds-person-bg{
        height: 50px;
    }
    .ds-align{
        text-align: center;
    }
    .ds-middle{
        vertical-align: middle;
    }
    .ds-person-box{
        padding: 15px 0;
    }
    .ds-person-p{
        line-height: 30px;
    }
    .ds-noPerson-box{
        padding-top: 20px;
    }
    .ds-no-person{
        width: 350px;
        margin: 0 auto;
    }
    .ds-bg-icon{
        font-size: 40px;
    }
    .ds-green{
        color: rgb(69, 226, 40);
    }
    .ds-orange{
        color: rgb(206, 174, 63);
    }
    .ds-blue{
        color: rgb(29, 172, 239);
    }
    .ds-violet{
        color: rgb(109, 48, 216);
    }
    .ds-charge-bottom{
        position: relative;
    }
    .ds-cover{
        z-index: 2;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #333;
        opacity: 0.4;
        text-align: center;
        line-height: 80px;
    }
    .ds-content-box {
        margin: 5px;
    }
</style>
