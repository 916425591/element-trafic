<template>
  <div id="charts-div">
    <div style="background:#fff">
      <Row type="flex">
        <i-col span="8" class="chart-border">
          <div style="width:98%;height:350px" id="test1"></div>
        </i-col>
        <i-col span="8" class="chart-border">
          <div style="width:98%;height:350px" id="data_source_con"></div>
        </i-col>
        <i-col span="8" class="chart-border">
          <div style="width:98%;height:350px" id="test2"></div>
        </i-col>
      </Row>
      <Row style="margin-top:20px;">
        <i-col span="8" class="chart-border">
          <div style="width:98%;height:350px" id="test4"></div>
        </i-col>
        <i-col span="8" class="chart-border">
          <div style="width:98%;height:350px" id="test3"></div>
        </i-col>
        <i-col span="8" class="chart-border">
          <div style="width:98%;height:350px" id="test5"></div>
        </i-col>
      </Row>
    </div>
  </div>
</template>
 
<script>
 import echarts from 'echarts';
 import Cookies from 'js-cookie';
  export default {
    name: 'dataSourcePie',
    data () {
      return {
        charts: ''
      };
    },
    watch:{
      chartMessage: {
        deep: true,
        handler(val){
          console.log(111)
          this.drawChart(val)
        }
      },
      charts(val, oldVal){//普通的watch监听
        // console.log(document.getElementById('charts-div').clientWidth)
        console.log("charts: "+val, oldVal);
      }
    },
    methods: {
      chart1() {
        const dataSourcePie = echarts.init(document.getElementById('data_source_con'));
        const option = {
            title: {
                left: 'left',
                text: '资源类型',
            },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: ['应急物资', '应急装备', '避险场所', '处置队伍', '专业车辆']
          },
          series: [
            {
              name: '资源类型',
              type: 'pie',
              radius: '66%',
              center: ['50%', '60%'],
              data: [
                {value: 2103456, name: '应急物资', /*itemStyle: {normal: {color: '#9bd598'}}*/},
                {value: 1305923, name: '应急装备', /*itemStyle: {normal: {color: '#ffd58f'}}*/},
                {value: 543250, name: '避险场所', /*itemStyle: {normal: {color: '#abd5f2'}}*/},
                {value: 798403, name: '处置队伍', /*itemStyle: {normal: {color: '#ab8df2'}}*/},
                {value: 302340, name: '专业车辆', /*itemStyle: {normal: {color: '#e14f60'}}*/}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        dataSourcePie.setOption(option);
      },
      chart2() {
        const test1 = echarts.init(document.getElementById('test1'));
        const option = {
        //   backgroundColor: '#1b1b1b',
        title: {
                left: 'left',
                text: '未处置事件',
            },
          tooltip : {
              formatter: "{a} <br/>{c} {b}"
          },
          series : [
              {
                  name:'速度',
                  type:'gauge',
                  min:0,
                  max:220,
                  splitNumber:11,
                  radius: '50%',
                  axisLine: {            // 坐标轴线
                      lineStyle: {       // 属性lineStyle控制线条样式
                          color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                          width: 3,
                          shadowColor : '#fff', //默认透明
                          shadowBlur: 10
                      }
                  },
                  axisLabel: {            // 坐标轴小标记
                      textStyle: {       // 属性lineStyle控制线条样式
                          fontWeight: 'bolder',
                          color: '#fff',
                          shadowColor : '#fff', //默认透明
                          shadowBlur: 10
                      }
                  },
                  axisTick: {            // 坐标轴小标记
                      length :15,        // 属性length控制线长
                      lineStyle: {       // 属性lineStyle控制线条样式
                          color: 'auto',
                          shadowColor : '#fff', //默认透明
                          shadowBlur: 10
                      }
                  },
                  splitLine: {           // 分隔线
                      length :25,         // 属性length控制线长
                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                          width:3,
                          color: '#fff',
                          shadowColor : '#fff', //默认透明
                          shadowBlur: 10
                      }
                  },
                  pointer: {           // 分隔线
                      shadowColor : '#fff', //默认透明
                      shadowBlur: 5
                  },
                  title : {
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                          fontWeight: 'bolder',
                          fontSize: 20,
                          fontStyle: 'italic',
                          color: '#fff',
                          shadowColor : '#fff', //默认透明
                          shadowBlur: 10
                      }
                  },
                  detail : {
                      backgroundColor: 'rgba(30,144,255,0.8)',
                      borderWidth: 1,
                      borderColor: '#fff',
                      shadowColor : '#fff', //默认透明
                      shadowBlur: 5,
                      offsetCenter: [0, '50%'],       // x, y，单位px
                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                          fontWeight: 'bolder',
                          color: '#fff'
                      }
                  },
                  data:[{value: 40, name: 'km/h'}]
              }
          ]
        };
        test1.setOption(option);
      },
      chart3() {
        const test2 = echarts.init(document.getElementById('test2'));
        const option = {
            title: {
                left: 'left',
                text: '预案事件类型',
            },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            data:['特大','重大','一般','轻微']
          },
          series: [
            {
              name:'预案事件类型',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {value:335, name:'特大'},
                {value:310, name:'重大'},
                {value:234, name:'一般'},
                {value:135, name:'轻微'}
              ]
            }
          ]
        };
        test2.setOption(option);
      },
      chart4() {
        const test3 = echarts.init(document.getElementById('test3'))
        const base = +new Date(1968, 9, 3)
        const oneDay = 24 * 3600 * 1000
        const date = []

        const data = [Math.random() * 30]
        let now
        for (let i = 1; i < 20000; i++) {
            now = new Date(base + oneDay)
            date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'))
            data.push(Math.round(Math.random() * 8 + data[i - 1]))
        }

        const option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: '应急事件处理效率',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            series: [
                {
                    name:'模拟数据',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    },
                    data: data
                }
            ]
        };
        test3.setOption(option)
      },
      chart5() {
        const test4 = echarts.init(document.getElementById('test4'))
        const option = {
          angleAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            z: 10
          },
          radiusAxis: {
          },
          polar: {
          },
          series: [{
            type: 'bar',
            data: [1, 2, 3, 4, 3, 5, 1],
            coordinateSystem: 'polar',
            name: '自然灾害事故',
            stack: 'a'
          }, {
            type: 'bar',
            data: [2, 4, 6, 1, 3, 2, 1],
            coordinateSystem: 'polar',
            name: '社会安全事故',
            stack: 'a'
          }, {
            type: 'bar',
            data: [1, 2, 3, 4, 1, 2, 5],
            coordinateSystem: 'polar',
            name: '公共卫生',
            stack: 'a'
          }],
          legend: {
            show: true,
            data: ['自然灾害事故', '社会安全事故', '公共卫生']
          }
        }
        test4.setOption(option)
      },
      chart6() {
        const test5 = echarts.init(document.getElementById('test5'))
        const dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
        const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
        const yMax = 500;
        const dataShadow = [];
        for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }
        const option = {
          title: {
            text: '基础数据维护',
            subtext: '可滑动查看'
          },
          xAxis: {
            data: dataAxis,
            axisLabel: {
              inside: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          series: [
            {
              type: 'bar',
              itemStyle: {
                normal: {color: 'rgba(0,0,0,0.05)'}
              },
              barGap:'-100%',
              barCategoryGap:'40%',
              data: dataShadow,
              animation: false
            },
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#83bff6'},
                      {offset: 0.5, color: '#188df0'},
                      {offset: 1, color: '#188df0'}
                    ]
                  )
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#2378f7'},
                      {offset: 0.7, color: '#2378f7'},
                      {offset: 1, color: '#83bff6'}
                    ]
                  )
                }
              },
              data: data
            }
          ]
        }
        var zoomSize = 6;
        test5.on('click', function (params) {
            test5.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            });
        });
        test5.setOption(option)
      }
    },
    mounted () {
      this.$nextTick(() => {
        const dataSourcePie = echarts.init(document.getElementById('data_source_con'))
        const test1 = echarts.init(document.getElementById('test1'))
        const test2 = echarts.init(document.getElementById('test2'))
        const test3 = echarts.init(document.getElementById('test3'))
        const test4 = echarts.init(document.getElementById('test4'))
        const test5 = echarts.init(document.getElementById('test5'))
        this.chart1()
        this.chart2()
        this.chart3()
        this.chart4()
        this.chart5()
        this.chart6()
        // window.addEventListener('resize', function () {
        // const w = document.getElementById('charts-div').clientWidth
        // this.charts = w
        console.log('this.charts', this.charts)
        window.addEventListener('resize', function () {
          console.log(22222222222, 'test')
          dataSourcePie.resize()
          test1.resize()
          test2.resize()
          test3.resize()
          test4.resize()
          test5.resize()
        })
      })
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
 </style>
 