<template>
  <div :data-json="processArrow">
    <!-- <div class="box-content" style="padding-top:50px;">
      <span v-if="boxData.length === 0">
        请完善处置流程
      </span>
      <span v-else-if="boxData.length < 2">
        <span style="border:1px solid #ccc;padding:10px 20px;margin:30px 0 0 20px;">{{boxData[boxData.length-1]}}</span>
      </span>
      <span v-else>
        <span v-for="(item, index) in boxData.length - 1" :key="index">
          <span>
            <span class="active" style="border:1px solid #ccc;padding:10px 20px;margin:30px 0 0 20px;">{{item}}</span>
            ====》
          </span>
        </span>
        <span style="border:1px solid #ccc;padding:10px 20px;margin:30px 0 0 20px;">{{boxData[boxData.length-1]}}</span>
      </span>
    </div> -->
    <ul class="step-case" id="step">
      <!-- <span v-if="boxData.length === 0">
        请完善处置流程
      </span>
      <span v-else>
        <li class="s-finish" @click="triggerArrow(0)">
          <span>{{item}}</span>
          <b class="b-l"></b>
        </li>
        <li v-for="(item, index) in boxData.length - 1" :key="index" class="s-finish" @click="triggerArrow(index)">
          <span>{{item}}</span>
          <b class="b-l"></b>
          <b class="b-2"></b>
        </li>
        <li @click="triggerArrow(boxData.length-1)" class="s-finish">
          <span>{{boxData[boxData.length-1]}}</span>
          <b class="b-1"></b>
          <b class="b-2"></b>
          <b class="b-r"></b>
        </li> 	
      </span> -->
      <li v-if="step1.name" class="s-finish" @click="triggerArrow(step1.id)">
        <span>{{step1.name}}</span>
        <b class="b-l"></b>
      </li>
      <li v-else>
        <span>请完善处置流程</span>
      </li>
      <li v-if="step2" v-for="(item, index) in step2" :key="index" class="s-finish" @click="triggerArrow(item.id, index)">
        <span>{{item.name}}</span>
        <b class="b-1"></b>
        <b class="b-2"></b>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      step1: {},
      step2: []
    }
  },
  computed: {
    processArrow() {
      console.log(this.$store.state.processArrow.processArrow)
      return this.$store.state.processArrow.processArrow
    },
    userCode() {
      return Cookies.get('userCode') //userCode
    },
    url() {
      return this.$store.state.userCode.url //url
    }
  },
  created() {
    this.showProcessArrow()
  },
  methods: {
    ...mapActions([
      'getProcessArrowId',
      'getNewDisposalList'
    ]),
    triggerArrow(id, index) {
      this.getProcessArrowId(id)
      const data = {
        url: this.url + '/plan/processTask/findProcessTask',
        data: {
          userCode: this.userCode,
          nodeId: id
        }
      }
      this.getNewDisposalList(data)
    },
    showProcessArrow() {
      const type = this.processArrow.type;
      if ( type === 'detailNodes' ) {
        const res = this.processArrow.nodes;
        if(res && res.length > 0) {
          this.step2 = []
          this.step1 = {
            name: res[0].name ? res[0].name : '',
            id: res[0].id ? res[0].id : ''
          }
          for (let i = 1; i < res.length; i++) {
            this.step2.push({
              name: res[i].name ? res[i].name : '',
              id: res[i].id ? res[i].id : ''
            })
          }
        } else {
          this.step2 = {}
          this.step1 = {}
        }
      } else {
        const url = this.processArrow.url
        const userCode = this.processArrow.userCode
        const planId = this.processArrow.planId
        axios({
          method: 'get',
          url: url,
          params: {
            userCode,
            planId
          }
        }).then(
          response => {
            if ( response.data.code === 200 ) {
              const res2 = response.data.data
              if(res2 && res2.length > 0) {
                this.step2 = []
                this.step1 = {
                  name: res2[0].name ? res2[0].name : '',
                  id: res2[0].id ? res2[0].id : ''
                }
                for (let i = 1; i < res2.length; i++) {
                  this.step2.push({
                    name: res2[i].name ? res2[i].name : '',
                    id: res2[i].id ? res2[i].id : ''
                  })
                }
              } else {
                this.step2 = {}
                this.step1 = {}
              }
            } else {
              this.$Message.error('请求失败')
            }
          }
        ).catch(
        );
      }
      
      // const step = document.getElementById("step")
      // const li = step.getElementsByTagName("li");		
      // for(var i = 0;i<li.length;i++){			
      //   li[i].index = i;				
      //   li[i].onclick = function(){					
      //     var i = this.index;					
      //     for(var j = 0;j<i;j++){						
      //       li[j].className = "s-finish";					
      //     }					
      //     for(var j = li.length;j>i;){						
      //       li[--j].className = "";						
      //       if(j==i+1){							
      //         li[j].className = "s-cur-next";						
      //       }					
      //     }					
      //     this.className = "s-cur";				
      //   }	
      // }	
    }
  }
}
</script>

<style scoped>
  .step-case{margin-top: 10px; margin-left: 10px;}
  ul{margin:0px; padding:0px; list-style:none;}	
  .wrap{width:960px; height:auto; line-height:30px; margin:100px auto 0;overflow-x: scroll;}	
  .step-case{min-height:160px;}		
  .step-case li{ float:left; margin:0px; width:180px;position:relative; cursor:pointer;margin-top:10px;}		
  .step-case li span{display:block; background-color:#ccc;  height:40px; line-height:40px;  text-align:center; color:#fff; font-weight:bold;}		
  .step-case b{position:absolute; font-size:0px; line-height:0px; top:0px;}		
  .step-case .b-l{border-width:2px 2px 2px 0; border-style:dashed solid dashed dashed; border-color:transparent #ccc transparent transparent; height:36px; /*left:-2px;*/}		
  .step-case .b-r{border-width:2px 0 2px 2px; border-style:dashed dashed dashed solid; border-color:transparent transparent transparent #ccc; height:36px; /*right:-2px;*/}
  .step-case .b-1{border-width:20px 0 20px 20px; border-style:solid dashed solid solid; border-color:#ccc transparent #ccc #ddd; left:-20px;}		
  .step-case .b-2{border-width:20px 0 20px 20px; border-style:dashed dashed dashed solid; border-color:transparent transparent transparent #ccc; left:-21px;}		/*当前状态*/		
  .step-case .s-cur span{background-color:orange;}
  .step-case .s-cur .b-l{border-right-color:orange;}		
  .step-case .s-cur .b-r{border-left-color:orange;}		
  .step-case .s-cur .b-1{border-color:orange orange orange #FABF55;}		
  .step-case .s-cur .b-2{border-left-color:#2d8cf0;}		/*当前状态后*/		
  .step-case .s-cur-next .b-2{border-color:transparent transparent transparent orange;}		/*完成的状态*/		
  .step-case .s-finish span{background-color:#2d8cf0; color:#fff;}		
  .step-case .s-finish .b-l{border-right-color:#2d8cf0;}		
  .step-case .s-finish .b-r{border-left-color:#2d8cf0;}		
  .step-case .s-finish .b-1{margin-left: 2px;border-color:#2d8cf0 #2d8cf0 #2d8cf0 #fff;}		
  .step-case .s-finish .b-2{border-left-color:#2d8cf0;}
</style>
