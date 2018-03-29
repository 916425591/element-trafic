<template>
    <el-dialog :title='msg':visible.sync="visible" :show-close="false" :close-on-click-modal="false">
        <!--内部嵌套-->
        <el-form ref="NewOfficer" :model="NewOfficer" label-width="106px" class="permissions">
            <el-col :span="12" >
                <el-form-item label="警员编号">
                    <el-input v-model="NewOfficer.deptNumber"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item label="姓名">
                    <el-input v-model="NewOfficer.description"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="所属支队">
                    <el-autocomplete
                            v-model="NewOfficer.description"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item label="所属单位">
                    <!--<el-input v-model="NewOfficer.level"></el-input> &lt;!&ndash;下拉框&ndash;&gt;-->
                    <el-autocomplete
                            v-model="NewOfficer.description"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item label="PDA设备编号">
                    <el-input v-model="NewOfficer.description"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item label="数字电台编号">
                    <el-input v-model="NewOfficer.description"></el-input>
                </el-form-item>
            </el-col>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close()">取 消</el-button>
            <el-button type="primary" @click="closeClick()">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'permissions',
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
                msg:'',
                NewOfficer:{},
                timeout:  null,
            }
        },
        computed:{
            getUrl(){
                return this.$store.state.userCode.urlChina;
            }
        },
        methods:{
            close() {
                this.$emit('update:visible', false) // 传递关闭事件
            },
            closeClick(){
                if(this.msg == "部门新增"){
                    const url =this.getUrl+this.$props.url
                    this.NewOfficer.options=[];
                    axios({method: 'post', url: url, data: this.NewOfficer}).then(
                        response => {
                            if ( response.data.code === 200 && response.data.message == '成功') {
                                console.log(response.data.data)
                                this.$emit('tableTrue', true);
                                this.$emit('update:visible', false)
                            }
                        }
                    ).catch(
                    );

                }else if( this.msg == "部门编辑"){

                    const url =this.getUrl+this.$props.url
                    this.NewOfficer.options=[];
                    axios({method: 'post', url: url, data: this.NewOfficer}).then(
                        response => {
                            if ( response.data.code === 200 && response.data.message == '成功') {
                                console.log(response.data.data)
                                this.$emit('tableTrue', false);
                                this.$emit('update:visible', false)
                            }
                        }
                    ).catch(
                    );
                }
            },
            //数据模拟加载
            handleSelect(item) {
                console.log(item);
            },
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
        },
        mounted(){

            if(Object.keys(this.$props.datadiog).length == 0){
                this.NewOfficer={
                    id:'12332146',//警员编号
                    name: '我只是一个测试的部门',//姓名
                    deptId:'test部门',//所属支队
                    dutyId:'test',//职务
                    pdaNumber:'0',//PDA设备编号
                    radioNumber:'103306',//数字电台编辑
                    level: 0
                }
                this.msg ="部门新增"
            }else{
                this.NewOfficer = this.$props.datadiog;
                this.NewOfficer.options= [{
                    level: 0,
                    label: '支队'
                }, {
                    level: 1,
                    label: '区级'
                }, {
                    level: 2,
                    label: '市级'
                }, {
                    level: 3,
                    label: '厅级'
                }]
                console.log(this.NewOfficer);
                this.msg ="部门编辑"
            }

            this.restaurants = this.loadAll();
        }
    };
</script>

<style scoped>

</style>
