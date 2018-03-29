<template>
    <el-dialog :title='msg':visible.sync="visible" :show-close="false" :close-on-click-modal="false" class="dia-el-checkbox dialg-body">
        <!--内部嵌套-->
        <el-form ref="NewOfficer" :model="NewOfficer" label-width="106px" class="permissions">
            <el-col :span="12" >
                <el-form-item label="分类标识">
                    <el-input v-model="NewOfficer.typeFlag"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item label="类型名称">
                    <el-input v-model="NewOfficer.typeName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="分类图标">
                    <el-input v-model="NewOfficer.typeIcon"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item label="功能名称">
                    <!--<el-input v-model="NewOfficer.level"></el-input> &lt;!&ndash;下拉框&ndash;&gt;-->
                    <el-input v-model="NewOfficer.functionalName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="分类状态">
                    <el-select v-model="NewOfficer.typeState" placeholder="请选择状态">
                        <el-option
                                v-for="item in tyoeOnMap.typeState"
                                :key="item.boolen"
                                :label="item.label"
                                :value="item.boolen">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="是否上图">
                    <el-select v-model="NewOfficer.onMap" placeholder="请选择">
                        <el-option
                                v-for="item in tyoeOnMap.onMap"
                                :key="item.boolen"
                                :label="item.label"
                                :value="item.boolen">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24"class="el-check-inter">
                <el-form-item label="属性" >
                    <el-checkbox-group v-model="NewOfficer.attrIds" >
                        <el-checkbox v-for="item in  types" :label="item.id" name="type">{{item.attrName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
            <div class="dialog-footer" style="text-align: right">
                <el-button @click="close()">取 消</el-button>
                <el-button type="primary" @click="closeClick('NewOfficer')">确定</el-button>
            </div>
        </el-form>
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
                msg:'',
                NewOfficer:{
                },
                types:[],
                timeout:  null,
                //图标和状态
                tyoeOnMap:{
                    onMap:[
                        {
                            boolen:true,
                            label:'是'
                        },
                        {
                            boolen:false,
                            label:'否'
                        }
                    ],
                    typeState:[
                        {
                            boolen:true,
                            label:'正常'
                        },
                        {
                            boolen:false,
                            label:'无效'
                        }
                    ]
                }
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
                if(this.msg == "设备类型新增"){ //接口功能目前成功
                    const url =this.$store.state.userCode.urlDong+this.$props.url;
                    console.log(url)
                    axios({method: 'post', url: url, data: this.NewOfficer}).then(
                        response => {
                            if ( response.data.message == '成功') {
                                this.$message({
                                    type: 'success',
                                    message: response.data.message
                                });
                                this.$emit('tableTrue', true);
                                this.$emit('update:visible', false)
                            }
                        }
                    ).catch(
                    );

                }else if( this.msg == "设备类型编辑"){
                    const url =this.getUrl+this.$props.url
                    // this.NewOfficer.attrIds=[]
                    axios({method: 'post', url: url, data: this.NewOfficer}).then(
                        response => {
                            if ( response.data.code === 200 && response.data.message == '成功') {
                                console.log(response.data.data)
                                this.$message({
                                    type: 'success',
                                    message: response.data.message
                                });
                                this.$emit('tableTrue', false);
                                this.$emit('update:visible', false)
                            }
                        }
                    ).catch(
                    );
                }
            },
            device(){
                let url = this.$store.state.userCode.urlDong+'/deviceAttr/get/availableAttrs'
                axios({method: 'get', url: url}).then(
                    response => {
                        if ( response.data.code === 200 && response.data.message == '成功') {
                            this.types=response.data.data;
                            console.log(this.types)
                        }
                    }
                ).catch(
                );
            }
        },
        mounted(){
            if(Object.keys(this.$props.datadiog).length == 0){
                this.device();
                this.NewOfficer={
                    typeFlag:'',//分类标识
                    typeName: '',//卡口名称
                    typeIcon:'',//分类图标
                    functionalName:'',//功能名称
                    typeState:'',//分类状态
                    onMap:'',//是否上图
                    attrIds:[]
                }
                this.msg ="设备类型新增"
            }else{
                this.NewOfficer = this.$props.datadiog;
                //编辑需要渲染
                let url = this.$store.state.userCode.urlDong+'/deviceAttr/get/availableAttrs'
                axios({method: 'get', url: url}).then(
                    response => {
                        if ( response.data.code === 200 && response.data.message == '成功') {
                            for(let i=0;i<response.data.data.length;i++){
                                for(let j=0;j<this.NewOfficer.attrIds.length;j++){
                                    if(this.NewOfficer.attrIds[j]==response.data.data[i].id){
                                        // this.types.push(response.data.data[i]) //可能不需要这么多的字段
                                        this.types.push({
                                            id: parseInt(response.data.data[i].id),
                                            attrName:response.data.data[i].attrName,
                                        })
                                        this.resources=true;
                                    }
                                }
                            }
                            console.log(this.types,this.NewOfficer.attrIds)
                        }
                    }
                ).catch(
                );
                this.msg ="设备类型编辑"
            }
        }
    };
</script>

<style >
.el-check-inter .el-form-item__content{
    height: inherit;
}
.dia-el-checkbox .el-checkbox+.el-checkbox{
    margin-right: 30px;
    margin-left: 0px;
}
.dia-el-checkbox .el-checkbox{
    margin-right: 30px;
}
</style>
