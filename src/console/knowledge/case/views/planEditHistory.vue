<template>
    <div class="ds-planEditHistory">
         <Row>
            <Col span="5">
                <div class="ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>预案修订历史</h2>
                    </div>
                    <div class="ds-timeLine-box">
                        <Timeline>
                            <TimelineItem v-for="(item,index) in timeList" :key="index">
                                <p class="time">{{ item.time }}</p>
                                <p class="content">{{ item.content }}</p>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </div>
            </Col>
            <Col span="19">
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>预案信息</h2>
                    </div>
                    <div class="ds-history-body">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        预案名称：
                                    </td>
                                    <td>
                                        {{ planInfo.planName }}
                                    </td>
                                    <td class="ds-table-left">
                                        防护对象：
                                    </td>
                                    <td>
                                        {{ planInfo.protect }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        防护类型：
                                    </td>
                                    <td>
                                        {{ planInfo.protectType }}
                                    </td>
                                    <td class="ds-table-left">
                                        防护等级：
                                    </td>
                                    <td>
                                        {{ planInfo.protectLevel }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        适用范围：
                                    </td>
                                    <td>
                                        {{ planInfo.range }}
                                    </td>
                                    <td class="ds-table-left">
                                        主编单位：
                                    </td>
                                    <td>
                                        {{ planInfo.manageOrg }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        关键字：
                                    </td>
                                    <td colspan="3">
                                        {{ planInfo.keyWord }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>预案编制信息</h2>
                    </div>
                    <div class="ds-history-body">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        创建时间：
                                    </td>
                                    <td>
                                        {{ planCreate.time }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        创建单位：
                                    </td>
                                    <td>
                                        {{ planCreate.org }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        创建人员：
                                    </td>
                                    <td>
                                        {{ planCreate.member }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>预案审核/发布信息</h2>
                    </div>
                    <div class="ds-history-body">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        提交审核时间：
                                    </td>
                                    <td>
                                        {{ planExamine.submitTime }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        提交人员：
                                    </td>
                                    <td>
                                        {{ planExamine.submitPerson }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        开始审核时间：
                                    </td>
                                    <td>
                                        {{ planExamine.starTime }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        审核人员：
                                    </td>
                                    <td>
                                        {{ planExamine.auditor }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        审核结果：
                                    </td>
                                    <td>
                                        {{ planExamine.result }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        审核意见：
                                    </td>
                                    <td>
                                        {{ planExamine.opinion }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        预案发布时间：
                                    </td>
                                    <td>
                                        {{ planExamine.releaseTime }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        发布人员：
                                    </td>
                                    <td>
                                        {{ planExamine.releasePerson }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        发布版本：
                                    </td>
                                    <td>
                                        {{ planExamine.releaseVersion }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        生效时间：
                                    </td>
                                    <td>
                                        {{ planExamine.effectTime }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="ds-widget-box ds-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>预案修订信息</h2>
                    </div>
                    <div class="ds-history-body">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td class="ds-table-left">
                                        申请修订时间：
                                    </td>
                                    <td>
                                        {{ planEditInfo.editTime }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        修订次数：
                                    </td>
                                    <td>
                                        {{ planEditInfo.editNUm }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        修订人员：
                                    </td>
                                    <td>
                                        {{ planEditInfo.editPerson }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        修订原因：
                                    </td>
                                    <td>
                                        {{ planEditInfo.editReason }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        修订内容：
                                    </td>
                                    <td>
                                        {{ planEditInfo.editContent }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="ds-table-left">
                                        完成修订时间：
                                    </td>
                                    <td>
                                        {{ planEditInfo.editSuccessTime }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'planEditHistory_index',
        data () {
            return {
                timeList: [
                    {
                        time: '2017'
                    },
                    {
                        time: '5月21日',
                        content: '创建预案'
                    },
                    {
                        time: '6月5日',
                        content: '预案审核'
                    },
                    {
                        time: '6月8日',
                        content: '预案发布'
                    },
                    {
                        time: '2018年'
                    },
                    {
                        time: '4月10日',
                        content: '预案一次修订'
                    }
                ],
                planInfo: {
                    planName: '东山重大滑坡处置预案',
                    protect: '东山重大滑坡处置预案',
                    protectType: '自然灾害——山体滑坡',
                    protectLevel: '特别重大',
                    range: '自然灾害——山体滑坡',
                    manageOrg: '金海市市政府',
                    keyWord: '金海市、东山、特别重大、重大、自然灾害、山体滑坡'
                },
                planCreate: {
                    time: '2017-5-21 11:03:21',
                    org: '金海市应急办业务科',
                    member: '张奎发'
                },
                planExamine: {
                    submitTime: '2017-5-21 11:03:21',
                    submitPerson: '张奎发',
                    starTime: '张奎发',
                    auditor: '朱雀心',
                    result: '同意发布',
                    opinion: 'xxx',
                    releaseTime: '2017-05-22 16:23:44',
                    releasePerson: '朱雀心',
                    releaseVersion: '金【字】2017005号',
                    effectTime: '2017-6-1'
                },
                planEditInfo: {
                    editTime: '2017-5-21 11:03:21',
                    editNUm: '第一次修订',
                    editPerson: '张奎发',
                    editReason: '',
                    editContent: '',
                    editSuccessTime: '2017-5-21 11:03:21'
                }
            }
        }
    }
</script>

<style scoped>
    .ds-timeLine-box {
        padding: 10px 30px;
    }
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .content{
        padding-left: 5px;
    }
    .ds-history-body table td {
        padding: 5px 0 5px 20px;
    }
    .ds-table-left {
        width: 110px;
    }
</style>


