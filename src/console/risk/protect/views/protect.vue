<template lang="html">
  <!-- 防护目标维护 -->
  <div>
    <Row :gutter="10">
      <Col span="5">
        <div class="ds-widget-box" ref="dsWidgetBox" :data-json="tableHeight">
          <div class="ds-widget-title" ref="dsWidgetTitle">
            <span class="ds-title-icon"></span>
            <h2>防护目标类型</h2>
          </div>
          <div class="ds-widget-concont" ref="dsWidgetConcont" :style='height'>
            <div class="ds-search-left">
              <Input v-model="searchContent" placeholder="输入查询条件" icon="ios-search" style="width: 100%" @on-click="queryTargetTypeTree" @on-enter="queryTargetTypeTree"></Input>
            </div>
            <!-- <Scroll :on-reach-bottom="handleReach" loading-text="加载中" :height="this.treeHeight.height"> -->
                <div class="ds-tree-left">
                  <Tree :data="treeData" ref="targetTypeTree" @on-select-change="risk_target_clickTreeNode"></Tree>
                </div>
            <!-- </Scroll> -->
          </div>
        </div>
      </Col>
      <Col span="19">
        <div>
         <protect-info ref="risk_protect_info"></protect-info>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import protectInfo from './protectInfo';
import { mapActions } from 'vuex';
import axios from 'axios'
import Cookies from 'js-cookie';
export default {
  components: {
      protectInfo
  },
  data () {
    return {
      treeData:[],
      searchContent:'',
      pageNum:1,
      pageSize:100,
      height: {
          height: '',
          'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
      }
    };
  },
  computed: {
    protectTargetTypeNode () {
      return this.$store.state.riskProtect.protectTargetTypeNode;
    },
    tableHeight() {
        const res = this.$store.state.heightTable.tableInfoIndex.tableHeight
        this.height.height = parseInt(res) + 'px' /*定义好的父框体高度*/
        return this.height.height
    }
  },
  created () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.setHeightContent(h);
    this.tableHeightMessageIndex(60);

    this.queryTargetTypeTree();
    this.saveProtectTargetTreeNode({});
  },
  methods: {
    ...mapActions([
      'saveProtectTargetTreeNode',// 保存节点数据
      'tableHeightMessageIndex',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
      'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ]),
      queryTargetTypeTree() {
          //树查询
          let info = {
              userCode: Cookies.get('userCode'),
              objName:this.searchContent
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/platform/public/queryFenseTargetType4New',
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
                      const nodes = response.data.data;
                      nodes[0].expand = true;
                      this.treeData = nodes;
                  }
              }
          ).catch(

          )
      },
      risk_target_clickTreeNode (data){//点击树的子节点
          if(!data || data.length===0){
              this.$refs.risk_protect_info.resetAll();
              return;
          }
      let typeId = data[0].id;
      let name = data[0].title;
      this.saveProtectTargetTreeNode({
          id:typeId,
          name:name,
          queryCode:data[0].queryCode
      });
      this.$refs.risk_protect_info.treeSelected = true;
      this.$refs.risk_protect_info.queryFenseTargetList();
    },
    handleReach (){// 滚动分页查询
      return new Promise(resolve => {
        setTimeout(() => {
            alert(this.pageNum++)
            resolve();
        }, 1000);
      });
    }
  }
};
</script>

<style>
.ds-widget-cont{
  background: #fff
}
.ivu-form-item{
  margin: 10px 0;
}
</style>
