<template>
  <div>
    <Modal v-model="modalStatus" :mask-closable="false" width="800"  @on-cancel="clickCancelBtn('chemicalInfo')" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <span>危险化学品知识维护</span>
      </p>
      <div>
        <Form ref="chemicalInfo" :rules="ruleCustom" :model="chemicalInfo" :label-width="90">
          <Row>
            <i-col span="12">
            <FormItem label="建规火险:" inline prop="level">
              <Select v-model="chemicalInfo.level">
                <Option v-for="item in levelData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="中文名称:" :label-width="100" prop="name">
              <i-input placeholder="请输入中文名称." style="width: 100%" v-model="chemicalInfo.name"></i-input>
            </FormItem>
            </i-col>
            <i-col span="24">
            <FormItem label="毒性:" prop="toxicity">
              <i-input placeholder="请输入毒性." style="width: 100%" v-model="chemicalInfo.toxicity"></i-input>
            </FormItem>
            </i-col>
            <i-col span="24">
            <FormItem label="健康危害:" prop="healthDanger">
              <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="chemicalInfo.healthDanger"></i-input>
            </FormItem>
            </i-col>
            <i-col span="24">
            <FormItem label="灭火方法:" prop="extinguish">
              <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="chemicalInfo.extinguish"></i-input>
            </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="clickConfirmBtn('chemicalInfo')">确定</Button>
        <Button type="ghost" @click="clickCancelBtn('chemicalInfo')">取消</Button>
      </div>
    </Modal>
   <chemical-type></chemical-type>
  </div>
</template>
<script>
import chemicalType from './chemicalType'
import { mapActions } from 'vuex'
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  components: {
      chemicalType,
      verify
  },
  data () {

      const validateLevel = (rule, value, callback) => {
          if (value==='null') {
              return callback(new Error('请选择等级'));
          } else{
              callback()
          }
      };
      const validateName = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入名字'));
          }else if(verify.name.test(value)){
              callback()
          }else {
              return callback(new Error('请输入汉字、数字、英文字母的组合'))
          }
      };
      const validateToxicity = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入毒性'));
          }else if(verify.name.test(value)){
              callback()
          }else {
              return callback(new Error('请输入汉字、数字、英文字母的组合,长度不能超过20字'))
          }
      };
      const validateHealthDanger = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入健康危害'));
          }else if(value.length<=1000){
              callback()
          }else {
              return callback(new Error('不能超过1000字'))
          }
      };
      const validateExtinguish = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入灭火方法'));
          }else if(value.length<=1000){
              callback()
          }else {
              return callback(new Error('不能超过1000字'))
          }
      };
    return {
        levelData:[
            {
                value:"null",
                label:'---请选择---'
            },
            {
                value:1,
                label:'甲'
            },
            {
                value:2,
                label:'乙'
            },
            {
                value:3,
                label:'丙'
            },
            {
                value:4,
                label:'丁'
            },
            {
                value:5,
                label:'戊'
            }
        ],
        addEditStatus:'',
        chemicalInfo:{},
        modalStatus:false,
        treeMode:false,
        ruleCustom: {
            level: [
                { required: true,validator: validateLevel, trigger: 'change' }
            ],
            name: [
                { required: true,validator: validateName, trigger: 'blur' }
            ],
            toxicity: [
                { required: true,validator: validateToxicity, trigger: 'blur' }
            ],
            healthDanger: [
                { required: true,validator: validateHealthDanger, trigger: 'blur' }
            ],
            extinguish: [
                { required: true,validator: validateExtinguish, trigger: 'blur' }
            ],
        }
    };
  },
  computed:{
    lawsFileTypeInfo (){
      return this.$store.state.laws.lawsFileTypeInfo;
    }
  },
  methods: {
    ...mapActions([
      'changeModalStatus',// 改变模态框状态
      'saveAddLaws',// 新增保存
      'saveEditLaws',// 编辑保存
      'changeTypeModalStatus',//改变类型弹出框状态
      'dateFormat',//格式化时间
      'getLawsTableList',// 获取表格列表
    ]),
      resetMaintain(){
          this. chemicalInfo={};
          this.$refs['chemicalInfo'].resetFields();
      },
      getDetail(id){
          //获取详情查询
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/chemical/getChemicalById',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      if(response.data.data){
                          this.chemicalInfo = response.data.data;
                      }
                  }
              }
          ).catch(

          )
      },
      addChemical(name) {
          //列表查询
          let info=this.chemicalInfo;
          info.userCode=Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/chemical/addChemical',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      this.$emit('maintain-parent')
                      this.$refs[name].resetFields();
                  }
              }
          ).catch(

          )
      },
      updateChemical(name) {
          //列表查询
          let info=this.chemicalInfo;
          info.userCode=Cookies.get('userCode');
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/knowledgeBank/chemical/updateChemical',
              data: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      this.$emit('maintain-parent');
                      this.$refs[name].resetFields();
                  }
              }
          ).catch(

          )
      },
    clickConfirmBtn (name){// 点击确认按钮
        this.$refs[name].validate((valid) => {
            if (valid) {
              if(this.addEditStatus === 'add'){//新增
                this.addChemical(name);
              }else if(this.addEditStatus === 'edit'){//编辑
                this.updateChemical(name);
              }else{

              }
            } else {
                this.$Message.error('请先完成必填项！');
            }
        })
    },
      delete(id){
          let info={
              userCode:Cookies.get('userCode'),
              id:id
          };
          axios({
              method: 'get',
              url: this.$store.state.userCode.url+'/knowledgeBank/chemical/deletedChemical',
              params: info
          }).then(
              response => {
                  if ( response.data.code === 200 ) {
                      this.$Message.success('操作成功!');
                      this.modalStatus = false;
                      this.$emit('maintain-parent')
                  }
              }
          ).catch(

          )
      },
    clickCancelBtn (name){// 点击取消按钮
        this.$refs[name].resetFields();
        if(this.addEditStatus==='add'){
            this.chemicalInfo={level: "null"};
        }
        this.modalStatus = false;
    },
    clickCloseModel (){ // 点击关闭弹出框
      alert(11)
    },
    choiceFileType (){//修改时弹框选择文件类型
      this.changeTypeModalStatus(true)
    },
    //格式化时间
    changeDateFormat (date){
      this.dateFormat(date);
    }
  }
}
</script>

