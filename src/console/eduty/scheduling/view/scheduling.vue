<template>
    <div>
        <table class="ds-table">
            <thead>
                <tr>
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th>周六</th>
                    <th>周日</th>
                </tr>
            </thead>
            <tbody id="duty_CalendarTbody">
                <tr v-for="(item, index) in date" :key="index">
                    <td v-for="(key, index) in item.week" :key="index">{{ key.day }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                date: [
                    {
                        week: [
                            {
                                day: '8',
                            },
                            {
                                day: '9'
                            },
                            {
                                day: '10'
                            },
                            {
                                day: '11'
                            },
                            {
                                day: '12'
                            },
                            {
                                day: '13'
                            },
                            {
                                day: '14'
                            }
                        ]
                    },
                    {
                        week: [
                            {
                                day: '15',
                            },
                            {
                                day: '16'
                            },
                            {
                                day: '17'
                            },
                            {
                                day: '18'
                            },
                            {
                                day: '19'
                            },
                            {
                                day: '20'
                            },
                            {
                                day: '21'
                            }
                        ]
                    }
                ]
            }
        },
        mounted () {
            this.date = this.getCalendarDay('2018-01-16');
        },
        methods: {
            getCalendarDay (date) {
                var today = new Date(date);
                var firstDay = today;
                //本月第一天
                firstDay.setDate(1); 
                //根据日期获取星期
                var wIndex = this.getWeekday(firstDay);
                //获取本月最后一天
                var lastDate = this.getMonthLastDate(firstDay);
                //上个月最后一天
                firstDay.setDate(0);
                var lastMLastDay = firstDay.getDate();
                //上个月开始的第一天（日历上显示的日期）
                var lastStart = lastMLastDay - wIndex +2;
                //本月第一天为周一，上个月显示在日历上的日期为
                if(wIndex === 1){
                    lastStart = lastMLastDay - 7;
                }
                var days = [];
                //组装上个月的日期
                var index = 0;
                for(;lastStart <= lastMLastDay;lastStart++){
                    firstDay.setDate(lastStart);
                    var value = this.format(firstDay);
                    days.push(value);
                    index ++;
                }
                //组装本月日期
                firstDay.setDate(1);
                firstDay.setMonth(firstDay.getMonth()+1);
                var start = 1;
                for(;start <= lastDate;start++){
                    firstDay.setDate(start);
                    var value = this.format(firstDay);
                    days.push(value);
                    index ++;
                }
                //组装下个月的日期
                firstDay.setDate(1);
                firstDay.setMonth(firstDay.getMonth()+1);
                var nextStart = 1;
                for(;index < 42;index++){
                    firstDay.setDate(nextStart);
                    var value = this.format(firstDay);
                    days.push(value);
                    nextStart ++;
                }
                //将日期转为六个数组
                // var weeks = []
                // var week = {};
                // weeks.push(week);
                // var j = 1;
                // for (let i=0;i<days.length;i++) {
                //     if(j > 7){
                //         j = 1;
                //         week = {};
                //         weeks.push(week);
                //     }
                //     week[j]=days[i];
                //     j ++;
                // }
                var weeks = [];
                var week = [];
                var tem = 0;
                var j = 1;
                for (var i = 0;i<6;i++) {
                    var arr = [];
                    for (let j=0;j<7;j++) {
                        arr.push({day: days[tem].slice(8)})
                        tem++;
                    }
                    weeks.push({week: arr});
                }
                return weeks;
            },
            getWeekday (date) {
                var weekday = new Array(7);
                weekday[0]=7;
                weekday[1]=1;
                weekday[2]=2;
                weekday[3]=3;
                weekday[4]=4;
                weekday[5]=5;
                weekday[6]=6;
                var wIndex = date.getDay();
                return weekday[wIndex];
            },
            getMonthLastDate (date) {
                date.setMonth(date.getMonth()+1);
                date.setDate(0);
                return date.getDate();
            },
            format (date) {
                var year=date.getFullYear();
                var month=date.getMonth()+1;
                if(month < 10){
                    month = '0'+month;
                }
                var date=date.getDate(); 
                if(date < 10){
                    date = '0'+date;
                }
                return year+"-"+month+"-"+date;
            }
        }
    }
</script>

<style scoped>

</style>


