<template>
    <el-dialog :title='msg':visible.sync="visible" :show-close="false" :close-on-click-modal="false" class="dialg-body">
        <!--内部嵌套-->
        <el-form ref="resurcesList" :model="resurcesList" label-width="106px" class="permissions">

            <el-col :span="12" v-for="item in resurcesList" >
                    <el-form-item :label="item.attrNamee">
                           <el-input v-model="item.attrName"></el-input>
                    </el-form-item>
            </el-col>
            <div class="dialog-footer" style="text-align: right">
                <el-button @click="close()">取 消</el-button>
                <el-button type="primary" @click="closeClick('resurcesList')">立即创建</el-button>
            </div>
        </el-form>
        <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-button @click="close()">取 消</el-button>-->
            <!--<el-button type="primary" @click="closeClick('types')">确定</el-button>-->
        <!--</div>-->
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
                msg:'设备新增',
                resurcesList:[],
                timeout:  null,
                //校验数组
                rules:{}
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
            closeClick(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.resurcesList)

                        let stringResu={}
                        for(let i=0;i<this.resurcesList.length;i++){
                            stringResu[this.resurcesList[i].key]=this.resurcesList[i].attrName
                        }
                        const url =this.getUrl+'/deviceDetails/insert'
                        axios({method: 'post', url: url, data: stringResu}).then(
                            response => {
                                if ( response.data.code === 200 && response.data.message == '成功') {
                                    console.log(response.data.data)
                                    this.$emit('update:visible', false)
                                }
                            }
                        ).catch(
                        );
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            lngLat(){
                this.$emit('update:visible', false)
                this.$emit('tableTrue', true);
            },
            device(){
                if(this.$props.datadiog.dataTypes.length>0){
                    this.resurcesList=this.$props.datadiog.dataTypes
                }
            }
        },
        mounted(){
            this.device();
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

    .el-check-inter .el-form-item__content{
        height: inherit;
    }
    .el-date-editor.el-input{
        width: 100%;
    }
</style>
