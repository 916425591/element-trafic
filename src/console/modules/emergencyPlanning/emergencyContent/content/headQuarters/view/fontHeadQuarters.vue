<template>
    <div>
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2 :data-id='quartersType'>前线指挥部</h2>
            </div>
            <div style="height: 305px; overflow-y: scroll;">
                <Row>
                    <i-col span="3" class="ds-expert-head">
                        <div @click="chooseHeadQuartersLeader(leader.id)">
                            <Icon class="ds-bg-icon" type="person"></Icon>
                            <p>{{ leader.title }}</p>
                        </div>
                    </i-col>
                    <i-col span="21">
                        <table class="ds-quarter-table">
                            <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        姓名:
                                    </td>
                                    <td>
                                        {{ leader.name }}
                                    </td>
                                    <td class="ds-table-left">
                                       原单位职务：
                                    </td>
                                    <td>
                                        {{ leader.dutyName }}
                                    </td>
                                    <td class="ds-table-left">
                                        联系电话：
                                    </td>
                                    <td>{{ leader.mobile }}</td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        职责：
                                    </td>
                                    <td colspan="5">
                                        <i-input type="textarea" v-model="leader.duty" :rows="3"></i-input>
                                    </td>
                                    <td class="ds-quarter-btn">
                                        <Button type="primary" @click="saveDuty(leader.id)" style="">保存</Button>
                                        <poptip confirm placement="left" title="您确认删除这条内容吗？" @on-ok="deleteDuty(leader.id)" @on-cancel="cancel" style="margin-top: 5px;">
                                            <Button type="error">删除</Button>
                                        </poptip>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </i-col>
                </Row>
                <Row v-for="item in headQuartersList" :key="item.id">
                    <i-col span="3" class="ds-expert-head">
                        <div @click="chooseHeadQuarters(item.id)">
                            <Icon class="ds-bg-icon" type="person"></Icon>
                            <p>{{ item.title }}</p>
                        </div>
                    </i-col>
                    <i-col span="21">
                        <table class="ds-quarter-table">
                            <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        姓名：
                                    </td>
                                    <td>
                                        {{ item.name }}
                                    </td>
                                    <td class="ds-table-left">
                                       原单位职务：
                                    </td>
                                    <td>
                                        {{ item.dutyName }}
                                    </td>
                                    <td class="ds-table-left">
                                        联系电话：
                                    </td>
                                    <td>{{ item.mobile }}</td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        职责：
                                    </td>
                                    <td colspan="5">
                                        <i-input type="textarea" v-model="item.function" :rows="3"></i-input>
                                    </td>
                                    <td class="ds-quarter-btn">
                                        <Button type="primary" @click="saveDuty(item.id, item.function)" style="">保存</Button>
                                        <poptip placement="left" confirm title="您确认删除这条内容吗？" @on-ok="deleteDuty(item.id)" @on-cancel="cancel" style="margin-top: 5px;">
                                            <Button type="error">删除</Button>
                                        </poptip>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="3" class="ds-expert-head">
                        <div @click="addDeputyConductor">
                            <Icon class="ds-bg-icon" type="person-add"></Icon>
                            <p>副指挥</p>
                        </div>
                    </i-col>
                    <i-col span="21"></i-col>
                </Row>
            </div>
        </div>
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>指挥部成员</h2>
                <div class="ds-fload-right">
                    <Button type="success" @click="chooseMenmbers">新增</Button>
                </div>
            </div>
            <div class="ds-expertMemberBody" :style='height' :data-json="tableHeight">
                <Table border :columns="columns1" :data="data1"></Table>
            </div>
        </div>
        <Modal v-model="treeMode" width="600" :mask-closable="false" @on-cancel="modalClose">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>选择指挥部成员</span>
            </p>
            <div style="text-align:center">
                <i-input icon="ios-search" v-model="name" @on-click="queryMembers" @on-enter="queryMembers" style="width: 100%;margin-bottom: 10px;" placeholder="请输入查询人名称……"></i-input>
                <Table border :columns="tableThead" :data="tableTbody" :highlight-row="true" @on-row-click="getSingleRowData" ref="listModule"></Table>
                <div class="ds-page-body" v-if="total > pageSize">
                    <Page :total="total" :page-size="pageSize" @on-change="expertPage" show-total class="ds-page-right"></Page>
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
            return {
                height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则新增此样式*/
                },
                leader:{
                    name: '',
                    duty: '',
                    mobile: '',
                    dutyName: '',
                    title: '指挥长'
                },
                pageSize: 7,
                pageNum: 1,
                total: 0,
                selectNode: [],
                treeMode: false,
                headQuartersList: [],
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
                        title: '原单位职务',
                        key: 'duty',
                        align: 'center'
                    }
                ],
                tableTbody: [],
                columns1: [
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
                        title: '原单位职务',
                        key: 'dutyName',
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
                                            vm.deleteDuty(params.row.id, params.index)
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
                data1: [],
                chooseStatus: '1', // 3 新增指挥部成员  2 替换组长/副组长  1新增组长/副组长信息
                dutyStatus: 1,
                name: ''
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(455)
            this.getAllHeadQuarters()
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
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height
            },
            quartersType() {
                return this.$store.state.userCode.quartersType //userCode
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
            modalSave () {
                const treeInfo = this.selectNode
                const url = this.url + '/plan/headquarters/addHeadquarters'
                const data = {
                    duty: this.dutyStatus,
                    member: {
                        id: this.selectNode.id 
                    },
                    node: {
                        id: this.contentNodeId
                    },
                    plan: {
                        id: this.planIdInfo
                    },
                    userCode: this.userCode,
                    type: this.quartersType
                }
                axios({
                    method: 'post',
                    url: url,
                    data: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.getAllHeadQuarters()
                            this.$Message.info('添加成功');
                            this.treeMode = false;
                        } else {
                            this.$Message.error('添加失败')
                        }
                    }
                ).catch(
                );
                //保存tree选择数据
                
            },
            modalClose () {
                //关闭装备类型弹框
                this.treeMode = false;
            },
            chooseHeadQuartersLeader(id) {
                this.dutyStatus = 1
                this.getAllPerson(id)
                this.treeMode = true
            },
            chooseHeadQuarters(id) {
                this.dutyStatus = 2
                this.chooseStatus = '2'
                this.getAllPerson(id)
                this.treeMode = true
            },
            saveDuty(id, functionsInfo) {
                const url = this.url + '/plan/headquarters/modifyHeadquarters'
                let functions
                if(this.dutyStatus === 1) {
                    functions = this.leader.duty
                } else {
                    functions = functionsInfo
                }
                axios({
                    method: 'post',
                    url: url,
                    data: {
                        userCode: this.userCode,
                        id,
                        function:functions,
                        type: this.quartersType
                    }
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('修改成功');
                        } else {
                            this.$Message.error('修改失败')
                        }
                    }
                ).catch(
                );
            },
            chooseMenmbers() {
                this.dutyStatus = 3
                this.chooseStatus = '2'
                this.getAllPerson()
                this.treeMode = true
            },
            //列表获取信息
            queryMembers() {
                this.getAllPerson()
            },
            getAllPerson(id) {
                const userCode = this.userCode
                const  url = this.url + '/platform/person/queryPersonBase4Paging?size='+ this.pageSize + '&&start=' + this.pageNum
                let data = {}
                if(id) {
                    data = {
                        oldExpertId: id,
                        userCode,
                        type: this.quartersType,
                        objName: this.name
                    }
                } else {
                    data = {
                        userCode,
                        type: this.quartersType,
                        objName: this.name
                    }
                }
                axios({
                    method: 'post',
                    url: url,
                    data: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.tableTbody = []
                            this.total = parseInt(response.data.data.total)
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
            addDeputyConductor() {
                this.dutyStatus = 2
                this.chooseStatus = '1'
                this.getAllPerson()
                this.treeMode = true
            },
            deleteDuty(id, index) {
                const url = this.url + '/plan/headquarters/removeHeadquarters'
                const data = {
                    userCode: this.userCode,
                    id,
                    type: this.quartersType
                }
                axios({
                    method: 'get',
                    url: url,
                    params: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.getAllHeadQuarters()
                            this.$Message.info('删除成功');
                        } else {
                            this.$Message.error('删除失败')
                        }
                    }
                ).catch(
                );
            },
            cancel() {
            },
            expertPage (num) {
                //翻页功能
                this.pageNum = num;
                //翻页数据查询
                this.getAllPerson();
            },
            getAllHeadQuarters() {
                const url = this.url + '/plan/headquarters/findHeadquarters2Map'
                const userCode = this.userCode
                axios({
                    method: 'get',
                    url: url,
                    params: { 
                        userCode,
                        planId: this.planIdInfo,
                        nodeId: this.contentNodeId,
                        type: this.quartersType
                    }
                }).then(
                    response => {
                        this.leader = {
                            name: '',
                            duty: '',
                            mobile: '',
                            type: '',
                            expertise: '',
                            dutyName: '',
                            experience: ''
                        }
                        this.data1 = []
                        this.headQuartersList = []
                        if ( response.data.code === 200 ) {
                            const res = response.data.data
                            if(res && res.commander) {
                                this.leader = {
                                    id: res.commander.id,
                                    name: res.commander.member.name,
                                    duty: res.commander.function ? res.commander.function : '',
                                    mobile: res.commander.member.mobile,
                                    dutyName: res.commander.member.duty,
                                    title: '总指挥'
                                }
                            }
                            if(res && res.deputyCommander) {
                                res.deputyCommander.forEach((v, i) => {
                                    this.headQuartersList.push({
                                        id: v.id,
                                        name: v.member.name,
                                        function: v.function ? v.function : '',
                                        mobile: v.member.mobile,
                                        dutyName: v.member.duty,
                                        title: '副指挥'
                                    })
                                })
                            }
                            if(res && res.member) {
                                res.member.forEach((v, i) => {
                                    this.data1.push({
                                        id: v.id,
                                        name: v.member.name,
                                        duty: v.function ? v.function : '',
                                        mobile: v.member.mobile,
                                        dutyName: v.member.duty
                                    })
                                })
                            }
                        }
                    }
                ).catch(
                );
            }
        }
    }
</script>

<style scoped>
    .ds-quarter-table {
        width: 100%;
    }
    .ds-quarter-table td {
        padding: 5px 0;
    }
    .ds-table-left {
        width: 90px;
    }
    .ds-expert-head {
        text-align: center;
    }
    .ds-bg-icon {
        font-size: 50px;
    }
    .ds-expert-list {
        line-height: 30px;
    }
    .ds-quarter-table .ds-quarter-btn {
        width: 80px;
        text-align: right;
        padding-right: 10px;
    }
</style>

