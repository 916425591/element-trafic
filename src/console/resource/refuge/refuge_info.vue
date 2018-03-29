<template>
    <div class="ds-hospital-table ds-widget-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>避险场所信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="primary" @click="refuge_edit_save('formCustom')" v-if="!ds_edit">提交</Button>
                    <Button type="warning" @click="change_edit" v-else>修改</Button>
                    <Button type="error" v-if="ds_edit" @click="deleteRefugeBefore">删除</Button>
                    <Button type="ghost" v-else @click="close_refuge">取消</Button>
                    <Modal v-model="delate_refuge" :mask-closable="false" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否删除此条避险场所信息？
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>
                            <Button size="large" type="primary" @click="delete_refuge">确定</Button>
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <i-form ref="formCustom" :model="refuge_info" :rules="ruleCustom" :label-width="100">
                <Row>
                <i-col span="8">
                    <form-item label="场所名称:" prop="name">
                    <span v-if="ds_edit">{{ refuge_info.name }}</span>
                    <span v-else>
                        <i-input v-model="refuge_info.name" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="行政区域:" prop="region">
                    <span v-if="ds_edit">{{ refuge_info.region.name }}</span>
                    <span v-else>
                        <i-input v-model="refuge_info.region.name" style="width:98%;" @on-focus="open_region"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="详细地址:">
                    <span v-if="ds_edit">{{ refuge_info.address }}</span>
                    <span v-else>
                        <i-input v-model="refuge_info.address" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                </Row>
                <Row>
                <i-col span="8">
                    <form-item label="场所面积:" prop="area">
                    <span v-if="ds_edit">{{ refuge_info.area }}</span>
                    <span v-else>
                        <i-input v-model="refuge_info.area" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="通道数量:" prop="aisleNumber">
                    <span v-if="ds_edit">{{ refuge_info.aisleNumber }}</span>
                    <span v-else>
                        <i-input v-model="refuge_info.aisleNumber" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="容纳人数:" prop="maximum">
                    <span v-if="ds_edit">{{ refuge_info.maximum }}</span>
                    <span v-else>
                        <i-input v-model="refuge_info.maximum" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                </Row>
                <Row>
                <i-col span="24">
                    <form-item label="场所职能:">
                    <span v-if="ds_edit">{{ refuge_info.functions }}</span>
                    <span v-else>
                        <i-input v-model="refuge_info.functions" style="width:98%;"></i-input>
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
    import RULE from '@/common/utils/verify'
    import Cookies from 'js-cookie';

    export default {
        components:{
            tree
        },
		 data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入避险场所名称'));
                } else {
                    callback()
                }
            };
            const validateCount = (rule, value, callback) => {
                if(value && !RULE.nonnegativeIntReg.test(value)){
                    return callback(new Error('请输入非负整数'));
                } else {
                    callback()
                }
            };
            const validateArea = (rule, value, callback) => {
                if(value && !RULE.useQuantityReg.test(value)){
                    return callback(new Error('请输入最多两位小数的数字'));
                } else {
                    callback()
                }
            };
            const validateRegion = (rule, value, callback) => {
                if (!value || !value.id) {
                    return callback(new Error('请选择行政区域'));
                } else {
                    callback()
                }
            };
            return {
                treeModal: false,
                delate_refuge: false,
                ds_save: false,
                ruleCustom: {
                    name: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ],
                    aisleNumber:[
                        { validator: validateCount, trigger: 'blur' }
                    ],
                    maximum:[
                        { validator: validateCount, trigger: 'blur' }
                    ],
                    area:[
                        { validator: validateArea, trigger: 'blur' }
                    ],
                    region:[
                        { required: true,validator: validateRegion, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getData() {
                return this.$store.state.refuge.resTypeId
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
            refuge_info() {
                return this.$store.state.refuge.refugeDetail
            }
        },
        methods: {
            ...mapActions([
				'saveDemoData',
                'changeEditStatus',
                'saveRefugeDetailData'
		    ]),
            change_edit () {
                let refugeInfo = this.refuge_info;
                if(!refugeInfo.id){
                    this.$Message.error('请选择具体避险场所进行编辑')
                } else{
                    this.changeEditStatus(false)
                }
            },
            refuge_edit_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         //避险场所信息保存
                        let refugeInfo = this.refuge_info;
                        if(refugeInfo.id){//修改
                            refugeInfo.userCode = this.userCode;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/refuge/modifyRefuge',
                                data: refugeInfo
                            }).then(
                                response => {
                                    if ( response.data.code === 200 ) {
                                        this.changeEditStatus(true)
                                        this.$emit('refuge-edit',this.refuge_info);
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$Message.error(error)
                                }
                            );
                        } else {//新增
                            let mrefugeInfo = this.refuge_info;
                            mrefugeInfo.userCode = this.userCode;
                            mrefugeInfo.resTypeId = this.getData;
                            mrefugeInfo.valid = 1;
                                axios({
                                    method: 'post',
                                    url: this.url + '/resource/refuge/addRefuge',
                                    data: mrefugeInfo
                                }).then(
                                    response => {
                                        this.changeEditStatus(true)
                                        this.$emit('refuge-save',response.data);
                                        this.$Message.info('新增成功')
                                    }
                                ).catch(
                                    error => {
                                        this.$Message.error(error)
                                    }
                                );
                            }  
                        
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })                
               
            },
            deleteRefugeBefore(){
                let refugeInfo = this.refuge_info;
                if(!refugeInfo.id){
                    this.$Message.error('请选择具体避险场所删除')
                } else{
                    this.delate_refuge = true
                }
            },
            delete_refuge () {
                //删除避险场所信息
                let refugeDeleteInfo = {
                    userCode: this.userCode,
                    refugeId: this.refuge_info.id
                };
                axios({
                    method: 'get',
                    url: this.url + '/resource/refuge/removeRefuge',
                    params: refugeDeleteInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$emit('refuge-delete',refugeDeleteInfo);
                            this.$Message.info('删除成功')
                            this.saveRefugeDetailData('');//清空避险场所详情缓存
                            this.delate_refuge = false;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            close_delete_model () {
                this.delate_refuge = false;
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            close_refuge () {
                this.$refs['formCustom'].resetFields();
                if(!this.refuge_info.id){
                    this.changeEditStatus(true);
                    return
                }
                let refugeInfo = {
                    userCode: this.userCode,
                    refugeId: this.refuge_info.id
                }
                axios({
                    method: 'get',
                    url: this.url + '/resource/refuge/getRefugeDetail',
                    params: refugeInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                                //查询避险场所详情
                                this.changeEditStatus(true);
                                this.saveRefugeDetailData(response.data.data);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
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
            open_affiliationOrg(){
                let TreeInfo = {
                    title: '选择所在单位',
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
                    this.refuge_info.region.name = data[0].title;
                    this.refuge_info.region.id = data[0].id;
                    this.$refs.formCustom.validateField('region', valid => {
                    });
                }else if(type === 'affiliationOrg'){
                    this.refuge_info.affiliationOrg.id = data[0].id;
                    this.refuge_info.affiliationOrg.name = data[0].title;
                }
                this.treeModalClose();
                
            },
            treeModalClose(){
                this.treeModal = false;
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