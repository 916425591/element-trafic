<template>
    <div id="gisMap">
        <el-button @click="monitorVideoClick()" :type="monitorVideoBool?'primary':'info'">监控摄像</el-button>
        <el-button @click="checkpointClick()" :type="checkpointBool?'primary':'info'">检查站</el-button>
        <el-button @click="actionStationClick()" :type="actionStationBool?'primary':'info'">执法站</el-button>
        <template>
            <el-select v-model="optionsValue"  placeholder="请选择警车">
                <el-option
                        v-for="item in options"
                        :key="item.optionsValue"
                        :label="item.label"
                        :value="item.optionsValue">
                </el-option>
            </el-select>
        </template>
        <el-button @click="btnSelectPliceCarClick()">
            查询
        </el-button>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: 'dataSourcePie',
        data() {
            return {
                options: [{
                    optionsValue: '100001',
                    label: '100001'
                }, {
                    optionsValue: '100002',
                    label: '100002'
                }, {
                    optionsValue: '100003',
                    label: '100003'
                }],
                optionsValue: null,
                gisMap: '',
                monitorVideoBool: false,//显示隐藏图层
                checkpointBool: false,
                actionStationBool: false,
                monitorVideoClickBool: true,//判断是否第一次点击按钮
                checkpointClickBool: true,
                actionStationClickBool: true
            };
        },
        methods: {
            monitorVideoClick() {
                this.monitorVideoBool = !this.monitorVideoBool;
                if (this.monitorVideoBool) {
                    if (this.monitorVideoClickBool) {
                        var url = "http://10.168.4.222:8080/WebDemo/geocontroller/getFeatures";
                        var params = {
                            tname: "ds_monitorvideo",
                            cql: "include",
                            attrs: ['geom', 'type']
                        };
                        this.gisMap.addMonitorVideoLayer(url, params);
                        this.monitorVideoClickBool = false;
                    } else {
                        this.gisMap.monitorVideoLayer.setVisible(true);
                    }
                } else {
                    this.gisMap.monitorVideoLayer.setVisible(false);
                }
            },
            checkpointClick() {
                this.checkpointBool = !this.checkpointBool;
                if (this.checkpointBool) {
                    if (this.checkpointClickBool) {
                        var url = "http://10.168.4.222:8080/WebDemo/geocontroller/getFeatures";
                        var params = {
                            tname: "ds_checkpoint",
                            cql: "include",
                            attrs: ['geom', 'type']
                        };
                        this.gisMap.addCheckpointLayer(url, params);
                        this.checkpointClickBool = false;
                    } else {
                        this.gisMap.checkpointLayer.setVisible(true);
                    }
                } else {
                    this.gisMap.checkpointLayer.setVisible(false);
                }
            },
            actionStationClick() {
                this.actionStationBool = !this.actionStationBool;
                if (this.actionStationBool) {
                    if (this.actionStationClickBool) {
                        var url = "http://10.168.4.222:8080/WebDemo/geocontroller/getFeatures";
                        var params = {
                            tname: "ds_actionstation",
                            cql: "include",
                            attrs: ['geom', 'type']
                        };
                        this.gisMap.addActionStationLayer(url, params);
                        this.actionStationClickBool = false;
                    } else {
                        this.gisMap.actionStationLayer.setVisible(true);
                    }
                } else {
                    this.gisMap.actionStationLayer.setVisible(false);
                }
            },
            btnSelectPliceCarClick(){
                var policecarId = this.optionsValue;
                if(policecarId!=null){
                    this.gisMap.addPliceCarTrackAnimation(policecarId);
                }
            }
        },
        mounted() {
            this.gisMap = new dsMap("gisMap");
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

    .back {
        background: #000 !important;
    }

    #gisMap {
        height: 820px;
    }
</style>
