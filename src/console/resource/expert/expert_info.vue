<template>
    <div class="ds-hospital-table ds-widget-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>专家信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="primary" @click="expert_edit_save('formCustom')" v-if="!ds_edit">提交</Button>
                    <Button type="warning" @click="change_edit" v-else>修改</Button>
                    <Button type="error" v-if="ds_edit" @click="deleteExpertBefore">删除</Button>
                    <Button type="ghost" v-else @click="close_expert">取消</Button>
                    <Modal v-model="delate_expert" :mask-closable="false" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否删除此条专家信息？
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>
                            <Button size="large" type="primary" @click="delete_expert">确定</Button>
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
            <i-form ref="formCustom" :model="expert_info" :rules="ruleCustom" :label-width="100">
                <Row>
                    <i-col span="24">
                        <Row>
                             <i-col span="12">
                                <form-item label="专家名称:" prop="name">
                                    <span v-if="ds_edit">{{ expert_info.name }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.name" style="width:98%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="12">
                                <form-item label="移动电话:" prop="mobile">
                                    <span v-if="ds_edit">{{ expert_info.mobile }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.mobile" style="width:98%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="12">
                                <form-item label="主管单位:" prop="dutyOrg">
                                    <span v-if="ds_edit">{{ expert_info.dutyOrg.name }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.dutyOrg.name" style="width:98%;" @on-focus="open_dutyOrg"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="12">
                                <form-item label="专业类别:">
                                    <span v-if="ds_edit">{{ expert_info.major }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.major" style="width:98%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="12">
                                <form-item label="专家职务:">
                                    <span v-if="ds_edit">{{ expert_info.duty }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.duty" style="width:98%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="12">
                                <form-item label="专家职称:">
                                    <span v-if="ds_edit">{{ expert_info.dutyTitle }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.dutyTitle" style="width:98%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="24">
                                <form-item label="专家专长:">
                                    <span v-if="ds_edit">{{ expert_info.expertise }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.expertise" style="width:99%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="24">
                                <form-item label="处置经验:">
                                    <span v-if="ds_edit">{{ expert_info.experience }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.experience" style="width:99%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="24">
                                <form-item label="学术成果:">
                                    <span v-if="ds_edit">{{ expert_info.academic }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.academic" style="width:99%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                             <i-col span="24">
                                <form-item label="通讯地址:">
                                    <span v-if="ds_edit">{{ expert_info.address }}</span>
                                    <span v-else>
                                        <i-input v-model="expert_info.address" style="width:99%;"></i-input>
                                    </span>
                                </form-item>
                             </i-col>
                        </Row>                    
                    </i-col>
                    <!-- 暂时屏蔽头像功能 -->
                    <!-- <i-col span="6">
                        <Row>
                             <i-col span="24" style="text-align:center;">
                                <img src="../../../common/assets/images/user.jpg" alt="" width="100" height="100">
                                <Upload action="http://192.168.0.29:80/resource/expert/uploadImage?userCode=sys&id=8" name="pic">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">选择图片</Button>
                                </Upload>
                             </i-col>
                             <i-col span="24">
                                <form-item label="性别:">
                                    <span v-if="ds_edit">{{ expert_info.sexName }}</span>
                                    <span v-else>
                                        <RadioGroup v-model="expert_info.sex">
                                            <Radio label="1">
                                                <Icon type="man"></Icon>
                                                <span>男</span>
                                            </Radio>
                                            <Radio label="2">
                                                <Icon type="woman"></Icon>
                                                <span>女</span>
                                            </Radio>
                                        </RadioGroup>
                                    </span>
                                </form-item>
                             </i-col>
                        </Row>
                    </i-col> -->
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
                    return callback(new Error('请输入专家名称'));
                } else {
                    callback()
                }
            };
            const validateMobile = (rule, value, callback) => {
                if(value && !RULE.strictMobile.test(value)){
                    return callback(new Error('手机号码格式不正确'));
                } else {
                    callback()
                }
            };
            const validateEmail = (rule, value, callback) => {
                if(value && !RULE.EmailReg.test(value)){
                    return callback(new Error('邮箱格式不正确'));
                } else {
                    callback()
                }
            };
            const validateDutyOrg = (rule, value, callback) => {
                if (!value || !value.id) {
                    return callback(new Error('请选择主管单位'));
                } else {
                    callback()
                }
            };
            return {
                height: {
                    height: ''
                },
                treeModal: false,
                delate_expert: false,
                ruleCustom: {
                    name: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ],
                    mobile: [
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    email: [
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                    dutyOrg: [
                        { required: true,validator: validateDutyOrg, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getData() {
                return this.$store.state.expert.resTypeId
            },
            ds_edit() {
                return this.$store.state.expert.ds_edit
            },
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            expert_info() {
                return this.$store.state.expert.expertDetail
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(72)
        },
        methods: {
            ...mapActions([
				'saveDemoData',
                'changeEditStatus',
                'saveExpertDetailData',
                'setHeightContent',
                'tableHeightMessage'
		    ]),
            change_edit () {
                let expertInfo = this.expert_info;
                if(!expertInfo.id){
                    this.$Message.error('请选择具体专家进行编辑')
                } else{
                    this.changeEditStatus(false)
                }
            },
            expert_edit_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         //专家信息保存修改
                        let expertInfo = this.expert_info;
                        if(expertInfo.id){//修改
                            expertInfo.userCode = this.userCode;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/expert/modifyExpert',
                                data: expertInfo
                            }).then(
                                response => {
                                    if ( response.data.code === 200 ) {
                                        this.changeEditStatus(true);
                                        this.$emit('expert-edit',this.expert_info);
                                    }
                                }
                            ).catch(
                                error => {
                                    this.$Message.error(error)
                                }
                            );
                        } else {//新增
                            let expertInfo = this.expert_info;
                            expertInfo.userCode = this.userCode;
                            expertInfo.resTypeId = this.getData;
                            axios({
                                method: 'post',
                                url: this.url + '/resource/expert/addExpert',
                                data: expertInfo
                            }).then(
                                response => {
                                    this.changeEditStatus(true);
                                    this.$emit('expert-save',response.data);
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
            deleteExpertBefore(){
                let expertInfo = this.expert_info;
                if(!expertInfo.id){
                    this.$Message.error('请选择具体专家删除')
                } else{
                    this.delate_expert = true
                }
            },
            delete_expert () {
                //删除专家信息
                let expertDeleteInfo = {
                    userCode: this.userCode,
                    expertId: this.expert_info.id
                };
                axios({
                    method: 'get',
                    url: this.url + '/resource/expert/removeExpert',
                    params: expertDeleteInfo
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$emit('expert-delete',expertDeleteInfo);
                            this.$Message.info('删除成功')
                            this.saveExpertDetailData('');//清空专家详情缓存
                            this.delate_expert = false;
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            close_delete_model () {
                this.delate_expert = false;
            },
            close_expert () {
                this.$refs['formCustom'].resetFields();
                if(!this.expert_info.id){
                    this.changeEditStatus(true);
                    return
                }
                let expertInfo = {
                        userCode: this.userCode,
                        expertId: this.expert_info.id
                    }
                    axios({
                        method: 'get',
                        url: this.url + '/resource/expert/getExpertDetail',
                        params: expertInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                 //查询避险场所详情
                                this.changeEditStatus(true);
                                const res = response.data.data;
                                if(res.sex === 1) {
                                        res.sexName = '男';
                                } else if(res.sex === 2){
                                    res.sexName = '女';
                                }
                                this.saveExpertDetailData(res);
                            }
                        }
                    ).catch(
                        error => {
                            this.$Message.error(error)
                        }
                    )
            },
            changeDateFormat (data){
                this.expert_info.birthday = data;
            },
            open_dutyOrg(){
                let TreeInfo = {
                    title: '选择责任单位',
                    treeMultiple: false,
                    additional: 'dutyOrg',
                    request: 'post',
                    queryInfo: {
                    userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryOrgTree4New'
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
                if(type === 'dutyOrg'){
                    this.expert_info.dutyOrg.name = data[0].title;
                    this.expert_info.dutyOrg.id = data[0].id;
                    this.$refs.formCustom.validateField('dutyOrg', valid => {
                    });
                }else if(type === 'affiliationOrg'){
                    this.expert_info.affiliationOrg.id = data[0].id;
                    this.expert_info.affiliationOrg.name = data[0].title;
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