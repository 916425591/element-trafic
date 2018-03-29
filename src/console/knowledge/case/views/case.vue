<template lang="html">
  <!-- 典型案例 -->
  <div>
    <law-info></law-info>
  </div>
</template>
<script>
import lawInfo from './caseInfo';
import { mapActions } from 'vuex';
import Cookies from 'js-cookie';

export default {
  name: 'emergencyKnowledge',
  components: {
    lawInfo
  },
  data () {
    return {
      treeHeight: {
        height: '100%',
        overflow: 'auto'
      },
      rightHeight:{
        height: '100%',
        overflow: 'auto'
      },
      searchContent:'',
      pageNum:1,
      pageSize:20,
    };
  },
  computed: {
    lawsTypeTreeList () {
      return this.$store.state.laws.lawsTypeList;
    }
  },
  mounted () {

  },
  methods: {
    ...mapActions([
      'getLawsTypeList',//获取树数据
      'getLawsTableList',// 获取表格数据
      'setQueryConditions',//设置查询参数
      'setLawsFileTypeInfo'//设置文件类型ID
    ]),
    clickTreeNode (data){//点击树的子节点
        if(!data||data.length===0){
            return;
        }
      this.setQueryConditions() //清空查询参数
      let lawsTypeId = (this.$refs.lawsTree.getSelectedNodes())[0].id;
      let name = (this.$refs.lawsTree.getSelectedNodes())[0].title;
      this.setLawsFileTypeInfo({
        id:lawsTypeId,
        name:name
      });
      this.getLawsTableList({
        'userCode':Cookies.get('userCode'),
        'pageNum':this.pageNum,
        'pageSize':this.pageSize,
        'fileType':lawsTypeId,
        'name':'',
        'fileLevel':'',
        'keywords':''
      })
    },
    queryLawsTypeList (){//查询树结构数据
      this.getLawsTypeList({
        'userCode':Cookies.get('userCode'),
        'pageNum':this.pageNum,
        'pageSize':this.pageSize,
        'name':this.searchContent
      })
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
