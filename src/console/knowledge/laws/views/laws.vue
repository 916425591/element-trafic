<template lang="html">
  <!-- 法律法规知识库 -->
  <div>
    <Row :gutter="10">
      <Col span="5">
        <div class="ds-widget-box" ref="dsWidgetBox">
          <div class="ds-widget-title" ref="dsWidgetTitle">
            <span class="ds-title-icon"></span>
            <h2>法律法规类型</h2>
          </div>
          <div class="ds-widget-concont" ref="dsWidgetConcont">
            <div class="ds-search-left" >
              <Form >
                <FormItem prop="searchContent">
                   <i-input v-model="searchContent" placeholder="输入查询条件" icon="ios-search" style="width: 100%" @on-click="queryTypeTree('formInline')" @on-enter="queryTypeTree('formInline')"></i-input>
                </FormItem>
              </Form>
            </div>
            <!-- <Scroll :on-reach-bottom="handleReach" loading-text="加载中" :height="this.treeHeight.height"> -->
                <div class="ds-tree-left cess" :data-json="treeHeight" :style='height' >
                  <Tree :data=treeData ref="lawsTree" @on-select-change="clickTreeNode"></Tree>
                </div>
            <!-- </Scroll> -->
          </div>
        </div>
      </Col>
      <Col span="19">
          <law-info ref="lawInfoRef"></law-info>
      </Col>
    </Row>
  </div>
</template>
<script>
import lawInfo from './lawInfo';
import { mapActions } from 'vuex';
import axios from 'axios'
import verify from '@/common/utils/verify'
import Cookies from 'js-cookie';
export default {
  name: 'laws',
  components: {
      lawInfo,
      verify
  },
  data () {
      const validateSearchContent = (rule, value, callback) => {
          if (value&&!verify.name.test(value)) {
              return callback(new Error('不能包含特殊符号，20字符以内'));
          }else {
              callback()
          }
      };
    return {
        rightHeight:{
            height: '100%',
            overflow: 'auto'
        },
        searchContent:'',
        // formInline2:{
          searchContent:null,
        // },
        treeData:[],
        height: {
            // margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
            height: '',
            'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
        },
        ruleCustom2: {
            searchContent:[
                { type:'text', validator: validateSearchContent, trigger: 'blur' }
            ]
        }
    };

  },
  computed: {
    lawsTypeTreeList () {
      return this.$store.state.laws.lawsTypeList;
    },
    treeHeight() {
        const height = this.$store.state.heightTable.tableInfoIndex.tableHeight /*定义好的父框体高度*/
        this.height.height = height;
        return this.height.height;
    }
  },
  created () {
        const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setHeightContent(h);
        this.tableHeightMessageIndex(130);
        this.queryTypeTree();
        this.saveLawTreeNode({
            id:null,
            name:null,
            queryCode:null
        });
    },
  methods: {
    ...mapActions([
        'saveLawTreeNode',
        'tableHeightMessageIndex',
        'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ]),
    queryTypeTree(name) {
              //树查询
              let info = {
                  userCode: Cookies.get('userCode'),
                  categoryArray:[1,2],
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
        if(data[0]){
            let lawsTypeId = data[0].id;
            let name = data[0].title;
            let queryCode = data[0].queryCode;
            this.saveLawTreeNode({
                id:lawsTypeId,
                name:name,
                queryCode:queryCode
            });
            this.$refs.lawInfoRef.queryFileList();
            this.$refs.lawInfoRef.setTreeSelected(true);
        } else {
            this.$refs.lawInfoRef.setTreeSelected(false);
            this.$refs.lawInfoRef.resetInfo();
        }
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
