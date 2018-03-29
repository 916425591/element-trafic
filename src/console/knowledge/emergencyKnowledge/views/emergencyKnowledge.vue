<template lang="html">
  <!-- 应急知识库 -->
  <div>
    <Row :gutter="10">
      <Col span="5">
        <div class="ds-widget-box" ref="dsWidgetBox">
          <div class="ds-widget-title" ref="dsWidgetTitle">
            <span class="ds-title-icon"></span>
            <h2>知识类型</h2>
          </div>
          <div class="ds-widget-concont" ref="dsWidgetConcont">
            <div class="ds-search-left">
              <i-input v-model="searchContent" placeholder="输入查询条件" icon="ios-search" style="width: 100%" @on-click="queryTypeTree" @on-enter="queryTypeTree"></i-input>
            </div>
            <!-- <Scroll :on-reach-bottom="handleReach" loading-text="加载中" :height="this.treeHeight.height"> -->
                <div class="ds-tree-left" :style='height'>
                  <Tree :data="treeData" ref="knowledgeTree" @on-select-change="clickTreeNode" :data-json="treeHeight"></Tree>
                </div>
            <!-- </Scroll> -->
          </div>
        </div>
      </Col>
      <Col span="19">
          <emergency-knowledge-info ref="knowledgeInfo"></emergency-knowledge-info>
      </Col>
    </Row>
  </div>
</template>
<script>
import emergencyKnowledgeInfo from './emergencyKnowledgeInfo';
import { mapActions } from 'vuex';
import axios from 'axios'
import Cookies from 'js-cookie';
export default {
  name: 'emergencyKnowledge',
  components: {
      emergencyKnowledgeInfo
  },
  data () {
    return {
        treeData:[],
        lawsTypeTreeList: [
            {
              id: 0,
              title: '应急知识',
              expand: true,
              children: [
              {
                id: 1,
                title: '应急常识',
                expand: true,
                children: [
                    {
                        id: 10,
                        title: '突发事件应急常识'
                    },
                    {
                        id: 11,
                        title: '自然灾害应急常识'
                    },
                    {
                        id: 10,
                        title: '事故灾难应急常识'
                    },
                    {
                        id: 11,
                        title: '公共卫生应急常识'
                    },
                    {
                        id: 11,
                        title: '社会安全应急常识'
                    }
                ]
              }
            ]
          }
        ],
        searchContent:'',
        pageNum:1,
        pageSize:20,
        height: {
            // margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
            height: '',
            'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
        }
    };
  },
  computed: {
      treeHeight() {
          this.height.height = this.$store.state.heightTable.tableInfoIndex.tableHeight /*定义好的父框体高度*/
          return this.height.height
      }
  },
  created () {
        const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setHeightContent(h)
        this.tableHeightMessageIndex(110)
        this.queryTypeTree();
        this.saveLawTreeNode({});
    },
  methods: {
    ...mapActions([
        'saveLawTreeNode',//获取树数据
        'tableHeightMessageIndex',
        'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ]),
    clickTreeNode (data){//点击树的子节点
        if(!data || data.length===0){
            this.$refs.knowledgeInfo.resetInfo();
            this.$refs.knowledgeInfo.setTreeSelected(false);
            return;
        }
      let lawsTypeId = data[0].id;
      let name = data[0].title;
      this.saveLawTreeNode({
        id:lawsTypeId,
        name:name,
          queryCode:data[0].queryCode
      });
        this.$refs.knowledgeInfo.setTreeSelected(true);
      this.$refs.knowledgeInfo.queryKnowledgeList();
    },
      queryTypeTree() {
          //树查询
          let info = {
              userCode: Cookies.get('userCode'),
              category:3,
              name:this.searchContent
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/platform/public/queryKnowledgeTree4New',
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
    queryLawsTypeList (){//查询树结构数据

    },
    handleReach (){// 滚动分页查询
      return new Promise(resolve => {
        setTimeout(() => {
            alert(this.pageNum++)
            resolve();
        }, 1000);
      });
    },
  },
  mounted () {
      this.queryLawsTypeList();
      
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
