<template>
    <div :data-html="tableModalInfo">
      <Modal v-model="modalStaus" width="800" :mask-closable="false" class-name="vertical-center-modal" @on-cancel="tableModalClose">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>{{tableModalInfo.title}}</span>
            </p>
            <!--<div style="text-align:center">-->
              <!--<Table border :columns="tableThead" :data="tableTbody" :highlight-row="tableSingle" @on-row-click="getSingleRowData"  @on-selection-change="getMultRowData"  ref="listModule"></Table>-->
            <!--</div>-->

          <el-table
                  :data="tableTbody"
                  @row-click="dataPush"
                  border
                  :row-class-name="tableRowClassName"
                  style="width: 100%;background: #000">

              <!--下拉-->
              <el-table-column
                      prop="name"
                      label="姓名"
                      width="">
              </el-table-column>
              <el-table-column
                      prop="org"
                      label="单位"
                      width="">
              </el-table-column>
              <el-table-column
                      prop="duty"
                      label="职务"
                      width="">
              </el-table-column>
              <el-table-column
                      prop="mobile"
                      label="联系方式"
                      width="">
              </el-table-column>
          </el-table>

            <div slot="footer">
                <Button type="primary" @click="clickSaveBtn">确认</Button>
                <Button type="ghost" @click="tableModalClose">取消</Button>
            </div>
      </Modal>

    </div>
</template>
<script>
import axios from 'axios'
import { mapActions } from 'vuex'
export default {
    data () {
        return {
            selectRowData: [],
            additional:'',
            modalStaus:true,
            tableSingle:true,
            tableThead: [
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '单位',
                    key: 'org'
                },
                {
                    title: '职务',
                    key: 'duty'
                },
                {
                    title: '联系方式',
                    key: 'mobile'
                }
            ],
            tableTbody: []
        };
    },
    mounted () {
       this.initTable();//初始化表格
    },
    computed:{
        tableModalInfo() {//获取调用组件传入的参数信息
            return this.$store.state.dialogs.tableModalInfo;
        }
    },
    created () {
        this.getTableList();
    },
    methods: {
        getTableList() {
            let tableInfo = this.tableModalInfo;
            this.additional = tableInfo.additional;
            let params = tableInfo.params;
            if(tableInfo.multipleStatus == true){
                this.tableSingle = false;
            }
            axios({
                method: 'post',
                url: tableInfo.url,
                data: params
            }).then(
                response => {
                    this.tableTbody = []
                    const listArray = []
                    const res = response.data.data.list
                    res.forEach((v, i) => {
                        listArray.push({
                            id: v.id,
                            name: v.name,
                            mobile: v.mobile,
                            duty: v.duty,
                            org: v.org.name,
                            test:0
                        })
                    })
                    this.tableTbody = listArray
                    // var listArray = [];
                    // var resData = response.data.data.list;
                    // for (let i = 0; i < response.data.data.list.length; i++) {
                    //     var listObj = {};
                    //     listObj.id = resData[i].id;
                    //     listObj.name = resData[i].name;
                    //     listObj.mobile = resData[i].mobile;
                    //     listObj.duty = resData[i].duty;
                    //     listObj.org = resData[i].org.name;
                    //     listArray.push(listObj);
                    // }
                    // this.tableTbody = listArray;
                }
            ).catch(
                // error => {
                //     this.$Message.open(error);
                // }
            )
        },
        initTable () { // 初始化表格数据
            if(this.tableModalInfo.multipleStatus==true){
              let theadData = {
                  type: 'selection',
                  width: 60,
                  align: 'center'
                };
              this.tableThead.splice(0, 0, theadData);
            }else{
              this.$refs.listModule.$set(this.$refs.listModule,"highlight-row","ture")
            }
        },
        getSingleRowData (data, index) { // 获取选中行的数据(单选)
            this.selectRowData = [{
                'id':data.id,
                'name':data.name,
                'mobile':data.mobile
            }]
        },
        getMultRowData (selection){// 获取选中行的数据(多选)
            this.selectRowData = selection;
        },
        clickSaveBtn () {
            this.$emit('table-save-Modal', this.selectRowData, this.additional);
        },
        tableModalClose () {
            //关闭tree
            this.$emit('table-close-Modal')
        },
        //大刀阔斧的修改开始
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
                if(this.selectRowData){
                    if(this.selectRowData.length>0){
                        if(this.selectRowData.indexOf(item)  == -1){
                            this.selectRowData.push(item);
                            // this.dataLists(item);
                        }
                    }else {
                        this.selectRowData.push(item);
                        // this.dataLists(item);
                    }
                }
            }else {
                item.test+=1;
                this.dataRemove(item);
            }
        },
        dataLists(item){//默认相加
            this.tableTbody.forEach((datals)=>{
                if(datals.name == item.name){
                    item.test+=1
                }
            })
        },
        //删除
        dataRemove(item){
            console.log(item)
            let indeice = this.selectRowData.indexOf(item);
            this.selectRowData.splice(indeice,1);
            this.dataLists(item);
        }
    }
};
</script>


