<template>
    <div class="scheduil-time">
        <div class="calendar">
            <!-- 年份 月份 -->
            <div class="month">
                <ul>
                    <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
                    <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
                    <li class="year-month" @click="pickYear(currentYear,currentMonth)">
                        <span class="choose-year">{{ currentYear }}</span>
                        <span class="choose-month">{{ currentMonth }}月</span>
                    </li>
                    <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
                </ul>
            </div>
            <!-- 星期 -->
            <ul class="weekdays">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li style="color:red">六</li>
                <li style="color:red">日</li>
            </ul>
            <!-- 日期 -->
            <ul class="days">
                <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
                <li  v-for="dayobject in days" :style="{height:(fullHeight-60-40-20-38-86)/5+'px'}" @click="thisData(dayobject.day.getDate())">
                    <!--本月-->
                    <!--如果不是本月  改变类名加灰色-->

                    <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>

                    <!--如果是本月  还需要判断是不是这一天-->
                    <span v-else>
          <!--今天  同年同月同日-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active" >{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>
            </span>

                </li>
            </ul>
        </div>
        <div class="time-right">
            <h3>组织机构</h3>
            <el-select v-model="value" placeholder="请选择">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <p>已选择排班人员</p>
            <div class="etdata">
                <p><span>值班领导：</span><span v-if="theSelectedData.leadership" class="dyle-lists">{{theSelectedData.leadership.name}}</span></p>
                <p><span>值班人员：</span><span v-for="item in theSelectedData.personnelS" class="dyle-list" v-if="item != theSelectedData.leadership">{{item.name}}</span></p>
            </div>
            <div>
                <p>部门人员列表</p>
                <el-table
                        :data="tableData"
                        @row-click="dataPush"
                        :row-class-name="tableRowClassName"
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            label="编号"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                           >
                    </el-table-column>
                    <el-table-column label="值班领导" width="136">
                        <template scope="scope">
                            <!--<el-radio class="radio" v-model="radio" :change="changeRadio(scope.row)" :label="scope.$index">确定</el-radio>-->
                            <el-radio :label="scope.$index" v-model="radio" @change="changeRadio(scope.row)">确定</el-radio>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'scheduling',
        data(){
            return{
                msg:'我是值班排版',
                currentDay: 1,
                currentMonth: 1,
                currentYear: 1970,
                currentWeek: 1,
                days: [],
                fullHeight:`${document.documentElement.clientHeight}`,
                tableData: [{
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    test:0,
                }, {
                    name: '奥菲',
                    address: '上海市普陀区金沙江路 1517 弄',
                    test:0,
                }, {
                    name: '汪涛',
                    address: '上海市普陀区金沙江路 1519 弄',
                    test:0,
                }, {
                    name: '周琦',
                    address: '上海市普陀区金沙江路 1516 弄',
                    test:0,
                }],
                radio: '',
                //select
                options: [{
                    value: 'JG001',
                    label: '一级机构',
                }, {
                    value: 'JG002',
                    label: '二级机构',
                }, {
                    value: 'JG003',
                    label: '三级机构',
                }, {
                    value: 'JG004',
                    label: '四级机构',
                }, {
                    value: 'JG005',
                    label: '五级机构',
                }],
                value: 'JG001',
                //选中的数据对象
                theSelectedData:{
                    leadership:'',
                    personnelS:[]
                },
            }
        },
        created: function() {  //在vue初始化时调用
            this.initData(null);
        },
        methods: {
            initData: function(cur) {
                var leftcount=0; //存放剩余数量
                var date;


                if (cur) {
                    date = new Date(cur);
                } else {
                    var now=new Date();
                    var d = new Date(this.formatDate(now.getFullYear() , now.getMonth() , 1));
                    d.setDate(35);
                    date = new Date(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
                }
                this.currentDay = date.getDate();
                this.currentYear = date.getFullYear();
                this.currentMonth = date.getMonth() + 1;

                this.currentWeek = date.getDay(); // 1...6,0
                if (this.currentWeek == 0) {
                    this.currentWeek = 7;
                }
                var str = this.formatDate(this.currentYear , this.currentMonth, this.currentDay);
                this.days.length = 0;
                // 今天是周日，放在第一行第7个位置，前面6个
                //初始化本周
                for (var i = this.currentWeek - 1; i >= 0; i--) {
                    var d = new Date(str);
                    d.setDate(d.getDate() - i);
                    var dayobject={}; //用一个对象包装Date对象  以便为以后预定功能添加属性
                    dayobject.day=d;
                    this.days.push(dayobject);//将日期放入data 中的days数组 供页面渲染使用


                }
                //其他周
                for (var i = 1; i <= 35 - this.currentWeek; i++) {
                    var d = new Date(str);
                    d.setDate(d.getDate() + i);
                    var dayobject={};
                    dayobject.day=d;
                    this.days.push(dayobject);
                }

            },
            pickPre: function(year, month) {

                // setDate(0); 上月最后一天
                // setDate(-1); 上月倒数第二天
                // setDate(dx) 参数dx为 上月最后一天的前后dx天
                var d = new Date(this.formatDate(year , month , 1));
                d.setDate(0);
                this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
            },
            pickNext: function(year, month) {
                var d = new Date(this.formatDate(year , month , 1));
                d.setDate(35);
                this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
            },
            pickYear: function(year, month) {
                alert(year + "," + month);
            },

            // 返回 类似 2016-01-02 格式的字符串
            formatDate: function(year,month,day){
                var y = year;
                var m = month;
                if(m<10) m = "0" + m;
                var d = day;
                if(d<10) d = "0" + d;
                return y+"-"+m+"-"+d
            },
            thisData(timedata){
                console.log(timedata)
            },
            //选中颜色大刀开始
            tableRowClassName({row}) {
                if (row.test%2!=0) {
                    return 'warning-row';
                } else if (row.test%2==0) {
                    return 'success-row';
                }
                return '';
            },
            //左右切换
            dataPush(item){//点击变色
                item.test+=1;
                if( item.test%2!=0){
                    if(this.theSelectedData.personnelS){
                        if(this.theSelectedData.personnelS.length>0){
                            if(this.theSelectedData.personnelS.indexOf(item)  == -1){
                                this.theSelectedData.personnelS.push(item);
                                // this.dataLists(item);
                            }
                        }else {
                            this.theSelectedData.personnelS.push(item);
                            // this.dataLists(item);
                        }
                    }
                }else {
                    item.test+=1;
                    this.dataRemove(item);
                }
            },
            dataLists(item){//默认相加
                this.tableData.forEach((datals)=>{
                    if(datals.name == item.name){
                        item.test+=1
                    }
                })
            },
            //删除
            dataRemove(item){
                let indeice = this.theSelectedData.personnelS.indexOf(item);
                this.theSelectedData.personnelS.splice(indeice,1);
                this.dataLists(item);
            },
            changeRadio(row){
                //event.cancelBubble = true;
                // row.test+=1
                this.theSelectedData.leadership = row;

            }
        },
        mounted(){
            console.log(this.fullHeight)
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight
                    this.fullHeight = window.fullHeight
                })()
            }
        },
        watch: {
            fullHeight (val) {
                if(!this.timer) {
                    this.fullHeight = val
                    this.timer = true
                    let that = this
                    setTimeout(function (){
                        that.timer = false
                    },400)
                }
            }
        }
    };
</script>

<style lang="less">
    @import "./style/scheduling.less";
</style>
