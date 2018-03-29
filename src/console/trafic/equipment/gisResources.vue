<template>
    <div style="position: relative;
    width: 100%;">
        <p class="gisResource-nav">
            <el-button  type="primary" @click="eqQuery()">设备查询</el-button>
            <el-dropdown trigger="click" >
                <el-button type="primary" :disabled="ListTrue">
                    设备新增<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <span v-for="item in resourcesList"  @click="resourcesShow(item)">
                        <el-dropdown-item>{{item.typeName}}</el-dropdown-item>
                    </span>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button  type="primary">设备管理</el-button>
            <el-button  type="primary">资源查询</el-button>
            <!--<el-button @click="testClick()" type="primary">测试</el-button>-->
        </p>


        <div v-if="resources"> <!--其实我不喜欢这样的写发但是目前我还没有发现其他好的写法-->
            <resourcesslot :visible.sync="resources"  :datadiog="datalagio" v-on:tableTrue="showDialog">
            </resourcesslot>
        </div>

        <div v-if="eqquery"> <!--其实我不喜欢这样的写发但是目前我还没有发现其他好的写法-->
            <eqquerys :visible.sync="eqquery"  :datadiog="datalagio" >
            </eqquerys>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import axios from 'axios'
    import  resourcesslot from  '@/common/components/scEquipment/gisResources' //设备新增
    import  eqquerys from  '@/common/components/scEquipment/eqQuery' //设备新增
    export default {
        name: 'dataSourcePie',
        data () {
            return {
                message: '欢迎来到我的地图',
                mymap:'',
                resources:false,
                eqquery:false,
                resourcesList:[],
                datalagio:{
                    lng:'',
                    lat:''
                },
                ListTrue:true,
                thisMap:this.$store.state.userCode.dsMap
            };
        },
        components:{resourcesslot,eqquerys},
        methods: {
            testClick(){
                this.mymap.test();
            },
            resourcesShow(row){
                    let url = this.$store.state.userCode.urlDong+'/deviceAttr/get/availableAttrs'
                    axios({method: 'get', url: url}).then(
                        response => {
                            if ( response.data.code === 200 && response.data.message == '成功') {
                                this.datalagio.dataTypes=[]
                                console.log(response.data.data,row.attrIds)
                                for(let i=0;i<response.data.data.length;i++){
                                    for(let j=0;j<row.attrIds.length;j++){
                                        if(row.attrIds[j]==response.data.data[i].id){
                                            // this.types.push(response.data.data[i]) //可能不需要这么多的字段
                                            this.datalagio.dataTypes.push({
                                                key:"value" + response.data.data[i].sort,
                                                attrNamee:response.data.data[i].attrName,
                                                attrName:''
                                            })
                                            this.resources=true;
                                        }
                                    }
                                }
                            }
                        }
                    ).catch(
                    );

                // this.datalagio={
                //     attrIds:row.attrIds
                // }
               //this.resources=true;
            },
            eqQuery(){
                 this.eqquery = true;
            },
            showDialog(data){
                if(data){
                    let me =this;
                   var key= me.thisMap.map.on('singleclick',function(event){
                        let lnglat=ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
                        me.datalagio={
                            lng :lnglat[0].toFixed(8) ,
                            lat:lnglat[1].toFixed(8),
                        }
                        me.resources=true;
                        me.thisMap.map.unByKey(key);
                    })
                }
            },
            rsLists(){//获取所有可用设备类型
                let url = this.$store.state.userCode.urlDong+'/deviceType/get/avalibleTypeList'
                axios({method: 'get', url: url}).then(
                    response => {
                        if ( response.data.code === 200 && response.data.message == '成功') {
                            this.resourcesList=response.data.data;
                            this.ListTrue=false;
                        }
                    }
                ).catch(
                );
            }
        },
        mounted () {
             this.rsLists();
        }
    }
</script>

<style>
    .chart-border {
        border: 1px solid #e5e5e5;
    }

    .chart-border:hover {
        border: 1px solid #2d90e6;
        box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, .1);
    }
    #gisMap{
    position: relative;
        overflow: hidden;
    }
    .gisResource-nav{
        /*position: absolute;*/
        /*left: 0px;*/
        /*top: 0px;*/
        z-index: 1;
        padding: 6px;
        width: 100%;
        margin: 0px;
        background: #0b76bf;
    }
</style>
