<template>
    <div>
        <modal v-model="modal" class-name="vertical-center-modal" :title="title" :mask-closable="false" width="600" @on-cancel="closeModal">
            <div v-if="searchShow" class="ds-search-body">
                <i-input type="text" icon="ios-search" placeholder="请输入名称， 回车查询或点击查询图标查询" v-model="searchName" @on-enter="searchTableInfo" @on-click="searchTableInfo"></i-input>
            </div>
            <div>
                <Table border ref="selection" :highlight-row="selectRadio" size="small" height="300" :columns="head" :data="data" @on-row-click="getSingleRowData" @on-select="getMultRowData" @on-select-all="getMultRowData" @on-select-cancel="selectCancel" @on-selection-change="selectCancelAll"></Table>
                <div class="ds-page-body" v-if="pageShow">
                    <Page :total="pageTotal" :page-size="pageSize" :current="pageNum" @on-change="slectPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveModal">确定</Button>
                <Button size="large"  @click="closeModal">取消</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'

    export default {
        data () {
            return {
                modal: true,
                selectRadio: true,
                searchShow: false,
                pageShow: false,
                pageTotal: null,
                pageNum: 1,
                pageSize: 10,
                searchName: '',
                title: '',
                type: '',
                selectNodes: [],
                head: [
                    {
                        type: 'selection',
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '预案名称',
                        key: 'name',
                        width: 490,
                        align: 'center'
                    }
                ],
                data: []
            }
        },
        computed:{
            tableModalInfo() {//获取调用组件传入的参数信息
                return this.$store.state.tableSearch.tableInfo;
            }
        },
        created () {
            //初始化表格
             this.initTable();
        },
        methods: {
            initTable () {
                //初始化表格
                const tableInfo = this.tableModalInfo;
                const multiple = tableInfo.multiple;
                const expand =  tableInfo.expand;
                this.searchShow = tableInfo.searchShow;
                this.title = tableInfo.title;
                this.type = tableInfo.type;
                this.head[2].title = tableInfo.name;
                if ( !multiple ) {
                    this.head.splice(0,1);
                } else {
                    this.head.splice(1,1);
                    this.selectRadio = false;
                }
                console.log(expand)
                if (expand) {
                    const expandList = expand.expandList;
                    this.head[0].width = '80';
                    this.head[1].width = '';
                    for (let i=0;i<expandList.length;i++) {
                        this.head.push(expandList[i]);
                    }
                }
                //查询表格数据
                this.queryTableInfo();
            },
            queryTableInfo () {
                //查询表格数据
                const treeInfo = this.tableModalInfo;
                const queryInfo = treeInfo.queryInfo;
                const request = treeInfo.request;
                queryInfo.name = this.searchName;
                if ( request === 'get' ) {
                    axios({
                        method: 'get',
                        url: treeInfo.url,
                        params: queryInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                if ( response.data.data.constructor === Array) {
                                    this.data = response.data.data;
                                }
                                if ( response.data.data.constructor === Object) {
                                    this.data = response.data.data.list;
                                    this.pageTotal = response.data.data.total;
                                    if ( this.pageTotal > this.pageSize ) {
                                        this.pageShow = true;
                                    } else {
                                        this.pageShow = false;
                                    }
                                }
                                if ( this.selectNodes.length > 0 ) {
                                    this.installselectedNodes(response.data.data.list);
                                }
                                
                            }
                        }
                    ).catch(
                        error => {
                            
                        }
                    )
                }
                if ( request === 'post' ) {
                    const queryO = queryInfo;
                    queryO.pageNum = this.pageNum;
                    queryO.pageSize = this.pageSize;
                    axios({
                        method: 'post',
                        url: treeInfo.url,
                        data: queryInfo
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                if ( response.data.data.constructor === Array) {
                                    this.data = response.data.data;
                                }
                                if ( response.data.data.constructor === Object) {
                                    this.data = response.data.data.list;
                                    this.pageTotal = response.data.data.total;
                                    if ( this.pageTotal > this.pageSize ) {
                                        this.pageShow = true;
                                    } else {
                                        this.pageShow = false;
                                    }
                                }
                                if ( this.selectNodes.length > 0 ) {
                                    this.installselectedNodes(response.data.data.list);
                                }
                            }
                        }
                    ).catch(
                        error => {
                            
                        }
                    )
                }
            },
            installselectedNodes (data) {
                const selectNodes = this.selectNodes;
                for ( let i=0;i<selectNodes.length;i++ ) {
                    for ( let j=0;j<data.length;j++) {
                        if ( selectNodes[i].id === data[j].id ) {
                            data[j]._checked = true;
                        }
                    }
                }
            },
            searchTableInfo () {
                this.selectNodes = [];
                //弹框查询功能
                this.queryTableInfo();
            },
            slectPage (index) {
                this.pageNum = index;
                this.queryTableInfo();
            },
            saveModal () {
                //点击弹框确定
                if ( this.selectNodes.length < 1) {
                    this.$Message.warning('请先选择');
                } else {
                    this.$emit('table-search-save',this.selectNodes,this.type)
                }
            },
            closeModal () {
                //取消关闭弹窗
                this.$emit('table-search-close', this.type)
            },
            getMultRowData (nodes) {
                //获取选中行的数据(多选)
                console.log(this.selectNodes,'node')
                if ( this.selectNodes.length === 0) {
                    this.selectNodes = nodes;
                } else {
                    for(var i = 0; i < nodes.length; i++) {
                        var flag = false;
                        for(var j = 0; j < this.selectNodes.length; j++) {
                            if(this.selectNodes[j].id == nodes[i].id) {
                                flag = true;
                                break;
                            } 
                        }
                        if(!flag) {
                            this.selectNodes.push(nodes[i])
                        }
                    }
                }
            },
            getSingleRowData (nodes) {
                // 获取选中行的数据(单选)
                if ( this.selectRadio ) {
                    this.selectNodes = nodes;
                } 
            },
            selectCancel (node, row) {
                const selectNodes = this.selectNodes;
                for ( let i=0;i<selectNodes.length;i++ ) {
                    if ( selectNodes[i].id === row.id ) {
                        this.selectNodes.splice(i,1);
                    }
                }
            },
            selectCancelAll (nodes) {
                if ( nodes.length === 0 ) {
                    var flag = false;
                    for ( let i=0;i<this.data.length;i++ ) {
                        for ( let j=0;j<this.selectNodes.length;j++ ) {
                            if(this.selectNodes[j].id == this.data[i].id) {
                                this.selectNodes.splice(j,1);
                            } 
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .ds-search-body {
        margin-bottom: 16px;
    }
</style>

 