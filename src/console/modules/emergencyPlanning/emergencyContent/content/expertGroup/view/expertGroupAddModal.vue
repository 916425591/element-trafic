<template>
    <div>
        <Modal v-model="modalShow" width="600" :mask-closable="false" @on-cancel="modalClose" class-name="vertical-center-modal">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>选择专家</span>
            </p>
            <div style="text-align:center">
                <Row class="ds-expert-search">
                    <i-col span="8">
                        <Row>
                            <i-col span="8">
                                类型：
                            </i-col>
                            <i-col span="16">
                                <i-input v-model="expertType"  style="" @on-focus="alertTree"></i-input>
                            </i-col>
                        </Row>
                    </i-col>
                    <i-col span="12">
                        <Row>
                            <i-col span="6">
                                姓名：
                            </i-col>
                            <i-col span="18">
                                <i-input v-model="expertName"  style=""></i-input>
                            </i-col>
                        </Row>
                    </i-col>
                    <i-col span="4">
                        <Button size="large" type="primary" @click="expertBtnAction">查询</Button>
                    </i-col>
                </Row>
                <div class="ds-model-table-box">
                    <Table border :columns="tableThead" :data="tableTbody" :highlight-row="true" @on-row-click="getSingleRowData" ref="listModule"></Table>
                    <div class="ds-page-body" v-if="total > pageSize">
                        <Page :total="total" :page-size="pageSize" @on-change="expertPage" show-total class="ds-page-right"></Page>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button size="large" type="primary" @click="modalSave">确认</Button>
                <Button size="large" type="ghost" @click="modalClose">取消</Button>
            </div>
        </Modal>
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
            return {
                treeMode: false,
                total: 0,
                modalShow: true,
                selectNode: [],
                pageSize: 8,
                pageNum: 1,
                expertName: '',
                expertType: '',
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
                        title: '类型',
                        key: 'type',
                        align: 'center'
                    },
                    {
                        title: '专长',
                        key: 'expertise',
                        align: 'center'
                    }
                ],
                tableTbody: [],
                queryCode: ''
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
            }
        },
        created () {
            this.queryExpert();
        },
        methods: {
            ...mapActions([
                'saveDemoData',
            ]),
            treeModalSave (treeInfo,type) {
                //保存tree选择数据
                console.log(treeInfo)
                this.expertType = treeInfo[0].title
                this.queryCode = treeInfo[0].queryCode
                this.treeMode = false;
            },
            treeModalClose () {
            //关闭装备类型弹框
                this.treeMode = false;
            },
            alertTree() {
                let TreeInfo = {
                    title: '选择专家类型',
                    treeMultiple: false,
                    request: 'post',
                    queryInfo: {
                        userCode: this.userCode,
                        category: 6,
                        // containsRootNode: false
                    },
                    url: this.url + '/platform/public/queryResourceTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            modalSave () {
                //保存专家
                this.$emit('modal-save', this.selectNode);
            },
            modalClose () {
                //关闭弹窗
                this.$emit('modal-close');
            },
            getSingleRowData (node) {
                //选择列表的数据
                this.selectNode = node;
            },
            expertBtnAction () {
                this.queryExpert();
            },
            queryExpert () {
                //专家查询
                const expertInfo = {
                    userCode: this.userCode,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    queryCode: this.queryCode,
                    name: this.expertName
                }
                axios({
                    method: 'post',
                    url: this.url + '/resource/expert/queryExperts4Page',//'/plan/PlanContent4Expert/findExpertsToSel',
                    data: expertInfo
                }).then(
                    response => {
                        this.tableTbody = []
                        if ( response.data.code === 200 ) {
                            const res = response.data.data
                            this.total = parseInt(res.total, 10)
                            const res_list = res.list
                            if(res && res.list) {
                                res_list.forEach((v, i) => {
                                    this.tableTbody.push({
                                        name: v.name ? v.name : '',
                                        type: v.resTypeName ? v.resTypeName : '',
                                        expertise: v.expertise ? v.expertise : '',
                                        mobile: v.mobile ? v.mobile : '',
                                        dutyTitle: v.dutyTitle ? v.dutyTitle : '',
                                        id: v.id,
                                        duty: v.duty ? v.duty : '',
                                        experience: v.expertise ? v.expertise : ''
                                    })
                                });
                            } else {
                                this.tableTbody = []
                            }
                        }
                    }
                ).catch(
                    
                )
            },
            expertPage (num) {
                //翻页功能
                this.pageNum = num;
                //翻页数据查询
                this.queryExpert();
            }
        }
    }
</script>

<style scoped>
    .ds-expert-search {
        line-height: 32px;
        padding-bottom: 10px;
    }
    .ds-page-body {
        padding-bottom: 0;
    }
</style>

