<template>
    <div class="ds-widget-box ds-hospital-table">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>医院信息</h2>
            <Row class="ds-fload-right">
                <Col span="24">
                    <Button type="ghost" size="small" @click="hospital_save" v-if="ds_save" style="background: #fff;"><Icon type="checkmark-round"></Icon></Button>
                    <Button type="ghost" size="small" @click="hospital_add_close" style="background: #fff;"><Icon type="close-round"></Icon></Button>
                </Col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <table border="1px" bordercolor="#ddd" cellspacing="0px" width="100%">
                <tbody>
                    <tr>
                        <td>
                            <Row>
                                <Col span="4">*名称:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_name }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_name" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <Col span="4">*编码:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_code }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_code" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <Row>
                                <Col span="2">地址:</Col>
                                <Col span="21">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_adress }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_adress" style="width:300px;"></Input>
                                    </span>
                                </Col>
                                <Col span="1" style="text-align: right;padding-right: 20px;">
                                    <Icon type="location"></Icon>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Row>
                                <Col span="4">行政区域:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_area }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_area" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <Col span="4">医院等级:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_leave }}</span>
                                    <span v-if="ds_save">
                                        <Select v-model="hospital_info.hospital_leave" style="width:300px">
                                            <Option v-for="item in hospital_leave_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Row>
                                <Col span="4">值班电话:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_phone }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_phone" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <Col span="4">专科类型:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_type }}</span>
                                    <span v-if="ds_save">
                                        <Select v-model="hospital_info.hospital_type" style="width:300px">
                                            <Option v-for="item in hospital_type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="showLess">
                        <td>
                            <Row>
                                <Col span="4">医生数量:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_doctor_number }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_doctor_number" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <Col span="4">护士数量:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_nurse_number }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_nurse_number" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="showLess">
                        <td>
                            <Row>
                                <Col span="4">床位数:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_bed_number }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_bed_number" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                        <td>
                            <Row>
                                <Col span="4">已用床位数:</Col>
                                <Col span="20">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_usedbed_number }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_usedbed_number" style="width:300px;"></Input>
                                    </span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="showLess">
                        <td colspan="2">
                            <Row>
                                <Col span="2">联网状态:</Col>
                                <Col span="22">
                                    <i-switch v-model="switch1" @on-change="change"></i-switch>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr v-if="showLess">
                        <td colspan="2">
                            <Row>
                                <Col span="2">职能:</Col>
                                <Col span="22">
                                    <span v-if="ds_edit">{{ hospital_info.hospital_function }}</span>
                                    <span v-if="ds_save">
                                        <Input v-model="hospital_info.hospital_function" style="width:300px;"></Input>
                                    </span>
                                </Col>
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
                delate_info: false,
                ds_edit: false,
                ds_save: true,
                showMore: true,
                showLess : false,
                switch1: true,
                parent_org: [],
                hospital_info: {
                    hospital_name: '',
                    hospital_code: '',
                    hospital_adress: '',
                    hospital_area: '',
                    hospital_org: '',
                    hospital_leave: '',
                    hospital_phone: '',
                    hospital_tel1: '',
                    hospital_tel2: '',
                    hospital_type: '',
                    hospital_fax: '',
                    hospital_doctor_number: '',
                    hospital_nurse_number: '',
                    hospital_bed_number: '',
                    hospital_usedbed_number: '',
                    hospital_function: '',
                },
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
            show_more () {
                this.showMore = false;
                this.showLess = true;
            },
            show_less () {
                this.showMore = true;
                this.showLess = false;
            },
            hospital_save () {
                this.$emit('hospital-save');
            },
            hospital_add_close () {
                this.$emit('hospital-add-close');
            }
        }
	}
</script>

<style>

</style>