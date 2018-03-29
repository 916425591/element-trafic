<template>
  <div>
    <div class="ds-widget-box" style="margin-left:5px;">
        <div class="ds-widget-title">
            <span class="ds-title-icon"></span>
            <h2>四色预警</h2>
        </div>
        <collapse v-model="value2" accordion>
            <panel name="1">
                红色预警
                <div slot="content" class="response-card">
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>预警指标
                        <span style="float:right;margin-right:10px;">
                            <Button v-if="gradedResponseStatus[0]" type="warning" @click="editGradedResponse(0)">
                                修改
                            </Button>
                            <Button v-else type="primary" @click="saveGradedResponse(0, idStatus[0])">
                                保存
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>处置措施
                        <span style="float:right;margin-right:10px;">
                            <Button type="success" @click="addGradedResponse(0, idStatus[0])">
                                新增
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12">
                        <textarea v-model="textarea1" name="" id="" style="height:280px;width:100%" :disabled="gradedResponseStatus[0]"></textarea>
                    </i-col>
                    <i-col span="12">
                        <Table height="280" ref="currentRowTable" :columns="columns" :data="tableData"></Table>
                    </i-col>
                </div>
            </panel>
            <panel name="2">
                橙色预警
                <div slot="content" class="response-card">
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>预警指标
                        <span style="float:right;margin-right:10px;">
                            <Button v-if="gradedResponseStatus[1]" type="warning" @click="editGradedResponse(1)">
                                修改
                            </Button>
                            <Button v-else type="primary" @click="saveGradedResponse(1, idStatus[1])">
                                保存
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>处置措施
                        <span style="float:right;margin-right:10px;">
                            <Button type="success" @click="addGradedResponse(1, idStatus[1])">
                                新增
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12">
                        <textarea v-model="textarea2" name="" id="" style="height:280px;width:100%" :disabled="gradedResponseStatus[1]"></textarea>
                    </i-col>
                    <i-col span="12">
                        <Table height="280" ref="currentRowTable" :columns="columns" :data="tableData1"></Table>
                    </i-col>
                </div>
            </panel>
            <panel name="3">
                黄色预警
                <div slot="content" class="response-card">
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>预警指标
                        <span style="float:right;margin-right:10px;">
                            <Button v-if="gradedResponseStatus[2]" type="warning" @click="editGradedResponse(2)">
                                修改
                            </Button>
                            <Button v-else type="primary" @click="saveGradedResponse(2, idStatus[2])">
                                保存
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>处置措施
                        <span style="float:right;margin-right:10px;">
                            <Button type="success" @click="addGradedResponse(2, idStatus[2])">
                                新增
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12">
                        <textarea  v-model="textarea3"  name="" id="" style="height:280px;width:100%" :disabled="gradedResponseStatus[2]"></textarea>
                    </i-col>
                    <i-col span="12">
                        <Table height="280" ref="currentRowTable" :columns="columns" :data="tableData2"></Table>
                    </i-col>
                </div>
            </panel>
            <panel name="4">
                蓝色预警
                <div slot="content" class="response-card">
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>预警指标
                        <span style="float:right;margin-right:10px;">
                            <Button v-if="gradedResponseStatus[3]" type="warning" @click="editGradedResponse(3)">
                                修改
                            </Button>
                            <Button v-else type="primary" @click="saveGradedResponse(3, idStatus[3])">
                                保存
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12" class="title-bg">
                        <span class="ds-title-icon"></span>处置措施
                        <span style="float:right;margin-right:10px;">
                            <Button type="success" @click="addGradedResponse(3, idStatus[3])">
                                新增
                            </Button>
                        </span>
                    </i-col>
                    <i-col span="12">
                        <textarea v-model="textarea4" name="" id="" style="height:280px;width:100%" :disabled="gradedResponseStatus[3]"></textarea>
                    </i-col>
                    <i-col span="12">
                        <Table height="280" ref="currentRowTable" :columns="columns" :data="tableData3"></Table>
                    </i-col>
                </div>
            </panel>
        </collapse>
    </div>
    <Modal title="新增处置措施" v-model="modalStatus" :mask-closable="false" class-name="vertical-center-modal">
      <i-form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <form-item prop="disposalMeasures">
            <i-input type="textarea" v-model="formInline.disposalMeasures" :rows="8" placeholder="请输入处置措施……" style="width:480px;"></i-input>
        </form-item>
      </i-form>
      <div slot="footer">
        <Button size="large" type="primary"  @click="handleSubmit('formInline')">保存</Button>
        <Button size="large" @click="handleReset('formInline')">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            modalStatus: false,
            value2: '1',
            columns: [
                {
                    type: 'index',
                    title: '序号',
                    width: 70,
                    align: 'center'
                },
                {
                    title: '处置信息',
                    key: 'content'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Poptip', {
                                props: {
                                confirm: true,
                                title: '您确定要删除这条数据吗?',
                                transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        let vm = this
                                        vm.deleteResponse(params)
                                    }
                                }
                            }, [
                                h('Button', {
                                style: {
                                    marginRight: '5px'
                                },
                                props: {
                                    size: 'small',
                                    placement: 'top'
                                }
                                }, '删除')
                            ])
                        ]);
                    }
                }
            ],
            tableData: [],
            tableData1: [],
            tableData2: [],
            tableData3: [],
            gradedResponseStatus: [true, true, true, true],
            formInline: {
                disposalMeasures: ''
            },
            ruleInline: {
                disposalMeasures: [
                    { required: true, message: '处置措施不能为空', trigger: 'blur' }
                ]
            },
            level: '',
            textarea4: '',
            textarea3: '',
            textarea2: '',
            textarea1: '',
            idStatus: [],
            ids: ''
        }
    },
    computed: {
    },
    computed: {
        contentNodeId() {
            return this.$store.state.userCode.contentNodeId //nodeId
        },
        planIdInfo() {
            return this.$store.state.userCode.planId //planID
        },
        userCode() {
            return Cookies.get('userCode') //userCode
        },
        url() {
            return this.$store.state.userCode.url //url
        }
    },
    created() {
        this.getGradeResponse()
    },
    methods: {
        getGradeResponse() {
            const params = {
                userCode: this.userCode,
                id: this.contentNodeId,
                planId: this.planIdInfo,
                type: 2,
                level: this.level
            }
            axios({
                method: 'post',
                url: this.url + '/plan/gradeResponse/queryGradeResponse',
                data: params
            }).then(
                response => {
                    this.tableData = []
                    this.tableData1 = []
                    this.tableData2 = []
                    this.tableData3 = []
                    if ( response.data.code === 200 ) {
                        if(response.data.data) {
                            const res = response.data.data
                            for(let i = 0; i<res.length; i++) {
                                if(res[i].level === 1) {
                                    this.textarea1 = res[i].content
                                    this.idStatus[0] = res[i].id
                                    if(res[i].measures) {
                                        for(let m1 = 0; m1 < res[i].measures.length; m1++) {
                                            this.tableData.push({
                                                id: res[i].measures[m1].id,
                                                content: res[i].measures[m1].content
                                            })
                                        }
                                    } else {
                                        this.tableData = []
                                    }
                                }
                                if(res[i].level === 2) {
                                    this.textarea2 = res[i].content
                                    this.idStatus[1] = res[i].id
                                    if(res[i].measures) {
                                        for(let m2 = 0; m2 < res[i].measures.length; m2++) {
                                            this.tableData1.push({
                                                id: res[i].measures[m2].id,
                                                content: res[i].measures[m2].content
                                            })
                                        }
                                    } else {
                                        this.tableData1 = []
                                    }
                                }
                                if(res[i].level === 3) {
                                    this.textarea3 = res[i].content
                                    this.idStatus[2] = res[i].id
                                    if(res[i].measures) {
                                        for(let m3 = 0; m3 < res[i].measures.length; m3++) {
                                            this.tableData2.push({
                                                id: res[i].measures[m3].id,
                                                content: res[i].measures[m3].content
                                            })
                                        }
                                    } else {
                                        this.tableData2 = []
                                    }
                                }
                                if(res[i].level === 4) {
                                    this.textarea4 = res[i].content
                                    this.idStatus[3] = res[i].id
                                    if(res[i].measures) {
                                        for(let m4 = 0; m4 < res[i].measures.length; m4++) {
                                            this.tableData3.push({
                                                id: res[i].measures[m4].id,
                                                content: res[i].measures[m4].content
                                            })
                                        }
                                    } else {
                                        this.tableData3 = []
                                    }
                                }
                            }
                        } else {
                            this.textarea1 = ''
                            this.textarea2 = ''
                            this.textarea3 = ''
                            this.textarea4 = ''
                        }
                    }
                }
            ).catch(
                
            )
        },
        editGradedResponse(index) {
            switch (index) {
                case  0:
                    this.gradedResponseStatus = [false, true, true, true]
                    break
                case  1:
                    this.gradedResponseStatus = [true, false, true, true]
                    break
                case  2:
                    this.gradedResponseStatus = [true, true, false, true]
                    break
                case  3:
                    this.gradedResponseStatus = [true, true, true, false]
                    break
                    default:
            }
        },
        saveGradedResponse(index) {
            let content = ''
            switch (index) {
                case  0:
                    this.level = 1
                    content = this.textarea1
                    this.gradedResponseStatus = [true, true, true, true]
                    break
                case  1:
                    this.level = 2
                    content = this.textarea2
                    this.gradedResponseStatus = [true, true, true, true]
                    break
                case  2:
                    this.level = 3
                    content = this.textarea3
                    this.gradedResponseStatus = [true, true, true, true]
                    break
                case  3:
                    this.level = 4
                    content = this.textarea4
                    this.gradedResponseStatus = [true, true, true, true]
                    break
                    default:
            }
            const params = {
                level: this.level,
                content,
                userCode: this.userCode,
                node: {
                    id: this.contentNodeId
                },
                plan: {
                    id: this.planIdInfo
                },
                type: 2, //1 分级响应  2 四色预警
                id: this.idStatus[index]
            }
            let url
            if (this.idStatus[index] && this.idStatus[index] !== undefined ) {
                url = this.url + '/plan/gradeResponse/modifyGradeResponse'
            } else {
                url = this.url + '/plan/gradeResponse/addGradeResponse'
            }
            axios({
                method: 'post',
                url: url,
                data: params
            }).then(
                response => {
                    if ( response.data.code === 200 ) {
                        this.$Message.info('保存成功');
                        this.getGradeResponse()
                    }
                }
            ).catch(
                
            )
        },
        addGradedResponse(index, id) {
            switch (index) {
                case 0:
                    if(this.textarea1 === '') {
                        this.$Message.error('请填写当前预警指标')
                        return false
                    }
                break
                case 1:
                    if(this.textarea2 === '') {
                        this.$Message.error('请填写当前预警指标')
                        return false
                    }
                break
                case 2:
                    if(this.textarea3 === '') {
                        this.$Message.error('请填写当前预警指标')
                        return false
                    }
                break
                case 3:
                    if(this.textarea4 === '') {
                        this.$Message.error('请填写当前预警指标')
                        return false
                    }
                break
                default:
            }
            this.modalStatus = true
            this.ids = id
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    const content = this.formInline.disposalMeasures
                    const userCode = Cookies.get('userCode')
                    axios({
                        method: 'post',
                        url: this.url + '/plan/gradeResponse/saveResponseMeasure',
                        data: {
                            responseId: this.ids,
                            content,
                            userCode,
                            type: 2
                        }
                    }).then(
                        response => {
                            if ( response.data.code === 200 ) {
                                this.$Message.info('保存成功');
                                this.getGradeResponse()
                            }
                        }
                    ).catch(
                        
                    )
                    this.modalStatus = false
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields()
            this.modalStatus = false
        },
        deleteResponse (params) {
            const data = {
                userCode: this.userCode,
                id: params.row.id,
                type: 2
            }
            axios({
                method: 'get',
                url: this.url + '/plan/gradeResponse/removeResponseMeasure',
                params: data
            }).then(
                response => {
                    if ( response.data.code === 200 ) {
                        if(this.value2 === '1') {
                            this.tableData.splice(params.row.index, 1)
                        }
                        if(this.value2 === '2') {
                            this.tableData1.splice(params.row.index, 1)
                        }
                        if(this.value2 === '3') {
                            this.tableData2.splice(params.row.index, 1)
                        }
                        if(this.value2 === '4') {
                            this.tableData3.splice(params.row.index, 1)
                        }
                        this.getGradeResponse()
                    }
                }
            ).catch(
                
            )
        }
    }
}
</script>
<style scoped>
.ivu-collapse .ivu-collapse-item .ivu-collapse-header i, 
.ivu-collapse .ivu-collapse-item .ivu-collapse-item-active .ivu-collapse-header>i {
    float: right;
    right: 30px;
}
textarea:disabled {
    background: rgba(241, 237, 237, 0.4)!important;
}
</style>

<style>
.response-card {
    height: 280px;
    max-height: 280px;
}
.title-bg {
    background-color: #f7f7f7;
    border: 1px solid #ccc;
    line-height: 35px;
}
.ivu-collapse-content {
    padding: 0px!important;
}
.ivu-collapse-content>.ivu-collapse-content-box {
    padding: 0px;
}
</style>
