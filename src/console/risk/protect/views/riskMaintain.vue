<template>
  <div>
    <Modal v-model="riskModalStatus" :mask-closable="false" width="800" on-visible-change="clickCloseModel">
      <p slot="header" style="color:#f60;text-align:center">
        <span>防护目标维护</span>
      </p>
      <div>
        <Form :model="riskInfo" :label-width="80">
          <Row>
            <i-col span="12">
            <FormItem label="目标类型:">
              <i-input placeholder="请选择目标类型." style="width: 100%" v-model="riskInfo.riskTypeName" readonly icon="edit" @on-click="choiceFileType"></i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="目标名称:">
              <i-input placeholder="请输入目标名称." style="width: 100%" v-model="riskInfo.name"></i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="重要级别:">
              <Select style="width:100%" v-model="queryRiskCondition.level">
                <Option value="1" label="一级">
                  <span>一级</span>
                </Option>
                <Option value="2" label="二级">
                  <span>二级</span>
                </Option>
                <Option value="3" label="三级">
                  <span>三级</span>
                </Option>
              </Select>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="责任人:">
              <Select style="width:100%" v-model="queryRiskCondition.dutyPersonId">
                <Option value="1" label="张三">
                  <span>张三</span>
                </Option>
                <Option value="2" label="李四">
                  <span>李四</span>
                </Option>
                <Option value="3" label="王五">
                  <span>王五</span>
                </Option>
              </Select>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="周期性:">
              <RadioGroup v-model="riskInfo.cycleType">
                <Radio label="1">周期性</Radio>
                <Radio label="2">长期性</Radio>
                <Radio label="3">临时性</Radio>
              </RadioGroup>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem label="周期时间:">
              <Row>
                <i-col span="12">
                <DatePicker type="date" placeholder="开始时间" v-model="cycleStartTime"></DatePicker>
                </i-col>
                <i-col span="12">
                <DatePicker type="date" placeholder="结束时间" v-model="cycleEndTime"></DatePicker>
                </i-col>
              </Row>
            </FormItem>
            </i-col>

            <i-col span="24">
            <FormItem label="地理位置:">
              <i-input placeholder="请输入地理位置." style="width: 100%" v-model="riskInfo.address"></i-input>
            </FormItem>
            </i-col>
            <i-col span="24">
            <FormItem label="关键特征:">
              <i-input  type="textarea" :autosize="{minRows: 5,maxRows: 10}" v-model="riskInfo.keyWords"></i-input>
            </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" type="primary" @click="clickConfirmBtn">确定</Button>
        <Button size="large" type="ghost" @click="clickCancelBtn">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    import { mapActions } from 'vuex'
    import Cookies from 'js-cookie';
    export default {
        components: {
        },
        data () {
            return {

            };
        },
        computed:{
            riskModalStatus() {
                return this.$store.state.risk.riskAddModalStatus
            },
            riskInfo() {
                return this.$store.state.risk.riskInfo
            },
            addEditStatus() {
                return this.$store.state.risk.addEditStatus
            },
            returnCode() {
                return this.$store.state.risk.returnCode
            },
            queryRiskCondition (){
                return this.$store.state.risk.queryRiskConditions;
            },
            riskFileTypeInfo (){
                return this.$store.state.risk.riskFileTypeInfo;
            }
        },
        methods: {
            ...mapActions([
                'changeModalStatus',// 改变模态框状态
                'saveAddRisk',// 新增保存
                'saveEditRisk',// 编辑保存
                'changeTypeModalStatus',//改变类型弹出框状态
                'dateFormat',//格式化时间
                'getRiskTableList',// 获取表格列表
            ]),
            async clickConfirmBtn (){// 点击确认按钮
                if(this.addEditStatus === 'add'){//新增
                    this.saveAddRisk(this.riskInfo);
                    if(this.returnCode === '200'){
                        await this.getRiskTableList({
                            'userCode':Cookies.get('userCode'),
                            'pageNum':1,
                            'pageSize':10,
                            'riskTypeId':this.riskFileTypeInfo.id,
                            'name':this.queryRiskCondition.name,
                            'level':this.queryRiskCondition.level
                        })
                    }
                    this.changeTypeModalStatus(false);
                }else if(this.addEditStatus === 'edit'){//编辑
                    this.saveEditRisk(this.riskInfo);
                }else{

                }
            },
            clickCancelBtn (){// 点击取消按钮
                this.changeModalStatus(false)
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

