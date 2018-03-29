<template>
    <div>
		<Row style="height:100%;">
			<i-col span="5" style="height:100%;">
				<div class="ds-widget-box">
					<div class="ds-widget-title">
						<span class="ds-title-icon"></span>
						<h2>应急物资</h2>
                        <div class="ds-btnList">
                            <Button type="success"  @click="add_material">新增</Button>
                        </div>
					</div>
                    <div :style='height' :data-json="tableHeight">
                        <div class="ds-search-left ds-search ds-flex">
                            <Select v-model="resourceType" style="width:70%" @on-change="queryMaterialByResourceType">
                                <Option v-for="item in material_resourceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <i-input v-model="materialSearchName" icon="ios-search" @on-click="queryMaterial" @on-enter="queryMaterial" style="width: 210px;margin-left: 5px;"></i-input>
                        </div>
                        <div class="ds-tree-left">
                            <Scroll :on-reach-bottom="material_list_search" loading-text="加载中" :height="scrollHeight" :data-pageSize2="pageSize2">
                                <Tree :data="material_tree_list" @on-select-change="selectMaterial" ref="tree"></Tree>
                            </Scroll>
                        </div>
                    </div>
				</div>
			</i-col>
			<i-col span="19">
                <div class="ds-hospital-table ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>应急物资详细信息</h2>
                    </div>
                    <div class="ds-widget-cont">
                        <material-info @material-edit="materialEdit" @material-delete="onComDelete" @material-save="material_add_show" ref="materialInfo"></material-info>
                        <!--<material-add v-if="material_add" @material-save="material_add_show" @material-add-close="material_add_close" ref="materialAdd"></material-add>-->
                        <!-- <br> -->
                        <div class="ds-resource-info">
                            <material-person ref="materialPerson"></material-person>
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
    // import materialInfo from './material_info'
	import materialPerson from './material_person'
	// import materialAdd from './material_add'
    import materialInfo from './material_info'
    import Cookies from 'js-cookie';

    export default {
        components: {
            // materialInfo,
			materialPerson,
			// materialAdd
            materialInfo
        },
        data () {
            return {
                height: {
                    height: ''
                },
				material_info: true,
				material_add: false,
                material_tree_list: [],
                resourceType: null,
                materialSearchName: '',
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
            material_resourceType() {
                return this.$store.state.material.resourceTypeData
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessageIndex(60) 
            this.getUnitAboutMaterials()
            this.getResourceTypeAboutMaterials();
            this.saveMaterialDetailData('');
        },
        mounted() {
            this.queryMaterial();
        },
        methods: {
            ...mapActions([
                'saveMaterialResTypeId',
                'saveMaterialDetailData',
                'getMaterialUnit',
                'getMaterialResourceType',
                'changeEditStatus',//编辑状态
                'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getUnitAboutMaterials() {
                const params = {
                    url: this.url + '/platform/dictionary/getDictionaryByType',
                    data: {
                        userCode: this.userCode,
                        type: 'resource_unit'
                    }
                }
                this.getMaterialUnit(params)
            },
            getResourceTypeAboutMaterials() {
                const params = {
                    url: this.url + '/platform/resourceType/queryResourceTypeList4ParentNotNull',
                    data: {
                        userCode: this.userCode,
                        category: 1
                    }
                }
                this.getMaterialResourceType(params)
            },
            //获取物资信息列表数据
            queryMaterial (scroll) {
                let materialSearch = {
                    userCode: this.userCode,
                    name: this.materialSearchName,
                    resTypeId: this.resourceType,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize2
                }
                axios({
                    method: 'POST',
                    url: this.url + '/resource/material/queryMaterialByPage',
                    data: materialSearch
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let materialListInfo = this.recombination(response.data.data.list);
                            if ( scroll === 'scroll') {
                                for (let i = 0; i < materialListInfo.length;i++) {
                                    this.material_tree_list.push(materialListInfo[i]);
                                }
                            } else {
                                this.material_tree_list = materialListInfo;
                            }
                            this.$set(this.material_tree_list[0], 'expand', true);
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
            selectMaterial (nodes) {
                //点击选择树节点
                this.$refs.materialInfo.resetFrom();
                if(nodes[0]){
                    let parent = nodes[0].parent;
                    if(nodes.length >= 1 && !parent){
                        let materialId = nodes[0].id;
                        let materialInfo = {
                            userCode: this.userCode,
                            id: materialId
                        }
                        axios({
                            method: 'get',
                            url: this.url + '/resource/material/getMaterialDetail',
                            params: materialInfo
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    const res = response.data.data
                                    //缓存获取的详细数据
                                    this.saveMaterialDetailData(res);
                                    this.$refs.materialPerson.getMaterial_mangement_info(res)
                                }
                            }
                        ).catch(
                            error => {
                                this.$Message.error(error)
                            }
                        )
                    }else{
                        //清空
                        this.saveMaterialDetailData('');
                        this.$refs.materialPerson.getMaterial_mangement_info('')
                    }
                } else {
                    //清空
                    this.saveMaterialDetailData('');
                    this.$refs.materialPerson.getMaterial_mangement_info('')
                }
            },
			add_material () {
                const selectedNode = this.$refs.tree.getSelectedNodes()[0];
                if(selectedNode){
                    let parent = selectedNode.parent;
                    let resTypeId = selectedNode.id;
                    if(parent){
                        this.changeEditStatus(false)
                        this.saveMaterialDetailData('');//清空物资详情缓存
                        this.material_info = false;
                        this.material_add = true;
                        this.saveMaterialResTypeId(resTypeId);
                        this.$refs.materialPerson.addCompanyInfo();
                    }else{
                        this.$Message.error('请选择根节点添加')
                    }
                } else{
                    this.$Message.error('请选择根节点添加')
                }
            },
            materialEdit (editInfo) {
                //修改成功渲染左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                const name = editInfo.name;
                this.$set(data[0], 'title', name);
            },
            material_list_search () {
                //滚动查询更多滚动查询更多
                this.pageNum ++;
                this.queryMaterial('scroll');
            },
			material_add_show (addInfo) {
                this.saveMaterialDetailData(addInfo.data);
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
			material_add_close () {
				this.material_info = true;
				this.material_add = false;
            },
            onComDelete (materialDeleteInfo) {
                //删除左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                let id = materialDeleteInfo.id;
                let list = this.material_tree_list;
                for (let i = 0; i< list.length;i++) {
                    let children = list[i].children;
                    for (let j = 0;j<children.length;j++) {
                        if ( children[j].id === id) {
                            children.splice(j, 1)
                        }
                    }
                }
            },
            queryMaterialByResourceType() {
                this.pageNum = 1;
                this.queryMaterial();
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

