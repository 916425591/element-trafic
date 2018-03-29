<template>
  <div :data-html="getData">
    <Modal v-model="person_charge" class-name="vertical-center-modal" :mask-closable="false" width="500" @on-cancel="treeModalClose">
        <p slot="header" style="color:#f60;text-align:center">
            <span>{{ getData.title }}</span>
        </p>
        <div v-if="searchShow" class="ds-search-body">
            <i-input type="text" icon="ios-search" placeholder="请输入名称， 回车查询或点击查询图标查询" v-model="searchName" @on-enter="getTreeModalInfo" @on-click="getTreeModalInfo"></i-input>
        </div>
        <div style="text-align:left;height:400px;overflow:auto;">
            <Tree :data="treeData" :multiple="treeMultiple" ref="tree"></Tree>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" @click="treeModalSave">确定</Button>
            <Button type="ghost" size="large" @click="treeModalClose">取消</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                searchShow: false,
                modalTitle: '',
                searchName: '',
                person_charge: true,
                additional:'',//标识哪个调用
                treeData: [],
                selectNodes: [],
                treeMultiple: false
            }
        },
        computed: {
            getData() {
                return this.$store.state.treeModal.TreeInfo
            }
        },
        created () {
            this.initTable();
            this.getTreeModalInfo();
        },
        methods: {
            initTable () {
                this.searchShow = this.getData.searchShow;
            },
            getTreeModalInfo() {
                //获取数据
                const treeInfo = this.getData;
                this.additional = treeInfo.additional;
                const userCode = Cookies.get('userCode');
                this.treeMultiple = treeInfo.treeMultiple;
                const request = treeInfo.request;
                const queryInfo = treeInfo.queryInfo;
                queryInfo.objName = this.searchName;
                if ( request === 'get') {
                    axios({
                        method: 'get',
                        url: treeInfo.url,
                        params: queryInfo
                    }).then(
                        response => {
                            const newList = this.openTreeNode(response.data.data);
                            this.treeData = newList;
                        }
                    ).catch(
                        error => {
                        }
                    )
                } else {
                    axios({
                        method: 'post',
                        url: treeInfo.url,
                        data: queryInfo
                    }).then(
                        response => {
                            // let list = response.data.data;
                            // let newList = this.jsonInstall(list);
                            // this.treeData = newList;
                            const newList = this.openTreeNode(response.data.data);
                            this.treeData = newList;
                        }
                    ).catch(
                        error => {
                            
                        }
                    )
                }
            },
            treeModalClose () {
                //关闭tree
                this.$emit('tree-close-Modal')
            },
            treeModalSave () {
                //保存选中数据
                const noSelect = this.getData.noSelect;
                let selectNodes = this.$refs.tree.getSelectedNodes()
                if(noSelect || selectNodes.length >= 1){
                    console.log('selectNodes', selectNodes)
                    this.$emit('tree-save-Modal', selectNodes, this.additional)
                } else {
                    this.$Message.error('请先选择节点。')
                }
                // if(selectNodes.length >= 1){
                //     this.$emit('tree-save-Modal', selectNodes, this.additional)
                // } else {
                //     this.$Message.error('请先选择节点。')
                // }
            },
            openTreeNode (data) {
                const nodes = data;
                for (let i=0;i<nodes.length;i++) {
                    nodes[i].expand = true;
                }
                return nodes;
            },
            jsonInstall (list) {
                //后端list数据组装
                var resource = [];
                for(let i = 0; i < list.length; i++) {
                    var typeParent = list[i].parent;
                    if(!typeParent) {
                    resource.push({
                        id: list[i].id,
                        title: list[i].name,
                        category: list[i].category,
                        expand: true,
                        children: []
                    });
                    } else {
                    var parent = findParent(typeParent, resource);
                    if(!parent) {
                        parent = {
                        id: typeParent.id,
                        category: list[i].category,
                        title: typeParent.name,
                        expand: true,
                        children: []
                        };
                        resource.push(parent);
                    }
                    if(!parent.children) {
                        parent.children = [];
                    }
                    var type = {
                        id: list[i].id,
                        title: list[i].name,
                        category: list[i].category,
                        expand: true
                    };
                    parent.children.push(type);
                    }
                }
                return resource;
                
                function findParent(typeParent, list) {
                    //递归查询组装数据
                    var parent = null;
                    for(let index = 0; index < list.length; index++) {
                        if(typeParent.id == list[index].id) {
                            parent = list[index];
                            return parent;
                        } else {
                            var children = list[index].children;
                            if(children) {
                                parent = findParent(typeParent, children);
                                if(parent) {
                                    return parent;
                                }
                            }
                        }
                    }
                    return parent;
                }
            }
        }
    }
</script>

<style>

</style>

