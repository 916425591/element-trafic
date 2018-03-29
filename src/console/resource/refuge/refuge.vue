<template>
    <div>
		<Row style="height:100%;">
			<i-col span="5" style="height:100%;">
				<div class="ds-widget-box">
					<div class="ds-widget-title">
						<span class="ds-title-icon"></span>
						<h2>应急避险场所</h2>
                        <div class="ds-btnList">
                            <Button type="success" @click="add_refuge">新增</Button>
                        </div>
					</div>
                    <div :style='height' :data-json="tableHeight">
                        <div class="ds-search-left ds-search ds-flex">
                            <Select v-model="resourceType" style="width:70%" @on-change="queryRefugeByResourceType">
                                <Option v-for="item in refuge_resourceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <i-input v-model="refugeSearchName" icon="ios-search" @on-click="queryRefuge" @on-enter="queryRefuge" style="width: 210px;margin-left: 5px;"></i-input>
                        </div>
                        <div class="ds-tree-left">
                            <Scroll :on-reach-bottom="refuge_list_search" loading-text="加载中" :height="scrollHeight" :data-pageSize2="pageSize2">
                                <Tree :data="refuge_tree_list" @on-select-change="selectRefuge" ref="tree"></Tree>
                            </Scroll>
                        </div>
                    </div>
				</div>
			</i-col>
			<i-col span="19">
                <div class="ds-hospital-table ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>应急避险场所详细信息</h2>
                    </div>
                    <div class="ds-widget-cont">
                        <refuge-info @refuge-edit="refugeEdit" @refuge-delete="onComDelete" @refuge-save="refuge_add_show" ref="refugeInfo"></refuge-info>
                        <div class="ds-resource-info">
                            <refuge-person ref="refugePerson"></refuge-person>
                        </div>
                    </div>
                </div>
				
			</i-col>
		</Row>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
	import refugePerson from './refuge_person'
    import refugeInfo from './refuge_info'
    import Cookies from 'js-cookie';

    export default {
        components: {
			refugePerson,
            refugeInfo
        },
        data () {
            return {
                height: {
                    height: ''
                },
				refuge_info: true,
				refuge_add: false,
                refuge_tree_list: [],
                resourceType: null,
                refugeSearchName: '',
                pageNum: 1,
                scrollHeight: null,
                pageSize2: 0         
            }
        },
        computed: {
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfoIndex.tableHeight /*定义好的父框体高度*/
                this.height.height = height;
                const count = parseInt((parseInt(height) - 43) / 18) + 3
                this.pageSize2 = count
                this.scrollHeight = parseInt(height) - 52;
                return this.height.height
            },
            refuge_resourceType() {
                return this.$store.state.refuge.resourceTypeData
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessageIndex(60) 
            this.saveRefugeDetailData('');
            this.getResourceTypeAboutRefuges();
        },
        mounted() {
            this.queryRefuge();
        },
        methods: {
            ...mapActions([
                'saveRefugeResTypeId',
                'saveRefugeDetailData',
                'getRefugeResourceType',
                'changeEditStatus',//编辑状态
                'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getResourceTypeAboutRefuges() {
                const params = {
                    url: this.url + '/platform/resourceType/queryResourceTypeList4ParentNotNull',
                    data: {
                        userCode: this.userCode,
                        category: 3
                    }
                }
                this.getRefugeResourceType(params)
            },
            //获取避险场所信息列表数据
            queryRefuge (scroll) {
                let refugeSearch = {
                    userCode: this.userCode,
                    name: this.refugeSearchName,
                    resTypeId: this.resourceType,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize2
                }
                axios({
                    method: 'POST',
                    url: this.url + '/resource/refuge/queryRefugesByPage',
                    data: refugeSearch
                }).then(
                    response => {
                        console.log(response.data)
                        if ( response.data.code === 200 ) {
                            let refugeListInfo = this.recombination(response.data.data.list);
                            if ( scroll === 'scroll') {
                                console.log(refugeListInfo)
                                for (let i = 0; i < refugeListInfo.length;i++) {
                                    this.refuge_tree_list.push(refugeListInfo[i]);
                                }
                            } else {
                                this.refuge_tree_list = refugeListInfo;
                            }
                            this.$set(this.refuge_tree_list[0], 'expand', true);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            recombination (array) {
                //组装渲染
                var temp = [];
                var l = array.length;
                for(let i = 0; i < l; i++) {
                    for(let j = i + 1; j < l; j++){
                        if (array[i].resTypeId === array[j].resTypeId){
                            i++;
                            j = i;
                        }else{
                            array[i].children = array[j];
                        }
                    }
                    temp.push({
                        id: array[i].resTypeId,
                        title: array[i].resTypeName,
                        parent: true,
                        children: []
                    });
                }
                for(let i=0;i<temp.length;i++){
                    for(let j=0;j<l;j++){
                        if( array[j].id && temp[i].id == array[j].resTypeId){
                            var list = {
                                    id: array[j].id,
                                    title: array[j].name
                                }
                            temp[i].children.push(list)
                        }
                    }
                }
                return temp;
            },
            selectRefuge (nodes) {
                //点击选择树节点
                this.$refs.refugeInfo.resetFrom();
                if(nodes[0]){
                    let parent = nodes[0].parent;
                    if(nodes.length >= 1 && !parent){
                        let refugeId = nodes[0].id;
                        let refugeInfo = {
                            userCode: this.userCode,
                            refugeId: refugeId
                        }
                        axios({
                            method: 'get',
                            url: this.url + '/resource/refuge/getRefugeDetail',
                            params: refugeInfo
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    const res = response.data.data
                                    //缓存获取的详细数据
                                    this.saveRefugeDetailData(res);
                                    this.$refs.refugePerson.getRefuge_mangement_info(res)
                                }
                            }
                        ).catch(
                            error => {
                                this.$Message.error(error)
                            }
                        )
                    }else{
                        //清空
                        this.saveRefugeDetailData('');
                        this.$refs.refugePerson.getRefuge_mangement_info('')
                    }
                } else {
                    //清空
                    this.saveRefugeDetailData('');
                    this.$refs.refugePerson.getRefuge_mangement_info('')
                }
            },
			add_refuge () {
                const selectedNode = this.$refs.tree.getSelectedNodes()[0];
                if(selectedNode){
                    let parent = selectedNode.parent;
                    let resTypeId = selectedNode.id;
                    if(parent){
                        this.changeEditStatus(false)
                        this.saveRefugeDetailData('');//清空避险场所详情缓存
                        this.refuge_info = false;
                        this.refuge_add = true;
                        this.saveRefugeResTypeId(resTypeId);
                        this.$refs.refugePerson.addCompanyInfo();
                    }else{
                        this.$Message.error('请选择根节点添加')
                    }
                } else{
                    this.$Message.error('请选择根节点添加')
                }
            },
            refugeEdit (editInfo) {
                //修改成功渲染左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                const name = editInfo.name;
                this.$set(data[0], 'title', name);
            },
            refuge_list_search () {
                //滚动查询更多滚动查询更多
                this.pageNum ++;
                this.queryRefuge('scroll');
            },
			refuge_add_show (addInfo) {
                console.log("addInfo",addInfo.data);
                this.saveRefugeDetailData(addInfo.data);
                //新增树数据
                let data = this.$refs.tree.getSelectedNodes();
                const children = data[0].children || [];
                children.push({
                    id: addInfo.data.id,
                    title: addInfo.data.name,
                    selected: true
                });
                //去除已选择的改为新增选中
                this.$set(data[0], 'selected', false);
                this.$set(data[0].children, 'children', children);
            },
			refuge_add_close () {
				this.refuge_info = true;
				this.refuge_add = false;
            },
            onComDelete (refugeDeleteInfo) {
                //删除左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                let id = refugeDeleteInfo.refugeId;
                let list = this.refuge_tree_list;
                for (let i = 0; i< list.length;i++) {
                    let children = list[i].children;
                    for (let j = 0;j<children.length;j++) {
                        if ( children[j].id === id) {
                            children.splice(j, 1)
                        }
                    }
                }
            },
            queryRefugeByResourceType() {
                this.pageNum = 1;
                this.queryRefuge();
            }
        }
    }
</script>

<style>
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

