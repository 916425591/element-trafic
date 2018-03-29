<template>
    <!-- 预案类型 -->
    <div class="ds-planType">
        <Row>
            <i-col span="5">
                <div class="ds-widget-box" :style='height' :data-json="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>预案类型</h2>
                        <Button type="success" @click="addPlanType" style="float:right;margin-top:3px;margin-right:3px;">新增</Button>
                    </div>
                    <div class="ds-search-left">
                        <i-input icon="ios-search" v-model="searchKey" @on-click="getTreeData" @on-enter="getTreeData" style="width: 100%"></i-input>
                    </div>
                    <div class="ds-tree-left ds-resources-listBox">
                        <Tree :data="planTypeTree" @on-select-change="clickThisTree" ref="tree"></Tree>
                    </div>
                </div>
            </i-col>
            <i-col span="19">
                <plan-type-info ref="info" :queryCode="queryCode" @getTreeDatas="getTreeData" :children="children" :parentId="parentId" :planName="title" :id="id" :planCode="code" :parentName="parentName" :switchStatus="switchStatus"></plan-type-info>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import planTypeInfo from './planTypeInfo';
    import axios from 'axios';
    import { mapActions } from 'vuex';
    import Cookies from 'js-cookie';
    export default {
        name: 'planType',
        components: {
            planTypeInfo
        },
        data () {
            return {
                planTypeTree: [],
                title: '',
                expertType: '',
                code: '',
                id: null,
                children: [],
                parentName: '',
                switchStatus: true,
                parentId: null,
                searchKey: '',
                height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                },
                queryCode: null,
            };
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(30)
            this.getTreeData();
            this.setPlanTypeStatus (true);
        },
        computed: {
            contentNodeId () {
                return this.$store.state.userCode.contentNodeId // nodeId
            },
            planIdInfo () {
                return this.$store.state.userCode.planId // planID
            },
            userCode () {
                return Cookies.get('userCode') // userCode
            },
            url () {
                return this.$store.state.userCode.url; // url
            },
            pageSize () {
                return this.$store.state.heightTable.tableInfo.numberBranches /* 根据高度换算 自定义每页显示条数 */
            },
            tableHeight () {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /* 定义好的父框体高度 */
                return this.height.height;
            }
        },
        methods: {
            ...mapActions([
                'setPlanTypeStatus',
                'tableHeightMessage', /* 将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数 */
                'setHeightContent'/* 将获取到的可读高度 存放到VUEX中进行换算 */
            ]),
            addPlanType () {
                this.title = ''
                this.code = ''
                this.id = null
                this.parentName = ''
                this.title = ''
                this.switchStatus = true
                this.parentId = null
                this.setPlanTypeStatus(false)
                this.$refs.info.editModal = false;
                this.$refs.info.formItem = {
                    expertType: this.expertType,
                    planName: this.planName,
                    planCode: this.planCode,
                    id: this.id,
                    parentName: this.parentName,
                    parentId: this.parentId,
                    switchStatus: this.switchStatus,
                    children: this.children,
                    queryCode: this.queryCode
                };
            },
            clickThisTree (data) {
                this.setPlanTypeStatus(true)
                this.title = data[0].title
                this.code = data[0].code
                this.id = data[0].id
                this.parentName = data[0].parentName
                this.switchStatus = data[0].valid
                this.parentId = data[0].parentId
                this.children = data[0].children
                this.queryCode = data[0].queryCode
                this.$refs.info.formItem = {
                    expertType: this.title,
                    planName: this.title,
                    planCode: this.code,
                    id: this.id,
                    parentName: this.parentName,
                    parentId: this.parentId,
                    switchStatus: this.switchStatus,
                    children: this.children,
                    queryCode: this.queryCode
                };
            },
            getTreeData () {
                const url = this.url + '/platform/public/queryPlanTypeTree4New'
                const info = {
                    userCode: this.userCode,
                    objName: this.searchKey
                }
                axios({
                    method: 'post',
                    url: url,
                    data: info
                }).then(
                    response => {
                        if(response.data.code === 200) {
                            const list = response.data.data
                            this.planTypeTree = list;
                        }
                    }
                ).catch(
                    error => {
                    }
                );
            }
        }
    }
</script>

<style>

</style>
