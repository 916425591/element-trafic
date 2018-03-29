<template>
    <!-- 事件信息 -->
    <div class="ds-scd-incident">
        <div class="ds-widget-box ds-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>事件信息</h2>
            </div>
            <div class="ds-table-box formBox">
                <i-form ref="formCustom" :model="formCustom" :label-width="80">
                    <Row>
                        <i-col span="8">
                            <form-item label="事发时间: ">
                                <span>{{ formCustom.occurTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事发区域: ">
                                <span>{{ formCustom.regionName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事件类型: ">
                                <span>{{ formCustom.incidentTypeName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="事件等级: ">
                                <span>{{ formCustom.incidentLevelName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="16">
                            <form-item label="事发地址: ">
                                <span>{{ formCustom.address }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事件描述: ">
                                <span>{{ formCustom.description }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="已采措施: ">
                                <span>{{ formCustom.measures }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="处置预案: ">
                                <span>{{ formCustom.planName }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="启动时间: ">
                                <span>{{ formCustom.startTime }}</span>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                        </i-col>
                    </Row>
                </i-form>
                <div class="ds-align-right ds-dropdown-icon">
                    <Button v-if="continuePlan" type="primary" @click="planContinue">继续预案</Button>
                    <Button v-if="selectPlan" type="primary" @click="openModal" style="margin-right: 3px;">{{ planStep.name }}</Button>
                    <Dropdown v-if="moreAction" trigger="click">
                        <Button type="primary">
                            更多操作
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <div @click="changePlanModal">切换预案</div>
                            </DropdownItem>
                            <DropdownItem>
                                <div @click="openSecondaryIncidentModal">次生事件</div>
                            </DropdownItem>
                            <DropdownItem v-if="closePlan">
                                <div @click="planClose">处置完毕</div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>成员单位</h2>
            </div>
            <div class="ds-table-box" :style='height' :data-json="tableHeight">
                <!-- <Table border highlight-row :columns="memberHead" :data="memberData"></Table> -->
                <el-table :data="memberData" border stripe style="width: 100%" highlight-current-row>
                    <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
                    <el-table-column prop="memberOrgName" label="单位名称" width="" align="center"></el-table-column>
                    <el-table-column prop="planName" label="预案名称" width="" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="启动时间" width="" align="center"></el-table-column>
                    <el-table-column prop="statusName" label="状态" width="100" align="center"></el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-button  size="mini" @click="queryProcess(scope)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>周围隐患</h2>
                <div class="ds-fload-right ds-dropdown-icon">
                    <Dropdown trigger="click" @on-click="selectRange">
                        <a href="javascript:void(0)">
                            {{ range }}
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="500米内" id="a">500米内</DropdownItem>
                            <DropdownItem name="1公里内">1公里内</DropdownItem>
                            <DropdownItem name="3公里内">3公里内</DropdownItem>
                            <DropdownItem name="5公里内">5公里内</DropdownItem>
                            <DropdownItem name="10公里内">10公里内</DropdownItem>
                            <DropdownItem name="10公里以外">10公里以外</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div class="ds-table-box" :style='height' :data-json="tableHeight">
                <Table border highlight-row :columns="dangerHead" :data="dangerData"></Table>
            </div> -->
        </div>
        <!-- 次生事件弹窗 -->
        <modal v-model="secondaryIncidentModal" title="次生事件" :mask-closable="false" width="600" @on-cancel="closeSecondaryIncidentModal('secondaryIncident')" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="secondaryIncident" :model="secondaryIncident" :rules="ruleCustom" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="事件名称： " prop="name">
                                <i-input type="text" v-model="secondaryIncident.name"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事发区域： " prop="regionName">
                                <i-input type="text" v-model="secondaryIncident.regionName" @on-focus="openArea"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事件类型： " prop="incidentTypeName">
                                <i-input type="text" v-model="secondaryIncident.incidentTypeName" @on-focus="openIncidentType"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事件等级： " prop="incidentLevelId">
                                <Select v-model="secondaryIncident.incidentLevelId">
                                    <Option v-for="item in incidentLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事发时间： " prop="time">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="secondaryIncident.time" style="width: 100%;" @on-change="changeOccurTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事件描述： " prop="description">
                                <i-input type="textarea" v-model="secondaryIncident.description"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveSecondaryIncidentModal('secondaryIncident')">确定</Button>
                <Button size="large"  @click="closeSecondaryIncidentModal('secondaryIncident')">关闭</Button>
            </div>
        </modal>
        <!-- 继续预案 -->
        <modal v-model="commandExampleModal" title="协同处置调度" :mask-closable="false" width="90%" class-name="vertical-center-modal">
            <div style="height: 500px;overflow:auto;">
                <command-example v-if="commandExampleModal"></command-example>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveregisterResource">确定</Button>
                <Button size="large"  @click="closeregisterResourceModal">关闭</Button>
            </div>
        </modal>
        <!-- 关闭预案 -->
        <modal v-model="closePlanModal" class-name="vertical-center-modal" title="处置完毕" :mask-closable="false" width="300" @on-cancel="planModalClose">
            <div>是否确定处置完毕</div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveClosePlan">确定</Button>
                <Button size="large"  @click="planModalClose">关闭</Button>
            </div>
        </modal>
        <select-plan-modal v-if="selectPlanModal" @table-search-close="closeSearchModal" @table-search-save="saveSearchModal"></select-plan-modal>
        <start-plan v-if="startPlanModal" @start-plan-save="startPlanSave" @start-plan-close="startPlanClose" @open-member="settingOrg" ref="startPlan"></start-plan>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import selectPlanModal from '@/common/components/tableSearchModal/tableSearchModal'
    import startPlan from '@/common/components/startPlan/startPlan'
    import commandExample from '@/console/scd/centerWork/view/incidentProcess'
    import tree from '@/common/components/treeModal/tree'
    import Cookies from 'js-cookie';

    export default {
        components: {
            selectPlanModal,
            startPlan,
            commandExample,
            tree
        },
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入事件名称'));
                } else {
                    callback()
                }
            };
            const validateRegionName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事发区域'));
                } else {
                    callback()
                }
            };
            const validateTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事发时间'));
                } else {
                    callback()
                }
            };
            const validateDescription = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入事件描述'));
                } else {
                    callback()
                }
            };
            const validateIncidentType = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事件类型'));
                } else {
                    callback()
                }
            };
            const validateIncidentLevel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事件等级'));
                } else {
                    callback()
                }
            };
            return {
                height: {
                    // margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                },
                treeMode: false,
                selectPlanModal: false,//筛选预案弹窗
                startPlanModal: false,//启动预案弹窗
                memberModal: false,//设置成员单位
                selectPlan: false,//点击列表后显示
                continuePlan: false,//继续预案
                changePlan: false,//切换预案
                closePlanModal: false,
                moreAction: false,
                closePlan: true,
                range: '区域范围',
                secondaryIncidentModal: false,
                commandExampleModal: false,
                planStep: {
                    state: 1,
                    name: '筛选预案'
                },
                planState: {},
                formCustom: {
                },
                selectPlanInfo: {},//选择预案信息
                noticeContent: '',
                orgDuty: '',//成员单位职责
                dangerHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '隐患/防护目标名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '负责人',
                        key: 'person',
                        align: 'center'
                    },
                    {
                        title: '重要级别',
                        key: 'level',
                        align: 'center'
                    },
                    {
                        title: '所在位置',
                        key: 'location',
                        align: 'center'
                    }
                ],
                memberData: [],
                dangerData: [
                    {
                        name: '加油站',
                        person: '张伟山',
                        level: '重要',
                        location: '金海区新城光路'
                    },
                    {
                        name: '小学',
                        person: '张伟山',
                        level: '重要',
                        location: '金海区新城光路'
                    },
                    {
                        name: '中学',
                        person: '张伟山',
                        level: '重要',
                        location: '金海区新城光路'
                    },
                    {
                        name: '天然气管道',
                        person: '张伟山',
                        level: '重要',
                        location: '金海区新城光路'
                    },
                    {
                        name: '天然气管道',
                        person: '张伟山',
                        level: '重要',
                        location: '金海区新城光路'
                    }
                ],
                secondaryIncident: {
                    name: '',
                    regionId: null,
                    regionName: '',
                    incidentTypeId: null,
                    incidentTypeName: '',
                    incidentLevelId: null,
                    occurTime: '',
                    description: '',
                    time: ''
                },
                incidentType: [
                    {
                        value: 1,
                        label: '类型'
                    }
                ],
                incidentLevel: [
                    {
                        value: 2,
                        label: '重要'
                    }
                ],
                ruleCustom: {
                    name: [
                        { required: true, validator: validateName, trigger: 'blur' }
                    ],
                    regionName: [
                        { required: true, validator: validateRegionName, trigger: 'blur' }
                    ],
                    time: [
                        { required: true, validator: validateTime, trigger: 'change' }
                    ],
                    description: [
                        { required: true, validator: validateDescription, trigger: 'blur' }
                    ],
                    incidentTypeName: [
                        { required: true, validator: validateIncidentType, trigger: 'blur' }
                    ],
                    incidentLevelId: [
                        { required: true, validator: validateIncidentLevel, trigger: 'change' }
                    ]
                },
            }
        },
        computed:{
            tableInfo() {//获取调用组件传入的参数信息
                return this.$store.state.scd.incident;
            },
            getUrl () {
                return this.$store.state.userCode.url;
            },
            tableHeight() {
                const res = this.$store.state.heightTable.tableInfo.tableHeight
                console.log(parseInt(res))
                this.height.height = parseInt(res) - 334 + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.setHeightContent(h);
            this.tableHeightMessage(30);
            //查询事件等级
            this.queryLevel();
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'saveTableData',
                'saveIncidentDetail',
                'saveStartPlanDetail',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryIncident (data) {
                this.planState = data;
                this.selectPlan = true;
                if ( data.status === 20 ) {
                    this.continuePlan = true;
                    this.selectPlan = false;
                    this.moreAction = true;
                    this.closePlan = true;
                } else {
                    this.continuePlan = false;
                    this.planStep = {
                        state: 1,
                        name: '筛选预案',
                    }
                    this.selectPlan = true;
                    this.moreAction = false;
                }
                //查询事件信息
                this.queryIncidentInfo(data);
                //查询周围隐患
                this.queryDanger(data);
            },
            queryIncidentInfo (data) {
                //查询事件详情信息
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    incidentId: data.id
                };
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/incident/getIncidentDetail',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.formCustom = response.data.data;
                            if (this.formCustom.planInstanceId) {
                                this.formCustom.oldPlanInstanceId = this.formCustom.planInstanceId;
                            }
                            console.log(this.formCustom)
                            //缓存事件详情
                            this.saveIncidentDetail(response.data.data);
                            this.saveStartPlanDetail(response.data.data);
                        }
                    }
                ).catch(
                    
                );
            },
            queryDanger (data) {
                //查询周围隐患
                // const queryO = {
                //     userCode: Cookies.get('userCode'),
                //     id: data.id
                // };
                // axios({
                //     method: 'get',
                //     url: tableInfo.url,
                //     params: queryO
                // }).then(
                //     response => {
                //         if ( response.data.code === 200 ) {
                //             this.dangerData =  response.data.data;
                //         }
                //     }
                // ).catch(
                    
                // );
                
            },
            changePlanModal () {
                //筛选预案
                const tableInfo = {
                    title: '筛选预案',
                    multiple: false,
                    url: this.getUrl+'/plan/publishPlan/screeningPlan',
                    name: '预案名称',
                    type: 'searchPlan',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode'),
                        name: '',
                        incidentTypeId: this.formCustom.incidentTypeId,
                        incidentId: this.formCustom.id
                    },
                    expand: {
                        expandList: [
                            {
                                title: '状态',
                                key: 'statusName',
                                align: 'center',
                                width: 100
                            }
                        ]
                    }
                }
                this.saveTableData(tableInfo);
                this.selectPlanModal = true;
            },
            openModal () {
                //事件按状态10未处置20处置中
                const state = this.planStep.state;
                if ( state === 1 ) {
                    this.changePlanModal();
                }
                if ( state === 2 ) {
                    this.startPlanModal = true;
                }
            },
            settingOrg () {
                //设置成员单位
                let TreeInfo = {
                    title: '设置成员单位',
                    treeMultiple: false,
                    additional: 'settingMember',
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.getUrl+'/platform/public/queryOrgTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            saveSearchModal (data,type) {
                //筛选预案弹窗保存
                if ( type === 'searchPlan') {
                    this.formCustom.planName = data.name;
                    this.formCustom.publishPlanId = data.id;
                    this.saveIncidentDetail(this.formCustom);
                    this.saveStartPlanDetail(this.formCustom);
                    const status = data.status;
                    if (status === -1 || status === 1) {
                        //未处置或已结束
                        this.planStep = {
                            state: 2,
                            name: '启动预案',
                        }
                        this.moreAction = true;
                        this.selectPlanModal = false;
                        this.startPlanModal = true;
                    }
                    if (status === 0) {
                        //处置中
                        this.planContinue();
                    }
                     this.selectPlanModal = false;
                }
                if ( type === 'settingMember' ) {
                    const memberData = [];
                    const dutyList = [];
                    for ( let i=0;i<data.length;i++ ) {
                        memberData.push({
                            id: data[i].id,
                            name: data[i].name,
                            content: ''
                        });
                    }
                    this.$refs.startPlan.settingMember(memberData);
                }
            },
            async startPlanSave (data) {
                const queryO = data;
                queryO.incidentId = this.formCustom.id;
                const status = this.formCustom.status;
                if ( status === 10 ) {
                    // 启动预案
                    axios({
                        method: 'post',
                        url: this.getUrl+'/scd/planInstance/startPlan',
                        data: data
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.success('预案启动成功')
                                this.formCustom.startTime = response.data.data.startTime;
                                this.formCustom.oldPlanInstanceId = response.data.data.planInstanceId;
                                this.formCustom.status = 20;
                                this.$emit('start-sucess');
                                this.memberData = [];
                                this.noticeContent = '';
                                this.continuePlan = true;
                                this.selectPlan = false;
                                this.startPlanModal = false;
                                this.closePlan = false;
                            }
                        }
                    ).catch(
                        
                    );
                }
                if ( status === 20) {
                    //修改预案
                    const editInfo = data;
                    editInfo.incidentId = this.formCustom.id;
                    editInfo.oldPlanInstanceId = this.formCustom.oldPlanInstanceId;
                    axios({
                        method: 'post',
                        url: this.getUrl+'/scd/planInstance/changePlan',
                        data: data
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.success('预案切换成功')
                                this.formCustom.startTime = response.data.data.startTime;
                                this.formCustom.oldPlanInstanceId = response.data.data.planInstanceId;
                                this.memberData = [];
                                this.noticeContent = '';
                                this.continuePlan = true;
                                this.selectPlan = false;
                                this.startPlanModal = false;
                                this.closePlan = true;
                            }
                        }
                    ).catch(
                        
                    );
                }
                await this.planContinue()
            },
            closeSearchModal () {
                this.selectPlanModal = false;
            },
            startPlanClose () {
                //关闭启动预案弹窗
                this.startPlanModal = false;
            },
            planContinue () {
                //继续预案 
                const incidentId = this.formCustom.id;
                window.open("/#/process?incidentId="+incidentId+"&show=0",'_blank','width='+(window.screen.availWidth-20)+',height='+(window.screen.availHeight-30)+
',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes'); 
            },
            openSecondaryIncidentModal () {
                //打开次生事件弹窗
                this.secondaryIncidentModal = true;
            },
            saveSecondaryIncidentModal (name) {
                //保存次生事件
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const queryO = this.secondaryIncident;
                        queryO.mainIncidentId = this.formCustom.id;
                        queryO.userCode = Cookies.get('userCode');
                        axios({
                            method: 'post',
                            url: this.getUrl+'/scd/incident/addSecondaryIncident',
                            data: queryO
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$emit('add-incident');
                                    this.secondaryIncidentModal = false;
                                }
                            }
                        ).catch(
                            
                        );
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
                console.log(this.secondaryIncident)
            },
            closeSecondaryIncidentModal (name) {
                //关闭次生事件
                this.$refs[name].resetFields();
                this.secondaryIncidentModal = false;
            },
            planClose () {
                //关闭预案
                this.closePlanModal = true;
            },
            closeregisterResourceModal () {

            },
            saveregisterResource () {

            },
            selectRange (name) {
                //选择范围
                this.range = name;
            },
            treeModalClose () {
                this.treeMode = false;
            },
            treeModalSave (data, type) {
                if ( type === 'settingMember' ) {
                    this.$refs.startPlan.settingMember(data)
                }
                if ( type === 'area' ) {
                     this.secondaryIncident.regionId = data[0].id;
                     this.secondaryIncident.regionName = data[0].title;
                     this.$refs.secondaryIncident.validateField('regionName', valid => {
                        
                    });
                }
                if ( type === 'incidentType' ) {
                    this.secondaryIncident.incidentTypeId = data[0].id;
                    this.secondaryIncident.incidentTypeName = data[0].title;
                    this.$refs.secondaryIncident.validateField('incidentTypeName', valid => {
                        
                    });
                }
                this.treeMode = false;
            },
            saveClosePlan () {
                //确定关闭预案
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    incidentId: this.formCustom.id
                };
                axios({
                    method: 'get',
                    url: this.getUrl+'/scd/incident/closeIncident',
                    params: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.formCustom = {};
                            this.continuePlan = false;
                            this.selectPlan =  false;
                            this.moreAction = false;
                            this.$emit('end-success');
                        }
                    }
                ).catch(
                    
                );
                this.closePlanModal = false;
            },
            planModalClose () {
                //关闭弹窗
                this.closePlanModal = false;
            },
            openIncidentType () {
                //打开事件类型弹窗
                let TreeInfo = {
                    title: '事件类型',
                    treeMultiple: false,
                    additional: 'incidentType',
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.getUrl+'/platform/public/queryIncidentTypeTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            openArea () {
                //打开事发区域弹窗
                let TreeInfo = {
                    title: '事发区域',
                    treeMultiple: false,
                    additional: 'area',
                    request: 'post',
                    searchShow: true,
                    queryInfo: {
                        userCode: Cookies.get('userCode')
                    },
                    url: this.getUrl+'/platform/public/queryRegionTree4New'
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
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
            changeOccurTime (time) {
                this.secondaryIncident.occurTime = time;
            },
            queryMemberOrg (data) {
                console.log(data)
                const info = {
                    userCode: Cookies.get('userCode'),
                    incidentId: data.id
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/incident/queryMemberOrgs4Incident',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.memberData = response.data.data.list;
                            console.log(this.memberData)
                        }
                    }
                ).catch(
                    
                )
            },
            queryProcess (data) {
                console.log(data)
                const incidentId = data.row.incidentId;
                const orgId = data.row.memberOrgId;
                window.open("/#/process?incidentId="+incidentId+"&orgId="+orgId+"&show=1",'_blank','width='+(window.screen.availWidth-20)+',height='+(window.screen.availHeight-30)+
',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes');
            }
        }
    }
</script>

<style scoped>
    .formBox {
        height: 262px;
        overflow: auto;
    }
    .ds-scd-incident .ivu-form-item {
        margin: 0 0 10px 0!important;
    }
    .ds-search-body {
        margin-bottom: 16px;
    }
    .ds-member-box {
        padding-left: 5px;
    }
    .ds-dropdown-icon .ivu-icon {
        font-size: 12px;
    }
    .ivu-dropdown-menu {
        text-align: center;
    }
</style>


