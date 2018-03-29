<template>
  <div class="ds-hospital-table ds-widget-box ds-resources-box">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>队伍信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24">
                    <Button type="primary" @click="resources_save('formCustom')" v-if="ds_save">保存</Button>
                    <Button type="ghost" @click="resources_close">取消</Button>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-cont" :style='height' :data-json="tableHeight">
            <i-form ref="formCustom" :model="resources_info" :rules="ruleCustom" :label-width="100">
                <Row>
                    <i-col span="24">
                        <form-item label="资源类型:">
                            <span v-if="ds_edit"></span>
                            <span v-if="ds_save">
                                {{ parentInfo.parentName }}
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <form-item label="名称:" prop="name">
                            <span v-if="ds_edit">{{ resources_info.name }}</span>
                            <span v-if="ds_save">
                                <i-input v-model="resources_info.name" style="width:300px;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <form-item label="编码:">
                            <span v-if="ds_edit">{{ resources_info.code }}</span>
                            <span v-if="ds_save">
                                <i-input v-model="resources_info.code" style="width:300px;"></i-input>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <form-item label="有效性:">
                            <span v-if="ds_edit">{{ resources_info.parent_type }}</span>
                            <span v-if="ds_save">
                                <i-switch v-model="resources_info.valid" size="large">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                            </span>
                        </form-item>
                    </i-col>
                </Row>
            </i-form>
            <!--
            <table class="ds-table">
                <tbody>
                    <tr>
                        <td>
                            <Row>
                                <i-col span="2">资源类型:</i-col>
                                <i-col span="22">
                                    <span v-if="ds_edit"></span>
                                    <span v-if="ds_save">
                                        {{ parentInfo.parentName }}
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Row>
                                <form-item label="名称:" prop="name">
                                    <span v-if="ds_edit">{{ resources_info.name }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="resources_info.name" style="width:300px;"></i-input>
                                    </span>
                                </i-col>
                                </form-item>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Row>
                                <form-item label="编码:" prop="code">
                                    <span v-if="ds_edit">{{ resources_info.code }}</span>
                                    <span v-if="ds_save">
                                        <i-input v-model="resources_info.code" style="width:300px;"></i-input>
                                    </span>
                                </form-item>
                            </Row>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Row>
                                <i-col span="2">有效性:</i-col>
                                <i-col span="22">
                                    <span v-if="ds_edit">{{ resources_info.parent_type }}</span>
                                    <span v-if="ds_save">
                                        <i-switch v-model="resources_info.valid" @on-change="" size="large">
                                            <span slot="open">开启</span>
                                            <span slot="close">关闭</span>
                                        </i-switch>
                                    </span>
                                </i-col>
                            </Row>
                        </td>
                    </tr>
                </tbody>
            </table>
            -->
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';

    export default {
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入资源类型名称'));
                } else {
                    callback()
                }
            };
            return {
                height: {
                    height: ''
                },
                ds_edit: false,
                ds_save: true,
                showMore: true,
                showLess: false,
                parentInfo: {},
                resources_info: {
                    'id': null,
					'name':"",//资源名称
					'code':"",//资源编码
					'resType':{id: null,name:''},//资源类型
					'valid': true,//有效性
                },
                resType: [
                    {
                        value: 1,
                        label: '专家'
                    },
                    {
                        value: 2,
                        label: '应急避险场所'
                    },
                    {
                        value: 3,
                        label: '处置队伍'
                    },
                    {
                        value: 4,
                        label: '应急装备'
                    }
                ],
                ruleCustom: {
                    name: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            userCode() {
                return Cookies.get('userCode') //userCode
                },
            url() {
                return this.$store.state.userCode.url //url
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight
                return this.height.height
            }
        },
        created () {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(340)
        },
        methods: {
            ...mapActions([
                'setHeightContent',
                'tableHeightMessage'
            ]),
            show_more () {
                this.showMore = false;
                this.showLess = true;
            },
            show_less () {
                this.showMore = true;
                this.showLess = false;
            },
            setParentId (parentInfo) {
                this.parentInfo = parentInfo;
            },
            resources_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const that = this;
                        let resources = {
                            name: this.resources_info.name,
                            code: this.resources_info.code,
                            valid: this.resources_info.valid,
                            parent: {
                                id: this.parentInfo.parentId
                            },
                            userCode: this.userCode
                        };
                        axios({
                            method: 'post',
                            url: this.url + '/platform/resourceType/addResourceType',
                            data: resources
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.info('新增成功')
                                    that.$emit('resources-save',response.data.data);
                                }
                            }
                        ).catch(
                            error => {
                                this.$Message.error(error)
                            }
                        );
                    } else {
                        this.$Message.error('操作失败！');
                    }
                }) 
            },
            resources_close () {
                this.$refs['formCustom'].resetFields();
                this.$refs['formCustom'].resetFields();
                this.$emit('resources-add-close');
            }
        }
    };
</script>

<style>

</style>

