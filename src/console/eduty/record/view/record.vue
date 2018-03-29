<template>
    <!-- 值班记录 -->
    <div>
        <div class="ds-widget-box" :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <div class="ds-search-box">
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="6">
                            <form-item label="值班日期： ">
                                <DatePicker type="date" style="width: 100%;"></DatePicker>
                            </form-item>
                        </i-col>
                        <i-col span="6">
                            <form-item label="值班人员">
                                <i-input type="text" v-model="searchInfo.content"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="">
                                <Button type="primary" size="large">查询</Button>
                                <Button type="ghost" size="large">清空查询</Button>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
        </div>
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询列表</h2>
            </div>
            <div class="ds-table-box" :style='height'>
                <Table border highlight-row :columns="searchHead" :data="searchData"></Table>
                <div class="ds-page-body">
                    <Page v-if="true" total="100" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <modal v-model="detailModal" title="值班记录" :mask-closable="false" width="600" class-name="vertical-center-modal">
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>请示内容</h2>
                </div>
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="12">
                            <form-item label="请示时间： ">
                                <span>2018-01-25 21:20:34</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="请示领导： ">
                                <span>张奎发</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="请示内容： ">
                                <span></span>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div class="ds-widget-box">
                <div class="ds-widget-title">
                    <span class="ds-title-icon"></span>
                    <h2>批示内容</h2>
                </div>
                <i-form :model="searchInfo" :label-width="100">
                    <Row>
                        <i-col span="12">
                            <form-item label="请示时间： ">
                                <span>2018-01-25 21:25:34</span>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="批示结果： ">
                                <span>同意</span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="请示内容： ">
                                <span></span>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="请示内容： ">
                                <a href="#">领导批示文件</a>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" >确定</Button>
                <Button size="large" >关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        data () {
            return {
                detailModal: false,
                searchInfo: {

                },
                incidentType: [
                    {
                        value: 0,
                        label: '刑事案件'
                    }
                ],
                searchHead: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '值班时间',
                        key: 'time',
                        width: 300,
                        align: 'center'
                    },
                    {
                        title: '单位名称',
                        key: 'name',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '值班负责人',
                        key: 'leader',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '值班人员',
                        key: 'person',
                        align: 'center'
                    }
                ],
                searchData: [
                    {
                        time: '2018-01-20 08:30 至 2018-01-20 16:30',
                        name: '金海市公安局',
                        leader: '赵军',
                        person: '周斌、方胜武'
                    },
                    {
                        time: '2018-01-20 08:30 至 2018-01-20 16:30',
                        name: '金海市公安局',
                        leader: '赵军',
                        person: '周斌、方胜武'
                    },
                    {
                        time: '2018-01-20 08:30 至 2018-01-20 16:30',
                        name: '金海市公安局',
                        leader: '赵军',
                        person: '周斌、方胜武'
                    },
                    {
                        time: '2018-01-20 08:30 至 2018-01-20 16:30',
                        name: '金海市公安局',
                        leader: '赵军',
                        person: '周斌、方胜武'
                    },
                    {
                        time: '2018-01-20 08:30 至 2018-01-20 16:30',
                        name: '金海市公安局',
                        leader: '赵军',
                        person: '周斌、方胜武'
                    },
                    {
                        time: '2018-01-20 08:30 至 2018-01-20 16:30',
                        name: '金海市公安局',
                        leader: '赵军',
                        person: '周斌、方胜武'
                    },
                    {
                        time: '2018-01-20 08:30 至 2018-01-20 16:30',
                        name: '金海市公安局',
                        leader: '赵军',
                        person: '周斌、方胜武'
                    }
                ],
                height: {
                    height: '',
                    'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
                }
            }
        },
        computed: {
            pageSize() {
                const res = this.$store.state.heightTable.tableInfo.numberBranches
                const numberBranches = parseInt(res)
                return numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                const res = this.$store.state.heightTable.tableInfo.tableHeight
                this.height.height = parseInt(res) - 20 + 'px' /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(154);

        },
        methods: {
            ...mapActions([
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            openModal () {
                this.detailModal = true;
            }
        }
    }
</script>

<style scoped>

</style>


