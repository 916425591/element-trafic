<template>
    <div>
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>保障救援小组</h2>
            </div>
            <div class="ds-member-body">
                <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="120">
                    <row>
                        <i-col span="12">
                            <form-item label="小组名称：" prop="resTypeName">
                            <i-input type="text" v-model="formCustom.resTypeName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="组长：" prop="mode">
                                <i-input type="text" v-model="formCustom.mode" @on-focus="selectEquipmentType"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="副组长：" prop="counts">
                                <!-- <i-input type="text" v-model="formCustom.counts"  @on-focus="selectfuzuzhang"></i-input> -->
                                <div class="input">
                                    <tag v-for="(item, index) in formCustom.counts" :key="index" :name="item" type="border" closable color="blue" @on-close="handleClose2">{{item}}</tag>
                                    <i-button icon="ios-plus-empty" type="dashed" size="small" @click="selectfuzuzhang">添加副组长</i-button>
                                </div>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="小组成员：" prop="members">
                                <!-- <i-input v-model="formCustom.members" type="textarea" placeholder="请输入小组成员" @on-focus="selectTeamMembeMembersrs"></i-input> -->
                                <div class="input">
                                    <tag v-for="(item, index) in formCustom.members" :key="index" :name="item" type="border" closable color="blue" @on-close="handleCloseMembers">{{item}}</tag>
                                    <i-button icon="ios-plus-empty" type="dashed" size="small" @click="selectTeamMembeMembersrs">添加小组成员</i-button>
                                </div>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="小组职责：" prop="duty">
                            <i-input v-model="formCustom.duty" type="textarea" placeholder="请输入小组职责"></i-input>
                            </form-item>
                        </i-col>
                    </row>
                </i-form>
                <div class="ds-member-action">
                    <Button type="primary"  @click="handleSubmit('formCustom', formCustom.id)">保存</Button>
                    <Button type="ghost"  @click="handleReset('formCustom')">清空</Button>
                </div>
            </div>
        </div>
        <div class="ds-widget-box ds-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>小组列表</h2>
            </div>
            <Table border :columns="columns1" :data="teamList" @on-row-click="selectMember"></Table>
            <div class="ds-page-body" v-if="total > pageSize">
                <Page :total="total" :page-size="pageSize" @on-change="changePages" show-total class="ds-page-right"></Page>
            </div>
        </div>
        <Modal v-model="treeMode" width="600" :mask-closable="false" @on-cancel="modalClose">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>{{modelTitle}}</span>
            </p>
            <div class="ds-model-table-box" style="text-align:center">
                <Table border :columns="tableThead" :data="tableTbody" :highlight-row="true" @on-row-click="getSingleRowData" ref="listModule"></Table>
                <div class="ds-page-body" v-if="modalTotal > modalSize">
                    <Page :total="modalTotal" :current="modePage" :page-size="modalSize" @on-change="expertPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
            <div slot="footer">
                <Button size="large" type="primary" @click="modalSave">确认</Button>
                <Button size="large" type="ghost" @click="modalClose">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie';
    export default {
        components: {
        },
        data () {
            const validateResTypeName = (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入小组名称'));
              } else {
                callback()
              }
            };
            const validateMode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择小组组长'));
                } else {
                    callback()
                }
            };
            // const validateCounts = (rule, value, callback) => {
            //     if (value.length > 0) {
            //         callback()
            //     } else {
            //         return callback(new Error('请输入小组副组长（可多选）'));
            //     }
            // };
            const validateUnitName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入小组职责'));
                } else {
                    callback()
                }
            };
            // const validateFunctions = (rule, value, callback) => {
            //     if (value.length > 0) {
            //         callback()
            //     } else {
            //         return callback(new Error('请输入小组成员（可多选）'));
            //     }
            // };
            return {
                height: {
                    height: ''
                },
                tableThead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '电话',
                        key: 'mobile',
                        align: 'center'
                    },
                    {
                        title: '原单位职称',
                        key: 'duty',
                        align: 'center'
                    }
                ],
                tableTbody: [],
                modalTotal: 0,
                modalSize: 8,
                modePage: 1,
                total: 0,
                page: 1,
                selectNode: [],
                treeMode: false,
                formCustom: {
                    resTypeId: null,
                    resTypeName: '',
                    mode: '',
                    modeId: null,
                    counts: [],
                    countsId: [],
                    duty: '',
                    membersId: [],
                    members: []
                },
                ruleCustom: {
                    resTypeName: [
                      { validator: validateResTypeName, trigger: 'blur' }
                    ],
                    mode: [
                    { validator: validateMode, trigger: 'blur' }
                    ],
                    duty: [
                    { validator: validateUnitName, trigger: 'blur' }
                    ],
                    // counts: [
                    // { type: 'array', validator: validateCounts, trigger: 'blur' }
                    // ],
                    // members: [
                    // { type: 'array', validator: validateFunctions, trigger: 'blur' }
                    // ]
                },
                modelTitle: '',
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '小组名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '职责',
                        key: 'duty',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Poptip', {
                                    props: {
                                    confirm: true,
                                    title: '您确定要删除这条数据吗?',
                                    transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            let vm = this
                                            vm.deleteGroup(params)
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            marginRight: '5px'
                                        },
                                        props: {
                                            size: 'small',
                                            placement: 'top',
                                            // type: 'error'
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                teamList: [],
                chooseStatus: 1
            }
        },
        computed: {
            contentNodeId() {
                return this.$store.state.userCode.contentNodeId //nodeId
            },
            planIdInfo() {
                return this.$store.state.userCode.planId //planID
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            pageSize() {
                return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height
            }
        },
        methods: {
             ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getSingleRowData (node) {
                //选择列表的数据
                this.selectNode = node;
            },
            selectEquipmentType () {
                this.modelTitle = '选择小组组长'
                this.chooseStatus = 1 //选择组长
                this.getAllPerson()
                this.treeMode = true;
            },
            selectfuzuzhang() {
                this.modelTitle = '选择小组副组长'
                this.chooseStatus = 2 //选择副组长
                this.getAllPerson()
                this.treeMode = true;
            },
            selectTeamMembeMembersrs() {
                this.modelTitle = '选择小组成员'
                this.chooseStatus = 3
                this.getAllPerson()
                this.treeMode = true;
            },
            getAllPerson(id) {
                const userCode = this.userCode
                const  url = this.url + '/platform/person/queryPersonBase4Paging?size='+ this.modalSize + '&&start=' + this.modePage
                const data = {
                        userCode
                    }
                axios({
                    method: 'post',
                    url: url,
                    data: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.tableTbody = []
                            this.modalTotal = parseInt(response.data.data.total)
                            response.data.data.list.forEach((v, i) => {
                                this.tableTbody.push({
                                    id: v.id,
                                    name: v.name,
                                    mobile: v.mobile,
                                    duty: v.duty
                                })
                            });
                        }
                    }
                ).catch(
                );
            },
            handleSubmit(name, id) {
               this.$refs[name].validate((valid) => {
                    if (valid) {
                        const info = this.formCustom;
                        let members = []
                        members.push({
                            memberOrgId: info.modeId,
                            type: 1
                        })
                        info.countsId.forEach((v, i) => {
                            members.push({
                                memberOrgId: v,
                                type: 2
                            })
                        })
                        info.membersId.forEach((v, i) => {
                            members.push({
                                memberOrgId: v,
                                type: 3
                            })
                        })
                        const data = {
                            name: info.resTypeName,
                            duty: info.duty,
                            nodeId: this.contentNodeId,
                            planId: this.planIdInfo,
                            userCode: this.userCode,
                            members
                        }
                        let url = '';
                        //判断是否新增或者修改
                        // if ( info.id === '') {
                            url = this.url + '/plan/PlanContent4SecurityGroup/addPlanContent4SecurityGroup ';
                        // } else {
                        //     url = '/plan/PlanContent4SecurityGroup/updatePlanContent4SecurityGroup ';
                        // }
                        //提交装备估算信息
                        axios({
                            method: 'post',
                            url: url,
                            data: data
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.getAllGroups()
                                    this.formCustom = {
                                        resTypeId: null,
                                        resTypeName: '',
                                        mode: '',
                                        modeId: null,
                                        counts: [],
                                        countsId: [],
                                        duty: '',
                                        membersId: [],
                                        members: []
                                    }
                                    this.$Message.success('操作成功!');
                                }
                            }
                        ).catch(
                            
                        );
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })
            },
            handleReset (name) {
                this.clearFormCustom();
                
            },
            modalSave (type) {
                //保存tree选择数据
                const treeInfo = this.selectNode
                this.formCustom.resTypeId = treeInfo.id;
                if ( this.chooseStatus === 1) {
                    // 组长
                    this.formCustom.mode = treeInfo.name
                    this.formCustom.modeId = treeInfo.id
                    this.$refs.formCustom.validateField('mode', valid => {
                        
                    });
                } else if (this.chooseStatus === 2) {
                    //副组长
                    this.formCustom.counts.push(treeInfo.name)
                    this.formCustom.countsId.push(treeInfo.id)
                } else {
                    //成员
                    this.formCustom.members.push(treeInfo.name)
                    this.formCustom.membersId.push(treeInfo.id)
                }
                 this.treeMode = false;
            },
            handleCloseMembers (event, name) {
                const index = this.formCustom.members.indexOf(name);
                this.formCustom.members.splice(index, 1);
                this.formCustom.membersId.splice(index, 1);
            },
            handleClose2 (event, name) {
                const index = this.formCustom.counts.indexOf(name);
                this.formCustom.counts.splice(index, 1);
                this.formCustom.countsId.splice(index, 1);
            },
            modalClose () {
            //关闭弹框
            this.modePage = 1;
            this.treeMode = false;
            },
            deleteGroup (data) {
                const index = data.index;
                const id = data.row.id;
                //删除装备信息
                const info = {
                    userCode: this.userCode,
                    id: data.row.id
                }
                axios({
                    method: 'get',
                    url: this.url + '/plan/content/removePlanContent4ResEquipment',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.tableData.splice(index, 1);
                            this.$Message.info('删除成功')
                        }
                    }
                ).catch(
                    
                );
            },
            changePages(num) {
                //翻页功能
                this.page = num;
                //翻页数据查询
                this.getAllGroups()
                
            },
            expertPage(num) {
                this.modePage = num
                this.getAllPerson()
            },
            getAllGroups() {
                const url = this.url + '/plan/PlanContent4SecurityGroup/queryPlanContent4SecurityGroupByPage?pageSize='+ this.pageSize + '&&currentPage=' + this.page
                const info = {
                    userCode: Cookies.get('userCode'),
                    nodeId: this.contentNodeId,
                    planId: this.planIdInfo,
                }
                axios({
                    method: 'post',
                    url: url,
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.total = parseInt(response.data.data.total)
                            this.teamList = response.data.data.list
                        }
                    }
                ).catch(
                    
                );
            },
            selectMember (data) {
                console.log(data)
                this.clearFormCustom();
                const members = data.members;
                for (let i=0;i<members.length;i++) {
                    if (members[i].type === 1) {
                        this.formCustom.mode = members[i].memberOrgName;
                    }
                    if (members[i].type === 2) {
                        this.formCustom.counts.push(members[i].memberOrgName)
                        this.formCustom.countsId.push(members[i].memberOrgId)
                    }
                    if (members[i].type === 3) {
                        this.formCustom.members.push(members[i].memberOrgName)
                        this.formCustom.membersId.push(members[i].memberOrgId)
                    }
                }
                this.formCustom.id = data.id;
                this.formCustom.resTypeName = data.name;
                this.formCustom.duty = data.duty;
            },
            clearFormCustom () {
                this.formCustom = {
                    resTypeId: null,
                    resTypeName: '',
                    mode: '',
                    modeId: null,
                    counts: [],
                    countsId: [],
                    duty: '',
                    membersId: [],
                    members: []
                }
                this.$refs['formCustom'].resetFields();
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(410)
            this.getAllGroups()
        }
    }
</script>

<style scoped>
    .ds-member-body {
        padding: 10px;
    }
    .ds-member-body table td {
        padding: 5px 0;
    }
    .ds-table-left {
        width: 80px;
    }
    .ds-member-action {
        text-align: right;
    }
    .ds-member-action button {
        margin: 0 10px;
    }
</style>

