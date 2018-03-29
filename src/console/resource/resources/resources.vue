<template>
    <div>
        <div>
            <Row style="height:100%;">
                <i-col span="5" style="height:100%;">
					<div class="ds-widget-box">
						<div class="ds-widget-title">
							<span class="ds-title-icon"></span>
							<h2>资源类型</h2>
                            <div class="ds-btnList">
                                <Button type="success" @click="resources_add">新增</Button>
                            </div>
						</div>
                        <div :style='height' :data-json="tableHeight">
                            <div class="ds-search-left ds-search ds-flex">
                                <Select v-model="resourceType" style="width:70%" @on-change="queryResourceByResourceType">
                                    <Option v-for="item in resource_resourceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <i-input v-model="rwourceTypeName" icon="ios-search" @on-click="queryResources" @on-enter="queryResources" style="width: 86%;margin-left: 5px;"></i-input>
                            </div>
                            <div class="ds-tree-left ds-resources-listBox" style="height: 529px;">
                                <Tree :data="resourcesListInfo" @on-select-change="selectResources" ref="tree"></Tree>
                            </div>
                        </div>
					</div>
                </i-col>
                <i-col span="19">
                    <div class="ds-hospital-table ds-widget-box">
                        <div class="ds-widget-title">
                            <span class="ds-title-icon"></span>
                            <h2>资源类型详细信息</h2>
                        </div>
                        <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
                            <resources-info :style='height2' v-if="resources_info_show" ref="info" @resource-edit="resourceEdit" @resources-delete="resourceDelete"></resources-info>
                            <resources-add :style='height2' v-if="resources_add_show" ref="resourcesAdd" @resources-save="resources_save" @resources-add-close="resources_add_close"></resources-add>
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import resourcesInfo from './resources_info'
    import resourcesAdd from './resources_add'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';

	export default {
		 name: 'resources',
         components: {
             resourcesInfo,
             resourcesAdd
         },
		 data () {
            return {
                height: {
                    height: '',
                    'overflow-y': 'scroll'
                },
                height2: {
                    height: ''
                },
                resources_info_show: true,
                resources_add_show: false,
                resourceType: null,
                rwourceTypeName: '',
                resourcesListInfo: []
            }
        },
        computed: {
            resourcesList() {
                return this.$store.state.resourceType.resourcesList
            },
            resourcesDetail () {
                return this.$store.state.resourceType.data
            },
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfoIndex.tableHeight /*定义好的父框体高度*/
                this.height.height = height;
                this.height2.height = (parseInt(height)-10)+ 'px'
                return this.height.height
            },
            resource_resourceType() {
                return this.$store.state.resourceType.resourceTypeData
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessageIndex(60)
            this.getResourceTypeAboutResources();
            this.queryResources();
        },
        methods: {
            ...mapActions([
                'queryResourcesList',/*test*/
                'queryResourcesDetail',
                'saveResourceTypeTree',
                'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent',/*将获取到的可读高度 存放到VUEX中进行换算*/
                'getResourceResourceType'
            ]),
            getResourceTypeAboutResources() {
                const params = {
                    url: this.url + '/platform/resourceType/queryResourceTypeList',
                    data: {
                        userCode: this.userCode
                    }
                }
                this.getResourceResourceType(params)
            },
            queryResources () {
                const that = this;
                let info = {userCode:this.userCode,'name':'',category: this.resourceType};
                info.name = this.rwourceTypeName;
                axios({
                    method: 'post',
                    url: this.url + '/platform/resourceType/queryResourceTypeAllTree',                    
                    data: info
                }).then(
                    response => {
                        console.log(response)
                        if ( response.data.code === 200 ) {
                            let resourceList = response.data.data;
                            //后台list数据组装成tree
                            var resource = this.AssemblyArray(resourceList);
                            this.resourcesListInfo = resource;
                        }
                // axios({
                //     method: 'get',
                //     url: 'http://127.0.0.1/queryResourceTypeAllTree',
                //     params: info
                // }).then(
                //     response => {
                //         if ( response.data.code === 200 ) {
                //             let resourcesList = response.data.data;
                //             console.log(resourcesList)
                //             var resource = [];
                //             for (var i=0;i<resourcesList.length;i++) {
                //                 if(!resourcesList[i].parent){
                //                     resourcesList[i].title = resourcesList[i].name;
                //                     resourcesList[i].expand = true;
                //                     resourcesList[i].children = [];
                //                     for(var j=0;j<resourcesList.length;j++){
                //                         if(resourcesList[j].parent && resourcesList[i].id == resourcesList[j].parent.id){
                //                             resourcesList[j].title = resourcesList[j].name;
                //                             resourcesList[i].children.push(resourcesList[j]);
                //                             console.log(resourcesList[j])
                //                         }
                //                     }
                //                     resource.push(resourcesList[i])
                //                 }
                //             }
                //             this.resourcesListInfo = resource;
                //         }
                //     }
                // ).catch(
                //     error => {
                //         this.$Message.error(error)
                //     }
                // );
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                )
            },
            AssemblyArray (resourceList) {
                var resource = [];
	            for (let i=0;i<resourceList.length;i++) {
	            	var typeParent = resourceList[i].parent;
	                if(!typeParent){
	                    resource.push({id:resourceList[i].id,title:resourceList[i].name,parent: true,expand:true,children:[]});
	                }else{
	                	var parent = findParent(typeParent,resource);
	                	if(!parent){
	                		parent = {id:typeParent.id,title:typeParent.name,expand:true,children:[]};
	                		resource.push(parent);
	                	}
	                	if(!parent.children){
	                		parent.children = [];
	                	}
	                	var  type = {id:resourceList[i].id,title:resourceList[i].name,expand:true};
	                	parent.children.push(type);
	                }
	            }
	           	return resource;
	            
	            function findParent(typeParent,list){
	            	//递归查询组装数据
	            	var parent = null;
	            	for(let index = 0;index<list.length;index++){
	            		if(typeParent.id == list[index].id){
	            			parent = list[index];
	            			return parent;
	            		}else{
	            			var children = list[index].children;
	            			if(children){
	            				parent = findParent(typeParent,children);
	            				if(parent){
	            					return parent;
	            				}
	            			}
	            		}
	            	}
	            	return parent;
	            }
            },
            selectResources (nodes) {
                if(nodes[0]){
                    //点击选择树节点
                    let parent = nodes[0].parent;
                    if(nodes.length >= 1 && !parent){
                        let resourcesId = nodes[0].id;
                        //查询装备详情
                        //this.queryResourcesDetail(resourcesId);
                        this.$refs.info.ds_edit = true;
                        this.$refs.info.ds_save = false;
                        this.getResoucesDetail(resourcesId);
                    } else {
                        this.$refs.info.setResourcesDetailEmpty();
                    }
                } else {
                    this.$refs.info.setResourcesDetailEmpty();
                }
            },
            getResoucesDetail (resourcesId) {
                this.$refs.info.getResoucesDetail(resourcesId);
            },
            resources_add () {
                const that = this;
                let selectNode = this.$refs.tree.getSelectedNodes()[0];
                if(selectNode){
                    let parent = selectNode.parent;
                    let parentId = selectNode.id;
                    let parentName = selectNode.title;
                    let parentInfo = {
                        parentId: parentId,
                        parentName: parentName
                    };
                    if(parent){
                        this.resources_info_show = false;
                        this.resources_add_show = true;
                        setTimeout(function(){
                            that.$refs.resourcesAdd.setParentId(parentInfo);
                        },200);
                    }else{
                        this.$Message.error('请选择根节点添加')
                    }
                } else {
                    this.$Message.error('请选择根节点添加')
                }
            },
            resourceEdit (editInfo) {
                //修改树数据
                let data = this.$refs.tree.getSelectedNodes();
                const name = editInfo.name;
                this.$set(data[0], 'title', name);
            },
            resources_save (addInfo) {
                this.resources_info_show = true;
                this.resources_add_show = false;
                //新增树数据
                let data = this.$refs.tree.getSelectedNodes();
                const children = data[0].children || [];
                children.push({
                    id: addInfo.id,
                    title: addInfo.name,
                    selected: true
                });
                //去除已选择的改为新增选中
                this.$set(data[0], 'selected', false);
                this.$set(data[0].children, 'children', children);
                //查询新增详情
                const that = this;
                //暂时未想出组件未加载完成调用子组件方法方案，所以先用延时器来做
                setTimeout(function(){
                    that.getResoucesDetail(addInfo.id);
                },200)
            },
            resourceDelete (deleteInfo) {
                //删除左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                let id = deleteInfo.id;
                let list = this.resourcesListInfo;
                for (let i = 0; i< list.length;i++) {
                    let children = list[i].children;
                    for (let j = 0;j<children.length;j++) {
                        if ( children[j].id === id) {
                            children.splice(j, 1)
                        }
                    }
                }
                this.$refs.info.setResourcesDetailEmpty();
                //this.resourcesListInfo = [];
            },
            resources_add_close () {
                this.resources_info_show = true;
                this.resources_add_show = false;
            },
            queryResourceByResourceType() {
                this.pageNum = 1;
                this.queryResources();
            }
        }
	}
</script>

<style scoped>
    .ds-resources-box {
        height: 618px;
    }
    .ds-resources-listBox {
        padding: 10px 0 0 10px;
    }
    .ds-search {
    padding: 10px 5px;
    }
    .ds-flex {
        display: flex;
    }
    .ds-btnList {
        float:right;
        margin-right:5px;
    }
</style>
