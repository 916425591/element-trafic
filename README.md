# 项目描述

* [1 项目运行环境](#1-环境操作)
* [2 自定义高度](#2-项目中自定义高度)  

## 1 环境操作

```javascript
  先下拉好代码进入项目文件里面
  *注：node版本不能低于8.0
  运行： npm install 
        npm run dev


```
## 2 自定义高度

```javascript
在DOM结构中的父元素上面增加 :style='height' :data-json="tableHeight"
  在data里面定义
    height: {
        // margin: '5px 0 0 0',  /*若是有其它css样式则一起添加进去*/
        height: '',
        //'overflow-y': 'scroll'  /* 如果不带分页 超出部分显示滚动条则增加此样式*/
    }


computed: {
    //切记：： 页面所有写死的pageSize 都要换成这个，之前写在data》return里面的pageSize也要删除掉
    pageSize() {
      return this.$store.state.heightTable.tableInfo.numberBranches /*根据高度换算 自定义每页显示条数*/
    },
    tableHeight() {
      this.height.height = this.$store.state.heightTable.tableInfo.tableHeight /*定义好的父框体高度*/
      return this.height.height
    }
  }

// created || mounted
created () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.setHeightContent(h)
    this.tableHeightMessage(xx) /* xx 为除去title以及面包屑和本身之外 其它元素所占用的高度*/
  }

  methods: {
    ...mapActions([
      'tableHeightMessage',/*将其它元素所占用的高度传入到vuex中 进行换算 返回相应高度及每页显示条数*/
      'setHeightContent'/*将获取到的可读高度 存放到VUEX中进行换算*/
    ])
  }
  注： 页面里面如果不含   ...mapActions  则要在script标签里面引入    import { mapActions } from 'vuex'
```