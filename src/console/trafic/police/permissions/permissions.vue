<template>
    <div>
        <el-form ref="theOfficer" :model="theOfficer" label-width="80px" class="permissions">
            <el-col :span="6">
                <el-form-item label="姓名">
                    <el-input v-model="theOfficer.department" placeholder="请输入内容"> </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="所属支队">
                    <el-autocomplete
                            v-model="theOfficer.department"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="排序">
                    <el-autocomplete
                            v-model="theOfficer.department"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="警员编号">
                    <el-input v-model="theOfficer.department" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="排序方式">
                    <el-autocomplete
                            v-model="theOfficer.department"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>

            <el-col :span="12" style="margin-left: 80px">
                <el-button type="primary" @click="onSubmit(theOfficer)" :loading="logadinTrue" >查询</el-button>
                <el-button type="primary" @click="newdepar('new')">添加警员</el-button>
            </el-col>
        </el-form>

            <el-table :data="tableData" show-header style="width: 100%">
                <el-table-column prop="id" label="警员编号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="deptId" label="所属支队"></el-table-column>
                <el-table-column prop="dutyId" label="职务"></el-table-column>
                <el-table-column prop="pdaNumber" label="PDA设备编号"></el-table-column>
                <el-table-column prop="radioNumber" label="数字电台编号"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="newdepar('editor',scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--应用型不强-->


        <div v-if="visible">
            <permissionsDiog :visible.sync="visible" :datadiog="datalagio" v-on:tableTrue="showDialog" :url="mainUrl"></permissionsDiog>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import  permissionsDiog from  '@/common/components/scPermissions/permissions'
    export default {
        name: 'permissions',
        components:{permissionsDiog},
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
                return this.$store.state.userCode.urlChina;
            }
        },
        mounted(){
            this.restaurants = this.loadAll();
        },
        methods:{
            onSubmit(theOfficer){
                console.log(21312,theOfficer)
                if(theOfficer.department == ''){
                    const url =this.getUrl+ '/police/find/list'
                    const dataList={
                        paraMap:'',
                        pageHelper:''
                    }
                    this.logadinTrue =true;
                    axios({method: 'post', url: url, data: dataList}).then(
                        response => {
                            if ( response.data.code === 200 && response.data.data.list.length>0) {
                                this.tableData = response.data.data.list;
                                this.logadinTrue =false
                            }
                        }
                    ).catch(
                    );
                }
            },
            //编辑
            handleEdit(index, row) {
                this.outerVisible = true
                console.log(index, row);
            },
            //删除
            handleDelete(index, row) {
                console.log(row.deptId,row)
                const url =this.getUrl+ '/police/delete/'+row.id
                const dataList={
                    paraMap:'',
                    pageHelper:''
                }
                axios({method: 'post', url: url}).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            let data = '';
                            this.onSubmit(data);
                        }
                    }
                ).catch(
                );
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
                    this.mainUrl='/police/insert'//新增
                }else if(data=='editor'){//编辑
                    this.mainUrl='/police/update' //编辑
                    this.datalagio =row;
                }
                this.visible = true;
            }
        }
    };
</script>

<style lang="less">
    @import "./style/permissions.less";
</style>
