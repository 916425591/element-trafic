<template>
    <el-dialog :title='msg':visible.sync="visible" :show-close="false" :close-on-click-modal="false">
        <!--内部嵌套-->
        <el-form ref="NewOfficer" :model="NewOfficer" label-width="106px" class="permissions">
            <el-col :span="12">
                <el-form-item label="编号">
                    <el-input v-model="NewOfficer.serial"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="所属机构">
                    <el-autocomplete
                            v-model="NewOfficer.institutions"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="值班领导">
                    <el-autocomplete
                            v-model="NewOfficer.leadership"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="值班人">
                    <el-autocomplete
                            v-model="NewOfficer.onDuty"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ><i class="el-icon-arrow-down" slot="suffix"></i></el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="开始时间">
                    <el-col :span="24">
                        <el-date-picker type="date" placeholder="开始时间" v-model="NewOfficer.dataOf.start" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="结束时间">
                    <el-col :span="24">
                        <el-date-picker type="date" placeholder="结束时间" v-model="NewOfficer.dataOf.end" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close()">取 消</el-button>
            <el-button type="primary" @click="closeClick()">确定</el-button>
        </div>
        {{NewOfficer}}
    </el-dialog>
</template>

<script>
    export default {
        name: 'schedu-new',
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
                msg:'值班/编辑',
                NewOfficer:this.$props.datadiog,
                timeout:  null,
            }
        },
        methods:{
            close() {
                this.$emit('update:visible', false) // 传递关闭事件
            },
            closeClick(){
                this.$emit('tableTrue', true)
                this.$emit('update:visible', false)
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
            this.NewOfficer =this.$props.datadiog
            this.restaurants = this.loadAll();
        }
    };
</script>

<style scoped>

</style>
