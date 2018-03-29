<template>
    <el-tabs type="border-card">
        <el-tab-pane label="抓状图">
            <el-row>
                <el-col :span="24" >
                    <div class="grid-content bg-purple-dark" id="a-histogram" :style="{
                              height:this.$store.state.userCode.globalHeight-30-40-20-40-60+'px',
                              width:this.$store.state.userCode.globaShrink?this.$store.state.userCode.globalWidht-50+'px':this.$store.state.userCode.globalWidht-300+'px'
                             }">

                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="折线图">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark" id="a-lineChart" :style="{
                              height:this.$store.state.userCode.globalHeight-30-40-20-40-60+'px',
                              width:this.$store.state.userCode.globaShrink?this.$store.state.userCode.globalWidht-50+'px':this.$store.state.userCode.globalWidht-300+'px'
                             }">
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="饼状图">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark" id="a-pieChart" :style="{
                              height:this.$store.state.userCode.globalHeight-30-40-20-40-60+'px',
                              width:this.$store.state.userCode.globaShrink?this.$store.state.userCode.globalWidht-50+'px':this.$store.state.userCode.globalWidht-300+'px'
                             }">
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'echarts-ept',
        data(){
            return{
                msg:123,
                // clientWidth:this.$store.state.userCode.globalWidht,
                // globalHeight:this.$store.state.userCode.globalHeight,

            }
        },
        computed: {
            clientWidth() {
                return this.$store.state.userCode.globalWidht;
            }
        },
        watch: {
            clientWidth: function() {
                setTimeout(()=>{
                    this.aHistogram();
                    this.lineChart();
                    this.pieChart();
                },400)
            }
        },
        methods:{
            aHistogram(){//柱状图
                let chart = echarts.init(document.getElementById('a-histogram'));
                chart.setOption({
                        backgroundColor: '#394056',
                    // backgroundColor: '#23243a',
                    tooltip: { //提示框组件
                        trigger: 'axis',
                        formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 12,
                        }
                    },
                    grid: {
                        left: '1%',
                        right: '4%',
                        bottom: '6%',
                        top:30,
                        padding:'0 0 10 0',
                        containLabel: true,
                    },
                    legend: {//图例组件，颜色和名字
                        right:10,
                        top:0,
                        itemGap: 16,
                        itemWidth: 18,
                        itemHeight: 10,
                        data:[{
                            name:'流入',
                            //icon:'image://../wwwroot/js/url2.png', //路径
                        },
                            {
                                name:'流出',
                            }],
                        textStyle: {
                            color: '#a8aab0',
                            fontStyle: 'normal',
                            fontFamily: '微软雅黑',
                            fontSize: 12,
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,//坐标轴两边留白
                            data: ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
                            axisLabel: { //坐标轴刻度标签的相关设置。
                                interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                                margin:15,
                                textStyle: {
                                    color: '#078ceb',
                                    fontStyle: 'normal',
                                    fontFamily: '微软雅黑',
                                    fontSize: 12,
                                }
                            },
                            axisTick:{//坐标轴刻度相关设置。
                                show: false,
                            },
                            axisLine:{//坐标轴轴线相关设置
                                lineStyle:{
                                    color:'#fff',
                                    opacity:0.2
                                }
                            },
                            splitLine: { //坐标轴在 grid 区域中的分隔线。
                                show: false,
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitNumber: 5,
                            axisLabel: {
                                textStyle: {
                                    color: '#a8aab0',
                                    fontStyle: 'normal',
                                    fontFamily: '微软雅黑',
                                    fontSize: 12,
                                }
                            },
                            axisLine:{
                                show: false
                            },
                            axisTick:{
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: ['#fff'],
                                    opacity:0.06
                                }
                            }

                        }
                    ],
                    series : [
                        {
                            name:'流入',
                            type:'bar',
                            data:[4.9, 7.3, 9.2, 5.6, 7.7, 5.6, 4.2, 3.6, 6, 6.4],
                            barWidth: 10,
                            barGap:0,//柱间距离
                            label: {//图形上的文本标签
                                normal: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: '#a8aab0',
                                        fontStyle: 'normal',
                                        fontFamily: '微软雅黑',
                                        fontSize: 12,
                                    },
                                },
                            },
                            itemStyle: {//图形样式
                                normal: {
                                    barBorderRadius: [5, 5, 0, 0],
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 1, color: 'rgba(127, 128, 225, 0.7)'
                                    },{
                                        offset: 0.9, color: 'rgba(72, 73, 181, 0.7)'
                                    },{
                                        offset: 0.31, color: 'rgba(0, 208, 208, 0.7)'
                                    },{
                                        offset: 0.15, color: 'rgba(0, 208, 208, 0.7)'
                                    }, {
                                        offset: 0, color: 'rgba(104, 253, 255, 0.7)'
                                    }], false),
                                },
                            },
                        },
                        {
                            name:'流出',
                            type:'bar',
                            data:[2.9, 5, 4.4, 2.7, 5.7, 4.6, 1.2, 2.7, 4.8, 6.0],
                            barWidth: 10,
                            barGap:0.2,//柱间距离
                            label: {//图形上的文本标签
                                normal: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: '#a8aab0',
                                        fontStyle: 'normal',
                                        fontFamily: '微软雅黑',
                                        fontSize: 12,
                                    },
                                },
                            },
                            itemStyle: {//图形样式
                                normal: {
                                    barBorderRadius: [5, 5, 0, 0],
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 1, color: 'rgba(127, 128, 225, 0.7)'
                                    },{
                                        offset: 0.9, color: 'rgba(72, 73, 181, 0.7)'
                                    },{
                                        offset: 0.25, color: 'rgba(226, 99, 74, 0.7)'
                                    }, {
                                        offset: 0, color: 'rgba(253, 200, 106, 0.7)'
                                    }], false),
                                },
                            },
                        }
                    ]
                    })
                chart.resize();
            },
            lineChart(){//折线图
                let chart = echarts.init(document.getElementById('a-lineChart'))
                chart.setOption({
                    backgroundColor: '#394056',
                    title: {
                        top: 20,
                        text: 'Requests',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 16,
                            color: '#F1F1F3'
                        },
                        left: '1%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            lineStyle: {
                                color: '#57617B'
                            }
                        }
                    },
                    legend: {
                        top: 20,
                        icon: 'rect',
                        itemWidth: 14,
                        itemHeight: 5,
                        itemGap: 13,
                        data: ['CMCC', 'CTCC', 'CUCC'],
                        right: '4%',
                        textStyle: {
                            fontSize: 12,
                            color: '#F1F1F3'
                        }
                    },
                    grid: {
                        top: 100,
                        left: '3%',
                        right: '4%',
                        bottom: '2%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#57617B'
                            }
                        },
                        data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '(%)',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#57617B'
                            }
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                fontSize: 14
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#57617B'
                            }
                        }
                    }],
                    series: [{
                        name: 'CMCC',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(137, 189, 27, 0.3)'
                                }, {
                                    offset: 0.8,
                                    color: 'rgba(137, 189, 27, 0)'
                                }], false),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(137,189,27)',
                                borderColor: 'rgba(137,189,2,0.27)',
                                borderWidth: 12

                            }
                        },
                        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
                    }, {
                        name: 'CTCC',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0, 136, 212, 0.3)'
                                }, {
                                    offset: 0.8,
                                    color: 'rgba(0, 136, 212, 0)'
                                }], false),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(0,136,212)',
                                borderColor: 'rgba(0,136,212,0.2)',
                                borderWidth: 12

                            }
                        },
                        data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
                    }, {
                        name: 'CUCC',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(219, 50, 51, 0.3)'
                                }, {
                                    offset: 0.8,
                                    color: 'rgba(219, 50, 51, 0)'
                                }], false),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(219,50,51)',
                                borderColor: 'rgba(219,50,51,0.2)',
                                borderWidth: 12
                            }
                        },
                        data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122]
                    }]
                })
                chart.resize();
            },
            pieChart(){
                let chart = echarts.init(document.getElementById('a-pieChart'))
                let giftImageUrl = "data:image/png;base64,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";
                chart.setOption({
                    backgroundColor: '#394056',
                    graphic: {
                        elements: [{
                            type: 'image',
                            style: {
                                image: giftImageUrl,
                                width: 30,
                                height: 30
                            },
                            left: 'center',
                            top: 'center'
                        }]
                    },
                    series: [{
                        type: 'pie',
                        radius: [30, '55%'],
                        center: ['50%', '50%'],
                        roseType: 'radius',
                        color: ['#f2c955', '#00a69d', '#46d185', '#ec5845'],
                        data: [{
                            value: 7,
                            name: '其他'
                        }, {
                            value: 4,
                            name: '自己制作'
                        }, {
                            value: 35,
                            name: '线下购买'
                        }, {
                            value: 53,
                            name: '网上购买'
                        }],
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: 14
                                },
                                formatter: function(param) {
                                    return param.name + ':\n' + Math.round(param.percent) + '%';
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                smooth: true,
                                lineStyle: {
                                    width: 2
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                shadowBlur: 30,
                                shadowColor: 'rgba(0, 0, 0, 0.4)'
                            }
                        },

                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function(idx) {
                            return Math.random() * 200;
                        }
                    }]

                })
                chart.resize();
            }

        },
        created(){

        },
        mounted(){
            this.aHistogram();
            this.lineChart();
            this.pieChart();
        }
    };
</script>

<style scoped>
.ol-viewport{
    display: none;
}
    #a-histogram{
      transition: all ease-in-out 0.4s;
        /*background: #cccccc;*/
        /*height:100px ;*/
    }
</style>
