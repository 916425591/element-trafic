<template lang="html">
  <!-- 分类分级知识库 -->
  <div>
    <Row :gutter="10">
      <i-col span="5">
        <div class="ds-widget-box" ref="dsWidgetBox">
          <div class="ds-widget-title" ref="dsWidgetTitle">
            <span class="ds-title-icon"></span>
            <h2>事件类型</h2>
          </div>
          <div class="ds-widget-concont" ref="dsWidgetConcont">
            <div class="ds-search-left">
              <Input v-model="searchContent" placeholder="输入查询条件" icon="ios-search" style="width: 100%" @on-click="queryTypeTree" @on-enter="queryTypeTree"></Input>
            </div>
            <!-- <Scroll :on-reach-bottom="handleReach" loading-text="加载中" :height="this.treeHeight.height"> -->
                <div class="ds-tree-left" :style='height'>
                  <Tree :data="treeData" ref="classifyTree" @on-select-change="clickTreeNode" :data-json="treeHeight"></Tree>
                </div>
            <!-- </Scroll> -->
          </div>
        </div>
      </i-col>
      <i-col span="19">
          <classify-info ref="classInfo"></classify-info>
      </i-col>
    </Row>
  </div>
</template>
<script>
import classifyInfo from './classifyInfo';
import { mapActions } from 'vuex';
import axios from 'axios'
import Cookies from 'js-cookie';

export default {
  name: 'classify',
  components: {
    classifyInfo
  },
  data () {
    return {
        searchContent:'',
        treeData:[],
        classifyTypeTreeList: [
        {
            id: 0,
            title: '自然灾害',
            expand: true,
            children: [
                {
                    id: 1,
                    title: '水旱灾害',
                    expand: true
                },
                {
                    id: 2,
                    title: '气象灾害',
                    expand: true
                }
            ]
        },
        {
            title: '事故灾难事件',
            expand: true,
            children: [
                {
                    id: 3,
                    title: '煤矿事故',
                    expand: true
                },
                {
                    id: 4,
                    title: '危险化学品事故',
                    expand: true
                },
                {
                    id: 4,
                    title: '建筑业事故',
                    expand: true
                }
            ]
        },
        {
            title: '公共卫生事件',
            expand: true,
            children: [
                {
                    id: 3,
                    title: '传染病事件',
                    expand: true
                },
                {
                    id: 4,
                    title: '食品药品安全事件',
                    expand: true
                }
            ]
        },
        {
            title: '其他突发事件',
            expand: true,
        }
      ],
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
        this.tableHeightMessageIndex(112)
        this.queryTypeTree();
        this.saveLawTreeNode({});
    },
  methods: {
    ...mapActions([
        'getClassifyTypeList',//获取树数据
        'getClassifyTableList',// 获取表格数据
        'setQueryConditions',//设置查询参数
        'setClassifyFileTypeInfo',//设置文件类型ID
        'saveLawTreeNode',
        'setHeightContent',/*将获取到的可读高度 存放到VUEX中进行换算*/
        'tableHeightMessageIndex'
    ]),
      queryTypeTree() {
          //树查询
          let info = {
              userCode: Cookies.get('userCode'),
              objName:this.searchContent
          };
          axios({
              method: 'post',
              url: this.$store.state.userCode.url+'/platform/public/queryIncidentTypeTree4New',
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
      clickTreeNode (data){//点击树的子节点
        if(!data||data.length===0){
            this.$refs.classInfo.resetInfo();
            this.$refs.classInfo.setTreeSelected(false);
            return;
        }
      let classifyTypeId = data[0].id;
      let name = data[0].title;
      this.saveLawTreeNode({
          id:classifyTypeId,
          name:name,
          queryCode:data[0].queryCode
      });
      this.$refs.classInfo.queryHierarchical();
      this.$refs.classInfo.setTreeSelected(true);
    },

    handleReach (){// 滚动分页查询
      return new Promise(resolve => {
        setTimeout(() => {
            alert(this.pageNum++)
            resolve();
        }, 1000);
      });
    },
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
