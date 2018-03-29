<template>
    <div class="ds-hospital-table ds-widget-box ds-resources-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>资源类型信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="warning" @click="change_edit" v-if="ds_edit">修改</Button>
                    <Button type="error" v-if="delate_show" @click="deleteResourceTypeBefore">删除</Button>
                    <Button type="primary" @click="change_save('formCustom')" v-if="ds_save">保存</Button>
                    <Button type="ghost" v-if="close_show" @click="close_team">取消</Button>
                    <Modal v-model="delate_info" title="确认删除" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否确定删除此条信息
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="primary" @click="delete_equipment">确定</Button>
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>   
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <i-form ref="formCustom" :model="resourcesInfo" :rules="ruleCustom" :label-width="100">
                <Row>
                    <i-col span="24">
                        <form-item label="资源类型:">
                            <span v-if="ds_edit">{{ resourcesInfo.parent.name }}</span>
                            <span v-if="ds_save">
                                <Select v-model="resourcesInfo.parent.id" style="width:300px">
                                    <Option v-for="item in resType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <form-item label="名称:" prop="name">
                            <span v-if="ds_edit">{{ resourcesInfo.name }}</span>
                            <span v-if="ds_save">
                                <i-input v-model="resourcesInfo.name" style="width:300px;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <form-item label="编码:" prop="code">
                            <span v-if="ds_edit">{{ resourcesInfo.code }}</span>
                            <span v-if="ds_save">
                                <i-input v-model="resourcesInfo.code" style="width:300px;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <form-item label="有效性:">
                            <span v-if="ds_edit">
                                <i-switch v-model="resourcesInfo.valid" :disabled="true" size="large">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                            </span>
                            <span v-if="ds_save">
                                <i-switch v-model="resourcesInfo.valid" size="large">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
            </i-form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapActions } from 'vuex';
    import Cookies from 'js-cookie';

    export default {
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入名称'));
                } else {
                    callback();
                }
            };
            return {
                delate_info: false,
                delate_show: true,// 是否显示删除按钮
                close_show: false,// 是否显示关闭按钮
                ds_edit: true,
                ds_save: false,
                switch1: true,
                resourcesInfo: {
                    id: null,
                    parent: {
                        name: '',
                        id: null
                    },
                    name: '',
                    code: '',
                    valid: null
                },
                resType: [
                ],
                ruleCustom: {
                    name: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            resourcesDetail () {
                return this.$store.state.resourceType.detail;
            },
            userCode () {
                return Cookies.get('userCode'); // userCode
            },
            url () {
                return this.$store.state.userCode.url; // url
            }
        },
        methods: {
            btn () {
                console.log(this.getSaveData)
            },
            getResoucesDetail (resourcesId) {
                let detail = {
                    userCode: this.userCode,
                    id: resourcesId
                };
                axios({
                    method: 'get',
                    url: this.url + '/platform/resourceType/getResourceTypeById',
                    params: detail
                }).then(
                    response => {
                        this.resourcesInfo = response.data.data;
                        console.log('aaa',this.resourcesInfo)
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    });
            },
            setResourcesDetailEmpty(){
                this.resourcesInfo = {
                    id: null,
                    parent: {
                        name: '',
                        id: null
                    },
                    name: '',
                    code: '',
                    valid: null
                };
            },
            getResourceType () {
                //获取资源类型
                const that = this;
                this.$http.get(this.url + '/queryResourcesType')
                .then(function (response) {
                    let resourcesInfo = response.data;
                    if ( resourcesInfo.code === 1 ) {
                        that.resType = resourcesInfo.datas;
                    }
                })
                .catch(function (error) {
                    this.$Message.error(error)
                });
            },
            change_edit () {
                let resourcesInfo = this.resourcesInfo;
                if(!resourcesInfo.id){
                    this.$Message.error('请选择具体资源类型进行编辑')
                } else {
                    let resTypeInfo = {
                        userCode: this.userCode
                    }
                    axios({
                        method: 'post',
                        url: this.url + '/platform/resourceType/queryResourceTypeList',
                        data: resTypeInfo
                    }).then(
                        response => {
                            if (response.data.code === 200) {
                                this.resType = response.data.data;
                                let resTypeData = response.data.data;
                                let resTypeList = [];
                                for (let i = 0; i < resTypeData.length; i++) {
                                    resTypeList.push({value: resTypeData[i].id, label: resTypeData[i].name})
                                }
                                this.resType = resTypeList;
                            }
                        }
                    ).catch(
                        error => {
                            this.$Message.error(error)
                        }
                    );
                    this.ds_edit = false;
                    this.ds_save = true;
                    this.delate_show = false;
                    this.close_show = true;
                }
            },
            change_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //修改类型
                        let resourceInfo = {
                            id: this.resourcesInfo.id,
                            code: this.resourcesInfo.code,
                            name: this.resourcesInfo.name,
                            valid: this.resourcesInfo.valid,
                            parent: {
                                id: this.resourcesInfo.parent.id,
                                name: this.resourcesInfo.parent.name
                            },
                            userCode: this.userCode
                        };
                        
                        axios({
                            method: 'post',
                            url: this.url + '/platform/resourceType/updateResourceType',
                            data: resourceInfo
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.ds_edit = true;
                                    this.ds_save = false;
                                    this.delate_show = true;
                                    this.close_show = false;
                                    this.$emit('resource-edit',this.resourcesInfo);
                                    this.$Message.info('修改成功')
                                }
                            }
                        ).catch(
                            error => {
                                this.$Message.error(error)
                            }
                        );
                    } else {
                        this.$Message.error('操作失败！');
                    }
                }) 
            },
            close_delete_model () {
                this.delate_info = false;
            },
            deleteResourceTypeBefore () {
                let resourcesInfo = this.resourcesInfo;
                if (!resourcesInfo.id) {
                    this.$Message.error('请选择具体资源类型删除')
                } else {
                    this.delate_info = true;
                }
            },
            delete_equipment () {
                // 删除资源
                let resourceDelete = {
                    userCode: this.userCode,
                    id: this.resourcesInfo.id
                };
                axios({
                    method: 'get',
                    url: this.url + '/platform/resourceType/deletedResourceType',
                    params: resourceDelete
                }).then(
                    response => {
                        if (response.data.code === 200) {
                            // 成功消息提示
                            this.$Message.info('删除成功')
                            this.delate_info = false;
                            // 通知父组件重新查询数据
                            this.$emit('resources-delete', resourceDelete);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            close_team () {
                this.$refs['formCustom'].resetFields();
                this.getResoucesDetail(this.resourcesInfo.id);
                this.ds_edit = true;
                this.ds_save = false;
                this.delate_show = true;
                this.close_show = false;
            }
        }
    };
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