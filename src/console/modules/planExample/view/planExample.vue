<template>
    <!-- 预案实例 -->
    <div class="ds-planExample">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <Row class="ds-plan-search">
                <Col span="6">
                    预案类型：
                    <Select style="width: 200px;">
                        <Option v-for="item in incidentType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="6">
                    预案名称：
                    <Input style="width: 200px;"></Input>
                </Col>
                <Col span="6">
                    事件类型：
                    <Input style="width: 200px;"></Input>
                </Col>
                <Col span="6">
                    <Button type="primary">查询</Button>
                    <Button type="ghost">清空查询</Button>
                </Col>
            </Row>
        </div>
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
                <div class="ds-fload-right">
                    <Button type="ghost" style="background: #fff;">详情</Button>
                </div>
            </div>
            <div>
                <Table border :columns="exampleHead" :data="exampleData"></Table>
                <div class="ds-page-body">
                    <Page v-if="true" :total="100" :page-size="10" @on-change="" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                incidentType: [
                    {
                        value: 1,
                        label: '应急预案'
                    },
                    {
                        value: 2,
                        label: '救援预案'
                    }
                ],
                exampleHead: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '预案名称',
                        key: 'planName',
                        align: 'center'
                    },
                    {
                        title: '预案类型',
                        key: 'planType',
                        align: 'center'
                    },
                    {
                        title: '事件类型',
                        key: 'incidentType',
                        align: 'center'
                    },
                    {
                        title: '启动时间',
                        key: 'starTime',
                        align: 'center'
                    },
                    {
                        title: '结束时间',
                        key: 'endTime',
                        align: 'center'
                    },
                    {
                        title: '相关事件',
                        key: 'aboutIncident',
                        align: 'center'
                    }
                ],
                exampleData: [
                    {
                        planName: '东山山体滑坡重大灾害预案',
                        planType: '专项预案',
                        incidentType: '自安然灾害',
                        starTime: '2015-07-25',
                        endTime: '2017-08-12',
                        aboutIncident: '7.25东山山体滑坡事件'
                    },
                    {
                        planName: '东山山体滑坡重大灾害预案',
                        planType: '专项预案',
                        incidentType: '自安然灾害',
                        starTime: '2015-07-25',
                        endTime: '2017-08-12',
                        aboutIncident: '7.25东山山体滑坡事件'
                    },
                    {
                        planName: '东山山体滑坡重大灾害预案',
                        planType: '专项预案',
                        incidentType: '自安然灾害',
                        starTime: '2015-07-25',
                        endTime: '2017-08-12',
                        aboutIncident: '7.25东山山体滑坡事件'
                    },
                    {
                        planName: '东山山体滑坡重大灾害预案',
                        planType: '专项预案',
                        incidentType: '自安然灾害',
                        starTime: '2015-07-25',
                        endTime: '2017-08-12',
                        aboutIncident: '7.25东山山体滑坡事件'
                    },
                    {
                        planName: '东山山体滑坡重大灾害预案',
                        planType: '专项预案',
                        incidentType: '自安然灾害',
                        starTime: '2015-07-25',
                        endTime: '2017-08-12',
                        aboutIncident: '7.25东山山体滑坡事件'
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .ds-widget-box {
        background: #ffffff;
    }
</style>

