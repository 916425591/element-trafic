<template>
    <div class="ds-hospital-table">
        <table class="ds-table">
            <thead>
                <tr>
                    <td colspan="2">
                        <div>
                            <Row>
                                <i-col span="18" style="text-align: left;font-weight: bold;">人员信息</i-col>
                                <i-col span="6" class="ds-info-list">
                                <!-- 
                                    <Button type="ghost" v-if="personAddShow" size="small" @click="personAddClick" style="background: #fff;">
                                        <Icon type="android-add"></Icon>
                                    </Button>
                                    <Button type="ghost" size="small" @click="personAddSave" v-if="personAddSaveShow" style="background: #fff;"><Icon type="checkmark-round"></Icon></Button>
                                    <Button type="ghost" size="small" @click="personEdit" v-if="dsEditShow" style="background: #fff;"><Icon type="edit"></Icon></Button>
                                    <Button type="ghost" size="small" v-if="ds_delate" @click="deletePerson" style="background: #fff;"><Icon type="trash-a"></Icon></Button>
                                    <Button type="ghost" size="small" @click="personEditSave" v-if="ds_saveShow" style="background: #fff;"><Icon type="checkmark-round"></Icon></Button>
                                    <Button type="ghost" size="small" v-if="close_show" @click="close_person" style="background: #fff;"><Icon type="close-round"></Icon></Button>
                                    <Modal style="z-index: 1000" v-model="delate_info" title="确认删除" @on-ok="ok" @on-cancel="cancel">
                                        <p>是否删除此条人员信息？</p>
                                    </Modal> -->
                                </i-col>
                            </Row>
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Row>
                            <i-col span="4">*姓名:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.name }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.name" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                    <td>
                        <Row>
                            <i-col span="4">职务:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.duty }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.duty" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Row>
                            <i-col span="4">联系电话:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.mobile }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.mobile" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                    <td>
                        <Row>
                            <i-col span="4">邮件:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.email }}</span>
                                <span v-if="ds_save">
                                     <i-input v-model="person_info.email" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Row>
                            <i-col span="4">性别:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">
                                    <Icon type="man" v-if="person_info.sex == '1'" color="rgb(29, 172, 239)"></Icon>
                                    <Icon type="woman" v-if="person_info.sex == '2'" color="red"></Icon>
                                </span>
                                <span v-if="ds_save">
                                    <RadioGroup v-model="person_info.sex">
                                        <Radio label="1">
                                            <Icon type="man" color="rgb(29, 172, 239)"></Icon>
                                            <span>男</span>
                                        </Radio>
                                        <Radio label="2">
                                            <Icon type="woman" color="red"></Icon>
                                            <span>女</span>
                                        </Radio>
                                    </RadioGroup>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                    <td>
                        <Row>
                            <i-col span="4">出生年月:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.birth }}</span>
                                <span v-if="ds_save">
                                    <DatePicker type="date" @on-change="setBirth" placeholder="请选择日期" style="width: 300px"></DatePicker>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                </tr>
                <tr>
                    
                    <td>
                        <Row>
                            <i-col span="4">政治面貌:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.political }}</span>
                                <span v-if="ds_save">
                                    <Select v-model="person_info.political" style="width:300px;">
                                        <Option v-for="item in political_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                    <td>
                        <Row>
                            <i-col span="4">通讯地址:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.address }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.address" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';

    export default {
		 name: 'hospital_info',
		 data () {
            return {
                personAddShow: true,
                personAddSaveShow: false,
                delate_info: false,
                ds_edit: true,
                dsEditShow: true,
                add_edit: true,
                ds_save: false,
                add_save: true,
                ds_saveShow: false,
                ds_delate: true,
                close_show: false,
                showMore: true,
                showLess : false,
                contact_switch: true,
                validity_switch: true,
                person_info: {
                    name: '',
                    duty: '',
                    mobile: '',
                    sex: 1,
                    email: '',
                    birth: '',
                    political: '',
                    address: ''
                },
                person_liable_list: [
                    {
                        value: '主责任人',
                        label: '主责任人'
                    },
                    {
                        value: '联络人',
                        label: '联络人'
                    }
                ],
                political_list: [
                    {
                        value: '1',
                        label: '党员'
                    },
                    {
                        value: '2',
                        label: '团员'
                    }
                ]
            }
        },
        computed: {
            getData() {
                return this.$store.state.team.personId
            },
            getTeamDetail () {
                return this.$store.state.team.teamDetail
            },
            getMemberDetail () {
                return this.$store.state.team.memberDetail
            },
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            }
        },
        methods: {
            ...mapActions([
                'saveMemberDetail'
            ]),
            queryMember (data) {
                //查询人员详情
                console.log(this.getData)
                let personInfo = {
                    userCode: this.userCode,
                    personId: this.getData.personId
                }
                axios({
                    method: 'get',
                    url: this.url + '/platform/person/getPersonByKey',
                    params: personInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.person_info = response.data.data;
                            this.saveMemberDetail(response.data.data);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            personEdit () {
                this.personAddShow = false;
                this.ds_edit = false;
                this.dsEditShow = false;
                this.ds_save = true;
                this.ds_saveShow = true;
                this.ds_delate = false;
                this.close_show = true;
            },
            personEditSave () {
                //保存修改人员
                axios({
                    method: 'get',
                    url: this.url + '/queryResourceTypeAllTree',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('人员修改成功')
                            this.ds_edit = true;
                            this.ds_save = false;
                            this.ds_delate = true;
                            this.close_show = false;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
                
            },
            close_person () {
                this.personAddShow = true;
                this.dsEditShow = true;
                this.personAddSaveShow = false;
                this.ds_edit = true;
                this.ds_save = false;
                this.ds_saveShow = false;
                this.ds_delate = true;
                this.close_show = false;
                this.person_info = this.getMemberDetail;
            },
            personAddClick () {
                this.person_info = {
                    name: '',
                    duty: '',
                    mobile: '',
                    sex: 1,
                    email: '',
                    birth: '',
                    political: '',
                    address: ''
                }
                this.dsEditShow = false;
                this.ds_edit = false;
                this.ds_saveShow = false;
                this.ds_save = true;
                this.ds_delate = false; 
                this.personAddShow = false;
                this.personAddSaveShow = true;
                this.close_show = true;
            },
            personAddSave () {
                //人员新增保存
                let personAddInfo = {};
                personAddInfo.userCode = this.userCode;
                personAddInfo.teamId = this.getTeamDetail.id;
                personAddInfo.personBO = this.person_info;
                personAddInfo.personBO.personId = null;
                personAddInfo.personBO.unit = 1;
                axios({
                    method: 'post',
                    url: this.url + '/resource/team/addTeamPerson',
                    data: personAddInfo
                }).then(
                    response => {
                        if ( response.data.code === 200) {

                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            deletePerson () {
                //删除了人员
                let personInfo = {
                    userCode: this.userCode,
                    teamId: this.getData.teamId,
                    personId: this.getData.personId
                }
                axios({
                    method: 'post',
                    url: this.url + '/resource/team/removeTeamPerson',
                    data: personInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('删除成功')
                            this.$emit( 'member-delete', personInfo);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            show_more () {
                this.showMore = false;
                this.showLess = true;
            },
            show_less () {
                this.showMore = true;
                this.showLess = false;
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            edit_person () {
                this.add_edit = true;
                this.ds_delate = true;
            },
            check_person () {
                this.add_edit = true;
                this.ds_delate = true;
            },
            close_model () {
                this.ds_edit = true;
                this.ds_save = false;
                this.ds_delate = true;
                this.close_show = false;
            },
            setBirth (value) {
                this.person_info.birth = value;
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
    .ds-info-list{
        text-align: right;
        padding-right: 20px;
    }
    .ds-text-align-left{
        text-align: left;
    }
</style>