<template>
    <div>
        <div>
            <Row style="height:100%;">
                <i-col span="5" style="height:100%;">
					<div class="ds-widget-box">
						<div class="ds-widget-title">
							<span class="ds-title-icon"></span>
							<h2>处置队伍</h2>
                            <div class="ds-btnList">
                                <Button type="success" @click="add_team">新增</Button>
                            </div>
						</div>
                        <div :style='height' :data-json="tableHeight">
                            <div class="ds-search-left ds-search ds-flex">
                                <Select v-model="resourceType" style="width:70%" @on-change="queryTeamByResourceType">
                                    <Option v-for="item in team_resourceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <i-input v-model="teamSearchName" icon="ios-search" @on-click="queryTeam" @on-enter="queryTeam" style="width: 210px;margin-left: 5px;"></i-input>
                            </div>
                            <div class="ds-tree-left">
                                <Scroll :on-reach-bottom="handleReachBottom" loading-text="加载中" :height="scrollHeight" :data-pageSize2="pageSize2">
                                    <Tree :data="teamList" @on-select-change="selectTeam" ref="tree"></Tree>
                                </Scroll>
                            </div>
                        </div>
					</div>
                </i-col>
                <i-col span="19">
                    <team-info @team-edit="teamEdit" @team-delete-sucess="team_delete_sucess" @team-save="team_add_show" ref="teamInfo"></team-info>
                    <div class="ds-resource-info">
                        <team-person ref="teamPerson" v-bind="teamId"></team-person>
                    </div>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import teamInfo from './team_info'
    import teamPerson from './team_person'
    import Cookies from 'js-cookie';

	export default {
		 name: 'hospital_index',
         components: {
             teamInfo,
             teamPerson
         },
		 data () {
            return {
                height: {
                    height: ''
                },
                pageNum: 1,
                resourceType: null,
                teamSearchName: '',
                teamList: [],
                teamId: null,
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
            team_resourceType() {
                return this.$store.state.team.resourceTypeData
            }
        },
        created () {
            this.queryTeam();
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessageIndex(60) 
            this.getResourceTypeAboutTeams();
            this.saveTeamDetailData('');
            this.getTeamMemberList([])
        },
        mounted() {
            this.queryTeam();
        },
        methods: {
            ...mapActions([
                'saveTeamResTypeId',
                'saveTeamDetailData',
                'getTeamResourceType',
                'changeEditStatus',//编辑状态
                'getTeamMemberList',
                'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            getResourceTypeAboutTeams() {
                const params = {
                    url: this.url + '/platform/resourceType/queryResourceTypeList4ParentNotNull',
                    data: {
                        userCode: this.userCode,
                        category: 4
                    }
                }
                this.getTeamResourceType(params)
            },
            queryTeam (scroll) {
                //获取队伍信息列表数据
                let teamSearch = {
                    userCode: this.userCode,
                    name: this.teamSearchName,
                    resTypeId: this.resourceType,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize2
                }
                axios({
                    method: 'POST',
                    url: this.url + '/resource/team/teamQuery',
                    data: teamSearch
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let teamListInfo = this.recombination(response.data.data.list);
                            if ( scroll === 'scroll') {
                                for (let i = 0; i < teamListInfo.length;i++) {
                                    this.teamList.push(teamListInfo[i]);
                                }
                            } else {
                                this.teamList = teamListInfo;
                            }
                            this.$set(this.teamList[0], 'expand', true);
                        }
                    }
                ).catch(
                    error => {
                        this.$Message.error(error)
                    }
                );
            },
            // getTeamDetail (teamDetail) {
            //     //查询队伍详细信息
            //     this.$refs.teamInfo.getTeamDetail(teamDetail);
            //     //查询队伍管理信息
            //     this.$refs.teamPerson.getTeam_mangement_info(teamDetail);
            //     //查询队伍成员
            //     this.$refs.teamPerson.getTeamMember();
            // },
            selectTeam (nodes) {
                //点击选择树节点
                this.$refs.teamInfo.resetFrom();
                if(nodes[0]){
                    let parent = nodes[0].parent;
                    if(nodes.length >= 1 && !parent){
                        let teamId = nodes[0].id;
                        let teamInfo = {
                            userCode: this.userCode,
                            id: teamId
                        }
                        axios({
                            method: 'get',
                            url: this.url + '/resource/team/getTeamDetail',
                            params: teamInfo
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    const res = response.data.data
                                    console.log("detail",res);
                                    //缓存获取的详细数据
                                    this.saveTeamDetailData(res);
                                    //查询队伍详情
                                    this.$refs.teamPerson.getTeam_mangement_info(res);
                                    //查询队伍成员
                                    this.$refs.teamPerson.getTeamMember();
                                }
                            }
                        ).catch(
                            error => {
                                this.$Message.error(error)
                            }
                        )
                    } else{
                        //清空
                        this.saveTeamDetailData('');
                        this.getTeamMemberList([])
                        this.$refs.teamPerson.getTeam_mangement_info('')
                        this.$refs.teamPerson.setTotalNumNull();
                    }
                } else {
                    //清空
                    this.saveTeamDetailData('');
                    this.getTeamMemberList([])
                    this.$refs.teamPerson.getTeam_mangement_info('')
                    this.$refs.teamPerson.setTotalNumNull();
                }
            },
            teamEdit (teamEditInfo) {
                //队伍修改成功后更新左侧数据
                console.log(teamEditInfo)
                let data = this.$refs.tree.getSelectedNodes();
                const name = teamEditInfo.name;
                this.$set(data[0], 'title', name);
            },
            team_delete_sucess (teamDeleteInfo) {
                //删除左侧列表
                let data = this.$refs.tree.getSelectedNodes();
                let id = teamDeleteInfo.id;
                let list = this.teamList;
                for (let i = 0; i< list.length;i++) {
                    let children = list[i].children;
                    for (let j = 0;j<children.length;j++) {
                        if ( children[j].id === id) {
                            children.splice(j, 1)
                        }
                    }
                }
            },
            add_team () {
                const selectedNode = this.$refs.tree.getSelectedNodes()[0];
                if(selectedNode){
                    let parent = selectedNode.parent;
                    let resTypeId = selectedNode.id;
                    if(parent){
                        this.changeEditStatus(false)
                        this.saveTeamDetailData('');//清空避险场所详情缓存
                        this.saveTeamResTypeId(resTypeId);
                        this.$refs.teamPerson.addCompanyInfo();
                    }else{
                        this.$Message.error('请选择根节点添加')
                    }
                } else{
                    this.$Message.error('请选择根节点添加')
                }
            },
            handleReachBottom () {
                let hospitalList = this.hospitalList;
                return new Promise(resolve => {
                    setTimeout(() => {
                        hospitalList.push({
                        title: '新建队伍',
                        expand: true,
                        children: [
                            {
                                title: '新建队伍1'
                            },
                            {
                                title: '新建队伍2'
                            }
                        ]
                    });
                        resolve();
                    }, 1000);
                });
            },
            team_add_show (teamAddData) {
                this.saveTeamDetailData(teamAddData.data);
                //新增树数据
                let data = this.$refs.tree.getSelectedNodes();
                const children = data[0].children || [];
                children.push({
                    id: teamAddData.data.id,
                    title: teamAddData.data.name,
                    selected: true
                });
                //去除已选择的改为新增选中
                this.$set(data[0], 'selected', false);
                this.$set(data[0].children, 'children', children);
                
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
            queryTeamByResourceType() {
                this.pageNum = 1;
                this.queryTeam();
            }
        }
	}
</script>

<style>
    .ds-hospital-title{
        padding: 5px 0;
    }
    .ds-hospital-info .ivu-card-body{
        padding-right: 0;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
    }
    .layout-assistant{
        width: 300px;
        margin: 0 auto;
        height: inherit;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }

    .ds-hospital-icon{
        line-height: 24px;
        text-align: center;
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