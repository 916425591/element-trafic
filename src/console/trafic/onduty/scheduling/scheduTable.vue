<template>
<div>
    <el-form ref="theOfficer" :model="theOfficer" label-width="80px" class="permissions">
        <el-col :span="6">
            <el-form-item label="值班时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="开始时间" v-model="theOfficer.dataOf.start" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" style="text-align: center" :span="2">-</el-col>
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="结束时间" v-model="theOfficer.dataOf.end" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
        </el-col>
        <el-col :span="4">
                <el-form-item label="所属机构"> <!--组合插件-->
                    <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="state3"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            @select="handleSelect">
                        <i
                                class="el-icon-arrow-down"
                                slot="suffix"
                                @click="handleIconClick">
                        </i>
                        <template slot-scope="props">
                            <div class="name">{{ props.item.value }}</div>
                            <span class="addr">{{ props.item.address }}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
        </el-col>
        <el-col :span="4">
            <el-form-item label="值班领导">
                <el-autocomplete
                        v-model="state4"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
            </el-form-item>
        </el-col>
            <el-col :span="4">
                <el-form-item label="值班人员">
                    <el-autocomplete
                            v-model="state4"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>


        <el-col :span="3" style="margin:0px 20px">
            <el-button type="primary" @click="onSubmit(theOfficer)">查询</el-button>
            <el-button type="primary">重置</el-button>
        </el-col>
        <el-col  :span="2">
            <el-button>添加值班</el-button>
        </el-col>
    </el-form>

    <div>
        <el-table :data="tableData" show-header style="width: 100%">
            <el-table-column prop="serial" label="编号"></el-table-column>
            <el-table-column prop="institutions" label="所属机构"></el-table-column>
            <el-table-column prop="leadership" label="值班领导"></el-table-column>
            <el-table-column prop="onDuty" label="值班人"></el-table-column>
            <el-table-column prop="dataOf.start" label="开始日期"></el-table-column>
            <el-table-column prop="dataOf.end" label="结束日期"></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, tableData)">删除</el-button>
                    <el-button size="mini" type="success" @click="handleDelete(scope.$index, tableData)">添加值班人员</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--应用型不强-->
        <div v-if="visible">
        <schedNew :visible.sync="visible" :datadiog="datalagio" v-on:tableTrue="showDialog" :url="url"></schedNew>
        </div>
    </div>
</div>
</template>

<script>
    import  schedNew from '@/common/components/schedu/scheduNew'//编辑弹窗
    export default {
        name: 'permissions',
        components:{schedNew},
        data(){
            return{
                msg:'警员信息编辑',
                visible:false,
                url:'/duty/update',
                theOfficer: {
                    serial: '', //编号
                    institutions: '',//机构
                    leadership:'',//领导
                    onDuty:'',//值班人
                    dataOf:{
                        start:'',
                        end:''
                    },//值班日期
                },
                datalagio:{},
                //组合插件
                restaurants: [],
                state3: '',
                state4: '',
                timeout:  null,
                //表格数据
                tableData: [{
                    serial: '10010', //编号
                    institutions: '天津交通管理局',//机构
                    leadership:'局综合室',//领导
                    onDuty:'张智慧,李平',//值班人
                    dataOf:{
                        start:'2017-3-16',
                        end:'2017-3-16'
                    },//值班日期
                }, {
                    serial: '10011', //编号
                    institutions: '天津交通管理局',//机构
                    leadership:'局综合室',//领导
                    onDuty:'张智慧,李平',//值班人
                    dataOf:{
                        start:'2017-3-16',
                        end:'2017-3-16'
                    },//值班日期
                }, {
                    serial: '10012', //编号
                    institutions: '天津交通管理局',//机构
                    leadership:'局综合室',//领导
                    onDuty:'张智慧,李平',//值班人
                    dataOf:{
                        start:'2017-3-16',
                        end:'2017-3-16'
                    },//值班日期
                }, {
                    serial: '10013', //编号
                    institutions: '天津交通管理局',//机构
                    leadership:'局综合室',//领导
                    onDuty:'张智慧,李平',//值班人
                    dataOf:{
                        start:'2017-3-16',
                        end:'2017-3-16'
                    },//值班日期
                }]
            }
        },
        mounted(){
            this.restaurants = this.loadAll();
        },
        methods:{
            onSubmit(theOfficer){
                console.log(theOfficer)
            },
            //编辑
            handleEdit(index, row) {
                    this.datalagio = row;
                    this.visible = true;
            },
            //删除
            handleDelete(index, row) {

                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        row.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

            },
            //组合插件模糊查询
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAll() {
                return [
                    { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
                    { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
                    { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
                    { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
                    { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
                    { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
                    { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
                    { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
                    { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
                    { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
                    { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
                    { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
                    { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
                    { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
                    { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
                    { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
                    { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
                    { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
                    { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
                    { "value": "枪会山", "address": "上海市普陀区棕榈路" },
                    { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
                    { "value": "钱记", "address": "上海市长宁区天山西路" },
                    { "value": "壹杯加", "address": "上海市长宁区通协路" },
                    { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
                    { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
                    { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
                    { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
                    { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
                    { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
                    { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
                    { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
                    { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
                    { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
                    { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
                    { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
                    { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
                    { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
                    { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
                    { "value": "浏阳蒸菜", "address": "天山西路430号" },
                    { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
                    { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
                    { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
                    { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
                    { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
                    { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
                    { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
                    { "value": "阳阳麻辣烫", "address": "天山西路389号" },
                    { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
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
            //获取子组件的传值
            showDialog(data){
                console.log("我想得到子组件的回传",data)
            }
        }
    };
</script>

<style lang="less">
    @import "./style/scheduling.less";
</style>
