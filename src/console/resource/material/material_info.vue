<template>
    <div class="ds-hospital-table ds-widget-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>物资信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="primary" @click="material_edit_save('formCustom')" v-if="!ds_edit">提交</Button>
                    <Button type="warning" @click="change_edit" v-else>修改</Button>
                    <Button type="error" v-if="ds_edit" @click="deleteMaterialBefore">删除</Button>
                    <Button type="ghost" v-else @click="close_material">取消</Button>
                    <Modal v-model="delate_material" :mask-closable="false" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否删除此条物资信息？
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>
                            <Button size="large" type="primary" @click="delete_material">确定</Button>
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <i-form ref="formCustom" :model="material_info" :rules="ruleCustom" :label-width="100">
                <Row>
                    <i-col span="8">
                        <form-item label="物资名称:" prop="name">
                            <span v-if="ds_edit">{{ material_info.name }}</span>
                            <span v-else>
                                <i-input v-model="material_info.name" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="可用数量:" prop="canUseQuantity">
                            <span v-if="ds_edit">{{ material_info.canUseQuantity }}</span>
                            <span v-else>
                                <i-input v-model="material_info.canUseQuantity" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="计量单位:">
                            <span v-if="ds_edit">{{ material_info.unitName }}</span>
                            <span v-else>
                                <Select v-model="material_info.unit" style="width:98%" @on-change="setUnitName">
                                    <Option v-for="item in material_metering" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="8">
                        <form-item label="所在区域:" prop="region">
                            <span v-if="ds_edit">{{material_info.region.name}}</span>
                            <span v-else>
                                <i-input v-model="material_info.region.name" style="width:98%;" @on-focus="open_region"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="存放地点:">
                            <span v-if="ds_edit">{{material_info.location}}</span>
                            <span v-else>
                                <i-input v-model="material_info.location" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                    <i-col span="8">
                        <form-item label="规格型号:">
                            <span v-if="ds_edit">{{ material_info.materialsType }}</span>
                            <span v-else>
                                <i-input v-model="material_info.materialsType" style="width:98%;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                   </Row>
                   <Row>
                    <i-col span="24">
                        <form-item label="物资职能:">
                            <span v-if="ds_edit">{{ material_info.function }}</span>
                            <span v-else>
                                <i-input v-model="material_info.function" style="width:99%;"></i-input>
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
                    return callback(new Error('请输入物资名称'));
                } else {
                    callback()
                }
            };
            const validateCanUseQuantity = (rule, value, callback) => {
                if(value && !RULE.useQuantityReg.test(value)){
                    return callback(new Error('请输入最多两位小数的数字'));
                } else {
                    callback()
                }
            };
            const validateRegion = (rule, value, callback) => {
                if (!value || !value.id) {
                    return callback(new Error('请选择所在行政区域'));
                } else {
                    callback()
                }
            };
            return {
                treeModal: false,
                delate_material: false,
                ds_save: false,
                ruleCustom: {
                    name: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ],
                    canUseQuantity: [
                        { validator: validateCanUseQuantity, trigger: 'blur' }
                    ],
                    region: [
                        { required: true,validator: validateRegion, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getData() {
                return this.$store.state.material.resTypeId
            },
            ds_edit() {
                return this.$store.state.material.ds_edit
            },
            material_metering() {
                return this.$store.state.material.unitData
            },
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            material_info() {
                console.log('material_info', this.$store.state.material.materialDetail)
                return this.$store.state.material.materialDetail
            }
        },
        methods: {
            ...mapActions([
				'saveDemoData',
                'changeEditStatus',
                'saveMaterialDetailData'
		    ]),
            change_edit () {
                let materialInfo = this.material_info;
                if(!materialInfo.id){
                    this.$Message.error('请选择具体物资进行编辑')
                } else{
                    this.changeEditStatus(false)
                }
            },
            material_edit_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         //物资信息保存
                        let materialInfo = this.material_info;
                        if(materialInfo.id){//修改
                            materialInfo.userCode = this.userCode;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/material/modifyMaterial',
                                data: materialInfo
                            }).then(
                                response => {
                                    console.log(response)
                                    if ( response.data.code === 200 ) {
                                        this.changeEditStatus(true)
                                        this.$emit('material-edit',this.material_info);
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$Message.error(error)
                                }
                            );
                        } else {//新增
                            let mmaterialInfo = this.material_info;
                            mmaterialInfo.userCode = this.userCode;
                            mmaterialInfo.resTypeId = this.getData;
                            mmaterialInfo.valid = 1;
                                axios({
                                    method: 'post',
                                    url: this.url + '/resource/material/addMaterial',
                                    data: mmaterialInfo
                                }).then(
                                    response => {
                                        this.changeEditStatus(true)
                                        this.$emit('material-save',response.data);
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
            deleteMaterialBefore(){
                let materialInfo = this.material_info;
                if(!materialInfo.id){
                    this.$Message.error('请选择具体物资删除')
                } else{
                    this.delate_material = true
                }
            },
            delete_material () {
                //删除物资信息
                let materialDeleteInfo = {
                    userCode: this.userCode,
                    id: this.material_info.id
                };
                axios({
                    method: 'get',
                    url: this.url + '/resource/material/removeMaterial',
                    params: materialDeleteInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$emit('material-delete',materialDeleteInfo);
                            this.$Message.info('删除成功')
                            this.saveMaterialDetailData('');//清空物资详情缓存
                            this.delate_material = false;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            close_delete_model () {
                this.delate_material = false;
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            close_material () {
                this.$refs['formCustom'].resetFields();
                if(!this.material_info.id){
                    this.changeEditStatus(true);
                    return
                }
                let materialInfo = {
                    userCode: this.userCode,
                    id: this.material_info.id
                }
                axios({
                    method: 'get',
                    url: this.url + '/resource/material/getMaterialDetail',
                    params: materialInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                                //查询物资详情
                                this.changeEditStatus(true);
                                this.saveMaterialDetailData(response.data.data);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                )
            },
            setUnitName(){
                this.material_metering.forEach((v, i) => {
                    if (v.value === this.material_info.unit){
                        this.material_info.unitName = v.label;
                    }
                })
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
                    this.material_info.region.name = data[0].title;
                    this.material_info.region.id = data[0].id;
                    this.$refs.formCustom.validateField('region', valid => {
                    });
                }else if(type === 'affiliationOrg'){
                    this.material_info.affiliationOrg.id = data[0].id;
                    this.material_info.affiliationOrg.name = data[0].title;
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
    .ds_select_unit .ivu-select-disabled .ivu-select-selection {
        background-color: #fff;
        opacity: 1;
        cursor: not-allowed;
        color: #000;
        border:none;
    }
    .ds_select_unit .ivu-icon,
    .ds_select_unit .ivu-select-selection:hover {
        display: none;
    }
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