<template>
    <!--化学品库类型 -->
    <div class="ds-planType">
        <Row>
            <i-col span="5">
                <div class="ds-widget-box" :style='height' :data-json="tableHeight">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>危险化学品类型</h2>
                        <Button type="success" @click="addType" style="float:right;margin-top:3px;margin-right:3px;">新增</Button>
                    </div>
                    <div class="ds-search-left">
                        <i-input icon="ios-search" v-model="searchKey" @on-click="getTreeData" @on-enter="getTreeData" style="width: 100%"></i-input>
                    </div>
                    <div class="ds-tree-left ds-resources-listBox">
                        <Tree :data="typeTree" @on-select-change="clickThisTree" ref="tree"></Tree>
                    </div>
                </div>
            </i-col>
            <i-col span="19">
                <type-info ref="info" @getTreeDatas="getTreeData" :queryCode="queryCode" :dangerType="dangerType" :children="children" :parentId="parentId" :name="title" :id="id" :code="code" :parentName="parentName" :switchStatus="switchStatus"></type-info>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import typeInfo from './chemicalTypeInfo'
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    export default {
        components: {
            typeInfo
        },
        data () {
            return  {
                typeTree: [],
                title: '',
                expertType: '',
                code: '',
                dangerType: "null",
                category: '',
                id: null,
                children: [],
                queryCode: null,
                parentName: '',
                switchStatus: true,
                parentId: null,
                searchKey: '',
                height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                }
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(30)
            this.getTreeData();
            this.saveTypesType (true);
        },
        computed: {
            contentNodeId() {
                return this.$store.state.userCode.contentNodeId; // nodeId
            },

            userCode() {
                return Cookies.get('userCode'); // userCode
            },
            url() {
                return this.$store.state.userCode.url; // url
            },
            pageSize() {
                return this.$store.state.heightTable.tableInfo.numberBranches; /* 根据高度换算 自定义每页显示条数 */
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight; /* 定义好的父框体高度 */
                return this.height.height;
            }
        },
        methods: {
            ...mapActions([
                'saveTypesType',
                'tableHeightMessage',/* 将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数 */
                'setHeightContent'/* 将获取到的可读高度 存放到VUEX中进行换算 */
            ]),
            addType () {
                this.name = '';
                this.category =  '';
                this.title = '';
                this.code = '';
                this.id = null;
                this.parentName = '';
                this.switchStatus = true;
                this.parentId = null;
                this.dangerType = 'null';
                this.saveTypesType (false);
                this.$refs.info.editModal = false;
                this.$refs.info.formItem = {
                    expertType: this.expertType,
                    name: this.title,
                    code: this.code,
                    id: this.id,
                    parentName: this.parentName,
                    parentId: this.parentId,
                    switchStatus: this.switchStatus,
                    children: this.children,
                    queryCode: this.queryCode,
                    dangerType: this.dangerType
                };
                this.$refs.info.$refs['formCustom'].resetFields();
            },
            clickThisTree (data) {
                this.saveTypesType(true)
                this.title = data[0].title
                this.code = data[0].code
                this.id = data[0].id
                this.dangerType = data[0].type
                this.parentName = data[0].parentName
                this.switchStatus = data[0].valid
                this.parentId = data[0].parentId
                this.children = data[0].children
                this.queryCode = data[0].queryCode
                this.$refs.info.formItem = {
                    expertType: this.expertType,
                    name: this.title,
                    code: this.code,
                    id: this.id,
                    parentName: this.parentName,
                    parentId: this.parentId,
                    switchStatus: this.switchStatus,
                    children: this.children,
                    queryCode: this.queryCode,
                    dangerType: this.dangerType
                };
            },
            getTreeData () {
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
                            this.typeTree = list;
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
