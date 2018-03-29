<template>
    <div class="ds-selectFlowWork">
        <Modal v-model="maintainModal" :mask-closable="false" width="800" @on-cancel="closeModal" class-name="vertical-center-modal">
            <p slot="header" style="color:#f60;text-align:center">
                <span>选择处置工作项</span>
            </p>
            <div>
                <Row>
                    <i-col span="15">
                        <div class="ds-widget-box box-right">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>待选处置工作项</h2>
                            </div>
                            <div class="ds-table-box">
                                <Scroll :distance-to-edge="10" height="400" :on-reach-bottom="handleReachBottom">
                                    <!--<Table ref="selection" border @on-selection-change="selectionMethods" :columns="managementHead" :data="managementData"></Table>-->
                                    <!--大刀阔斧的改开始-->
                                    <el-table :data="managementData" @row-click="dataPush" border :row-class-name="tableRowClassName" header-cell-class-name="ds-table-head">
                                        <!--下拉-->
                                        <el-table-column prop="name" label="处置工作项" width="" align="center"></el-table-column>
                                        <el-table-column prop="taskTypeName" label="任务类型" width="" align="center"></el-table-column>
                                    </el-table>
                                    <!--大刀阔斧修改结束-->
                                </Scroll>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="9" >
                        <div class="ds-widget-box">
                            <div class="ds-widget-title">
                                <span class="ds-title-icon"></span>
                                <h2>新选处置工作项</h2>
                            </div>
                            <!--<div class="ds-manageList-box">-->
                                <!--<tag v-for="(item, index) in newManagement" :key="index" :name="index" closable @on-close="handleClose2">{{ item.name }}</tag>-->
                            <!--</div>-->
                            <ul class="ds-manageList-box ds-selectw">
                                <li v-for="item in newManagement" :key="item">{{item.name}}<el-button type="text"  icon="el-icon-close" style="float: right;margin-left: 3px" @click="dataRemove(item)"></el-button></li>
                            </ul>

                        </div>
                    </i-col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="primary" @click="saveThisWork">确定</Button>
                <Button type="ghost" @click="closeModal">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
export default{
        data () {
            return {
                maintainModal: true,
                tableShow:true,
                managementHead: [
                    {
                        title: '序号',
                        type: 'selection',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '处置工作项',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '任务类型',
                        key: 'taskTypeName',
                        align: 'center'
                    }
                ],
                managementData: [],
                newManagement: [],
                selectData: [],
                pageNum: 1,
                pageSize: 4
            }
        },
        computed: {
            selectWorkData() {
                return this.$store.state.selectFlow.selectWork;
            }
        },
        created() {
            this.handleReachBottom();
        },
        methods: {
            selectionMethods(data) {
                this.selectData = data;
                this.newManagement = data;
            },
            closeModal () {
                this.$emit('close-work-modal');
            },
            saveThisWork() {
                this.$emit('save-work-modal', this.newManagement);
            },
            handleReachBottom () {
                const url = this.selectWorkData.url
                const data = this.selectWorkData.params
                data.pageNum = this.pageNum++
                data.pageSize = this.pageSize
                axios({
                    method: 'POST',
                    url: url,
                    data: data
                }).then(
                    response => {
                        if (response.data.code === 200 ) {
                            const res = response.data.data
                            if(res.list && res.list.length > 0) {
                                res.list.forEach((v, i) => {
                                    this.managementData.push({
                                        name: v.name,
                                        id: v.id,
                                        test:0,
                                        taskTypeName: v.taskTypeName
                                    })
                                })
                            }
                        } else {
                            this.$Message.error('请求失败')
                        }
                    }
                ).catch(
                    error => {
                    }
                );
            },
            handleClose2 (event, name) {
                this.newManagement.splice(name, 1);
            },
            //选中颜色大刀开始
            tableRowClassName({row}) {
                if (row.test%2!=0) {
                    return 'warning-row';
                } else if (row.test%2==0) {
                    return 'success-row';
                }
                return '';
            },
            //左右切换
            dataPush(item){//点击变色
                item.test+=1;
                if( item.test%2!=0){
                    if(this.newManagement){
                        if(this.newManagement.length>0){
                            if(this.newManagement.indexOf(item)  == -1){
                                this.newManagement.push(item);
                                // this.dataLists(item);
                            }
                        }else {
                            this.newManagement.push(item);
                            // this.dataLists(item);
                        }
                    }
                }else {
                    item.test+=1;
                    this.dataRemove(item);
                }
            },
            dataLists(item){//默认相加
                this.managementData.forEach((datals)=>{
                    if(datals.name == item.name){
                        item.test+=1
                    }
                })
            },
            //删除
            dataRemove(item){
                let indeice = this.newManagement.indexOf(item);
                this.newManagement.splice(indeice,1);
                this.dataLists(item);
            }
        }
    }
</script>

<style scoped>


</style>

