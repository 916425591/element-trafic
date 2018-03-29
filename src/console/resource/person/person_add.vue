<template>
    <div class="ds-hospital-table">
        <table class="ds-table">
            <thead>
                <tr>
                    <td colspan="2">
                        <div>
                            <Row>
                                <i-col span="20" style="text-align: left;font-weight: bold;">{{ person_info.title }}</i-col>
                                <i-col span="4" class="ds-info-list">
                                    <Button type="ghost" size="small" @click="change_save" style="background: #fff;">
                                        <Icon type="checkmark-circled"></Icon>
                                    </Button>
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
                                <span v-if="ds_edit">{{ person_info.job }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.job" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Row>
                            <i-col span="4">出生年月:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.year }}</span>
                                <span v-if="ds_save">
                                    <DatePicker type="date" format="yyyy-MM-dd" :value="person_info.year" v-model="person_info.year" style="width: 300px"></DatePicker>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                     <td>
                        <Row>
                            <i-col span="4">性别:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.sex }}</span>
                                <span v-if="ds_save">
                                    <RadioGroup v-model="person_info.sex">
                                        <Radio label="man">
                                            <Icon type="man" color="rgb(29, 172, 239)"></Icon>
                                            <span>男</span>
                                        </Radio>
                                        <Radio label="woman">
                                            <Icon type="woman" color="red"></Icon>
                                            <span>女</span>
                                        </Radio>
                                    </RadioGroup>
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
                                <span v-if="ds_edit">{{ person_info.phone }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.phone" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                    <td>
                        <Row>
                            <i-col span="4">政治面貌:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.politics }}</span>
                                <span v-if="ds_save">
                                    <Select v-model="person_info.politics" style="width:300px;">
                                        <Option v-for="item in politics_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                </tr>
                <tr>
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
                    <td>
                        <Row>
                            <i-col span="4">通讯地址:</i-col>
                            <i-col span="20" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.adress }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.adress" style="width:300px;"></i-input>
                                </span>
                            </i-col>
                        </Row>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row>
                            <i-col span="2">专长:</i-col>
                            <i-col span="22" class="ds-text-align-left">
                                <span v-if="ds_edit">{{ person_info.year }}</span>
                                <span v-if="ds_save">
                                    <i-input v-model="person_info.adress" style="width:300px;"></i-input>
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
    export default {
		 name: 'hospital_info',
		 data () {
            return {
                ds_edit: false,
                ds_save: true,
                showMore: true,
                showLess : false,
                contact_switch: true,
                validity_switch: true,
                teamId: null,
                person_info: {
                    title: '人员新增',
                    name: '',
                    job: '',
                    phone: '',
                    tel: '',
                    sex: 'man',
                    home_tel: '',
                    liable: 'charge',
                    year: '',
                    politics: '',
                    email: '',
                    adress: ''
                },
                person_liable_list: [
                    {
                        value: '主责任人',
                        label: '主责任人'
                    },
                    {
                        value: '主联络人',
                        label: '主联络人'
                    },
                    {
                        value: '次联络人',
                        label: '次联络人'
                    },
                    {
                        value: '普通人员',
                        label: '普通人员'
                    }
                ],
                politics_list: [
                    {
                        value: '党员',
                        label: '党员'
                    },
                    {
                        value: '团员',
                        label: '团员'
                    },
                    {
                        value: '无',
                        label: '无'
                    }
                ]
            }
        },
        methods: {
            setTeamId (teamId) {
                this.teamId = teamId;
            },
            change_save () {
                console.log(this.person_info.year)
                // const that = this;
                // let personInfo = this.person_info;
                // personInfo.teamId = this.teamId;
                // this.$http.post('http://127.0.0.1/teamPersonAdd',personInfo)
                // .then(function (response) {
                //     let person = response.data;
                //     if ( person.code === 1 ) {
                //         that.$emit('close-modal');
                //     }
                // })
                // .catch(function (error) {
                //     this.$Message.error(error)
                // });
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