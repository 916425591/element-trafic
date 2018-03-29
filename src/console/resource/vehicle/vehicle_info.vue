<template>
    <div class="ds-hospital-table ds-widget-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>车辆信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="primary" @click="vehicle_edit_save('formCustom')" v-if="!ds_edit">提交</Button>
                    <Button type="warning" @click="change_edit" v-else>修改</Button>
                    <Button type="error" v-if="ds_edit" @click="deleteVehicleBefore">删除</Button>
                    <Button type="ghost" v-else @click="close_vehicle">取消</Button>
                    <Modal v-model="delate_vehicle" :mask-closable="false" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否删除此条车辆信息？
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>
                            <Button size="large" type="primary" @click="delete_vehicle">确定</Button>
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont">
            <i-form ref="formCustom" :model="vehicle_info" :rules="ruleCustom" :label-width="100">
                <Row>
                <i-col span="8">
                    <form-item label="车辆名称:" prop="name">
                    <span v-if="ds_edit">{{ vehicle_info.name }}</span>
                    <span v-else>
                        <i-input v-model="vehicle_info.name" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="车辆牌号:" prop="plateNumber">
                    <span v-if="ds_edit">{{ vehicle_info.plateNumber }}</span>
                    <span v-else>
                        <i-input v-model="vehicle_info.plateNumber" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="车载电台:">
                    <span v-if="ds_edit">{{ vehicle_info.radioRoda }}</span>
                    <span v-else>
                        <i-input v-model="vehicle_info.radioRoda" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                </Row>
                <Row>
                <i-col span="8">
                    <form-item label="存放区域:" prop="region">
                    <span v-if="ds_edit">{{ vehicle_info.region.name }}</span>
                    <span v-else>
                        <i-input v-model="vehicle_info.region.name" style="width:98%;" @on-focus="open_region"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="存放地点:">
                    <span v-if="ds_edit">{{ vehicle_info.location }}</span>
                    <span v-else>
                        <i-input v-model="vehicle_info.location" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                <i-col span="8">
                    <form-item label="随车装备:">
                    <span v-if="ds_edit">{{ vehicle_info.attachment }}</span>
                    <span v-else>
                        <i-input v-model="vehicle_info.attachment" style="width:98%;"></i-input>
                    </span>
                    </form-item>
                </i-col>
                </Row>
                <Row>
                <i-col span="24">
                    <form-item label="车辆职能:" prop="function">
                    <span v-if="ds_edit">{{ vehicle_info.function }}</span>
                    <span v-else>
                        <i-input v-model="vehicle_info.function" style="width:98%;"></i-input>
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
                    return callback(new Error('请输入车辆名称'));
                } else {
                    callback()
                }
            };
            const validatePlateNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入车辆牌号'));
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
                delate_vehicle: false,
                ds_save: false,
                ruleCustom: {
                    name: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ],
                    region: [
                        { required: true,validator: validateRegion, trigger: 'blur' }
                    ],
                    plateNumber: [
                        { required: true,validator: validatePlateNumber, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getData() {
                return this.$store.state.vehicle.resTypeId
            },
            ds_edit() {
                return this.$store.state.vehicle.ds_edit
            },
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            vehicle_info() {
                return this.$store.state.vehicle.vehicleDetail
            }
        },
        methods: {
            ...mapActions([
				'saveDemoData',
                'changeEditStatus',
                'saveVehicleDetailData'
		    ]),
            change_edit () {
                let vehicleInfo = this.vehicle_info;
                if(!vehicleInfo.id){
                    this.$Message.error('请选择具体车辆进行编辑')
                } else{
                    this.changeEditStatus(false)
                }
            },
            vehicle_edit_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         //车辆信息保存
                        let vehicleInfo = this.vehicle_info;
                        if(vehicleInfo.id){//修改
                            vehicleInfo.userCode = this.userCode;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/vehicle/modifyVehicle',
                                data: vehicleInfo
                            }).then(
                                response => {
                                    console.log(response)
                                    if ( response.data.code === 200 ) {
                                        this.changeEditStatus(true)
                                        this.$emit('vehicle-edit',this.vehicle_info);
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$Message.error(error)
                                }
                            );
                        } else {//新增
                            let mvehicleInfo = this.vehicle_info;
                            mvehicleInfo.userCode = this.userCode;
                            mvehicleInfo.resTypeId = this.getData;
                            mvehicleInfo.valid = 1;
                                axios({
                                    method: 'post',
                                    url: this.url + '/resource/vehicle/addVehicle',
                                    data: mvehicleInfo
                                }).then(
                                    response => {
                                        this.changeEditStatus(true)
                                        this.$emit('vehicle-save',response.data);
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
            deleteVehicleBefore(){
                let vehicleInfo = this.vehicle_info;
                if(!vehicleInfo.id){
                    this.$Message.error('请选择具体车辆删除')
                } else{
                    this.delate_vehicle = true
                }
            },
            delete_vehicle () {
                //删除车辆信息
                let vehicleDeleteInfo = {
                    userCode: this.userCode,
                    id: this.vehicle_info.id
                };
                axios({
                    method: 'get',
                    url: this.url + '/resource/vehicle/removeVehicle',
                    params: vehicleDeleteInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$emit('vehicle-delete',vehicleDeleteInfo);
                            this.$Message.info('删除成功');
                            this.saveVehicleDetailData('');//清空车辆详情缓存
                            this.delate_vehicle = false;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error);
                    }
                );
            },
            close_delete_model () {
                this.delate_vehicle = false;
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            close_vehicle () {
                this.$refs['formCustom'].resetFields();
                if(!this.vehicle_info.id){
                    this.changeEditStatus(true);
                    return
                }
                let vehicleInfo = {
                    userCode: this.userCode,
                    id: this.vehicle_info.id
                }
                axios({
                    method: 'get',
                    url: this.url + '/resource/vehicle/getVehicleDetail',
                    params: vehicleInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                                //查询车辆详情
                            this.changeEditStatus(true);
                            this.saveVehicleDetailData(response.data.data);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error);
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
                    this.vehicle_info.region.name = data[0].title;
                    this.vehicle_info.region.id = data[0].id;
                    this.$refs.formCustom.validateField('region', valid => {
                    });
                }else if(type === 'affiliationOrg'){
                    this.vehicle_info.affiliationOrg.id = data[0].id;
                    this.vehicle_info.affiliationOrg.name = data[0].title;
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