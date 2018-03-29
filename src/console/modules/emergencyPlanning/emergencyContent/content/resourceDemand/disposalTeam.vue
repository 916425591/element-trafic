<template>
  <div>
    <!-- 处置队伍 -->
    <div class="ds-widget-box" :style="height" :data-json="tableHeight">
      <div class="ds-widget-title">
        <span class="ds-title-icon"></span>
        <h2>处置队伍</h2>
        <div class="ds-fload-right">
          <Button type="success" @click="openSettingModal">
            新增
          </Button>
        </div>
      </div>
      <div class="ds-table-box">
        <Table border highlight-row ref="currentRowTable" :columns="columns" :data="tableData"></Table>
        <div class="ds-page-body" v-if="totalSize > pageSize">
            <Page :total="totalSize" :page-size="pageSize" @on-change="slectPage" show-total class="ds-page-right"></Page>
        </div>
      </div>
    </div>
    <modal v-model="eqModal" :title="title" :mask-closable="false" width="600" class-name="vertical-center-modal">
      <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <Row>
          <i-col span="12">
            <form-item label="队伍类型" prop="resType">
              <i-input type="text" v-model="formCustom.resTypeName" @on-focus="selectTeamType"></i-input>
            </form-item>
          </i-col>
          <i-col span="12">
            <form-item label="人员数量" prop="counts">
              <i-input type="text" v-model="formCustom.count"></i-input>
            </form-item>
          </i-col>
          <i-col span="24">
            <form-item label="队伍名称" prop="name">
              <i-input type="text" v-model="formCustom.name" placeholder="请输入队伍名称"></i-input>
            </form-item>
          </i-col>
          <i-col span="24">
            <form-item label="队伍职能" prop="functions">
              <i-input v-model="formCustom.function" type="textarea" placeholder="请输入队伍职能"></i-input>
            </form-item>
          </i-col>
          <i-col span="24">
            <form-item label="携带装备" prop="equipment">
              <i-input v-model="formCustom.equipment" type="textarea" placeholder="请输入携带装备"></i-input>
            </form-item>
          </i-col>
        </Row>
      </i-form>
      <div slot="footer">
        <Button type="primary"  @click="handleSubmit('formCustom')">保存</Button>
        <Button  @click="handleReset('formCustom')">取消</Button>
      </div>
    </modal>
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
  data () {
    // const validateResType = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入队伍类型'));
    //   } else {
    //     callback()
    //   }
    // };
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入队伍名称'));
      } else {
        callback()
      }
    };
    const validateCounts = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入人员数量'));
      } else {
        callback()
      }
    };
    const validateEquipment = (rule, value, callback) => {
      console.log(value, 'tee')
      if (!value) {
        return callback(new Error('请输入计量单位'));
      } else {
        callback()
      }
    };
    const validateFunctions = (rule, value, callback) => {
      console.log(value, '请输入装备职能')
      if (!value) {
        return callback(new Error('请输入装备职能'));
      } else {
        callback()
      }
    };
    return {
      height: {
        height: '',
        'margin-left': '5px'
      },
      title: '新增处置队伍信息',
      pageShow: false,
      totalSize: null,
      pageNum: 1,
      treeMode: false,
      eqModal: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '队伍类型',
          key: 'resTypeName',
          align: 'center'
        },
        {
          title: '队伍名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '人员数量',
          key: 'count',
          align: 'center'
        },
        {
          title: '职能',
          key: 'function',
          align: 'center'
        },
        {
          title: '装备情况',
          key: 'equipment',
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
                  // type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.index)
                  }
                }
              }, '编辑'),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '您确定要删除这条数据吗?',
                  transfer: true
                },
                on: {
                  'on-ok': () => {
                    let vm = this
                    // vm.tableData.splice(params.index, 1)
                    vm.deleteTeam(params)
                  }
                }
              }, [
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  props: {
                    size: 'small',
                    placement: 'top',
                    // type: 'error'
                  }
                }, '删除')
              ])
            ]);
          }
        }
      ],
      tableData: [],
      formCustom: {
        resTypeId: null,
        resTypeName: '',
        mode: '',
        count: '',
        unitName: '',
        unitId: '',
        function: ''
      },
      ruleCustom: {
        // resType: [
        //   { validator: validateResType, trigger: 'blur' }
        // ],
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        equipment: [
          { validator: validateEquipment, trigger: 'blur' }
        ],
        count: [
          { type: 'number',validator: validateCounts, trigger: 'blur' }
        ],
        function: [
          { validator: validateFunctions, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.setHeightContent(h)
    this.tableHeightMessage(75)
    this.teamQuery();
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
    ...mapActions([
      'saveDemoData',
      'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
      'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ]),
    teamQuery () {
      //队伍列表查询
      let info = {
        userCode: this.userCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        planId: this.planIdInfo
      }
      axios({
          method: 'post',
          url: this.url + '/plan/team/queryPlanResTeam',
          data: info
      }).then(
          response => {
            if ( response.data.code === 200 ) {
              let total = response.data.data.total;
              this.totalSize = response.data.data.total;
              if ( total > this.pageSize ) {
                this.pageShow = true;
              } else {
                this.pageShow = false;
              }
              this.tableData = response.data.data.list;
            }
          }
      ).catch(
          
      );
    },
    treeModalClose () {
      this.treeMode = false;
    },
    openSettingModal () {
      this.title = '新增处置队伍信息'
      this.formCustom = {
        id: '',
        resTypeId: '',
        resTypeName: '',
        mode: '',
        count: '',
        unitName: '',
        unitId: '',
        function: ''
      }
      this.eqModal = true;
    },
    edit (index) {
      
      //打开编辑弹框
      this.tableIndex = index
      this.title = '编辑处置队伍信息'

      //计量单位列表查询
      this.queryUnit();

      //装备详情查询
      let teamId = this.tableData[index].id;
      const info = {
        userCode: this.userCode,
        id: teamId
      }
      axios({
          method: 'get',
          url: this.url + '/plan/team/getPlanResTeam',
          params: info
      }).then(
          response => {
            if ( response.data.code === 200 ) {
              this.formCustom = response.data.data;
            }
          }
      ).catch(
          
      );
      this.eqModal = true;
    },
    deleteTeam (data) {
      const index = data.index;
      const id = data.row.id;
      //删除队伍信息
      const info = {
        userCode: this.userCode,
        id: id
      }
      axios({
          method: 'get',
          url: this.url + '/plan/team/removePlanResTeam',
          params: info
      }).then(
          response => {
            if ( response.data.code === 200 ) {
              this.teamQuery();
            }
          }
      ).catch(
          
      );
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const info = this.formCustom;
          info.userCode = Cookies.get('userCode');
          info.plan = { id: this.planIdInfo }
          info.node = { id: this.contentNodeId }
          let url = this.url + '/plan/team/savePlanResTeam';
          //提交估算信息
          axios({
              method: 'post',
              url: url,
              data: info
          }).then(
              response => {
                if ( response.data.code === 200 ) {
                  this.$Message.success('操作成功!');
                  //重新查询列表
                  this.teamQuery();
                  this.eqModal = false;
                }
              }
          ).catch(
              
          );
        } else {
          this.$Message.error('操作失败！');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
      this.eqModal = false
    },
    selectTeamType () {
      //打开查询车辆类型弹窗
      let TreeInfo = {
        title: '物资类型',
        treeMultiple: false,
        additional: 'teamType',
        request: 'post',
        queryInfo: {
          userCode: this.userCode,
          category: 4
        },
        url: this.url + '/platform/public/queryResourceTypeTree4New'
      }
      this.saveDemoData(TreeInfo);
      this.treeMode = true;
    },
    treeModalSave (treeInfo,type) {
      //保存tree选择数据
      if ( type === 'teamType') {
        this.formCustom.resTypeId = treeInfo[0].id;
        this.formCustom.resTypeName = treeInfo[0].title;
        this.treeMode = false;
      }
    },
    queryUnit () {
      //计量单位列表查询
      let unitInfo = {
        userCode: this.userCode,
        type: 'RESOURCE_UNIT'
      }
      axios({
          method: 'get',
          url: this.url + '/platform/dictionary/getDictionaryByType',
          params: unitInfo
      }).then(
          response => {
            if ( response.data.code === 200 ) {
              const list = response.data.data;
              const newList = [];
              for ( let i=0;i<list.length;i++ ) {
                newList.push({
                  value: parseInt(list[i].key),
                  label: list[i].value
                })
              }
              this.unit = newList;
            }
          }
      ).catch(
          
      )
    },
    slectPage (index) {
      //分页查询
      this.pageNum = index;
      this.teamQuery();
    }
  },
  mounted () {
  },
  destroyed () {
  }
};
</script>

<style scoped>
.ivu-input-type textarea {
  height: 80px!important;
}
</style>
