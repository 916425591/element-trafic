<template>
    <el-dialog :title='msg':visible.sync="visible" :show-close="false" :close-on-click-modal="false">
           <!--内部嵌套-->
           <el-form ref="NewOfficer" :model="NewOfficer" label-width="106px" class="permissions">
               <!--<el-col :span="12" >-->
                   <!--<el-form-item label="所属支队">-->
                       <!--&lt;!&ndash;<el-input v-model="NewOfficer.level"></el-input> &lt;!&ndash;下拉框&ndash;&gt;&ndash;&gt;-->
                       <!--<el-select v-model="NewOfficer.level" placeholder="请选择支队">-->
                           <!--<el-option-->
                                   <!--v-for="item in NewOfficer.options"-->
                                   <!--:key="item.level"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.level">-->
                           <!--</el-option>-->
                       <!--</el-select>-->
                   <!--</el-form-item>-->
               <!--</el-col>-->
               <!--<el-col :span="12" >-->
                   <!--<el-form-item label="所属大队">-->
                       <!--&lt;!&ndash;<el-input v-model="NewOfficer.level"></el-input> &lt;!&ndash;下拉框&ndash;&gt;&ndash;&gt;-->
                       <!--<el-select v-model="NewOfficer.level" placeholder="请选择综合室">-->
                           <!--<el-option-->
                                   <!--v-for="item in NewOfficer.options"-->
                                   <!--:key="item.level"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.level">-->
                           <!--</el-option>-->
                       <!--</el-select>-->
                   <!--</el-form-item>-->
               <!--</el-col>-->
               <!--<el-col :span="12" >-->
                   <!--<el-form-item label="设备大类">-->
                       <!--&lt;!&ndash;<el-input v-model="NewOfficer.level"></el-input> &lt;!&ndash;下拉框&ndash;&gt;&ndash;&gt;-->
                       <!--<el-select v-model="NewOfficer.level" placeholder="请选择设备大类">-->
                           <!--<el-option-->
                                   <!--v-for="item in NewOfficer.options"-->
                                   <!--:key="item.level"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.level">-->
                           <!--</el-option>-->
                       <!--</el-select>-->
                   <!--</el-form-item>-->
               <!--</el-col>-->
               <!--<el-col :span="12" >-->
                   <!--<el-form-item label="设备编号">-->
                       <!--<el-input v-model="NewOfficer.description"></el-input>-->
                   <!--</el-form-item>-->
               <!--</el-col>-->
               <!--<el-col :span="12">-->
                   <!--<el-form-item label="设备名称">-->
                       <!--<el-input v-model="NewOfficer.fullName"></el-input>-->
                   <!--</el-form-item>-->
               <!--</el-col>-->
               <el-col :span="12">
                   <el-form-item label="搜索">
                       <el-input v-model="NewOfficer.licensePlate"></el-input>
                   </el-form-item>
               </el-col>
                <el-col :span="12" >
                    <el-button @click="seach()">查 询</el-button>
                    <el-button type="primary" @click="reset()">重 置</el-button>
                </el-col>
           </el-form>
              <el-table
                      :data="queryCarLists"
                      height="250"
                      border
                      style="width: 100%">
                  <el-table-column
                          prop="attributionUnit"
                          label="地点"
                          width="180">
                  </el-table-column>
                  <el-table-column
                          prop="deviceState"
                          label="过程"
                          width="180">
                  </el-table-column>
                  <el-table-column
                          prop="licensePlate"
                          label="车牌号">
                  </el-table-column>
              </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="lngLat()">关闭</el-button>
        </div>

        <!--我是你们的表格-->
    </el-dialog>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'equipment',
        props: {
            title: String,
            visible: {
                type: Boolean,
                default: false,
            },
            datadiog:Object,
            url:String
        },
        data(){
            return{
                msg:'资源查询',
                NewOfficer:{
                    attrIds:'0',
                    description: '我只是一个测试的部门',//部门描述
                    typeName:'test部门',//部门简称
                    name:'test',//部门全称
                    parentId:'0',//父ID
                    time:'',//日期
                    regionCode:'103306',//地区编码
                    options:[{
                        level:0,
                        label:'无效'
                    },{
                        level:1,
                        label:'正常'
                    }],
                    level:1,
                    licensePlate:''
                },
                timeout:  null,
                queryCarLists:[] //默认分页查询
            }
        },
        computed:{
            getUrl(){
                return this.$store.state.userCode.urlDong;
            }
        },
        methods:{
            close() {
                this.$emit('update:visible', false) // 传递关闭事件
            },
            closeClick(){
                const url =this.getUrl+''
                this.NewOfficer.options=[];
                axios({method: 'post', url: url, data: this.NewOfficer}).then(
                    response => {
                        if ( response.data.code === 200 && response.data.message == '成功') {
                            console.log(response.data.data)
                            // this.$emit('update:visible', false)
                        }
                    }
                ).catch(
                );
            },
            lngLat(){
                this.$emit('update:visible', false)
            },
            //数据模拟加载
            // handleSelect(item) {
            //     console.log(item);
            // },
            handleIconClick(ev) {
                console.log(ev);
            },
            loadAll() {
                return [
                    { "value": "三全鲜食（北新泾店）"},
                    { "value": "Hot honey 首尔炸鸡（仙霞路）" },
                    { "value": "新旺角茶餐厅" },
                    { "value": "泷千家(天山西路店)",  },
                    { "value": "胖仙女纸杯蛋糕（上海凌空店）",  },
                    { "value": "贡茶",  },
                ];
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
            //分页查询警车 /deviceCar/queryCarListByCondition
            queryCarList(){
                const url =this.$store.state.userCode.urlDong+'/deviceCar/queryCarListByCondition';
                console.log(url)
                let qeryCond={
                    obj: {},
                    order: '',
                    pageNum: 0,
                    pageSize: 0,
                    sort: ''
                }

                axios({method: 'post', url: url, data: qeryCond}).then(
                    response => {
                        if ( response.data.message == '成功') {
                            console.log(response.data.data)
                            this.queryCarLists=response.data.data.list;
                        }
                    }
                ).catch(
                );
            }
        },
        mounted(){
            this.queryCarList();
            this.restaurants = this.loadAll();
        }
    };
</script>

<style lang="less">
    @import "./resources.less";
    .btn-resour {
        padding: 0px !important;
        width: 100%;
        height: 40px;
        text-align: center;
        margin-top: 1px;
    }
    .btn-resour i{
        font-size: 25px !important;
    }
</style>
