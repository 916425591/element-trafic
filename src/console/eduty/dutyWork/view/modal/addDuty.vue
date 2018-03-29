<template>
    <!-- 新增 -->
    <div>
        <modal v-model="addDutyModal" title="信息登记" :mask-closable="false" width="600" @on-cancel="cancelDutyModal" class-name="vertical-center-modal">
            <div>
                <i-form ref="dutyInfo" :model="dutyInfo" :rules="dutyInfoCustom" :label-width="100">
                    <row>
                        <i-col span="12">
                            <form-item label="事发时间：" prop="occurTime">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" @on-change="changeTime"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="来源：" prop="source">
                                <Select v-model="dutyInfo.source">
                                    <Option v-for="item in incidentSources" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select> 
                            </form-item>
                        </i-col>
                    </row>
                    <row>
                        <i-col span="12">
                            <form-item label="事件类型：" prop="typeName">
                                <i-input type="text" v-model="dutyInfo.typeName" @on-focus="openIncident"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="事件等级： " prop="levelId">
                                <Select v-model="dutyInfo.levelId">
                                    <Option v-for="item in incidentLevels" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>                            
                            </form-item>
                        </i-col>
                    </row>
                    <row>
                        <i-col span="24">
                            <form-item label="事件区域： " prop="regionName">
                                <i-input type="text" v-model="dutyInfo.regionName" @on-focus="openRegion"></i-input>
                            </form-item>
                        </i-col>
                    </row>
                    <row>
                        <i-col span="24">
                            <form-item label="事件地址： " prop="address">
                                <i-input type="text" v-model="dutyInfo.address"></i-input>
                            </form-item>
                        </i-col>
                    </row>
                    <row>
                        <i-col span="24">
                            <form-item label="事件描述： " prop="description">
                                <i-input type="text" v-model="dutyInfo.description"></i-input>
                            </form-item>
                        </i-col>
                    </row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="submitInfo('dutyInfo')">确定</Button>
                <Button size="large" @click="cancelDutyModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';

    
    export default {
        components: {
            
        },
        data () {
            const validateOccurTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事发时间'));
                } else {
                    callback()
                }
            };
            const validateSource = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择来源'));
                } else {
                    callback()
                }
            };
            const validateTypeName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事件类型'));
                } else {
                    callback()
                }
            };
            const validateLevelId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事件等级'));
                } else {
                    callback()
                }
            };
            const validateRegionName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择事件区域'));
                } else {
                    callback()
                }
            };
            const validateAddress = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入事件地址'));
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
            return {
                addDutyModal: true,
                dutyInfo: {
                    occurTime: '',
                    source: null,
                    typeId: null,
                    typeName: '',
                    levelId: null,
                    address: '',
                    description: '',
                    regionId: null,
                    regionName: ''
                },
                incidentLevels: [],
                incidentSources:[],
                dutyInfoCustom: {
                    occurTime: [
                        { required: true, validator: validateOccurTime, trigger: 'change' }
                    ],
                    source: [
                        { required: true, validator: validateSource, trigger: 'change' }
                    ],
                    typeName: [
                        { required: true, validator: validateTypeName, trigger: 'blur' }
                    ],
                    levelId: [
                        { required: true, validator: validateLevelId, trigger: 'change' }
                    ],
                    regionName: [
                        { required: true, validator: validateRegionName, trigger: 'blur' }
                    ],
                    address: [
                        { required: true, validator: validateAddress, trigger: 'blur' }
                    ],
                    description: [
                        { required: true, validator: validateDescription, trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{
            url(){
                return this.$store.state.userCode.url;
            }
        },
        //默认加载的
        created() {
            this.queryIncidentLevels();
            this.queryIncidentSources();
        },
        methods: {
            //新增值守信息
            submitInfo(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const info = this.dutyInfo;
                        info.userCode = Cookies.get('userCode');
                        axios({
                            method:"post",
                            url:this.$store.state.userCode.url+"/eduty/eIncident/saveIncident",
                            data:info
                        }).then(
                            response => {
                                if(response.data.code === 200){                            
                                    this.$Message.success("新增成功！");
                                    this.$emit("save-modal");
                                }
                            }
                        );
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
                
            },
            openIncident () {
                //打开事件类型弹窗
                this.$emit('open-modal', 'incidentType');
            },
            settingModal (data, type) {
                //保存树组件选择数据
                if ( type === 'incidentType' ) {
                    this.dutyInfo.typeId = data[0].id;
                    this.dutyInfo.typeName = data[0].title;
                    this.$refs.dutyInfo.validateField('typeName', valid => {

                    })
                }
                if ( type === 'region' ) {
                    this.dutyInfo.regionId = data[0].id;
                    this.dutyInfo.regionName = data[0].title;
                    this.$refs.dutyInfo.validateField('regionName', valid => {
                        
                    })
                }
            },
            //查询事件等级
            queryIncidentLevels() {
                const url = this.url + '/platform/incidentLevel/queryIncidentLevelMaintain'
                const data = {
                    userCode: Cookies.get('userCode'),
                    pageNum:1,
                    pageSize:1000
                }
                axios({
                    method: 'post',
                    url: url,
                    data: data
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
                            this.$set(this,'incidentLevels',newList);
                        }
                    }
                ).catch(
                    
                )
            },
            queryIncidentSources() {
                const url = this.url + '/eduty/eIncident/queryIncidentSources';
                const data = {
                    userCode: Cookies.get('userCode')
                }
                axios({
                    method: 'get',
                    url: url,
                    params: data
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let list = response.data.data;
                            let newList = [];
                            for ( let i=0;i<list.length;i++ ) {
                                newList.push({
                                value: list[i].id,
                                label: list[i].name
                                })
                            }
                            this.$set(this,'incidentSources',newList);
                        }
                    }
                ).catch(
                    
                )
            },
            cancelDutyModal(name) {
                this.$emit('close-modal');
            },
            changeTime (time) {
                //设置事发时间
                this.dutyInfo.occurTime = time;
            },
            openRegion () {
                this.$emit('open-modal', 'region');
            }
        }        
    }
</script>

<style scoped>

</style>
