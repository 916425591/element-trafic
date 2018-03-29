<template>
    <div>
        <el-form ref="theOfficer" :model="theOfficer" label-width="80px" class="permissions">
            <!--<el-col :span="6">-->
                <!--<el-form-item label="选择部门">-->
                    <!--<el-autocomplete-->
                            <!--v-model="theOfficer.department"-->
                            <!--:fetch-suggestions="querySearchAsync"-->
                            <!--placeholder="请输入内容"-->
                            <!--@select="handleSelect"-->
                    <!--&gt;<i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>-->
                <!--</el-form-item>-->
            <!--</el-col>-->

            <p style="float: right">
                <!--<el-button type="primary" @click="onSubmit(theOfficer.department)" :loading="logadinTrue" >查询</el-button>-->
                <el-button type="primary" @click="newdepar('new')">添加设备类型</el-button>
            </p>
        </el-form>
        <div>
            <el-table :data="tableData" show-header style="width: 100%">
                <el-table-column prop="id" label="分类标识"></el-table-column>
                <el-table-column prop="typeName" label="分类名称"></el-table-column>
                <el-table-column prop="fullName" label="分类图标"></el-table-column>
                <el-table-column prop="name" label="功能名称"></el-table-column>
                <el-table-column  label="分类状态">
                    <template slot-scope="scope">
                    <span v-if="scope.row.isAvailable">正常</span>
                    <span v-if="!scope.row.isAvailable">无效</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否上图">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isAvailable">是</span>
                        <span v-if="!scope.row.isAvailable">否</span>
                    </template>
                </el-table-column>

                <!--</el-table-column>-->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="newdepar('editor',scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--应用型不强-->

        </div>
        <div v-if="visible">
            <mainenaceNew :visible.sync="visible" :datadiog="datalagio" v-on:tableTrue="showDialog" :url="mainUrl"></mainenaceNew>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import  mainenaceNew from  '@/common/components/scEquipment/equipment'
    export default {
        name: 'permissions',
        components:{mainenaceNew},
        data(){
            return{
                msg:'警员信息编辑',
                //弹窗
                visible: false,
                datalagio:{},
                logadinTrue:false,
                mainUrl:'',
                //组合插件
                timeout:  null,
                //url:'/dept/find/list',
                theOfficer: {
                    department: ''
                },
                //表格数据
                tableData: []
            }
        },
        computed:{
          getUrl(){
              return this.$store.state.userCode.urlDong;
          }
        },
        // created(){
        //     this.onSubmit();
        // },
        mounted(){
            this.onSubmit();
        },
        methods:{
            onSubmit(){
                    //const url =this.getUrl+ '/dept/find/list'
                    const url =this.getUrl+ '/deviceType/get/avalibleTypeList'
                    axios({method: 'get', url: url}).then(
                        response => {
                            if ( response.data.code === 200 && response.data.data.length>0) {
                                this.tableData = response.data.data;
                                this.logadinTrue =false
                            }
                        }
                    ).catch(
                    );
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const url =this.getUrl+ '/deviceType/delete/'+row.id+''
                    axios({method: 'post', url: url}).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                let data = '';
                                this.onSubmit(data);
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                        }
                    ).catch(
                    );
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            //编辑
            newdepar(data,row){
                this.datalagio = {};
              if(data=='new'){//这是新增
                  this.mainUrl='/deviceType/insert'//新增
              }else if(data=='editor'){//编辑
                  this.mainUrl='/deviceType/update' //编辑
                 this.datalagio =row;
              }
              this.visible = true;
            },
            //获取返回值
            showDialog(data){
                this.onSubmit();
                console.log(data)
            }
        }
    };
</script>

<style lang="less">
    @import "./style/equipment.less";
    .ol-viewport{
        display: none;
    }
</style>
