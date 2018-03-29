<template>
    <div class="ds-widget-box"  :style="height" :data-height="tableHeight">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>突发事件列表</h2>
            <div class="ds-fload-right">
                <Button type="success" @click="addIncident">
                    新增
                </Button>
            </div>
        </div>
        <div class="ds-table-box">
            <Scroll :distance-to-edge="10" :on-reach-bottom="handleReachBottom" :height="(parseInt(tableHeight) - 50)">
                <Table border highlight-row :columns="incidentHead" :data="incidentData" @on-row-click="queryIncidentInfo"></Table>
            </Scroll>
        </div>
        <!-- 突发事件新增弹窗 -->
        <modal v-model="addIncidentModal" title="增加事件" :mask-closable="false" width="600" @on-cancel="closeAddIncidentModal('incidentInfo')" class-name="vertical-center-modal">
            <div class="ds-search-body">
                <i-form ref="incidentInfo" :model="incidentInfo" :rules="ruleCustom" :label-width="110">
                    <Row>
                        <i-col span="12">
                            <form-item label="事件名称： " prop="name">
                                <i-input type="text" v-model="incidentInfo.name"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="事发区域： " prop="regionName">
                                <i-input type="text" v-model="incidentInfo.regionName" @on-focus="openRegion"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="事件类型： " prop="incidentTypeName">
                                <i-input id="type" type="text" v-model="incidentInfo.incidentTypeName" @on-focus="openIncident"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="事件等级： " prop="incidentLevelId">
                                <Select v-model="incidentInfo.incidentLevelId">
                                    <Option v-for="item in incidentLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事发时间： " prop="occurTime">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" @on-change="changeIncidentTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事发地址： " prop="address">
                                <i-input type="text" v-model="incidentInfo.address"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="事件描述： " prop="description">
                                <i-input type="textarea" v-model="incidentInfo.description"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="已采取措施： " prop="">
                                <i-input type="text" v-model="incidentInfo.measures"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="报警人： " prop="">
                                <i-input type="text" v-model="incidentInfo.reporter"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="报警人电话： " prop="">
                                <i-input type="text" v-model="incidentInfo.contact"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="报警时间： " prop="">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" @on-change="changeAlarmTime"></DatePicker>
                            </form-item>
                        </i-col>
                        
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveAddIncident('incidentInfo')">确定</Button>
                <Button size="large"  @click="closeAddIncidentModal('incidentInfo')">关闭</Button>
            </div>
        </modal>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import tree from '@/common/components/treeModal/tree'
    import Cookies from 'js-cookie';

    export default {
        components: {
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
            const validateArea = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事发区域'));
                } else {
                    callback()
                }
            };
            const validateincidentTypeName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事件类型'));
                } else {
                    callback()
                }
            };
            const validateincidentLevelId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事件等级'));
                } else {
                    callback()
                }
            };
            const validateOccurTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事发时间'));
                } else {
                    callback()
                }
            };
            const validateAdress = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入事发地址'));
                } else {
                    callback()
                }
            };
            const validateMeasures = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入已采取措施'));
                } else {
                    callback()
                }
            };
            const validateReporter = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入报警人'));
                } else {
                    callback()
                }
            };
            const validateContact = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入报警电话'));
                } else {
                    callback()
                }
            };
            const validateReportTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择报警时间'));
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
            }
            return {
                height: {
                    height: ''
                },
                treeMode: false,
                selectNodes: {},
                selectNodeIndex: null,
                addIncidentModal: false,
                pageNum: 1,
                incidentHead: [
                    {
                        title: '突发事件名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'states',
                        width: 80,
                        align: 'center'
                    }
                ],
                incidentData: [
                ],
                incidentInfo: {
                    name: '',
                    regionId: null,
                    regionName: '',
                    incidentTypeId: null,
                    incidentTypeName: '',
                    incidentLevelId: null,
                    occurTime: '',
                    address: '',
                    measures: '',
                    reporter: '',
                    contact: '',
                    reportTime: '',
                    description: ''
                },
                incidentType: [
                    {
                        value: 0,
                        label: '事件类型'
                    }
                ],
                incidentLevel: [],
                ruleCustom: {
                    name: [
                        { required: true, validator: validateName, trigger: 'blur' }
                    ],
                    regionName: [
                        {  required: true, validator: validateArea, trigger: 'blur' }
                    ],
                    incidentTypeName: [
                        { required: true, validator: validateincidentTypeName, trigger: 'blur' }
                    ],
                    incidentLevelId: [
                        { required: true, validator: validateincidentLevelId, trigger: 'change' }
                    ],
                    occurTime: [
                        { required: true, validator: validateOccurTime, trigger: 'change' }
                    ],
                    address: [
                        { required: true, validator: validateAdress, trigger: 'blur' }
                    ],
                    measures: [
                        { validator: validateMeasures, trigger: 'blur' }
                    ],
                    reporter: [
                        { validator: validateReporter, trigger: 'blur' }
                    ],
                    contact: [
                        { validator: validateContact, trigger: 'blur' }
                    ],
                    reportTime: [
                        { validator: validateReportTime, trigger: 'change' }
                    ],
                    description: [
                        { required: true, validator: validateDescription, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getUrl () {
                return this.$store.state.userCode.url
            },
            //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
            pageSize() {
                return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height;
            }
        },
        // created || mounted
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(35) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
            this.queryIncidentList();
        },
        methods: {
             ...mapActions([
                'saveDemoData',
                'setHeightContent',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            queryIncidentList (type) {
                //查询处置中突发事件列表
                const queryO = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize + 2
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/scd/incident/queryIncidents4NoClose',
                    data: queryO
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            const dataList = response.data.data.list;
                            for ( let i=0;i<dataList.length;i++) {
                                if ( dataList[i].status === 10 ) {
                                    dataList[i].states = '未处置';
                                }
                                if ( dataList[i].status === 20 ) {
                                    dataList[i].states = '处置中';
                                }
                            }
                            if ( type === 'scroll') {
                                if (dataList.length < 1 ) {
                                    this.$Message.warning('没有更多了')
                                }
                                for ( let i=0;i<dataList.length;i++ ) {
                                    this.incidentData.push(dataList[i]);
                                }
                            } else {
                                this.incidentData = dataList;
                            }
                        }
                    }
                ).catch(
                    
                );
            },
            handleReachBottom () {
                //滚动加载
                this.pageNum = this.pageNum+1;
                this.queryIncidentList('scroll');
            },
            queryIncidentInfo (data, index) {
                this.selectNodes = data;
                this.selectNodeIndex = index;
                this.$emit('select-row',this.selectNodes);
            },
            addIncident () {
                //增加事件
                this.addIncidentModal = true;
                this.queryLevel();
            },
            changeIncidentTime (time) {
                //事发时间
                this.incidentInfo.occurTime = time;
            },
            changeAlarmTime (time) {
                //报警时间
                this.incidentInfo.reportTime = time;
            },
            saveAddIncident (name) {
                //保存事件信息
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const queryO = this.incidentInfo;
                        queryO.userCode = Cookies.get('userCode')
                        axios({
                            method: 'post',
                            url: this.getUrl+'/scd/incident/addIncident',
                            data: queryO
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.addIncidentModal = false;
                                    this.$Message.success('突发事件新增成功');
                                    this.queryIncidentList();
                                    this.incidentInfo = {
                                        name: '',
                                        regionId: null,
                                        regionName: '',
                                        incidentTypeId: null,
                                        incidentTypeName: '',
                                        incidentLevelId: null,
                                        occurTime: '',
                                        address: '',
                                        measures: '',
                                        reporter: '',
                                        contact: '',
                                        reportTime: '',
                                        description: ''
                                    };
                                } else {
                                    this.$Message.warning(response.data.message);
                                }
                            }
                        ).catch(
                            
                        );
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
                
            },
            closeAddIncidentModal (name) {
                this.$refs[name].resetFields();
                this.addIncidentModal = false;
            },
            openRegion () {
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
            openIncident () {
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
            treeModalClose () {
                //关闭树组件弹出
                this.treeMode = false;
            },
            treeModalSave (data, type) {
                //保存树组件选择数据
                if ( type === 'area' ) {
                    this.incidentInfo.regionId = data[0].id;
                    this.incidentInfo.regionName = data[0].title;
                    this.$refs.incidentInfo.validateField('regionName', valid => {
                        
                    });
                }
                if ( type === 'incidentType' ) {
                    this.incidentInfo.incidentTypeId = data[0].id;
                    this.incidentInfo.incidentTypeName = data[0].title;
                    this.$refs.incidentInfo.validateField('incidentTypeName', valid => {
                        
                    });
                }
                this.treeMode = false;
            },
            queryLevel () {
                //查询事件等级
                const info = {
                    userCode: Cookies.get('userCode'),
                    pageNum : 1,
                    pageSize:20
                }
                axios({
                    method: 'post',
                    url: this.getUrl+'/platform/incidentLevel/queryIncidentLevelMaintain',
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
            startPlanSucess () {
                //预案启动成功修改状态
                const newNode = this.selectNodes;
                newNode.status = 20;
                newNode.states = '处置中';
                this.$set(this.incidentData,this.selectNodeIndex,newNode);
            }
        },
        mounted () {
        }
    }
</script>

<style scoped>
</style>

