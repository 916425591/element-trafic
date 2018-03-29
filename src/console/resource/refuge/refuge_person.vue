<template>
    <div class="ds-widget-box ds-hospital-table">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>避险场所管理信息</h2>
        </div>
        <Row class="ds-person-body" :style='height' :data-json="tableHeight">
            <i-col span="8">
                <div class="ds-content-box">
                    <Modal v-model="set_duty_confirm" :mask-closable="false" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认设置主管单位
                        </p>
                        <div style="text-align:center">
                            设置主管单位需重新设置负责人与联络员
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="ghost" @click="closeSetDutyConfirmModal">取消</Button>
                            <Button size="large" type="primary" @click="openSetDutyConfirmModal">确定</Button>
                        </div>
                    </Modal>
                    <div v-if="show_refuge_no_competent" class="ds-align-center" @click="openTreeModal">
                        <Row class="ds-content-person">
                            <i-col span="24" class="ds-content-title">
                                主管单位
                            </i-col>
                        </Row>
                        <div class="ds-content-main" :style="height2">
                            <Icon type="ios-home-outline" class="ds-bg-icon ds-green" size="55"></Icon>
                            <p class="ds-person-p">您还没有设置主管单位</p>
                        </div>
                    </div>
                    <div v-if="show_refuge_competent">
                        <div class="ds-pointer" @click="set_duty_confirm = true">
                            <Row class="ds-content-person">
                                <i-col span="24" class="ds-content-title">
                                    主管单位
                                </i-col>
                            </Row>
                            <div class="ds-content-main"  :style="height2">
                                <Icon type="ios-home-outline" class="ds-bg-icon ds-green" size="55"></Icon>
                                <p>{{ refuge_competent }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ds-content-box">
                    <div v-if="show_refuge_no_leader" class="ds-align-center" @click="openTablePrincipalModal">
                        <Row class="ds-content-person">
                            <i-col span="24" class="ds-content-title">
                                负责人
                            </i-col>
                        </Row>
                        <div class="ds-content-main"  :style="height2">
                            <Icon type="person" class="ds-bg-icon ds-orange" size="55"></Icon>
                            <p class="ds-person-p">您还没有设置负责人</p>
                        </div>
                    </div>
                    <div v-if="show_refuge_leader">
                        <div class="ds-pointer" @click="openTablePrincipalModal">
                            <Row class="ds-content-person">
                                <i-col span="24" class="ds-content-title">
                                    负责人
                                </i-col>
                            </Row>
                            <div class="ds-content-main" :style="height2">
                                <Icon type="person" class="ds-bg-icon ds-orange" size="55"></Icon>
                                <p>{{ refuge_manager_name }}</p>
                                <p>{{ refuge_manager_tel }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col span="16">
                <div class="ds-charge-bottom">
                    <div class="ds-content-box" style="min-height:224px;">
                        <div class="ds-content-title">
                            联络员列表
                            <Button type="success" @click="openTableContacterModal" style="float:right;margin:2px 2px;">新增</Button>
                        </div>
                        <div class="ds-content-main"  :style="height3">
                            <!--<span>没有联络员，请点击添加联络员</span> -->
                            <Table border :columns="contactersColumns" :data="content_person_list" highlight-row></Table>
                        </div>
                    </div>
                </div>
            </i-col>
        </Row>
        <refuge-tree v-if="treeModal" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></refuge-tree>
        <refuge-list v-if="tableMode" @table-close-Modal="tableModalClose" @table-save-Modal="tableModalSave"></refuge-list>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import refugePersonAdd from '../person/person_add'
    import refugePersonEdit from '../person/person_edit'
    import refugeTree from '@/common/components/treeModal/tree'
    import refugeList from '@/common/components/tableModal/tableList'
    import Cookies from 'js-cookie'; 

    export default {
        components: {
            refugePersonAdd,
            refugePersonEdit,
            refugeTree,
            refugeList
        },
        data () {
            return {
                height: {
                    height: ''
                },
                height2: {
                    height: ''
                },
                height3:{
                     height: '',
                    'overflow-y': 'scroll'
                },
                set_duty_confirm: false,
                treeModal: false,//树窗口
                tableMode: false,//table窗口
                refuge_id: '',
                person_edit: false,
                person_add: false,
                charge_cover: false,
                secondary_charge_cover: false,
                first_charge_cover: false,
                charge_cover: false,
                show_refuge_no_competent: true,//是否显示无主管单位
                show_refuge_no_leader: true,//是否显示无负责人
                show_refuge_competent: false,//是否显示主管单位
                show_refuge_leader: false,//是否显示负责人
                refuge_setting_company: true,
                refuge_setting_person: false,
                save_type: '',
                refuge_competent: '',
                content_person_list: [],
                person_title: '人员修改',
                person_setting_title: '设置负责人',
                refuge_manager_name: '',
                refuge_manager_tel: '',
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
                                        this.content_delete(params.row.id)
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
                ]
            }
        },
        computed: {
            getDetail () {
                return this.$store.state.refuge.refugeDetail
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfo.tableHeight
                this.height.height = height + '!important' /*定义好的父框体高度*/
                this.height2.height = (parseInt(height) -110)/2 + 'px'
                 this.height3.height = (parseInt(height)-60)+ 'px'
                return this.height.height
            }
        },
        watch: { 
            
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(340)
        },
        methods: {
            ...mapActions([
                'saveResourceTypeTree',
                'setTabelModalInfo',
                'saveDemoData',
                'saveRefugeDutyOrgId',
                'setHeightContent',
                'tableHeightMessage'
            ]),
            openSetDutyConfirmModal() {
                this.set_duty_confirm = false;
                this.openTreeModal();
            },
            closeSetDutyConfirmModal() {
                this.set_duty_confirm = false;
            },
            openTreeModal () {
                const refugeDetail = this.getDetail;
                if(refugeDetail && refugeDetail.id){
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
                }else{
                    this.$Message.error('请先添加避险场所基本信息')
                }
            },
            openTablePrincipalModal () {
                const refugeDetail = this.getDetail;
                if(refugeDetail.dutyOrg && refugeDetail.dutyOrg.id){
                    let tableInfo = {
                        url: this.url + '/platform/person/queryPerson4Maintain',
                        title:"设置负责人",
                        params:{userCode: this.userCode,orgId: refugeDetail.dutyOrg.id},
                        additional:"principal",
                        multipleStatus: false
                    }
                    this.setTabelModalInfo(tableInfo);
                    this.tableMode = true;
                } else{
                    this.$Message.error('请先设置避险场所主管单位')
                }
            },
            openTableContacterModal () {
                const refugeDetail = this.getDetail;
                if(refugeDetail.dutyOrg && refugeDetail.dutyOrg.id){
                    let tableInfo = {
                        url: this.url + '/platform/person/queryPerson4Maintain',
                        title:"设置联络人",
                        params:{userCode: this.userCode,orgId: refugeDetail.dutyOrg.id},
                        additional:"contacter",
                        multipleStatus:true
                    }
                    this.setTabelModalInfo(tableInfo);
                    this.tableMode = true;
                } else{
                    this.$Message.error('请先设置避险场所主管单位')
                }
            },
            treeModalClose () {
                //关闭tree弹框
                this.treeModal = false;
            },
            treeModalSave (treeInfo,type) {
                //保存主管单位
                let refugeDetail = this.getDetail;
                let refugeId = refugeDetail.id
                let dutyOrgInfo = {
                    userCode: this.userCode,
                    id: refugeId,
                    dutyOrg: {
                        id: treeInfo[0].id
                    }
                }
                axios({
                    method: 'post',
                    url: this.url + '/resource/refuge/setDutyOrg',
                    data: dutyOrgInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('主管单位设置成功')
                            this.refuge_competent = treeInfo[0].title;
                            this.show_refuge_no_competent = false;
                            this.show_refuge_competent = true;
                            //需重新设置负责人
                            this.show_refuge_no_leader = true;
                            this.show_refuge_leader = false;
                            //需重新设置联络员
                            this.content_person_list = refugeDetail.contacters || [];

                            this.treeModal = false;
                            this.saveRefugeDutyOrgId(treeInfo[0].id);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
                
            },
            tableModalClose () {
                this.tableMode = false;
            },
            tableModalSave (tableInfo,type) {
                if (type === 'principal') {
                    let refugeDetail = this.getDetail;
                    let refugeId = refugeDetail.id;
                    let principalInfo = {
                        userCode: this.userCode,
                        id: refugeId,
                        principal: {
                            id: tableInfo[0].id,
                            name: tableInfo[0].name,
                            mobile: tableInfo[0].mobile
                        }
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/resource/refuge/setPrincipal',
                        data: principalInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.info('负责人设置成功')
                                this.show_refuge_no_leader = false;
                                this.show_refuge_leader = true;
                                this.refuge_manager_name = tableInfo[0].name;
                                this.refuge_manager_tel = tableInfo[0].mobile;
                                this.tableMode = false;
                            }
                        }
                    ).catch(
                        error => {
                            this.$Message.error(error)
                        }
                    )
                }
                if ( type === 'contacter') {
                    let refugeDetail = this.getDetail;
                    let refugeId = refugeDetail.id;
                    let personIdList = [];
                    for (let i=0;i<tableInfo.length;i++) {
                        personIdList.push(tableInfo[i].id);
                    }
                    let contactersInfo = {
                        userCode: this.userCode,
                        refugeId: refugeId,
                        contacters: personIdList
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/resource/refuge/setContacters',
                        data: contactersInfo
                    }).then(
                        response => {
                            console.log(tableInfo.length,'tableInfo')
                            if ( response.data.code === 200 ) {
                                let contactersList = this.content_person_list || [];
                                let children = this.content_person_list || [];
                                console.log(tableInfo)
                                console.log(contactersList)
                                for(var i = 0; i < tableInfo.length; i++) {
                                    var flag = false;
                                    for(var j = 0; j < contactersList.length; j++) {
                                        if(contactersList[j].id == tableInfo[i].id) {
                                            flag = true;
                                            break;
                                        }
                                    }
                                    if(!flag) {
                                        children.push({
                                            mobile: tableInfo[i].mobile,
                                            name: tableInfo[i].name,
                                            id: tableInfo[i].id
                                        });
                                    }
                                }
                                this.$set(this,'content_person_list',children);
                                // this.show_refuge_no_contenter = false;
                                // this.show_refuge_contenter = true;                          
                                this.tableMode = false;
                            }
                        }
                    ).catch(
                        error => {
                            this.$Message.error(error)
                        }
                    );
                }
            },
            getRefuge_mangement_info (refugeDetail) {
                //展示管理信息
                var refugeMangeInfo = refugeDetail;
                
                if ( !refugeMangeInfo.dutyOrg ) {
                    this.show_refuge_no_competent = true;
                    this.show_refuge_competent = false;
                } else {
                    let dutyOrgName =  refugeMangeInfo.dutyOrg.name || '';
                    this.show_refuge_no_competent = false;
                    this.refuge_competent = dutyOrgName;
                    this.show_refuge_competent = true;
                };
                if ( !refugeMangeInfo.principal ) {
                    this.show_refuge_no_leader = true;
                    this.show_refuge_leader = false;
                } else {
                    let principalName = refugeMangeInfo.principal.name || '';
                    let principalMobile = refugeMangeInfo.principal.mobile || '';
                    this.show_refuge_no_leader = false;
                    this.refuge_manager_name = principalName;
                    this.refuge_manager_tel = principalMobile;
                    this.show_refuge_leader = true;
                };
                if ( refugeMangeInfo.contacters ) {
                    // this.show_refuge_no_contenter = false;
                    // this.show_refuge_contenter = true;
                    this.content_person_list = refugeMangeInfo.contacters;
                } else {
                    // this.show_refuge_no_contenter = true;
                    // this.show_refuge_contenter = false;
                    this.content_person_list = refugeMangeInfo.contacters || [];
                }
            },
            content_delete (contentId) {
                //删除联系人员
                let refugeDetail = this.getDetail;
                let refugeId = refugeDetail.id;
                axios({
                    method: 'post',
                    url: this.url + '/resource/refuge/removeContacters',
                    data: {
                        userCode: this.userCode,
                        id: contentId,
                        resourceId: refugeId
                    }
                }).then(
                    response => {
                        if ( response.data.code === 200) {
                            this.$Message.info('删除成功')
                            let content_person_list = this.content_person_list;
                            for (var i = 0; i<content_person_list.length;i++) {
                                if ( content_person_list[i].id == contentId) {
                                    content_person_list.splice(i,1);
                                }
                            }
                            // if ( content_person_list.length == 0 ) {
                            //     this.show_refuge_no_contenter = true;
                            //     this.show_refuge_contenter = false;
                            // }
                        }
                        
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            addCompanyInfo () {
                //隐藏管理信息展示
                this.show_refuge_no_competent = true;
                this.show_refuge_competent = false;
                this.show_refuge_no_leader = true;
                this.show_refuge_leader = false;
                // this.show_refuge_no_contenter = true;
                // this.show_refuge_contenter = false;
            }
        }
    }
</script>

<style scope>
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
</style>