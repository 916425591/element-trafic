<template>
    <div>
		<Row style="height:100%;">
			<i-col span="5" style="height:100%;">
				<div class="ds-widget-box">
					<div class="ds-widget-title">
						<span class="ds-title-icon"></span>
						<h2>应急专家</h2>
                        <div class="ds-btnList">
                            <Button type="success" @click="add_expert">新增</Button>
                        </div>
					</div>
                    <div :style='height' :data-json="tableHeight">
                        <div class="ds-search-left ds-search ds-flex">
                            <Select v-model="resourceType" style="width:70%" @on-change="queryExpertByResourceType">
                                <Option v-for="item in expert_resourceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <i-input v-model="expertSearchName" icon="ios-search" @on-click="queryExpert" @on-enter="queryExpert" style="width: 210px;margin-left: 5px;"></i-input>    
                        </div>
                        <div class="ds-tree-left">
                            <Scroll :on-reach-bottom="expert_list_search" loading-text="加载中" :height="scrollHeight" :data-pageSize2="pageSize2">
                                <Tree :data="expert_tree_list" @on-select-change="selectExpert" ref="tree"></Tree>
                            </Scroll>
                        </div>
                    </div>
				</div>
			</i-col>
			<i-col span="19">
                <div class="ds-hospital-table ds-widget-box">
                    <div class="ds-widget-cont">
                        <expert-info ref="expertInfo" @expert-edit="expertEdit" @expert-delete="onComDelete"  @expert-save="expert_add_show"></expert-info>
                    </div>
                </div>
				
			</i-col>
		</Row>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import expertInfo from './expert_info'
    import Cookies from 'js-cookie';

    export default {
        components: {
            expertInfo
        },
        data () {
            return {
                height: {
                    height: ''
                },
                expert_tree_list: [],
                expertSearchName: '',
                resourceType: null,
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
                const count = parseInt((parseInt(height) - 50) / 18) + 3
                this.pageSize2 = count
                this.scrollHeight = parseInt(height) - 52;
                return this.height.height
            },
            expert_resourceType() {
                return this.$store.state.expert.resourceTypeData
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessageIndex(60) 
            this.getResourceTypeAboutExperts();
            this.saveExpertDetailData('');
        },
        mounted() {
            this.queryExpert();
        },
        methods: {
            ...mapActions([
                'saveExpertResTypeId',
                'saveExpertDetailData',
                'getExpertResourceType',
                'changeEditStatus',//编辑状态
                'saveExpertSexName',
                'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getResourceTypeAboutExperts() {
                const params = {
                    url: this.url + '/platform/resourceType/queryResourceTypeList4ParentNotNull',
                    data: {
                        userCode: this.userCode,
                        category: 6
                    }
                }
                this.getExpertResourceType(params)
            },
            //获取专家信息列表数据
            queryExpert (scroll) {
                let expertSearch = {
                    userCode: this.userCode,
                    name: this.expertSearchName,
                    resTypeId: this.resourceType,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize2
                }
                axios({
                    method: 'POST',
                    url: this.url + '/resource/expert/queryExpertsByPage',
                    data: expertSearch
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let expertListInfo = this.recombination(response.data.data.list);
                            if ( scroll === 'scroll') {
                                for (let i = 0; i < expertListInfo.length;i++) {
                                    this.expert_tree_list.push(expertListInfo[i]);
                                }
                            } else {
                                this.expert_tree_list = expertListInfo;
                            }
                            this.$set(this.expert_tree_list[0], 'expand', true);
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
            selectExpert (nodes) {
                //点击选择树节点
                this.$refs.expertInfo.resetFrom();
                if(nodes[0]){
                    let parent = nodes[0].parent;
                    if(nodes.length >= 1 && !parent){
                        let expertId = nodes[0].id;
                        let expertInfo = {
                            userCode: this.userCode,
                            expertId: expertId
                        }
                        axios({
                            method: 'get',
                            url: this.url + '/resource/expert/getExpertDetail',
                            params: expertInfo
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    const res = response.data.data
                                    //缓存获取的详细数据
                                    if(res.sex === 1) {
                                        res.sexName = '男';
                                    } else if(res.sex === 2){
                                        res.sexName = '女';
                                    }
                                    this.saveExpertDetailData(res);
                                }
                            }
                        ).catch(
                            error => {
                                this.$Message.error(error)
                            }
                        )
                    } else{
                        //清空
                        this.saveExpertDetailData('');
                    }
                } else {
                    //清空
                    this.saveExpertDetailData('');
                }
            },
			add_expert () {
                const selectedNode = this.$refs.tree.getSelectedNodes()[0];
                if(selectedNode){
                    let parent = selectedNode.parent;
                    let resTypeId = selectedNode.id;
                    if(parent){
                        this.changeEditStatus(false);
                        this.saveExpertDetailData('');//清空专家详情缓存
                        this.saveExpertResTypeId(resTypeId);
                    }else{
                        this.$Message.error('请选择根节点添加')
                    }
                } else{
                    this.$Message.error('请选择根节点添加')
                }
            },
            expertEdit (editInfo) {
                console.log('before',editInfo);
                if(editInfo.sex === 1 || editInfo.sex === '1') {
                    editInfo.sexName = '男';
                } else if(editInfo.sex === 2 || editInfo.sex === '2'){
                    editInfo.sexName = '女';
                }
                console.log('after',editInfo);
                this.saveExpertDetailData(editInfo);
                //修改成功渲染左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                const name = editInfo.name;
                this.$set(data[0], 'title', name);
            },
            expert_list_search () {
                //滚动查询更多
                this.pageNum ++;
                this.queryExpert('scroll');
            },
			expert_add_show (addInfo) {
                const res = addInfo.data;
                if(res.sex === 1) {
                    res.sexName = '男';
                } else if(res.sex === 2){
                    res.sexName = '女';
                }
                this.saveExpertDetailData(res);
                //新增树数据
                let data = this.$refs.tree.getSelectedNodes();
                const children = data[0].children || [];
                children.push({
                    id: res.id,
                    title: res.name,
                    selected: true
                });
                //去除已选择的改为新增选中
                this.$set(data[0], 'selected', false);
                this.$set(data[0].children, 'children', children);
            },
            onComDelete (expertDeleteInfo) {
                //删除左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                let id = expertDeleteInfo.expertId;
                let list = this.expert_tree_list;
                for (let i = 0; i< list.length;i++) {
                    let children = list[i].children;
                    for (let j = 0;j<children.length;j++) {
                        if ( children[j].id === id) {
                            children.splice(j, 1)
                        }
                    }
                }
            },
            queryExpertByResourceType() {
                this.pageNum = 1;
                this.queryExpert();
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

