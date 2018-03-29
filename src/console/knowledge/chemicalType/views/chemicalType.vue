<template>
    <!--化学品库类型 -->
    <div class="ds-planType">
        <Row>
            <i-col span="5">
                <div class="ds-widget-box" :style='height' :data-json="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>危险化学品类型</h2>
                    </div>
                    <div class="ds-search-left">
                        <i-input icon="ios-search" v-model="searchKey" @on-click="getTreeData" @on-enter="getTreeData" style="width: 210px"></i-input>
                        <Button type="ghost" size="small" @click="addPlanType" style="background: #fff;"><Icon type="android-add" size="20"></Icon></Button>
                    </div>
                    <div class="ds-tree-left ds-resources-listBox">
                        <Tree :data="planTypeTree" @on-select-change="clickThisTree" ref="tree"></Tree>
                    </div>
                </div>
            </i-col>
            <i-col span="19">
                <plan-type-info @getTreeData="getTreeData" :dangerType="dangerType" :children="children" :parentId="parentId" :name="title" :id="id" :code="code" :parentName="parentName" :switchStatus="switchStatus"></plan-type-info>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import planTypeInfo from './chemicalTypeInfo'
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    export default {
        components: {
            planTypeInfo
        },
        data () {
            return  {
                planTypeTree: [],
                title: '',
                expertType: '',
                code: '',
                dangerType: "null",
                category: '',
                id: null,
                children: [],
                parentName: '',
                switchStatus: true,
                parentId: null,
                searchKey: '',
                height: {
                    height: ''
                }
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(30)
            this.getTreeData()
        },
        computed: {
            contentNodeId() {
                return this.$store.state.userCode.contentNodeId //nodeId
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
                'saveTypesType',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            addPlanType() {
                this.name = ''
                this.category =  ''
                this.code = ''
                this.id = null
                this.parentName = ''
                this.switchStatus = true
                this.parentId = null
                this.dangerType = 'null'
                this.saveTypesType(false)
            },
            clickThisTree(data) {
                console.log(data)
                this.title = data[0].title
                this.code = data[0].code
                this.id = data[0].id
                this.dangerType = data[0].type
                this.parentName = data[0].parentName
                this.switchStatus = data[0].valid
                this.parentId = data[0].parentId
                this.children = data[0].children
            },
            getTreeData() {
                const url = this.url + '/platform/public/queryChemicalType4New'
                const info = {
                    userCode: this.userCode,
                    objName: this.searchKey,
                    pageSize: 1000
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
                )
            }
        }
    }
</script>

<style>

</style>
