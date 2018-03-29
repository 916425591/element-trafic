<template>
    <div>
        <Row style="height:100%;">
            <Col span="5" style="height:100%;">
                <div class="ds-widget-box">
                    <div class="ds-widget-title">
                        <span class="ds-title-icon"></span>
                        <h2>医院</h2>
                    </div>
                    <div class="ds-search-left">
                        <Input placeholder="" icon="ios-search" @on-click="hospital_search" @on-enter="hospital_search" style="width: 210px"></Input>
                        <Button type="ghost" size="small" @click="add_hospital" style="background: #fff;"><Icon type="android-add" size="20"></Icon></Button>
                    </div>
                    <div class="ds-tree-left">
                        <Scroll :on-reach-bottom="handleReachBottom" loading-text="加载中" height="469">
                            <Tree :data="hospitalList" ref="tree"></Tree>
                        </Scroll>
                    </div>
                </div>
            </Col>
            <Col span="19">
                <hospital-info v-if="hospital_info" ref="hospitalInfo"></hospital-info>
                <hospital-add v-if="hospital_add" @hospital-save="hospital_add_show" @hospital-add-close="hospital_add_close"></hospital-add>
                <hospital-person-info></hospital-person-info>
            </Col>
        </Row>
    </div>
</template>

<script>
    import hospitalInfo from './hospital_info'
    import hospitalAdd from './hospital_add'
    import hospitalPersonInfo from './hospital_person_info'   

	export default {
		 name: 'hospital_home',
         components: {
             hospitalInfo,
             hospitalPersonInfo,
             hospitalAdd
         },
		 data () {
            return {
                page: 1,
                hospital_info: true,
                hospital_add: false,
                info: [
                    {
                        info_onload: true,
                        colspan: 1,
                        name_left: '*名称',
                        content_left: '复旦大学附属中山医院',
                        name_right: '*编码',
                        content_right: 'DW-00002'
                    },
                    {
                        info_onload: false,
                        colspan: 2,
                        name_left: '*名称',
                        content_left: '复旦大学附属中山医院'
                    },
                    {
                        info_onload: true,
                        colspan: 1,
                        name_left: '行政区域',
                        content_left: '浦东新区',
                        name_right: '上级单位',
                        content_right: '上海市浦东新区指挥中心'
                    },
                    {
                        info_onload: true,
                        colspan: 1,
                        name_left: '医院等级',
                        content_left: '浦东新区',
                        name_right: '值班电话',
                        content_right: '88669988'
                    },
                    {
                        info_onload: true,
                        colspan: 1,
                        name_left: '办公电话1',
                        content_left: '88669988',
                        name_right: '办公电话2',
                        content_right: '88669999'
                    }
                ],
                hospitalList: [
                    {
                        title: '综合医院',
                        expand: true,
                        children: [
                            {
                                title: '复旦大学附属中山医院',
                                selected: true
                            },
                            {
                                title: '上海市第一人民医院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    }
                ]
            }
        },
        created (){
            this.$http.get('http://127.0.0.1/getHospital')
            .then(function (response) {
                console.log(response.data);
                this.showHospital();
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        methods: {
            showHospital () {
                console.log(1)
            },
            add_hospital () {
                this.hospital_info = false;
                this.hospital_add = true;
            },
            hospital_add_show () {
                this.hospital_info = true;
                this.hospital_add = false;
            },
            handleReachBottom () {
                let hospitalList = this.hospitalList;
                this.page ++;
                alert(this.page)
                setTimeout(function(){
                    hospitalList.push({
                        title: '新建医院',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },{
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    },
                    {
                        title: '妇婴科',
                        expand: true,
                        children: [
                            {
                                title: '上海市第一妇婴保健院'
                            },
                            {
                                title: '上海市第三妇幼保健院'
                            }
                        ]
                    })
                },500)
            },
            hospital_add_close () {
                this.hospital_info = true;
                this.hospital_add = false;
            },
            hospital_search () {
                alert(1)
            }
        }
	}
</script>

<style scope>
    .ds-hospital-title{
        padding: 5px 0;
    }
    .ds-hospital-info .ivu-card-body{
        padding-right: 0;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
    }
    .layout-assistant{
        width: 300px;
        margin: 0 auto;
        height: inherit;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }

    .ds-hospital-icon{
        line-height: 24px;
        text-align: center;
    }
</style>