<template>
    <div class="ds-hospital-table ds-widget-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>装备信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="primary"  @click="equipment_edit_save('formCustom')" v-if="!ds_edit">提交</Button>
                    <Button type="warning" @click="change_edit" v-else>修改</Button>
                    <Button type="error" v-if="ds_edit" @click="deleteEquipmentBefore">删除</Button>
                    <Button type="ghost" v-else @click="close_equipment">取消</Button>
                    <Modal v-model="delate_equipment" :mask-closable="false" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否删除此条装备信息？
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>
                            <Button size="large" type="primary" @click="delete_equipment">确定</Button>
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <i-form ref="formCustom" :model="equipment_info" :rules="ruleCustom" :label-width="100">
                <Row>
                <i-col span="8">
                    <form-item label="装备名称:" prop="name">
                    <span v-if="ds_edit">{{ equipment_info.name }}</span>
                    <span v-else>
                        <i-input v-model="equipment_info.name"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="存放区域:" prop="region">
                    <span v-if="ds_edit">{{ equipment_info.region.name }}</span>
                    <span v-else>
                        <i-input v-model="equipment_info.region.name" @on-focus="open_region"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="存放地点:">
                    <span v-if="ds_edit">{{ equipment_info.location }}</span>
                    <span v-else>
                        <i-input v-model="equipment_info.location"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="可用数量:" prop="canUseQuantity">
                    <span v-if="ds_edit">{{ equipment_info.canUseQuantity }}{{ equipment_info.unitName }}</span>
                    <span v-else>
                        <i-input v-model="equipment_info.canUseQuantity"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="计量单位:">
                        <span v-if="ds_edit">{{ equipment_info.unitName }}</span>
                        <span v-else>
                            <Select v-model="equipment_info.unit" @on-change="setUnitName">
                                <Option v-for="item in equipment_metering" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="规格型号:">
                    <span v-if="ds_edit">{{ equipment_info.equipmentsType }}</span>
                    <span v-else>
                        <i-input v-model="equipment_info.equipmentsType"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="24">
                    <form-item label="装备职能:">
                        <span v-if="ds_edit">{{ equipment_info.function }}</span>
                        <span v-else>
                            <i-input v-model="equipment_info.function"></i-input>
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
                    return callback(new Error('请输入装备名称'));
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
                    return callback(new Error('请选择存放区域'));
                } else {
                    callback()
                }
            };
            return {
                treeModal: false,
                delate_equipment: false,
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
                return this.$store.state.equipment.resTypeId
            },
            ds_edit() {
                return this.$store.state.equipment.ds_edit
            },
            equipment_metering() {
                return this.$store.state.equipment.unitData
            },
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            equipment_info() {
                console.log('equipment_info', this.$store.state.equipment.equipmentDetail)
                return this.$store.state.equipment.equipmentDetail
            }
        },
        methods: {
            ...mapActions([
				'saveDemoData',
                'changeEditStatus',
                'saveEquipmentDetailData'
		    ]),
            change_edit () {
                let equipmentInfo = this.equipment_info;
                if(!equipmentInfo.id){
                    this.$Message.error('请选择具体装备进行编辑');
                } else{
                    this.changeEditStatus(false)
                }
            },
            equipment_edit_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         //装备信息保存
                        let equipmentInfo = this.equipment_info;
                        if(equipmentInfo.id){//修改
                            equipmentInfo.userCode = this.userCode;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/equipment/modifyEquipment',
                                data: equipmentInfo
                            }).then(
                                response => {
                                    if ( response.data.code === 200 ) {
                                        this.changeEditStatus(true)
                                        this.$emit('equipment-edit',this.equipment_info);
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$Message.error(error)
                                }
                            );
                        } else {//新增
                            let mequipmentInfo = this.equipment_info;
                            mequipmentInfo.userCode = this.userCode;
                            mequipmentInfo.resTypeId = this.getData;
                            mequipmentInfo.valid = 1;
                                axios({
                                    method: 'post',
                                    url: this.url + '/resource/equipment/addEquipment',
                                    data: mequipmentInfo
                                }).then(
                                    response => {
                                        this.changeEditStatus(true)
                                        this.$emit('equipment-save',response.data);
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
            deleteEquipmentBefore(){
                let equipmentInfo = this.equipment_info;
                if(!equipmentInfo.id){
                    this.$Message.error('请选择具体装备删除')
                } else{
                    this.delate_equipment = true
                }
            },
            delete_equipment () {
                //删除装备信息
                let equipmentDeleteInfo = {
                    userCode: this.userCode,
                    id: this.equipment_info.id
                };
                axios({
                    method: 'get',
                    url: this.url + '/resource/equipment/removeEquipment',
                    params: equipmentDeleteInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$emit('equipment-delete',equipmentDeleteInfo);
                            this.$Message.info('删除成功')
                            this.saveEquipmentDetailData('');//清空装备详情缓存
                            this.delate_equipment = false;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            close_delete_model () {
                this.delate_equipment = false;
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            close_equipment () {
                this.$refs['formCustom'].resetFields();
                if(!this.equipment_info.id){
                    this.changeEditStatus(true);
                    return
                }
                let equipmentInfo = {
                    userCode: this.userCode,
                    id: this.equipment_info.id
                }
                axios({
                    method: 'get',
                    url: this.url + '/resource/equipment/getEquipmentDetail',
                    params: equipmentInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                                //查询装备详情
                                this.changeEditStatus(true);
                                this.saveEquipmentDetailData(response.data.data);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                )
            },
            setUnitName(){
                this.equipment_metering.forEach((v, i) => {
                    if (v.value === this.equipment_info.unit){
                        this.equipment_info.unitName = v.label;
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
                    this.equipment_info.region.name = data[0].title;
                    this.equipment_info.region.id = data[0].id;
                    this.$refs.formCustom.validateField('region', valid => {
                    });
                }else if(type === 'affiliationOrg'){
                    this.equipment_info.affiliationOrg.id = data[0].id;
                    this.equipment_info.affiliationOrg.name = data[0].title;
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