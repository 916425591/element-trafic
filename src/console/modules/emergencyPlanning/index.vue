<template>
  <div>
    <div class="wrap" :data-json="showMes">
      <ul class="step-case" id="step">
        <li :class="arr[0]" @click="handelSearchEmergency"><span>预案编制查询</span><b class="b-l"></b></li>		
        <!-- <li :class="arr[1]" @click="handelInfoEmergency"><span>基本信息</span><b class="b-1"></b><b class="b-2"></b></li>		 -->
        <li :class="arr[1]" class="" @click="handelContentEmergency"><span>预案内容</span><b class="b-1"></b><b class="b-2"></b></li>
        <li :class="arr[2]" @click="handelFlowEmergency"><span>处置流程</span><b class="b-1"></b><b class="b-2"></b></li>		
        <li :class="arr[3]" @click="handelReleaseEmergency"><span>提交审核</span><b class="b-1"></b><b class="b-2"></b><b class="b-r"></b></li>
      </ul>
    </div>
    <div style="margin-top:5px;">
      <div v-if="showMes === 1">
        <searchEmergency></searchEmergency>
      </div>
      <div v-else-if="showMes === 2">
        <basicInformation></basicInformation>
      </div>
      <div v-else-if="showMes === 3">
        <emergencyContent></emergencyContent>
      </div>
      <div v-else>
        <disposalProcess></disposalProcess>
      </div>
      <modal v-model="modal" :mask-closable="false" width="200" class-name="vertical-center-modal">
        <p>是否确认提交当前信息</p>
        <div slot="footer">
          <i-button type="primary" @click="submmitPlan">提交</i-button>
          <i-button @click="cancelPlan">取消</i-button>  
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import tinymce from 'tinymce';
import searchEmergency from './searchEmergency/searchEmergency'
import emergencyContent from './emergencyContent/index'
import basicInformation from './basicInformation/view/basicInformation'
import disposalProcess from './disposalProcess/views/disposalProcess'
import axios from 'axios'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie';
export default {
    components: {
        searchEmergency,
        emergencyContent,
        basicInformation,
        disposalProcess
    },
    data () {
      return {
        modal: false
      }
    },
    computed: {
      showMes() {
        return this.$store.state.planContent.showMes
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
      arr() {
        return this.$store.state.processArrow.processArrowMenu
      },
      status() {
        return this.$store.state.processArrow.status
      }
    },
    created() {
    },
    methods: {
      ...mapActions([
        'setProcessArrowStatus',
        'setSearchInformation',
        'setProcessArrowMenu',
        'setStatus',//根据ID判断是否提交过
        'clearProcessArrowData',
        'setShowMessage'
      ]),
      handelClick(event) {
        const step = document.getElementById("step")
        const li = step.getElementsByTagName("li");		
        for(let i = 0;i<li.length;i++){			
          li[i].index = i;				
          this.liclick(event, li)
        }
      },
      liclick(event, li){
        const i = this.index;					
        for(let j = 0;j<i;j++){						
          li[j].className = "s-finish";					
        }					
        for(let j = li.length;j>i;){						
          li[--j].className = ''						
          if(j==i+1){							
            li[j].className = "s-cur-next";						
          }					
        }					
        this.className = "s-cur";	
      },
      handelSearchEmergency() {
          this.setShowMessage(1)
      },
      handelInfoEmergency() {
        if(this.status === 1) {
          this.$Message.error('当前预案已经提交,请重新选择预案信息!');
          return false
        }
        if(!this.planIdInfo){
          this.$Message.error('请选择预案!');
        } else {
          this.setShowMessage(2)
        }
      },
      handelContentEmergency() {
        if(this.status === 1) {
          this.$Message.error('当前预案已经提交,请重新选择预案信息!');
          return false
        }
        if(!this.planIdInfo){
          this.$Message.error('请选择预案!');
        } else {
          this.setShowMessage(3)
        }
      },
      handelFlowEmergency() {
        this.clearProcessArrowData('clear')
        if(this.status === 1) {
          this.$Message.error('当前预案已经提交,请重新选择预案信息!');
          return false
        }
        if(!this.planIdInfo){
          this.$Message.error('请选择预案!');
        } else {
          this.setShowMessage(4)
        }
      },
      handelReleaseEmergency() {
        if(this.status === 1) {
          this.$Message.error('当前预案已提交，请重新选择预案信息!')
        } else {
          if (this.planIdInfo) {
            this.modal = true
          } else {
            this.$Message.error('请选择需要发布的预案!');
          }
        }
      },
      cancelPlan() {
        this.modal = false
      },
      submmitPlan() {
        if(this.status === this.planIdInfo) {
          this.$Message.error('此预案已经提交,请勿重复提交')
        } else {
          const data = {
            plan: {
              id: this.planIdInfo
            },
            userCode: this.userCode
          }
          axios({
            method: 'post',
            url: this.url + '/plan/planExamine/submitExamine',
            data: data
          }).then(
            response => {
              if ( response.data.code === 200 ) {
                this.$Message.success('操作成功!');
                this.modal = false
                this.setShowMessage(1)
                this.setProcessArrowMenu(['s-cur', 's-cur-next', '', '', ''])
                this.setProcessArrowStatus(1)
                this.setStatus(this.planIdInfo)
                const parmas = {
                  data: {
                    planTypeName: '',
                    name: '',
                    pageNum: 1,
                    pageSize: this.pageSize,
                    userCode: this.userCode
                  },
                  url: this.url + '/plan/content/queryPlanByTypeAndName'
                }
                this.setSearchInformation(parmas);
              } else {
                this.$Message.error(response.data.message);
              }
            }
          ).catch(
            error => {
            }
          )
        }
      }
    },
    mounted () {
    }
};
</script>

<style>
  .yuan-banner-title {height:50px;}
  ul{margin:0px; padding:0px; list-style:none;}	
  .wrap{width:100%; height:auto; line-height:30px; margin:10px auto 10px 0;}	
  .step-case{height:40px;}		
  .step-case li{ float:left; margin:0px; width:25%;position:relative; cursor:pointer;}		
  .step-case li span{display:block; background-color:#ccc;  height:40px; line-height:40px;  text-align:center; color:#fff; font-weight:bold;}		
  .step-case b{position:absolute; font-size:0px; line-height:0px; top:0px;}		
  .step-case .b-l{border-width:2px 2px 2px 0; border-style:dashed solid dashed dashed; border-color:transparent #ccc transparent transparent; height:36px;}		
  .step-case .b-r{border-width:2px 0 2px 2px; border-style:dashed dashed dashed solid; border-color:transparent transparent transparent #ccc; height:36px;}
  .step-case .b-1{border-width:20px 0 20px 20px; border-style:solid dashed solid solid; border-color:#ccc transparent #ccc #ddd; left:-20px;}		
  .step-case .b-2{border-width:20px 0 20px 20px; border-style:dashed dashed dashed solid; border-color:transparent transparent transparent #ccc; left:-21px;}		/*当前状态*/		
  .step-case .s-cur span{background-color:#27a9e3;}		
  .step-case .s-cur .b-l{border-right-color:#27a9e3;}		
  .step-case .s-cur .b-r{border-left-color:#27a9e3;}		
  .step-case .s-cur .b-1{margin-left: 2px;border-color:#27a9e3 #27a9e3 #27a9e3 #fff;}		
  .step-case .s-cur .b-2{border-left-color:#27a9e3;}		/*当前状态后*/		
  .step-case .s-cur-next .b-2{border-color:transparent transparent transparent #27a9e3;}		/*完成的状态*/		
  .step-case .s-finish span{background-color:#27a9e3; color:#fff;}		
  .step-case .s-finish .b-l{border-right-color:#27a9e3;}		
  .step-case .s-finish .b-r{border-left-color:#27a9e3;}		
  .step-case .s-finish .b-1{margin-left: 2px;border-color:#27a9e3 #27a9e3 #27a9e3 #fff;}		
  .step-case .s-finish .b-2{border-left-color:#27a9e3;}
</style>
