<template>
    <!-- 预案审核 -->
    <div class="ds-planEdit">
        <div class="ds-widget-box">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>查询条件</h2>
            </div>
            <Row class="ds-plan-search">
                <i-col span="6">
                    预案类型：
                    <i-input style="width: 200px;" v-model="planType" @on-focus="alertTree"></i-input>
                </i-col>
                <i-col span="6">
                    预案名称：
                    <i-input style="width: 200px;" v-model="planName"></i-input>
                </i-col>
                <i-col span="12">
                    <Button type="primary" @click="queryPlan">查询</Button>
                    <Button type="ghost" @click="clearPlan">清空查询</Button>
                </i-col>
            </Row>
        </div>
        <div class="ds-widget-box" :style='height' :data-json="tableHeight">
            <div class="ds-widget-title">
                <span class="ds-title-icon"></span>
                <h2>预案列表</h2>
            </div>
            <div class="ds-table-box">
                <Table border highlight-row :columns="planHead" :data="planData"></Table>
                <div class="ds-page-body" v-if="total > pageSize">
                    <Page ref="pages" :total="total" :page-size="pageSize" @on-change="handelClickPage" show-total class="ds-page-right"></Page>
                </div>
            </div>
        </div>
        <tree v-if="treeMode" @tree-close-Modal="treeModalClose" @tree-save-Modal="treeModalSave"></tree> 
        <Modal v-model="reviewModal" :mask-closable="false" width="600">
          <p slot="header" style="color:#f60;text-align:center">
            <span>预案审核</span>
          </p>
          <div class="planReviewModal">
            <row>
              <i-col span="4" class="text_algin_right">审核意见</i-col>
              <i-col span="20">
                <i-input v-model="description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入审核意见"></i-input>
              </i-col>
            </row>
            <row>
              <i-col span="4" class="text_algin_right">审核结果</i-col>
              <i-col span="20">
                <radio-group v-model="result">
                  <radio label="0">不通过</radio>
                  <radio label="1">通过并发布</radio>
                </radio-group>
              </i-col>
            </row>
            <row v-if="result === '1'">
              <i-col span="4" class="text_algin_right">版本号</i-col>
              <i-col span="20">
                <i-input v-model="version" placeholder="请输入版本号"></i-input>
              </i-col>
            </row>
            <row v-if="result === '1'">
              <i-col span="4" class="text_algin_right">文件号</i-col>
              <i-col span="20">
                <i-input v-model="fileCode" placeholder="请输入文件号"></i-input>
              </i-col>
            </row>
          </div>
          <div slot="footer">
              <Button type="primary" @click="savePlanReview">确定</Button>
              <Button type="ghost" @click="cancelPlanReview">取消</Button>
          </div>
        </Modal>       
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
        data () {
          return {
            reviewModal: false,
            pageNum: 1,
            total: 0,
            name: '',
            planName: '',
            planType: '',
            treeMode: false,
            planHead: [
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
                  title: '事件级别',
                  key: 'incidentLevel',
                  align: 'center'
                },
                {
                  title: '主编单位',
                  key: 'editorOrg',
                  align: 'center'
                },
                {
                  title: '状态',
                  key: 'state',
                  align: 'center'
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 150,
                  align: 'center',
                  render: (h, params) => {
                    return h('div', [
                      h('Button', {
                        props: {
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.examine(params)
                          }
                        }
                      }, '审核')
                    ])
                  }
                }
            ],
            planData: [],
            deatilsId: null,
            fileCode: '',
            version: '',
            result: '0',
            description: '',
            height: {
              height: ''
            }
          }
        },
        created() {
          const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
          this.setHeightContent(h)
          this.tableHeightMessage(110)
          this.queryPlan()
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
          },
          pageSize() {
            return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
          },
          tableHeight() {
            this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
            return this.height.height
          }
        },
        methods: {
          savePlanReview() {
            let params 
            if( this.result === '0') {
              params = {
                plan: {
                  id: this.deatilsId
                },
                description: this.description,
                result: parseInt(this.result),
              }
            } else {
              params = {
                plan: {
                  id: this.deatilsId
                },
                description: this.description,
                result: parseInt(this.result),
                version: this.version,
                fileCode: this.fileCode
              }
            }
            params.userCode = this.userCode
            const url = this.url + '/plan/planExamine/examinePlan '
            axios({
              method: 'post',
              url: url,
              data: params
            }).then(
              response => {
                if(response.data.code === 200) {
                  this.$Message.info('审核成功')
                  this.reviewModal = false
                  // this.planName = ''
                  // this.planType = ''
                  // this.$refs['pages'].currentPage = 1;
                  this.pageNum = 1
                  this.queryPlan()
                } else {
                  const message = response.data.message
                  this.$Message.error(message)
                }
              }
            ).catch(
              error => {
              }
            )
          },
          cancelPlanReview() {
            this.reviewModal = false
          },
          examine(params) {
            this.fileCode = ''
            this.version = ''
            this.result = '0'
            this.description = ''
            this.deatilsId = params.row.id
            this.reviewModal = true
          },
          ...mapActions([
            'saveDemoData',
            'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
            'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
          ]),
          treeModalSave (treeInfo,type) {
              //保存tree选择数据
              this.planType = treeInfo[0].title
              this.idStatus = treeInfo[0].id
              this.treeMode = false;
          },
          treeModalClose () {
            //关闭装备类型弹框
              this.treeMode = false;
          },
          alertTree() {
              let TreeInfo = {
                  title: '选择预案类型',
                  treeMultiple: true,
                  request: 'post',
                  queryInfo: {
                      userCode: this.userCode,
                      category: 6
                  },
                  url: this.url + '/platform/public/queryPlanTypeTree4New' //'/platform/resourceType/queryResourceTypeList4ParentNotNull'
              }
              this.saveDemoData(TreeInfo);
              this.treeMode = true;
          },
          openHistory () {
              this.$router.push({
                  name: 'planEditHistory_index'
              });
          },
          handelClickPage (num) {
              //翻页功能
              this.pageNum = num;
              //翻页数据查询
              this.queryPlan()   // 调用获取方法
          },
          clearPlan() {
              this.planName = ''
              this.planType = ''
              this.$refs['pages'].currentPage = 1;
              this.pageNum = 1
              this.queryPlan()
          },
          queryPlan () {
              //预案元素库查询
              let info = {
                  userCode: this.userCode,
                  name: this.planName,
                  pageNum: this.pageNum,
                  pageSize: this.pageSize,
                  planTypeName: this.planType
              }
              const url = this.url + '/plan/content/queryPlanBy4Audit'
              axios({
                  method: 'post',
                  url: url,
                  data: info
              }).then(
                  response => {
                      this.planData = []
                      if(response.data.code === 200) {
                          const res = response.data.data
                          this.total = parseInt(res.total)
                          res.list.forEach((v, i) => {
                              this.planData.push({
                                  id: v.id,
                                  editorOrg: v.chiefEditOrgName,
                                  planName: v.name,
                                  planType: v.planTypeName,
                                  incidentType: v.incidentTypeName,
                                  incidentLevel: v.incidentLevelName,
                                  state: v.statusName
                              })
                          })
                      }
                  }
              ).catch(
                  error => {
                      
                  }
              )
          }
        }
    }
</script>

<style scoped>
.text_algin_right {
  text-align: right;
  right: 10px;
}
.planReviewModal .ivu-row {
  margin-top: 10px;
}
</style>

