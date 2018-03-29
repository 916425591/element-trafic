<template>
    <div class="ds-widget-box ds-hospital-table">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>医院管理信息</h2>
        </div>
        <Row class="ds-person-body ds-noPerson-box">
            <Col span="8">
                <Row>
                    <Col span="12" class="ds-person-box">
                        <div v-if="show_hospital_no_competent" class="ds-align-center" v-on:mouseenter="charge_add_cover">
                            <Icon type="ios-home-outline" class="ds-bg-icon ds-green"></Icon>
                            <p class="ds-person-p">您还没有设置主管单位</p>
                        </div>
                        <transition name=”fade”>
                            <div class="ds-cover" v-if="charge_cover" @click="charge_company" v-on:mouseleave="charge_remove_cover">
                                <Icon type="android-add" size="60" color="#fff"></Icon>
                            </div>
                        </transition>
                        <div v-if="show_hospital_competent">
                            <div v-if="show_hospital_leader">
                                <div class="ds-content-box">
                                    <Row class="ds-content-person">
                                        <Col span="24" class="ds-content-title">
                                            主管单位
                                        </Col>
                                    </Row>
                                    <div class="ds-content-main">
                                        <Icon type="ios-home-outline" class="ds-bg-icon ds-green"></Icon>
                                        <p>上海市卫生局</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span="12" class="ds-person-box">
                        <div v-if="show_hospital_no_leader" class="ds-align-center"  v-on:mouseenter="first_charge_add_cover">
                            <Icon type="person" class="ds-bg-icon ds-orange"></Icon>
                            <p class="ds-person-p">您还没有设置医院负责人</p>
                        </div>
                        <transition name=”fade”>
                            <div class="ds-cover" v-if="first_charge_cover" @click="first_charge" v-on:mouseleave="first_charge_remove_cover">
                                <Icon type="android-add" size="60" color="#fff"></Icon>
                            </div>
                        </transition>
                        <div v-if="show_hospital_leader">
                            <div class="ds-content-box">
                                <Row class="ds-content-person">
                                    <Col span="24" class="ds-content-title">
                                        负责人
                                    </Col>
                                </Row>
                                <div class="ds-content-main">
                                    <Icon type="person" class="ds-bg-icon ds-orange"></Icon>
                                    <p>沈力</p>
                                    <p>13253647835</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                
            </Col>
            <Col span="16">
                <div class="ds-person-box ds-charge-bottom">
                    <div class="ds-align-center" v-if="show_hospital_no_contenter" v-on:mouseenter="secondary_charge_add_cover">
                        <Icon type="person-stalker" class="ds-bg-icon ds-blue"></Icon>
                        <p class="ds-person-p">您还没有设置联络员</p>
                    </div>
                    <transition name=”fade”>
                        <div class="ds-cover" v-if="secondary_charge_cover" @click="secondary_charge" v-on:mouseleave="secondary_charge_remove_cover">
                            <Icon type="android-add" size="60" color="#fff"></Icon>
                        </div>
                    </transition>
                    <div class="ds-content-box" v-if="show_hospital_contenter">
                        <Row class="ds-content-person">
                            <Col span="14" class="ds-content-title">
                                联系人员
                            </Col>
                            <Col span="10" class="ds-content-add">
                                <Button type="ghost" size="small" @click="" style="background: #fff;"><Icon type="android-add" size="20"></Icon></Button>
                            </Col>
                        </Row>
                        <ul class="ds-contenter-list">
                            <li v-for="item in content_person_list">
                                <Row>
                                    <Col span="4">
                                        <Icon type="person-stalker" class="ds-blue"></Icon>
                                    </Col>
                                    <Col span="6">{{ item.name }}</Col>
                                    <Col span="14">{{ item.tel }}</Col>
                                </Row>
                            </li>
                        </ul>
                    </div>
                </div>
                <Modal v-model="person_charge" :mask-closable="false" width="800">
                    <p slot="header" style="color:#f60;text-align:center">
                        <span>{{ person_setting_title }}</span>
                    </p>
                    <div style="text-align:center">
                        <hospital-setting-person v-if="hospital_setting_person"></hospital-setting-person>
                        <hospital-setting-company v-if="hospital_setting_company"></hospital-setting-company>
                    </div>
                    <div slot="footer" class="ds-text-center">
                        <Button type="ghost" @click="close_setting_model">取消</Button>
                        <Button type="primary">保存</Button>
                    </div>
                </Modal>
            </Col>
        </Row>
    </div>
</template>

<script>
    import hospitalPersonEdit from '../person/person_edit'
    import hospitalPersonAdd from '../person/person_add'
    import hospitalSettingPerson from '../person/person_setting_management'
    import hospitalSettingCompany from '../person/person_setting_company'

    export default {
        components: {
             hospitalPersonEdit,
             hospitalPersonAdd,
             hospitalSettingPerson,
             hospitalSettingCompany
         },
        data () {
            return {
                show_person_list: true,//是否展示人员列表
                show_hospital_no_competent: true,//是否展示无主管单位
                show_hospital_no_leader: true,//是否展示无负责人
                show_hospital_no_contenter: true,//是否展示无联系人
                show_hospital_competent: false,//是否展示主管单位
                show_hospital_leader: false,//是否展示负责人
                show_hospital_contenter: false,//是否展示联系人
                person_edit: false,
                person_add: false,
                person_charge: false,
                charge_cover: false,
                secondary_charge_cover: false,
                first_charge_cover: false,
                charge_cover: false,
                hospital_setting_person: true,//是否显示设置责任人、联络员
                hospital_setting_company: false,//是否显示设置主管单位
                person_title: '人员修改',
                person_setting_title: '设置负责人',
                columns7: [
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
                        title: '职务',
                        key: 'post',
                        align: 'center'
                    },
                    {
                        title: '移动电话',
                        key: 'phone',
                        align: 'center'
                    },
                    {
                        title: '办公电话',
                        key: 'tel',
                        align: 'center'
                    }
                ],
                data6: [
                    {
                        name: 'John Brown',
                        post: '组长',
                        phone: '15221566825',
                        tel: '85654541',
                    },
                    {
                        name: 'Jim Green',
                        post: '组长',
                        phone: '15221566825',
                        tel: '85654541',
                    },
                    {
                        name: 'Joe Black',
                        post: '组长',
                        phone: '15221566825',
                        tel: '85654541',
                    },
                    {
                        name: 'Jon Snow',
                        post: '组长',
                        phone: '15221566825',
                        tel: '85654541',
                    },
                    {
                        name: 'Jon Snow',
                        post: '组长',
                        phone: '15221566825',
                        tel: '85654541',
                    }
                ],
                content_person_list: [
                    {
                        name: '朱海鹏',
                        tel: 13253647835
                    },
                    {
                        name: '顾梦',
                        tel: 18921546220
                    },
                    {
                        name: '张静',
                        tel: 13253647835
                    }
                ]
            }
        },
        methods: {
            charge_company () {
                this.person_setting_title = '设置主管单位';
                this.person_charge = true;
                this.hospital_setting_person = false;
                this.hospital_setting_company = true;
            },
            first_charge () {
                this.person_setting_title = '设置负责人';
                this.person_charge = true;
                this.hospital_setting_person = true;
                this.hospital_setting_company = false;
            },
            secondary_charge () {
                this.person_setting_title = '设置联络员';
                this.person_charge = true;
                this.hospital_setting_person = true;
                this.hospital_setting_company = false;
            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            personAdd () {
                this.person_edit = false;
                this.person_add = true;
            },
            check_person () {
                this.person_edit = true;
                this.person_title = '人员设置';
                this.$refs.hospitalPersonEdit.check_person();
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
            close_setting_model () {
                this.person_charge = false;
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