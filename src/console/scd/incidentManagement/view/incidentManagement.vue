<template>
    <!-- 突发事件管理 -->
    <div>
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <div class="ds-search-box" :data-json="tableHeight">
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="6">
                            <form-item label="事件名称： ">
                                <i-input type="text" v-model="searchInfo.name"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="事发区域： ">
                                <i-input type="text" v-model="searchInfo.area" @on-focus="openArea"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="事件类型： ">
                                <i-input type="text" v-model="searchInfo.incidentTypeName" @on-focus="openType"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="事件等级： ">
                                <Select v-model="searchInfo.incidentLevelId">
                                    <Option v-for="item in incidentLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="6">
                            <form-item label="事件时间： ">
                                <DatePicker type="date" v-model="startTime" style="width: 100%;" @on-change="changeStartTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="至">
                                <DatePicker type="date" v-model="endTime" style="width: 100%;" @on-change="changeEndTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="12" class="ds-manage-btnBox">
                            <Button type="primary" size="large" @click="queryIncidentList">查询</Button>
                            <Button type="ghost" size="large" @click="clearSearch">清空查询</Button>
                        </i-col>
                    </Row>
                </i-form>
            </div>
        </div>
        <div class="ds-widget-box"  :data-height="tableHeight" :style="height">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
                <div class="ds-fload-right">
                    <Button type="info" @click="openExample">指挥实例</Button>
                    <Button type="primary" @click="secondaryIncident">次生事件</Button>
                    <!-- <Button type="ghost" style="background: #fff;" @click="settingCase">设为典型案例</Button> -->
                </div>
            </div>
            <div class="ds-table-box">
                <el-table :data="listData" border stripe style="width: 100%" highlight-current-row @row-click="tableSelect">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column label="突发事件名称" width="">
                        <template slot-scope="scope">
                            <!-- <i class="ds-icon-position" v-if="scope.row."></i> -->
                            <i class="ds-icon-position"></i>
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="occurTime" label="事发时间" width=""></el-table-column>
                    <el-table-column prop="regionName" label="事发区域" width=""></el-table-column>
                    <el-table-column prop="incidentTypeName" label="事件类型" width=""></el-table-column>
                    <el-table-column prop="incidentLevelName" label="事件等级" width=""></el-table-column>
                </el-table>
                <!-- <Table border ref="selection" highlight-row :columns="listHead" :data="listData" @on-row-click="tableSelect"></Table> -->
                <div class="ds-page-body" v-if="pageTotal > pageSize">
                    <Page :total="pageTotal" :page-size="pageSize" :current="pageNum" @on-change="slectPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="commandExampleModal" title="指挥实例" :mask-closable="false" width="90%" class-name="vertical-center-modal">
            <div class="ds-search-body" style="height: 500px;;overflow:auto;">
                <command-example v-if="commandExampleModal"></command-example>
            </div>
            <div slot="footer">
                <Button type="primary"  size="large" @click="saveregisterResource">确定</Button>
                <Button size="large"  @click="closeregisterResourceModal">关闭</Button>
            </div>
        </modal>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import tree from '@/common/components/treeModal/tree'
    import commandExample from '@/console/scd/centerWork/view/incidentProcess'
    import Cookies from 'js-cookie';

    export default {
        components: {
            tree,
            commandExample
        },
        data () {
            return {
                height: {
                    height: ''
                },
                treeMode: false,
                pageShow: false,
                pageTotal: null,
                pageNum: 1,
                commandExampleModal: false,
                startTime: '',
                endTime: '',
                searchInfo: {
                    name: '',
                    area: '',
                    regionId: null,
                    incidentTypeName: '',
                    incidentTypeId: null,
                    incidentLevelName: '',
                    incidentLevelId: null,
                    occurStartTime: '',
                    occurEndTime: ''
                },
                selectTableNode: {},
                // listHead: [
                //     {
                //         title: '序号',
                //         type: 'index',
                //         width: 70,
                //         align: 'center'
                //     },
                //     {
                //         title: '突发事件名称',
                //         key: 'name',
                //         align: 'center'
                //     },
                //     {
                //         title: '事发时间',
                //         key: 'occurTime',
                //         align: 'center'
                //     }
                //     ,
                //     {
                //         title: '事发区域',
                //         key: 'regionName',
                //         align: 'center'
                //     },
                //     {
                //         title: '事件类型',
                //         key: 'incidentTypeName',
                //         align: 'center'
                //     },
                //     {
                //         title: '事件等级',
                //         key: 'incidentLevelName',
                //         align: 'center'
                //     }
                // ],
                listData: [
                    
                ],
                incidentLevel: [
                ]
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            },
            //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
            pageSize() {
                console.log(this.$store.state.heightTable.tableInfo.numberBranches)
                return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                const height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                this.height.height = parseInt(height) + 20 + 'px';
                return height;
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.setHeightContent(h);
            this.tableHeightMessage(215); /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.queryIncidentList();
            //查询事件等级
            this.queryLevel();
            //查询突发事件列表
            this.queryIncidents();
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'saveData',
                'setHeightContent',
                'tableHeightMessage'
            ]),
            queryIncidents () {
                //查询突发事件列表
                const queryO = this.searchInfo;
                queryO.userCode = Cookies.get('userCode');
                queryO.pageNum = this.pageNum;
                queryO.pageSize = this.pageSize;
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/incident/queryIncidents',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.pageTotal = response.data.data.total;
                            this.listData = response.data.data.list;
                        }
                    }
                ).catch(
                    
                );
            },
            queryLevel () {
                //查询事件等级
                let userCode = Cookies.get('userCode');
                const info = {
                    userCode: userCode
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/platform/incidentLevel/queryIncidentLevelMaintain?userCode=sys&start=1&size=20',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                        let list = response.data.data.list;
                        let newList = [];
                        for ( let i=0;i<list.length;i++ ) {
                            newList.push({
                            value: list[i].id,
                            label: list[i].name
                            })
                        }
                        this.$set(this,'incidentLevel',newList);
                        }
                    }
                ).catch(
                    
                )
            },
            openArea () {
                //打开查询事发区域弹窗
                let TreeInfo = {
                    title: '事发区域',
                    treeMultiple: false,
                    additional: 'area',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.getUrl+'/platform/public/queryRegionTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            openType () {
                //打开事件类型弹窗
                let TreeInfo = {
                    title: '事件类型',
                    treeMultiple: false,
                    additional: 'type',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.getUrl+'/platform/public/queryIncidentTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            treeModalClose () {
                //关闭tree弹窗
                this.treeMode = false;
            },
            treeModalSave (data, type) {
                //tree确定
                if ( type === 'area') {
                    this.searchInfo.regionId = data[0].id;
                    this.searchInfo.area = data[0].title;
                }
                if ( type === 'type') {
                    this.searchInfo.incidentTypeId = data[0].id;
                    this.searchInfo.incidentTypeName = data[0].title;
                }
                if ( type === 'secondaryIncident') {

                }
                this.treeMode = false;
            },
            changeStartTime (time) {
                //查询开始时间
                this.searchInfo.occurStartTime = time;
                console.log(this.searchInfo)
            },
            changeEndTime (time) {
                //查询结束时间
                this.searchInfo.occurEndTime = time + ' ' + '23:59:59';
            },
            queryIncidentList () {
                //查询事件列表
                this.queryIncidents();
            },
            clearSearch () {
                //清空查询
                this.searchInfo = {
                   name: '',
                    area: '',
                    regionId: null,
                    incidentTypeName: '',
                    incidentTypeId: null,
                    incidentLevelName: '',
                    incidnetLevelId: null,
                    startTime: '',
                    endTime: ''
                };
                this.startTime = '';
                this.endTime = '';
                this.pageNum = 1;
                this.queryIncidents();
            },
            tableSelect (node) {
                console.log(node)
                this.selectTableNode = node;
            },
            openExample () {
                //指挥实例
                if ( !this.selectTableNode.id ) {
                    this.$Message.warning('请先选择列表数据');
                } else {
                    const status = this.selectTableNode.status;
                    if ( status === 10 ) {
                        this.$Message.warning('事件尚未处置')
                    } else {
                        const incidentId = this.selectTableNode.id;
                        window.open("/#/process?incidentId="+incidentId+"&show=1",'_blank','width='+(window.screen.availWidth-20)+',height='+(window.screen.availHeight-30)+
',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes');
                    }
                }
            },
            secondaryIncident () {
                //次生事件
                if ( !this.selectTableNode.id ) {
                    this.$Message.warning('请先选择列表数据');
                } else {
                    let TreeInfo = {
                        title: '次生事件',
                        treeMultiple: false,
                        additional: 'secondaryIncident',
                        request: 'get',
                        queryInfo: {
                            userCode: Cookies.get('userCode'),
                            incidentId: this.selectTableNode.id
                        },
                        url: this.getUrl+'/scd/incident/querySecondyIncidents4NewTree'
                    }
                    this.saveDemoData(TreeInfo);
                    this.treeMode = true;
                }
            },
            settingCase () {
                //设为典型案例
                if ( !this.selectTableNode.id ) {
                    this.$Message.warning('请先选择列表数据');
                } else {
                    // const queryO = {
                    //     userCode: Cookies.get('userCode')
                    // }
                    // axios({
                    //     method: 'get',
                    //     url: 'http://192.168.0.29:8080/plan/content/queryPlanContent4ResEquipmentPlanByPage',
                    //     params: queryO
                    // }).then(
                    //     response => {
                    //         if ( response.data.code === 200 ) {
                    //         }
                    //     }
                    // ).catch(
                        
                    // );
                }
            },
            saveregisterResource () {

            },
            closeregisterResourceModal () {

            },
            slectPage (index) {
                //分页
                this.pageNum = index;
                this.queryIncidents();
            }
        }
    }
</script>

<style scoped>
    .ds-search-box {
        padding-top: 20px;
        margin-right: 20px;
    }
    .ds-manage-btnBox {
        padding-left: 20px;
    }
</style>
<style>
    .ds-icon-position {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 0; 
        height: 0; 
        border-top: 20px solid #ccc; 
        border-right: 20px solid transparent;
    }
</style>

