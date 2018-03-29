<template>
    <div>
        <Modal v-model="dangerModalStatus" :mask-closable="false" width="400" @on-cancel="clickCancelBtn('recordInfo')">
            <p slot="header" style="color:#f60;text-align:center">
                <span>监测信息登记</span>
            </p>
            <div>
                <Form ref="recordInfo" :rules="ruleCustom" :model="recordInfo" :label-width="110">
                    <Row>
                        <i-col span="24">
                            <FormItem label="隐患名称:">
                                <p>{{recordInfo.name}}</p>
                            </FormItem>
                        </i-col>
                        <i-col span="24">
                            <FormItem label="监测项:">
                                <p>{{recordInfo.itemName}}</p>
                            </FormItem>
                        </i-col>
                        <i-col span="24">
                            <FormItem label="正常取值范围:">
                                <p>{{recordInfo.normalRange}}</p>
                            </FormItem>
                        </i-col>
                        <i-col span="24">
                            <FormItem label="监测时间:" prop="monitorTime">
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" style="width: 100%;" v-model="recordInfo.monitorTime"></DatePicker>
                            </FormItem>
                        </i-col>
                        <i-col span="24">
                            <FormItem label="监测值:" prop="value">
                                <i-input placeholder="请输入地理位置." style="width: 100%" v-model="recordInfo.value"></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="24">
                            <FormItem label="预警级别:" prop="level">
                                <Select v-model="recordInfo.level">
                                    <Option v-for="item in valueData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </i-col>
                        <i-col span="24" v-show="false">
                            <FormItem label="状态:" prop="status">
                                <Select v-model="recordInfo.status">
                                    <Option v-for="item in statusData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </i-col>
                        </i-col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="clickConfirmBtn('recordInfo')">确定</Button>
                <Button type="ghost" @click="clickCancelBtn('recordInfo')">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    import axios from 'axios'
    import verify from '@/common/utils/verify'
    import Cookies from 'js-cookie';
    export default {
        components: {
            verify
        },
        data () {
            const validateValue = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入监测值'));
                }else if(verify.useQuantityReg.test(value)){
                    callback()
                }else {
                    return callback(new Error('请输入整数或者小数'));
                }
            };
            const validateMonitorTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择监测时间'));
                }else {
                    callback()
                }
            };
            return {
                valueData:[
                    {
                        value:'null',
                        label:'---请选择---'
                    },
                    {
                        value:1,
                        label:'红色'
                    },
                    {
                        value:2,
                        label:'橙色'
                    },
                    {
                        value:3,
                        label:'黄色'
                    },
                    {
                        value:4,
                        label:'蓝色'
                    }
                ],
                statusData:[
                    {
                        value:'null',
                        label:'---请选择---'
                    },
                    {
                        value:1,
                        label:'正常'
                    },
                    {
                        value:2,
                        label:'异常'
                    }
                ],
                recordInfo:{
                    monitorTime:'',
                    status:'null'
                },
                dangerModalStatus:false,
                columns1: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '监测值',
                        key: 'value',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'statusName',
                        align: 'center'
                    },
                    {
                        title: '预警级别',
                        key: 'levelName',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 70,
                        render: (h, params) => {
                            return h('div', [
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            let vm = this
                                            vm.deleteItemRecord(params)
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            marginRight: '5px'
                                        },
                                        props: {
                                            size: 'small',
                                            placement: 'top'
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
                recordData: [],
                pageShow: false,
                totalSize: null,
                pageSize: 2,
                pageNum: 1,
                initDate: new Date(),
                ruleCustom: {
                    value:[
                        { required: true, validator: validateValue, trigger: 'blur' }
                    ],
                    monitorTime:[
                        { required: true, validator: validateMonitorTime, trigger: 'blur' }
                    ],

                }
            };
        },
        computed:{

        },
        methods: {
            ...mapActions([

            ]),
            queryRecordBaseList(){
                let info = {
                    userCode: Cookies.get('userCode'),
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    itemId: this.recordInfo.itemId
                };
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/risk/monitorRecord/queryMonitorRecordBaseList',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let total = response.data.data.total;
                            this.totalSize = response.data.data.total;
                            if ( total > this.pageSize ) {
                                this.pageShow = true;
                            } else {
                                this.pageShow = false;
                            }
                            this.recordData = response.data.data.list;
                            for (let i=0;i<this.recordData.length;i++){
                                if(!this.recordData[i].levelName){
                                    this.recordData[i].levelName = "未设置";
                                }
                            }
                        }
                    }
                ).catch(

                )
            },
            clickConfirmBtn(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.saveRecrod(name);
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                })
            },
            saveRecrod(name){
                // 新增
                let info=this.recordInfo;
                info.userCode = Cookies.get('userCode');
                axios({
                    method: 'post',
                    url: this.$store.state.userCode.url+'/risk/monitorRecord/addMonitorRecord',
                    data: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('操作成功!');
                            if(! this.recordInfo.id){
                                this.pageNum = 1;
                            }
                            //this.queryRecordBaseList();
                            this.flushTableList();
                            this.clickCancelBtn(name);
                        }
                    }
                ).catch(

                )
            },
            clickCancelBtn(name){
                this.$refs[name].resetFields();
                const itemId = this.recordInfo.itemId;
                this.recordInfo.id = null;
                this.recordInfo.monitorTime = null;
                this.recordInfo.value = null;
                this.recordInfo.status = null;
                this.recordInfo.statusName = null;
                this.recordInfo.levelName = null;
                this.closeModal();
                // this.$refs.recordTable.clearCurrentRow();
            },
            initRiskInfo(data){
                this.recordInfo.itemId = data.itemId;
                this.recordInfo.name = data.name;
                this.recordInfo.itemName = data.itemName;
                this.recordInfo.normalRange = data.normalRange;
            },
            risk_record_clickTableRow(data){
                this.recordInfo.id=data.id;
                this.recordInfo.level=data.level;
                this.recordInfo.levelName=data.levelName;
                this.recordInfo.monitorTime=data.monitorTime;
                this.recordInfo.status=data.status;
                this.recordInfo.statusName=data.statusName;
                this.recordInfo.value=data.value;

            },
            clickPage(num){
                this.pageNum=num;
                this.queryRecordBaseList();
            },
            /**
             * 删除监测记录
             * @param data
             */
            deleteItemRecord (data) {
                // 删除监测项记录
                let info={
                    id:data.row.id,
                    itemId:data.row.itemId,
                    userCode:Cookies.get('userCode')
                }
                axios({
                    method: 'get',
                    url: this.$store.state.userCode.url+'/risk/monitorRecord/deletedMonitorRecord',
                    params: info
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.$Message.success('删除成功!');
                            if(! this.recordInfo.id){
                                this.pageNum = 1;
                            }
                            this.queryRecordBaseList();
                        }
                    }
                ).catch(

                )
            },
            flushTableList(){
                this.$emit('maintain-parent');
            },
            initFormItemAndOpenModal(params){
                this.initFormItem(params);
                this.openModal();
            },
            initFormItem(params){
                let nowTime = new Date();
                this.recordInfo.monitorTime = nowTime;
                this.recordInfo.itemId=params.row.itemId;
                this.recordInfo.level='null';
                this.recordInfo.status=2;
            },
            openModal(){
                this.dangerModalStatus=true;
            },
            closeModal(){
                this.dangerModalStatus = false;
            }
        }
    }
</script>

