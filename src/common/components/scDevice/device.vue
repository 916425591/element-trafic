<template>
    <el-dialog :title='msg':visible.sync="visible" :show-close="false" :close-on-click-modal="false">
        <!--内部嵌套-->
        <el-form ref="NewOfficer" :model="NewOfficer" label-width="106px" class="permissions">
            <el-col :span="12" >
                <el-form-item label="名称">
                    <el-input v-model="NewOfficer.attrName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item label="配置ID">
                    <el-input v-model="NewOfficer.attrCfgId"></el-input>
                </el-form-item>
            </el-col>

            <!--<el-col :span="12">-->
                <!--<el-form-item label="Sort">-->
                    <!--<el-input v-model="NewOfficer.sort"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-col>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close()">取 消</el-button>
            <el-button type="primary" @click="closeClick()" :loading="newLoad">确定</el-button>
        </div>
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
            url:String,
            sortLengt:Number
        },
        data(){
            return{
                msg:'',
                NewOfficer:{
                },
                timeout:  null,
                newLoad:false
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
                this.newLoad =true;
                if(this.msg == "属性新增"){
                    const url =this.$store.state.userCode.urlDong+this.$props.url
                    axios({method: 'post', url: url, data: this.NewOfficer}).then(
                        response => {

                                if(response.data.message == '成功'){
                                    this.$message({
                                        type: 'success',
                                        message:response.data.message
                                    });
                                    this.$emit('tableTrue', true);
                                    this.$emit('update:visible', false)
                                }else if(response.data.message != '成功'){
                                    this.$message({
                                        type: 'info',
                                        message:response.data.message
                                    });
                                }
                                this.newLoad =false;

                        }
                    ).catch(
                    );
                }else if( this.msg == "属性编辑"){
                    const url =this.getUrl+this.$props.url
                    axios({method: 'post', url: url, data: this.NewOfficer}).then(
                        response => {
                            if (response.data.message == '成功') {
                                this.$emit('tableTrue', false);
                                this.$emit('update:visible', false)
                            }else{
                                this.$message({
                                    type: 'info',
                                    message:response.data.message
                                });
                            }
                            this.newLoad =false;
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
            }
        },
        mounted(){

            if(Object.keys(this.$props.datadiog).length == 0){
                this.NewOfficer={
                    attrCfgId:'0',//部门人数
                    attrName: '我只是一个测试的部门',//名称
                    sort:this.$props.sortLengt+1,//地区编码
                }
                this.msg ="属性新增"
            }else{
                this.NewOfficer = this.$props.datadiog;
                console.log(this.NewOfficer);
                this.msg ="属性编辑"
            }
            this.restaurants = this.loadAll();
        }
    };
</script>

<style scoped>

</style>
