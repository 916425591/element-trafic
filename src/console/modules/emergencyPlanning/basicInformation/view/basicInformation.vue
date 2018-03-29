<template>
    <div>
        <div class="ds-widget-box ds-box" :style="height" :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>预案基本信息</h2>
            </div>
            <Row>
                <i-col span="24" style="padding:0 0 0 30px;margin:30px 0;">
                    <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100">
                        <div>
                            <Row>
                                <i-col span="24">
                                    <form-item label="预案名称：" prop="name">
                                        <i-input type="text" v-model="formCustom.name" style="width:200px;"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="预案类型：" prop="planType">
                                        <i-input type="text" v-model="formCustom.planType" @on-focus="openAddPlanType" style="width:200px;"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="事件级别：" prop="incidentLevelId">
                                        <Select v-model="formCustom.incidentLevelId" style="width:200px;" @on-change="changeINcidentLevel">
                                            <Option v-for="item in incidentLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </form-item>
                                </i-col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <i-col span="24">
                                    <form-item label="事件类型：" prop="type">
                                        <i-input type="text" v-model="formCustom.type" @on-focus="selectOtherType" style="width:200px;"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="主编单位：" prop="org">
                                        <i-input type="text" v-model="formCustom.org"  @on-focus="selectOrg" style="width:200px;"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <i-col span="24">
                                    <form-item label="检索关键字：" prop="keyWords">
                                        <i-input type="text" v-model="formCustom.keyWords" style="width:200px;"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="24">
                                    <form-item label="适用区域：" prop="area">
                                        <i-input v-model="formCustom.area" type="text" placeholder="请输入适用区域"  @on-focus="selectArea" style="width:200px;"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                        </div>
                    </i-form>
                    <div style="padding-left:240px;">
                        <Button type="warning"  @click="handleSubmit('formCustom')">修改</Button>
                    </div>
                    <div>
                    </div>
                </i-col>
            </Row>
        </div>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import tree from '@/common/components/treeModal/tree'
    import Cookies from 'js-cookie';

    export default {
        components: {
            tree
        },
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入预案名称'));
                } else {
                    callback()
                }
            };
            const validateType = (rule, value, callback) => {
                if (!value) {
                    if(value.title){
                        callback()
                    } else {
                        return callback(new Error('请输入事件类型'));
                    }
                } else {
                    callback()
                }
            };
            const validateOrg = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入主编单位'));
                } else {
                    callback()
                }
            };
            const validateKeyWords = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入检索关键字'));
                } else {
                    callback()
                }
            };
            const validateArea = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入适用区域'));
                } else {
                    callback()
                }
            };
            return {
                height: {
                    height: '',
                },
                incidentLevel: [],
                treeMode: false,
                formCustom: {
                    name: '',
                    type: '',
                    org: '',
                    keyWords: '',
                    area: '',
                    planType: '',
                    incidentLevelId: null,
                    incidentLevelName: ''
                },
                ruleCustom: {
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    type: [
                        { validator: validateType, trigger: 'blur' }
                    ],
                    org: [
                        { validator: validateOrg, trigger: 'blur' }
                    ],
                    keyWords: [
                        { validator: validateKeyWords, trigger: 'blur' }
                    ],
                    area: [
                        { validator: validateArea, trigger: 'blur' }
                    ]
                },
            }
        },
        computed: {
            planIdInfo() {
                return this.$store.state.userCode.planId //planID
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created() {
            this.selectINfo()
            this.addPlan()
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(80)
        },
        methods: {
            changeINcidentLevel(data) {
                const len = this.incidentLevel.length
                this.incidentLevel.forEach((v, i) => {
                    if(v.value === data){
                        this.formCustom.incidentLevelName = v.label
                    }
                });
            },
            selectINfo(){
                const url = this.url + '/plan/content/getPlanDetail'
                axios({
                    method: 'get',
                    url: url,
                    params: {
                       userCode: this.userCode,
                       id: this.planIdInfo
                    }
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            const res = response.data.data
                            this.formCustom = {
                                id: res.id,
                                name: res.name,
                                type: res.incidentTypeName,
                                typeId: res.incidentTypeId,
                                org: res.chiefEditOrgName,
                                orgId: res.chiefEditOrg,
                                keyWords: res.keyWords,
                                area: res.regionName,
                                areaId: res.regionId,
                                planType: res.planTypeName,
                                planTypeId: res.planTypeId,
                                incidentLevelName: res.incidentLevelName,
                                incidentLevelId: res.incidentLevelId
                            }
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                )
            },
            ...mapActions([
                'saveDemoData',
                'changeListNode',
                'setHeightContent',
                'tableHeightMessage'
            ]),
            treeModalClose() {
                this.treeMode = false
            },
            treeModalSave (treeInfo,type) {
                /**
                 * 1   事件类型
                 * 2   适用区域
                 * 3   主编单位
                 */
                if (type === '1') {
                    this.formCustom.type = treeInfo[0].title
                    this.formCustom.incidentTypeId = treeInfo[0].id
                } 
                if (type === '2') {
                    this.formCustom.area = treeInfo[0].title
                    this.formCustom.regionId = treeInfo[0].id
                }
                if (type === '3') {
                    this.formCustom.org = treeInfo[0].title
                    this.formCustom.chiefEditOrg = treeInfo[0].id
                }
                if (type === '4') {
                    this.formCustom.planType = treeInfo[0].title
                    this.formCustom.planTypeId = treeInfo[0].id
                }
                this.treeMode = false;
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const data = {
                            userCode: this.userCode,
                            id: this.formCustom.id,
                            name: this.formCustom.name,
                            keyWords: this.formCustom.keyWords,
                            chiefEditOrg: this.formCustom.chiefEditOrg,
                            incidentTypeId: this.formCustom.incidentTypeId,
                            regionId: this.formCustom.regionId,
                            planTypeId: this.formCustom.planTypeId,
                            incidentLevelId: this.formCustom.incidentLevelId
                        }
                        const params = this.formCustom
                        const url = this.url + '/plan/content/modifyPlan'
                        axios({
                            method: 'post',
                            url: url,
                            data: data
                        }).then(
                            response => {
                                if(response.data.code === 200) {
                                    this.changeListNode(params)
                                    this.$Message.info('保存成功')
                                } else {
                                    this.$Message.error('保存失败')
                                }
                            }
                        ).catch(
                            error => {
                                
                            }
                        )
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })
            },
            addPlan () {
                //预案新增
                //查询事件类型
                let userCode = Cookies.get('userCode');
                const info = {
                    userCode: userCode
                }
                axios({
                    method: 'post',
                    url: this.url + '/platform/incidentLevel/queryIncidentLevelMaintain?start=1&size=20',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let list = response.data.data.list;
                            let newList = [];
                            for ( let i=0;i<list.length;i++ ) {
                                newList.push({
                                    value: list[i].id,
                                    label: list[i].name
                                })
                            }
                            this.$set(this,'incidentLevel',newList);
                        }
                    }
                ).catch(
                    
                )
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            selectOtherType () {
                let TreeInfo = {
                    title: '事件类型',
                    treeMultiple: false,
                    additional: '1',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryIncidentTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            selectArea() {
                let TreeInfo = {
                    title: '适用区域',
                    treeMultiple: false,
                    additional: '2',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryRegionTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            selectOrg() {
                let TreeInfo = {
                    title: '主编单位',
                    treeMultiple: false,
                    additional: '3',
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryOrgTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            openAddPlanType () {
                //打开预案新增预案类型弹窗
                let TreeInfo = {
                    title: '预案类型',
                    treeMultiple: false,
                    additional: '4',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.url + '/platform/public/queryPlanTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            }
        }
    }
</script>

<style scoped>
    .ds-table-left {
        padding-left: 5px;
        width: 80px;
    }
    .ds-search-box {
        text-align: center;
    }
    .ds-search-box>div:nth-child(2) {
        margin-top: 10px;
    }
    .ds-content-box {
        margin: 5px;
    }
    .ds-basic-tree {
        margin: 5px 10px;
    }
    .ds-search-box {
        margin-right: 0;
    }
</style>

