<template>
    <div>
        <el-form ref="theOfficer" :model="theOfficer" label-width="80px" class="permissions">
            <p style="float: right">
                <!--<el-button type="primary" @click="onSubmit(theOfficer.department)" :loading="logadinTrue" >查询</el-button>-->
                <el-button type="primary" @click="newdepar('new')">添加属性</el-button>
            </p>
        </el-form>
        <div>
            <el-table :data="tableData" show-header style="width: 100%" :logoin="true">
                <!--<el-table-column prop="attrCfgId" label="attrCfgId"></el-table-column>-->
                <el-table-column prop="attrName" label="名称"></el-table-column>
                <el-table-column prop="id" label="编号ID"></el-table-column>
                <el-table-column prop="createTime" label="时间"></el-table-column>
                <el-table-column  label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isAvailable">正常</span>
                        <span v-if="!scope.row.isAvailable">无效</span>
                    </template>
                </el-table-column>

                <el-table-column  prop="updateTime" label="更新时间"></el-table-column>
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
            <device :visible.sync="visible" :datadiog="datalagio" v-on:tableTrue="showDialog" :url="mainUrl" :sortLengt="sortLengt"></device>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import  device from  '@/common/components/scDevice/device'
    export default {
        name: 'permissions',
        components:{device},
        data(){
            return{
                msg:'警员信息编辑',
                //弹窗
                visible: false,
                datalagio:{},
                logadinTrue:false,
                mainUrl:'',
                sortLengt:'',
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
            },
        },

        // created(){
        //     this.onSubmit();
        // },
        mounted(){
            this.restaurants = this.loadAll();
            this.onSubmit();
        },
        methods:{
            onSubmit(){//默认查询列表
                //const url =this.getUrl+ '/dept/find/list'
                let url =this.getUrl+ '/deviceAttr/get/availableAttrs'
                axios({method: 'get', url: url}).then(
                    response => {
                        if ( response.data.code === 200 && response.data.data.length>0) {
                            this.tableData = response.data.data;
                            this.sortLengt=response.data.data.length
                            this.logadinTrue =false
                        }
                    }
                ).catch(
                );
            },
            //编辑
            handleEdit(index, row) {
                this.outerVisible = true
                console.log(index, row);
            },
            //删除
            handleDelete(index, row) {

                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const url =this.getUrl+ '/deviceAttr/delete/'+row.id+''//'+row.id+'
                    axios({method: 'post', url: url}).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.onSubmit();

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
            //组合查询服务器
            loadAll() {
                return [
                    { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
                    { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
                    { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
                    { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
                    { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
                    { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
                ];
            },
            handleSelect(item) {
                console.log(item);
            },
            handleIconClick(ev) {
                console.log(ev);
            },
            //服务端查询
            querySearchAsync(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            //数据联动新增和编辑
            showDialog(data){
                this.onSubmit('');
            },
            newdepar(data,row){
                this.datalagio = {};
                if(data=='new'){//这是新增
                    this.mainUrl='/deviceAttr/insert'//新增
                }else if(data=='editor'){//编辑
                    this.mainUrl='/deviceAttr/update' //编辑 POST /deviceAttr/update
                    this.datalagio =row;
                }
                this.visible = true;
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
