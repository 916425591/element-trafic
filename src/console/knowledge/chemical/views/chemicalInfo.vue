<template>
  <div>
    <div class="ds-widget-box">
      <div class="ds-widget-title">
          <span class="ds-title-icon"></span>
          <h2>查询条件</h2>
      </div>
      <div class="ds-widget-cont">
        <i-form ref="queryCondition" :rules="ruleCustom" :model="queryCondition" :label-width="80">
          <Row>
              <i-col span="6">
                  <form-item label="标题: " prop="name">
                      <Input placeholder="请输入中文名." v-model="queryCondition.name" />
                  </form-item>
              </i-col>
              <i-col span="6">
                  <form-item label="建规火险:">
                     <Select style="width:200px" v-model="queryCondition.level">
                         <Option value="null" label="---请选择---">
                             <span>---请选择---</span>
                         </Option>
                      <Option value="1" label="甲">
                        <span>甲</span>
                      </Option>
                      <Option value="2" label="乙">
                        <span>乙</span>
                      </Option>
                      <Option value="3" label="丙">
                        <span>丙</span>
                      </Option>
                      <Option value="4" label="丁">
                        <span>丁</span>
                      </Option>
                      <Option value="5" label="戊">
                        <span>戊</span>
                      </Option>
                    </Select>
                  </form-item>
              </i-col>
              <i-col span="12">
                  <form-item label="" style="text-align: right;" >
                      <Button type="primary" @click="clickQueryBtn('queryCondition')">查询</Button>
                      <Button type="default" @click="clickClearBtn('queryCondition')">清空查询</Button>
                  </form-item>
              </i-col>
          </Row>
        </i-form>
      </div>
      <div class="ds-widget-title">
          <span class="ds-title-icon"></span>
          <h2>查询列表</h2>
          <div class="ds-fload-right">
            <Button type="success" @click="clickAddBtn">新增</Button>
            <Button type="warning" @click="clickEditBtn">修改</Button>
              <span v-if="record.id">
                            <Poptip placement="top-end" confirm title="您确认删除这条内容吗？" @on-ok="clickDeleteBtn">
                                <Button type="error">删除</Button>
                            </Poptip>
                        </span>
              <span v-else>
                <Button type="error" @click="clickDeleteBtn">删除</Button>
             </span>

           <!-- <Button type="error" @click="clickDeleteBtn">删除</Button>-->
          </div>
      </div>
      <div class="ds-widget-cont" :style='height'>
        <Table :columns="columns1" :data="tableData" ref="lawsTable" border highlight-row @on-row-click="clickTableRow" :data-json="tableHeight"></Table>
          <div class="ds-page-body" v-if="pageShow">
              <Page :total="totalSize" :page-size="pageSize" :current="pageNum" @on-change="clickPage"></Page>
          </div>
      </div>
    </div>

    <chemical-maintain ref="maintain" @maintain-parent="queryChemicalList"></chemical-maintain>

  </div>
</template>
<script>
import { mapActions } from 'vuex';
import chemicalMaintain from './chemicalMaintain'
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      chemicalMaintain,
      verify
  },
  data() {
      const validateName = (rule, value, callback) => {
          if (value&&!verify.name.test(value)) {
              return callback(new Error('名称不能包含特殊符号，20字符以内'));
          }else {
              callback()
          }
      };
    return {
        record:'',
        columns1: [
          {
              title: '序号',
              width: 80,
              align:'center',
              type: 'index'
          },
          {
              title: '建规火险分级',
              align:'center',
              key: 'levelName'
          },
          {
              title: '中文名',
              align:'center',
              key: 'name'
          },
          {
              title: '危险级别',
              align:'center',
              key: 'dangerType'
          },
          {
              title: '健康危害',
              align:'center',
              key: 'healthDanger'
          },
          {
              title: '毒性',
              align:'center',
              key: 'toxicity'
          },
          {
              title: '灭火方法',
              align:'center',
              key: 'extinguish'
          }
      ],
        queryCondition:{
            name:'',
            level:'null'
        },
        tableData: [],
        pageShow:false,
        treeSelected: false,
        totalSize: null,
        pageNum: 1,
        height: {
            // margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
            height: '',
            //'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
        },
        ruleCustom: {
            name:[
                { validator: validateName, trigger: 'blur' }
            ],
        }
    }
  },
    created () {
        const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setHeightContent(h)
        this.tableHeightMessage(155) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
    },
  computed: {
      //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
      pageSize() {
          return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
      },
      tableHeight() {
          this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
          return this.height.height
      },
      chemicalType (){
      return this.$store.state.chemical.nodes;
    }
  },
  methods: {
    ...mapActions([
        'changeModalStatus',// 改变弹出框状态
        'getLawsTableList',// 获取表格列表
        'setInfoWhereClick',//点击表格某一行把值赋上去
        'deleteLawsRecord',// 删除一行记录
        'setAddEditStatus',// 设置新增编辑状态
        'setQueryConditions',//设置查询参数
        'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
        'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ]),
      resetInfo(){
          this.tableData = [];
          this.record = {};
          this.$refs.maintain.resetMaintain();
          this.initPage();
      },
      initPage(){
          this.pageShow = false;
          this.totalSize = 0;
          this.pageNum = 1;
      },
      queryChemicalList() {
          //列表查询
          this.record='';
          this.$refs.maintain.chemicalInfo={};
          let info = {
              userCode: Cookies.get('userCode'),
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              title:this.queryCondition.name,
              level:this.queryCondition.level,
              queryCode:this.chemicalType.queryCode
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/chemical/queryChemicalListByPage',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      let total = response.data.data.total;
                      this.totalSize = response.data.data.total;
                      console.log(total)
                      if ( total > this.pageSize ) {
                          this.pageShow = true;
                      } else {
                          this.pageShow = false;
                      }
                      this.tableData = response.data.data.list;
                  }
              }
          ).catch(

          )
      },
      clickQueryBtn (name){// 点击查询按钮
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.pageNum=1;
                this.queryChemicalList();
                this.record='';
            } else {
                this.$Message.error('字段输入不合法');
            }
        })
    },
      clickClearBtn (name){//点击清除查询按钮
        this.$refs[name].resetFields();
        this.queryCondition.name='';
        this.queryCondition.level='null';
        this.pageNum=1;
        this.queryChemicalList();
        this.record='';
    },
      clickAddBtn (){// 点击新增按钮
      if(this.treeSelected&&this.chemicalType && this.chemicalType.id){
          this.$refs.maintain.addEditStatus='add';
          this.$refs.maintain.chemicalInfo={};
          this.$refs.maintain.chemicalInfo.level="null";
          this.$refs.maintain.$refs['chemicalInfo'].resetFields();
          this.$refs.maintain.chemicalInfo.chemicalTypeId=this.chemicalType.id;
          this.$refs.maintain.chemicalInfo.chemicalTypeName=this.chemicalType.name;
          this.$refs.maintain.modalStatus=true;
      }else{
        this.$Message.error('请选择某一化学品类型.');
      }
      
    },
      clickEditBtn (){// 点击编辑按钮
      if(this.record && this.record.id){
          this.$refs.maintain.addEditStatus='edit';//设置新增编辑状态
          this.$refs.maintain.chemicalInfo=this.record;
          this.$refs.maintain.getDetail(this.record.id);
          this.$refs.maintain.modalStatus=true;
      }else{
        this.$Message.error('请选择某一行记录.');
      }
    },
      clickTableRow (data,index){// 点击表格每一行
          this.record=data;
      },
      clickDeleteBtn () {// 点击删除按钮
          if (this.record && this.record.id) {
              this.$refs.maintain.delete(this.record.id);
          } else {
              this.$Message.error('请选择某一行记录.');
          }
      },
      clickPage (num){//点击分页
        this.pageNum=num;
        this.queryChemicalList();
    },
      setTreeSelected(param){
          this.treeSelected = param;
      }
  }
}
</script>

