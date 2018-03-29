<template>
    <div class="ds-widget-box ds-box" :style='height' :data-json="tableHeight">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>防护目标类型信息</h2>
            <Row class="ds-fload-right">
                <i-col span="24" class="ds-button-box">
                    <Button type="warning" @click="change_edit" v-if="ds_edit">修改</Button>
                    <Button type="primary" @click="change_save('formCustom')" v-else>保存</Button>
                    <Button type="error" v-if="ds_edit" @click="deleteType">删除</Button>
                    <Button type="ghost" v-else @click="close_team">取消</Button>
                    <Modal v-model="delate_info" title="确认删除" width="400">
                        <p slot="header" style="color:#f60;text-align:center">
                            确认删除
                        </p>
                        <div style="text-align:center">
                            是否删除此条防护目标信息？
                        </div>
                        <div slot="footer" class="ds-text-center">
                            <Button size="large" type="primary" @click="delete_equipment">确定</Button>
                            <Button size="large" type="ghost" @click="close_delete_model">取消</Button>
                        </div>
                    </Modal>
                </i-col>
            </Row>
        </div>
        <div class="ds-table-box">
            <Form ref="formCustom" :model="formItem" :rules="ruleCustom" :label-width="110">
                <FormItem label="上级类型:" >
                    <i-input v-model="formItem.parentName" style="width:300px;"  @on-focus="alertTree" :disabled="ds_edit"></i-input>
                </FormItem>
                <FormItem label="防护目标名称:" prop="name">
                    <i-input v-model="formItem.name" style="width:300px;"  :disabled="ds_edit"></i-input>
                </FormItem>
                <FormItem label="防护目标编码:" prop="code">
                    <i-input v-model="formItem.code" style="width:300px;" :disabled="ds_edit"></i-input>
                </FormItem>
                <FormItem label="有效性:">
                    <i-switch v-model="formItem.switchStatus" :disabled="ds_edit" size="large">
                        <span slot="open">有效</span>
                        <span slot="close">无效</span>
                    </i-switch>
                </FormItem>
            </Form>
        </div>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex'
    import tree from '@/common/components/treeModal/tree'
    import Cookies from 'js-cookie';

    export default {
        components: {
            tree
        },
        props: ['expertType', 'name', 'code', 'id', 'parentName', 'parentId', 'switchStatus', 'children', 'queryCode'],
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入名称'));
                } else {
                    callback();
                }
            };
            const validateCode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入编码'));
                } else {
                    callback();
                }
            };
            return {
                formItem: {
                    expertType: this.expertType,
                    name: this.name,
                    code: this.code,
                    id: this.id,
                    parentName: this.parentName,
                    parentId: this.parentId,
                    switchStatus: this.switchStatus,
                    children: this.children,
                    queryCode: this.queryCode
                },
                treeMode: false,
                delate_info: false,
                close_show: false,
                resourcesInfo: {
                    parent: {
                        name: '',
                        id: null
                    },
                    name: '',
                    code: '',
                    valid: null
                },
                resType: [

                ],
                idStatus: null,
                height: {
                    height: ''
                },
                editModal: false,
                ruleCustom: {
                    name: [
                        { required: true, validator: validateName, trigger: 'blur' }
                    ],
                    code: [
                        { required: true, validator: validateCode, trigger: 'blur' }
                    ]
                }
            };
        },
        computed: {
            contentNodeId() {
                return this.$store.state.userCode.contentNodeId //nodeId
            },
            userCode() {
                return Cookies.get('userCode') //userCode
            },
            urlStatus() {
                return this.$store.state.userCode.url //url
            },
            ds_edit() {
                return this.$store.state.types.editStatus
            },
            pageSize() {
                return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
            },
            tableHeight() {
                this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
                return this.height.height
            }
        },
        created() {
            const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            this.setHeightContent(h)
            this.tableHeightMessage(30)
        },
        methods: {
            ...mapActions([
                'saveDemoData',
                'saveTypesType',
                'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
                'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
            ]),
            url(url2) {
                const url = this.urlStatus + url2
                return url
            },
            getTreeData() {
                this.url('/plan/content/queryResourceType')
            },
            treeModalSave (treeInfo,type) {
                this.formItem.parentName = treeInfo[0].title
                this.formItem.expertType = treeInfo[0].title
                this.formItem.idStatus = treeInfo[0].id
                this.formItem.parentId = treeInfo[0].id
                //保存tree选择数据
                this.treeMode = false;
            },
            treeModalClose () {
                //关闭装备类型弹框
                this.treeMode = false;
            },
            alertTree() {
                let TreeInfo = {
                    title: '选择防护目标类型',
                    treeMultiple: true,
                    request: 'post',
                    queryInfo: {
                        userCode: Cookies.get('userCode'),
                        pageSize: 10000
                    },
                    url: this.url('/platform/public/queryFenseTargetType4New')
                }
                if (this.editModal) {
                    TreeInfo.queryInfo.excludeQueryCode = this.queryCode;
                }
                this.saveDemoData(TreeInfo);
                this.treeMode = true;
            },
            change_edit () {
                if (this.formItem.id) {
                    this.saveTypesType(false)
                    this.editModal = true;
                } else {
                    this.$Message.error('请选择防护目标类型')
                }
            },
            change_save (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let resTypeInfo = {
                            userCode: Cookies.get('userCode'),
                            valid: this.formItem.switchStatus,
                            name: this.formItem.name,
                            id: this.formItem.id,
                            parentId: this.formItem.parentId,
                            code: this.formItem.code
                        }
                        axios({
                            method: 'post',
                            url: this.url('/platform/fenseTargetType/addFenseTargetType'),
                            data: resTypeInfo
                        }).then(
                            response => {
                                if ( response.data.code === 200 ) {
                                    this.$Message.info('操作成功');
                                    this.saveTypesType(true)
                                    this.$emit('getTreeDatas');
                                }
                            }
                        ).catch(
                            error => {
                            }
                        );
                    } else {
                        this.$Message.error('请添加必填项！');
                    }
                });
            },
            deleteType () {
                if (this.formItem.id) {
                    if (this.formItem.children.length > 0){
                        this.$Message.error('有下级子类型，请先删除下级节点');
                        return;
                    }
                    this.delate_info = true;
                } else {
                    this.$Message.error('请选择防护目标类型');
                }
            },
            close_delete_model () {
                this.delate_info = false;
            },
            delete_equipment () {
                //删除资源
                let resourceDelete = {
                    userCode: Cookies.get('userCode'),
                    id: this.formItem.id
                };
                axios({
                    method: 'get',
                    url: this.url('/platform/fenseTargetType/deletedFenseTargetType'),
                    params: resourceDelete
                }).then(
                    response => {
                        if ( response.data.code === 200 ) {
                            this.delate_info = false;
                            this.formItem.switchStatus = true
                            this.formItem.name = ''
                            this.formItem.id = null
                            this.formItem.parentId = null
                            this.formItem.code = ''
                            this.saveTypesType(true)
                            this.$Message.info('删除成功');
                            this.$emit('getTreeDatas');
                            this.close_team();
                        } else {
                            this.$Message.error(response.data.message);
                            this.delate_info = false;
                        }
                    }
                ).catch(
                    error => {
                    }
                );
            },
            close_team () {
                this.$refs['formCustom'].resetFields();
                this.formItem.name = ''
                this.formItem.id = null
                this.formItem.parentId = null
                this.formItem.code = ''
                this.formItem.parentName =  ''
                this.saveTypesType(true)
            }
        }
    }
</script>

<style scoped>

</style>
