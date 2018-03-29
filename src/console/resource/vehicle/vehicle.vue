<template>
    <div>
		<Row style="height:100%;">
			<i-col span="5" style="height:100%;">
				<div class="ds-widget-box">
					<div class="ds-widget-title">
						<span class="ds-title-icon"></span>
						<h2>应急车辆</h2>
                        <div class="ds-btnList">
                            <Button type="success" @click="add_vehicle">新增</Button>
                        </div>
					</div>
                    <div :style='height' :data-json="tableHeight">
                        <div class="ds-search-left ds-search ds-flex">
                            <Select v-model="resourceType" style="width:70%" @on-change="queryVehicleByResourceType">
                                <Option v-for="item in vehicle_resourceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <i-input v-model="vehicleSearchName" icon="ios-search" @on-click="queryVehicle" @on-enter="queryVehicle" style="width: 210px;margin-left: 5px;"></i-input>
                        </div>
                        <div class="ds-tree-left">
                            <Scroll :on-reach-bottom="vehicle_list_search" loading-text="加载中" :height="scrollHeight" :data-pageSize2="pageSize2">
                                <Tree :data="vehicle_tree_list" @on-select-change="selectVehicle" ref="tree"></Tree>
                            </Scroll>
                        </div>
                    </div>
				</div>
			</i-col>
			<i-col span="19">
                <div class="ds-hospital-table ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>应急车辆详细信息</h2>
                    </div>
                    <div class="ds-widget-cont">
                        <vehicle-info @vehicle-edit="vehicleEdit" @vehicle-delete="onComDelete" @vehicle-save="vehicle_add_show" ref="vehicleInfo"></vehicle-info>
                        <div class="ds-resource-info">
                            <vehicle-person ref="vehiclePerson"></vehicle-person>
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
	import vehiclePerson from './vehicle_person'
    import vehicleInfo from './vehicle_info'
    import Cookies from 'js-cookie';

    export default {
        components: {
			vehiclePerson,
            vehicleInfo
        },
        data () {
            return {
                height: {
                    height: ''
                },
				vehicle_info: true,
				vehicle_add: false,
                vehicle_tree_list: [],
                resourceType: null,
                vehicleSearchName: '',
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
            vehicle_resourceType() {
                return this.$store.state.vehicle.resourceTypeData
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessageIndex(60) 
            this.getResourceTypeAboutVehicles();
            this.saveVehicleDetailData('');
        },
        mounted() {
            this.queryVehicle();
        },
        methods: {
            ...mapActions([
                'saveVehicleResTypeId',
                'saveVehicleDetailData',
                'getVehicleResourceType',
                'changeEditStatus',//编辑状态
                'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getResourceTypeAboutVehicles() {
                const params = {
                    url: this.url + '/platform/resourceType/queryResourceTypeList4ParentNotNull',
                    data: {
                        userCode: this.userCode,
                        category: 5
                    }
                }
                this.getVehicleResourceType(params)
            },
            //获取车辆信息列表数据
            queryVehicle (scroll) {
                let vehicleSearch = {
                    userCode: this.userCode,
                    name: this.vehicleSearchName,
                    resTypeId: this.resourceType,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize2
                }
                axios({
                    method: 'POST',
                    url: this.url + '/resource/vehicle/queryVehicleByPage',
                    data: vehicleSearch
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let vehicleListInfo = this.recombination(response.data.data.list);
                            if ( scroll === 'scroll') {
                                for (let i = 0; i < vehicleListInfo.length;i++) {
                                    this.vehicle_tree_list.push(vehicleListInfo[i]);
                                }
                            } else {
                                this.vehicle_tree_list = vehicleListInfo;
                            }
                            this.$set(this.vehicle_tree_list[0], 'expand', true);
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
            selectVehicle (nodes) {
                //点击选择树节点
                this.$refs.vehicleInfo.resetFrom();
                if(nodes[0]){
                    let parent = nodes[0].parent;
                    if(nodes.length >= 1 && !parent){
                        let vehicleId = nodes[0].id;
                        let vehicleInfo = {
                            userCode: this.userCode,
                            id: vehicleId
                        }
                        axios({
                            method: 'get',
                            url: this.url + '/resource/vehicle/getVehicleDetail',
                            params: vehicleInfo
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    const res = response.data.data
                                    //缓存获取的详细数据
                                    this.saveVehicleDetailData(res);
                                    this.$refs.vehiclePerson.getVehicle_mangement_info(res)
                                }
                            }
                        ).catch(
                            error => {
                                this.$Message.error(error)
                            }
                        )
                    }else{
                        //清空
                        this.saveVehicleDetailData('');
                        this.$refs.vehiclePerson.getVehicle_mangement_info('')
                    }
                } else {
                    //清空
                    this.saveVehicleDetailData('');
                    this.$refs.vehiclePerson.getVehicle_mangement_info('')
                }
            },
			add_vehicle () {
                const selectedNode = this.$refs.tree.getSelectedNodes()[0];
                if(selectedNode){
                    let parent = selectedNode.parent;
                    let resTypeId = selectedNode.id;
                    if(parent){
                        this.changeEditStatus(false)
                        this.saveVehicleDetailData('');//清空车辆详情缓存
                        this.vehicle_info = false;
                        this.vehicle_add = true;
                        this.saveVehicleResTypeId(resTypeId);
                        this.$refs.vehiclePerson.addCompanyInfo();
                    }else{
                        this.$Message.error('请选择根节点添加')
                    }
                } else{
                    this.$Message.error('请选择根节点添加')
                }
            },
            vehicleEdit (editInfo) {
                //修改成功渲染左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                const name = editInfo.name;
                this.$set(data[0], 'title', name);
            },
            vehicle_list_search () {
                //滚动查询更多滚动查询更多
                this.pageNum ++;
                this.queryVehicle('scroll');
            },
			vehicle_add_show (addInfo) {
                this.saveVehicleDetailData(addInfo.data);
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
			vehicle_add_close () {
				this.vehicle_info = true;
				this.vehicle_add = false;
            },
            onComDelete (vehicleDeleteInfo) {
                //删除左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                let id = vehicleDeleteInfo.id;
                let list = this.vehicle_tree_list;
                for (let i = 0; i< list.length;i++) {
                    let children = list[i].children;
                    for (let j = 0;j<children.length;j++) {
                        if ( children[j].id === id) {
                            children.splice(j, 1)
                        }
                    }
                }
            },
            queryVehicleByResourceType() {
                this.pageNum = 1;
                this.queryVehicle();
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

