<template>
    <div class="ds-widget-box ds-hospital-table">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>物资管理信息</h2>
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
                    <div v-if="show_material_no_competent" class="ds-align-center" @click="openTreeModal">
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
                    <div v-if="show_material_competent">
                        <div class="ds-pointer" @click="set_duty_confirm = true">
                            <Row class="ds-content-person">
                                <i-col span="24" class="ds-content-title">
                                    主管单位
                                </i-col>
                            </Row>
                            <div class="ds-content-main" :style="height2">
                                <Icon type="ios-home-outline" class="ds-bg-icon ds-green" size="55"></Icon>
                                <p>{{ material_competent }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ds-content-box">
                    <div v-if="show_material_no_leader" class="ds-align-center" @click="openTablePrincipalModal">
                        <Row class="ds-content-person">
                            <i-col span="24" class="ds-content-title">
                                负责人
                            </i-col>
                        </Row>
                        <div class="ds-content-main" :style="height2">
                            <Icon type="person" class="ds-bg-icon ds-orange" size="55"></Icon>
                            <p class="ds-person-p">您还没有设置负责人</p>
                        </div>
                    </div>
                    <div v-if="show_material_leader">
                        <div class="ds-pointer" @click="openTablePrincipalModal">
                            <Row class="ds-content-person">
                                <i-col span="24" class="ds-content-title">
                                    负责人
                                </i-col>
                            </Row>
                            <div class="ds-content-main" :style="height2">
                                <Icon type="person" class="ds-bg-icon ds-orange" size="55"></Icon>
                                <p>{{ material_manager_name }}</p>
                                <p>{{ material_manager_tel }}</p>
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
                        <div class="ds-content-main" :style="height3">
                            <Table border :columns="contactersColumns" :data="content_person_list" highlight-row></Table>
                        </div>
                    </div>
                </div>
            </i-col>
        </Row>
        <material-tree v-if="treeModal" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></material-tree>
        <material-list v-if="tableMode" @table-close-Modal="tableModalClose" @table-save-Modal="tableModalSave"></material-list>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import materialPersonAdd from '../person/person_add'
    import materialPersonEdit from '../person/person_edit'
    import materialTree from '@/common/components/treeModal/tree'
    import materialList from '@/common/components/tableModal/tableList'
    import Cookies from 'js-cookie';

    export default {
        components: {
            materialPersonAdd,
            materialPersonEdit,
            materialTree,
            materialList
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
                material_id: '',
                person_edit: false,
                person_add: false,
                charge_cover: false,
                secondary_charge_cover: false,
                first_charge_cover: false,
                charge_cover: false,
                show_material_no_competent: true,//是否显示无主管单位
                show_material_no_leader: true,//是否显示无负责人
                show_material_competent: false,//是否显示主管单位
                show_material_leader: false,//是否显示负责人
                material_setting_company: true,
                material_setting_person: false,
                save_type: '',
                material_competent: '',
                content_person_list: [],
                person_title: '人员修改',
                person_setting_title: '设置负责人',
                material_manager_name: '',
                material_manager_tel: '',
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
                return this.$store.state.material.materialDetail
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
                'saveMaterialDutyOrgId',
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
                const materialDetail = this.getDetail;
                if(materialDetail && materialDetail.id){
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
                    this.$Message.error('请先添加物资基本信息')
                }
            },
            openTablePrincipalModal () {
                const materialDetail = this.getDetail;
                if(materialDetail.dutyOrg && materialDetail.dutyOrg.id){
                    let tableInfo = {
                        url: this.url + '/platform/person/queryPerson4Maintain',
                        title:"设置负责人",
                        params:{userCode: this.userCode,orgId: materialDetail.dutyOrg.id},
                        additional:"principal",
                        multipleStatus: false
                    }
                    this.setTabelModalInfo(tableInfo);
                    this.tableMode = true;
                } else{
                    this.$Message.error('请先设置物资主管单位')
                }
            },
            openTableContacterModal () {
                const materialDetail = this.getDetail;
                if(materialDetail.dutyOrg && materialDetail.dutyOrg.id){
                    let tableInfo = {
                        url: this.url + '/platform/person/queryPerson4Maintain',
                        title:"设置联络人",
                        params:{userCode: this.userCode,orgId: materialDetail.dutyOrg.id},
                        additional:"contacter",
                        multipleStatus:true
                    }
                    this.setTabelModalInfo(tableInfo);
                    this.tableMode = true;
                } else{
                    this.$Message.error('请先设置物资主管单位')
                }
            },
            treeModalClose () {
                //关闭tree弹框
                this.treeModal = false;
            },
            treeModalSave (treeInfo,type) {
                //保存主管单位
                let materialDetail = this.getDetail;
                let materialId = materialDetail.id
                let dutyOrgInfo = {
                    userCode: this.userCode,
                    id: materialId,
                    dutyOrg: {
                        id: treeInfo[0].id
                    }
                }
                axios({
                    method: 'post',
                    url: this.url + '/resource/material/setDutyOrg',
                    data: dutyOrgInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('主管单位设置成功')
                            this.material_competent = treeInfo[0].title;
                            this.show_material_no_competent = false;
                            this.show_material_competent = true;
                            //需重新设置负责人
                            this.show_material_no_leader = true;
                            this.show_material_leader = false;
                            //需重新设置联络员
                            this.content_person_list = materialDetail.contacters || [];
                            this.treeModal = false;
                            this.saveMaterialDutyOrgId(treeInfo[0].id);
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
                //保存tree选择数据
                if (type === 'principal') {
                    let materialDetail = this.getDetail;
                    let materialId = materialDetail.id;
                    let principalInfo = {
                        userCode: this.userCode,
                        id: materialId,
                        principal: {
                            id: tableInfo[0].id,
                            name: tableInfo[0].name,
                            mobile: tableInfo[0].mobile
                        }
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/resource/material/setPrincipal',
                        data: principalInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.info('负责人设置成功')
                                this.show_material_no_leader = false;
                                this.show_material_leader = true;
                                this.material_manager_name = tableInfo[0].name;
                                this.material_manager_tel = tableInfo[0].mobile;
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
                    let materialDetail = this.getDetail;
                    let materialId = materialDetail.id;
                    let personIdList = [];
                    for (let i=0;i<tableInfo.length;i++) {
                        personIdList.push(tableInfo[i].id);
                    }
                    let contactersInfo = {
                        userCode: this.userCode,
                        materialId: materialId,
                        contacters: personIdList
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/resource/material/setContacters',
                        data: contactersInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                let contactersList = this.content_person_list || [];
                                let children = this.content_person_list || [];
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
            getMaterial_mangement_info (materialDetail) {
                //展示管理信息
                var materialMangeInfo = materialDetail;
                
                if ( !materialMangeInfo.dutyOrg ) {
                    this.show_material_no_competent = true;
                    this.show_material_competent = false;
                } else {
                    let dutyOrgName =  materialMangeInfo.dutyOrg.name || '';
                    this.show_material_no_competent = false;
                    this.material_competent = dutyOrgName;
                    this.show_material_competent = true;
                };
                if ( !materialMangeInfo.principal ) {
                    this.show_material_no_leader = true;
                    this.show_material_leader = false;
                } else {
                    let principalName = materialMangeInfo.principal.name || '';
                    let principalMobile = materialMangeInfo.principal.mobile || '';
                    this.show_material_no_leader = false;
                    this.material_manager_name = principalName;
                    this.material_manager_tel = principalMobile;
                    this.show_material_leader = true;
                };
                if ( materialMangeInfo.contacters ) {
                    this.content_person_list = materialMangeInfo.contacters;
                } else {
                    this.content_person_list = materialMangeInfo.contacters || [];
                }
            },
            content_delete (contentId) {
                //删除联系人员
                let materialDetail = this.getDetail;
                let materialId = materialDetail.id;
                axios({
                    method: 'post',
                    url: this.url + '/resource/material/removeContacters',
                    data: {
                        userCode: this.userCode,
                        id: materialId,
                        personId: contentId
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
                this.show_material_no_competent = true;
                this.show_material_competent = false;
                this.show_material_no_leader = true;
                this.show_material_leader = false;
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