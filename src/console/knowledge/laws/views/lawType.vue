<template>
  <div>
    <Modal v-model="typeModalStatus">
        <p slot="header" style="color:#f60;text-align:center">
            <span>选择文件类型</span>
        </p>
        <Tree :data="lawsTypeTreeModalList" ref="lawsTypeTree"></Tree>
        <div slot="footer">
          <Button type="primary" @click="Type_clickConfirmBtn">确定</Button>
          <Button type="ghost" @click="Type_clickCancelBtn">取消</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
        
    };
  },
  computed:{
    typeModalStatus() {
      return this.$store.state.laws.typeModalStatus
    },
    lawsTypeTreeModalList () {
      return this.$store.state.laws.lawsTypeModalTreeList;
    }
  },
  methods: {
    ...mapActions([
      'changeTypeModalStatus',//改变弹框状态
      'setFileType'//设置文件类型
    ]),
    Type_clickCancelBtn (){// 点击取消按钮
      this.changeTypeModalStatus(false);
    },
    Type_clickConfirmBtn (){//点击确定按钮
      let fileType = (this.$refs.lawsTypeTree.getSelectedNodes())[0].id
      let fileTypeName = (this.$refs.lawsTypeTree.getSelectedNodes())[0].title
      this.setFileType({
        fileType,
        fileTypeName
      });
      this.changeTypeModalStatus(false);
    }
    
  }
}
</script>

