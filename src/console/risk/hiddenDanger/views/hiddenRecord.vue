<template>
    <div>
        <Modal v-model="dangerModalStatus" :mask-closable="false" width="800" @on-cancel="clickCancelBtn()">
            <p slot="header" style="color:#f60;text-align:center">
                <span>监测信息记录</span>
            </p>
            <div>
                <Table border :columns="columns1" :data="recordData"></Table>
                <div class="ds-page-body">
                    <Page :total="totalSize" :page-size="pageSize" :current=pageNum @on-change="clickPage" v-if="pageShow"></Page>
                </div>
            </div>
            <div slot="footer">
                <Button size="large" type="ghost" @click="clickCancelBtn()">取消</Button>
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
            return {
                recordInfo:{
                    monitorTime:'',
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
                pageSize: 5,
                pageNum: 1
            };
        },
        computed:{
            riskHiddenDangerTypeNode () {
                return this.$store.state.hiddenDanger.riskHiddenDangerTypeNode;
            },
        },
        created () {
            this.queryRecordBaseList();
        },
        methods: {
            ...mapActions([

            ]),
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
            clickConfirmBtn(){
                this.dangerModalStatus=false;
            },
            clickCancelBtn(){
                this.dangerModalStatus=false;
            },
            clickPage(num){
                this.pageNum=num;
                this.queryRecordBaseList();
            },
        }
    }
</script>

