<template>
    <div class="ds-widget-box ds-hospital-table">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>医院信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="ghost" size="small" @click="change_edit" v-if="ds_edit" style="background: #fff;"><Icon type="edit"></Icon></Button>
                    <Button type="ghost" size="small" v-if="delate_show" @click="delate_info = true" style="background: #fff;"><Icon type="trash-a"></Icon></Button>
                    <Button type="ghost" size="small" @click="change_save" v-if="ds_save" style="background: #fff;"><Icon type="checkmark-round"></Icon></Button>
                    <Button type="ghost" size="small" v-if="close_show" @click="close_hospital" style="background: #fff;"><Icon type="close-round"></Icon></Button>
                    <Modal v-model="delate_info" title="确认删除" @on-ok="ok" @on-cancel="cancel">
                        <p>是否删除此条医院信息？</p>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <table class="ds-table">
                <tbody>
                    <tr>
                        <td>
                            <Row>
                                <i-col span="4">*名称:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_name }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_name" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <i-col span="4">*编码:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_code }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_code" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <Row>
                                <i-col span="2">地址:</i-col>
                                <i-col span="22">
                                    <span v-if="ds_edit">{{ hospital_adress }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_adress" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Row>
                                <i-col span="4">行政区域:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_area }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_area" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <i-col span="4">医院等级:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_leave }}</span>
                                    <span v-if="ds_save">
                                        <Select v-model="hospital_leave" style="width:300px">
                                            <Option v-for="item in hospital_leave_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Row>
                                <i-col span="4">值班电话:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_phone }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_phone" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <i-col span="4">专科类型:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_type }}</span>
                                    <span v-if="ds_save">
                                        <Select v-model="hospital_type" style="width:300px">
                                            <Option v-for="item in hospital_type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="showLess">
                        <td>
                            <Row>
                                <i-col span="4">医生数量:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_doctor_number }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_doctor_number" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <i-col span="4">护士数量:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_nurse_number }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_nurse_number" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="showLess">
                        <td>
                            <Row>
                                <i-col span="4">床位数:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_bed_number }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_bed_number" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <i-col span="4">已用床位数:</i-col>
                                <i-col span="20">
                                    <span v-if="ds_edit">{{ hospital_usedbed_number }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_usedbed_number" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="showLess">
                        <td colspan="2">
                            <Row>
                                <i-col span="2">职能:</i-col>
                                <i-col span="22">
                                    <span v-if="ds_edit">{{ hospital_function }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="hospital_function" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="ds-show-action" @click="show_more" v-if="showMore">
                    展开更多
                    <Icon type="ios-arrow-down" class="ds-show-more"></Icon>
            </div>
            <div class="ds-show-action" @click="show_less"  v-if="showLess">
                收起
                <Icon type="ios-arrow-up" class="ds-show-less"></Icon>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
		 name: 'hospital_info',
		 data () {
            return {
                close_show: false,//是否展示关闭
                delate_info: false,
                ds_edit: true,
                ds_save: false,
                delate_show: true,
                showMore: true,
                showLess : false,
                switch1: true,
                parent_org: [],
                hospital_name: '复旦大学附属中山医院',
                hospital_code: 'DW-00002',
                hospital_adress: '复旦大学附属中山医院',
                hospital_area: '浦东新区',
                hospital_org: '公安局',
                hospital_leave: '一级甲等',
                hospital_phone: '15221566854',
                hospital_tel1: '88668866',
                hospital_tel2: '88668899',
                hospital_type: '综合医院',
                hospital_fax: '021-83478123',
                hospital_doctor_number: '200',
                hospital_nurse_number: '350',
                hospital_bed_number: '700',
                hospital_usedbed_number: '350',
                hospital_function: '外科',
                hospital_leave_list: [
                    {
                        value: '一级甲等',
                        label: '一级甲等'
                    },
                    {
                        value: '二级甲等',
                        label: '二级甲等'
                    },
                    {
                        value: '三级甲等',
                        label: '三级甲等'
                    },
                    {
                        value: '四级甲等',
                        label: '四级甲等'
                    }
                ],
                hospital_type_list: [
                    {
                        value: '综合医院',
                        label: '综合医院'
                    },
                    {
                        value: '专科医院',
                        label: '专科医院'
                    }
                ],
                parent_org_list: [{
                    value: '应急单位',
                    label: '应急单位',
                    children: [
                        {
                            value: '司法机关',
                            label: '司法机关'
                        },
                        {
                            value: '行政机关',
                            label: '行政机关'
                        }
                    ]
                }, {
                    value: '联动中心',
                    label: '联动中心',
                    children: [
                        {
                            value: '联动单位',
                            label: '联动单位',
                            children: [
                                {
                                    value: '公安局',
                                    label: '公安局',
                                },
                                 {
                                    value: '工商局',
                                    label: '工商局',
                                }
                            ]
                        }
                    ],
                },{
                    value: '应急指挥',
                    label: '应急指挥',
                    children: [
                        {
                            value: '规范组织',
                            label: '规范组织',
                            children: [
                                {
                                    value: '军队',
                                    label: '军队',
                                }
                            ]
                        },
                        {
                            value: '实用组织',
                            label: '实用组织',
                            children: [
                                {
                                    value: '工厂',
                                    label: '工厂',
                                },
                                {
                                    value: '机械厂',
                                    label: '机械厂',
                                }
                            ]
                        }
                    ],
                }],
            }
        },
        methods: {
            change_edit () {
                this.ds_edit = false;
                this.ds_save = true;
                this.close_show = true;
                this.delate_show = false;
            },
            change_save () {
                this.ds_edit = true;
                this.ds_save = false;
                this.close_show = false;
                this.delate_show = true;
            },
            delate () {
                this.$Message.error('确定要删除吗')
            },
            ok () {
                this.$Message.info('删除成功');
            },
            cancel () {
                this.$Message.info('取消删除');
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
            close_hospital () {
                this.ds_edit = true;
                this.ds_save = false;
                this.close_show = false;
                this.delate_show = true;
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