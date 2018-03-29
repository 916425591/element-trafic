<template>
    <!-- 成员单位 -->
    <div class="ds-widget-box ds-box"  :style="height" :data-json="tableHeight">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>成员单位信息</h2>
        </div>
        <div>
            <ul class="ds-member-list">
                <li v-for="(item,index) in memberList" :key="index">
                    <Card style="" dis-hover>
                        <p slot="title">
                            <Icon type="home"></Icon>
                            {{ item.title}}
                        </p>
                        <div slot="extra">
                            <Poptip confirm placement="left" title="您确认删除这条内容吗？" @on-ok="deleteMemberOrg(item)" @on-cancel="cancel">
                                <a class="ds-member-a">
                                    <Icon style="font-size: 40px;" color="#fff" type="ios-close-empty"></Icon>
                                </a>
                            </Poptip>
                        </div>
                        <div class="ds-member-body">
                            <div>
                                <div v-if="item.person" class="ds-pointer">
                                    <span @click="editPrincipal(index)">
                                        <Icon type="person"></Icon>
                                    </span>
                                    <span @click="editPrincipal(index)">({{ item.person.personName }})</span>
                                    <span @click="editPrincipal(index)">{{ item.person.mobile }}</span>
                                </div>
                                <div v-else>
                                    <span class="ds-pointer" @click="editPrincipal(index)">
                                        <Icon type="person-add"></Icon>
                                    </span>
                                    <span @click="editPrincipal(index)" >点击选择负责人</span>
                                </div>
                            </div>
                            <!-- <div>
                                <div v-if="item.person" class="ds-pointer">
                                    <span>
                                        <Icon type="person"></Icon>
                                    </span>
                                    <span>({{ item.person.personName }})</span>
                                    <span>{{ item.person.mobile }}</span>
                                </div>
                                <div v-else>
                                    <span class="ds-pointer">
                                        <Icon type="person-add"></Icon>
                                    </span>
                                    <span>点击选择负责人</span>
                                </div>
                            </div> -->
                            <div>
                                <i-input v-model="item.functions" placeholder="请输入职责。" type="textarea" :rows="7" @on-change="dutyFocus(index)"></i-input>
                            </div>
                            <div v-if="item.showBtn" class="ds-member-card">
                                <Button type="primary"  @click="saveMemberOrg(item.id, index)">
                                    保存
                                </Button>
                                <Button type="ghost"  @click="cancelDuty(index)">
                                    取消
                                </Button>
                            </div>
                        </div>
                    </Card>
                </li>
                <li>
                    <Card style="" dis-hover>
                        <p slot="title">
                            <Icon type="home"></Icon>
                            新成员单位
                        </p>
                        <div class="ds-member-body">
                            <div class="ds-nomember" @click="openTreeModal">
                                点击添加新的成员单位
                            </div>
                        </div>
                    </Card>
                </li>
            </ul>
        </div>
        <Modal v-model="tableMode" width="600" :mask-closable="false" @on-cancel="modalClose" class-name="vertical-center-modal">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>选择负责人</span>
            </p>
            <div style="text-align:center">
                <Table border :columns="tableThead" :data="tableTbody" :highlight-row="true" @on-row-click="getSingleRowData" @on-row-dblclick="modalSave" ref="listModule"></Table>
                <div class="ds-page-body">
                    <Page v-if="true" :total="modalTotal" :page-size="modalSize" @on-change="expertPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" @click="modalSave">确认</Button>
                <Button type="ghost" @click="modalClose">取消</Button>
            </div>
        </Modal>
        <member-tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></member-tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import memberTree from '@/common/components/treeModal/tree'
    import Cookies from 'js-cookie';

    export default {
        components: {
            memberTree
        },
        data () {
            return {
                height: {
                    height: '',
                    'overflow-y': 'scroll'
                },
                selectNodeTable: [],
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
                pageSize: 10,
                page: 1,
                flag: [],
                editFunctionShow: false,
                orgDuty: '',
                treeMode: false,
                tableMode: false,
                memberList: [],
                dutyList: [],
                memberListData: {},
                test: null,
                memberIndexId: null,
                orgIDInfo: null
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
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height
            }
        },
        mounted() {
        },
        methods: {
            getSingleRowData (node) {
                //选择列表的数据
                this.selectNodeTable = node;
            },
            ...mapActions([
                'saveDemoData',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            editPrincipal (index) {
                //更换负责人
                this.memberIndexId = index
                this.getAllPerson(index)
                this.tableMode = true;
            },
            openTreeModal () {
                // 打开成员单位弹框
                let TreeInfo = {
                    title: '选择成员单位',
                    treeMultiple: false,
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: this.userCode
                    },
                    url: this.url + '/platform/public/queryOrgTree4New' ///platform/public/queryOrgBase'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            saveMemberOrg (id, index) {
                this.memberListData.functions = this.memberList[index].functions
                const url = this.url + '/plan/PlanContent4MemberOrg/addPlanContent4MemberOrg'
                const data = {
                    id: this.memberList[index].id,
                    nodeId: this.contentNodeId,
                    orgDuty: this.memberList[index].functions,
                    orgId: this.memberList[index].orgId,
                    personId: this.memberList[index].person.id,
                    planId: this.planIdInfo,
                    userCode: this.userCode
                }
                axios({
                    method: 'post',
                    url: url,
                    data: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.info('添加成功');
                            this.dutyList[index].functions = this.memberList[index].functions;
                            this.memberList[index].showBtn = false;
                        }
                    }
                ).catch(
                );
            },
            cancelDuty (index) {
                this.memberList[index].functions = this.dutyList[index].functions;
                this.memberList[index].showBtn = false;
            },
            editMemberOrg (id, index) {
                this.orgIDInfo = this.memberList[index].id
            },
            deleteMemberOrg (params) {
                const url = this.url + '/plan/PlanContent4MemberOrg/deletedPlanContent4MemberOrg'
                const data = {
                    userCode: this.userCode,
                    id: params.id
                }
                axios({
                    method: 'get',
                    url: url,
                    params: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                           this.$Message.info('删除成功')
                           this.memberList.splice(params.index, 1)
                        } else {
                            this.$Message.error('删除失败')
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                );
            },
            cancel () {
                return
            },
            modalClose () {
                //关闭弹框
                this.tableMode = false;
            },
            treeModalClose () {
                //关闭list弹框
                this.treeMode = false;
            },
            treeModalSave (params) {                
                //保存list数据
                //********************** */
                
                this.createOrg(params);
                this.treeMode = false
            },
            createOrg (params) {
                const data = {
                    nodeId: this.contentNodeId,
                    orgId: params[0].id,
                    planId: this.planIdInfo,
                    userCode: this.userCode
                }
                axios({
                    method: 'post',
                    url: this.url + '/plan/PlanContent4MemberOrg/addPlanContent4MemberOrg',
                    data: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.memberList.push(
                                {
                                    id: response.data.data.id,
                                    orgId: params[0].id,
                                    showBtn: true,
                                    title: params[0].title,
                                    person: {
                                        id: null,
                                        name: '',
                                        mobile: '',
                                        personName: '请选择负责人'
                                    },
                                    functions: '单位职责：' + ''
                                }
                            )
                            this.orgIDInfo = params[0].id;
                            this.$Message.info('添加成功');
                        }
                    }
                ).catch(
                );
            },
            dutyFocus (index) {
                this.memberList[index].showBtn = true;
            },
            getAllMemberOrg() {
                const url = this.url + '/plan/PlanContent4MemberOrg/queryPlanContent4MemberOrgByPage?pageSize='+ this.pageSize + '&&currentPage=' + this.page
                const info = {
                    nodeId: this.contentNodeId,
                    planId: this.planIdInfo,
                    userCode: this.userCode
                }
                axios({
                    method: 'post',
                    url: url,
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.memberList = []
                            const res = response.data.data
                            const list = res.list
                            res.list.forEach((v, i) => {
                                this.memberList.push({
                                    id: v.id,
                                    orgId: v.orgId,
                                    showBtn: false,
                                    title: v.orgName,
                                    functions: v.orgDuty ? v.orgDuty : '',
                                    person: {
                                        id: v.personId,
                                        name: v.name,
                                        mobile: v.mobile,
                                        personName: v.personName ? v.personName : '请选择负责人'
                                    }
                                });
                                this.dutyList.push({
                                    functions: v.orgDuty ? v.orgDuty : ''
                                })
                            })
                        }
                    }
                ).catch(
                    error => {
                        
                    }
                );
            },
            expertPage(num) {
                this.modePage = num
                this.getAllPerson()
            },
            modalSave () {
                const id = this.selectNodeTable.id;
                if (!id) {
                    this.$Message.warning('请选择负责人')
                } else {
                    const treeInfo = this.selectNodeTable
                    this.memberList[this.memberIndexId].person = {
                        id: treeInfo.id,
                        mobile: treeInfo.mobile,
                        personName: treeInfo.name ? treeInfo.name : '请选择负责人',
                    }
                    this.saveMemberOrg('', this.memberIndexId);
                    this.tableMode = false;
                }
            },
            getAllPerson(index) {
                const userCode = this.userCode
                const url = this.url + '/platform/person/queryPersonBase4Paging?size='+ this.modalSize + '&&start=' + this.modePage
                const data = {
                    userCode,
                    orgId: this.memberList[index].orgId
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
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(75) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.getAllMemberOrg()
        }
    }
</script>

<style scoped>
    .ds-member-list {
        padding: 5px;
    }
    .ds-member-body {
        height: 210px;
    }
    .ds-member-list {
        zoom: 1;
    }
    .ds-member-list:after {
        display: block;
        content: '.';
        width: 0;
        height: 0;
        visibility: hidden;
        clear: both;
    }
    .ds-member-list li {
        width: 50%;
        float: left;
        padding: 5px;
    }
    .ds-nomember {
        line-height: 200px;
        text-align: center;
        cursor: pointer;
    }
    .ds-member-function {
        border: 1px solid #e9eaec;
        height: 170px;
        background: #ffffff;
        line-height: 22px;
        overflow: auto;
    }
    .ds-org-duty {
        line-height: 170px;
        border: 1px solid #e9eaec;
        background: #ffffff;
        text-align: center;
        cursor: pointer;
    }
    
</style>

