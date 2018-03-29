<template>
    <div>
        <div style="width:300px;">
            <i-input v-model="value"></i-input>
            <i-button @click="addNode">
                <Icon type="plus-round"></Icon>
            </i-button>
            <i-button @click="remove">
                <Icon type="minus-round"></Icon>
            </i-button>
            <i-button @click="nodeMoveUp">
                <Icon type="arrow-up-c"></Icon>
            </i-button>
            <i-button @click="nodeMoveRight">
                <Icon type="arrow-right-c"></Icon>
            </i-button>
            <i-button @click="nodeMoveDown">
                <Icon type="arrow-down-c"></Icon>
            </i-button>
            <i-button @click="nodeMoveLet">
                <Icon type="arrow-left-c"></Icon>
            </i-button>
            <tree :data="data5" :render="renderContent"></tree>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      data5: [
        {
            title: '预案信息',
            expand: true,
            children: [
                {
                    id:10,
                    title: 'child 1-1',
                    expand: true,
                    children: [
                        {
                            id:11,
                            title: 'leaf 1-1-1',
                            expand: true,
                            children: [{
                                id:131,
                                title: 'xxxxxxxxxx',
                                expand: true,
                            }]               
                        },
                        {
                            id:12,                            
                            title: 'leaf 1-1-2',
                            expand: true
                        }
                    ]
                },
                {
                    id:13,                        
                    title: 'child 1-2',
                    expand: true,
                    children: [
                        {
                            id:14,                            
                            title: 'leaf 1-2-1',
                            expand: true
                        },
                        {
                            id:15,
                            title: 'leaf 1-2-2',
                            expand: true
                        }
                    ]
                }
            ]
        }
      ],
      addnodeDAta: null,
      rootData: [],
      nodeData: {}
    }
  },
  methods: {
      //上移
    nodeMoveUp(){
        debugger;
        const root = this.rootData
        const node = this.nodeData
        const currentNode  = this.addnodeDAta
        //移动节点的上级节点
        const nodeParent =  node.parent;
        const nodeId = node.node.id;
        //移动节点所在树中index位置
        const nodeKey = currentNode.nodeKey;
        var num = 1;
        if(nodeKey > 0){
            for(let i=nodeKey-1;i>=0;i--){
                let pNode = root[i];
                let pNodeId = pNode.node.id;
                if(pNode.parent == nodeParent){
                    //向后端发送上移提交申请
                    const parentKey = root.find(el => el === node).parent;
                    const parent = root.find(el => el.nodeKey === parentKey).node;
                    const index = parent.children.indexOf(currentNode);
                    parent.children.splice(index, 1);
                    parent.children.splice(index-1, 0, currentNode)
                    node.nodeKey = node.nodeKey - num;
                    // sampleLevelMoveNode(nodeId,pNodeId,'up');
                    node.selected = true;
                    return;
                }
                num ++;
                
            }
        }       
    },
    //下移
    nodeMoveDown(){
        const root = this.rootData
        const node = this.nodeData
        const currentNode  = this.addnodeDAta
        //移动节点的上级节点
        let nodeParent =  node.parent;
        let nodeId = node.id;
        //移动节点所在树中index位置
        let nodeKey = currentNode.nodeKey;
        let num = 1;
        if(nodeKey < root.length){
            for(let i=nodeKey+1;i< root.length;i++){
                let pNode = root[i];
                let pNodeId = pNode.node.id;
                if(pNode.parent == nodeParent){
                    //向后端发送下移动移提交申请
                    const parentKey = root.find(el => el === node).parent;
                    const parent = root.find(el => el.nodeKey === parentKey).node;
                    const index = parent.children.indexOf(currentNode);
                    parent.children.splice(index, 1);
                    parent.children.splice(index+1, 0, currentNode)
                    // sampleLevelMoveNode(nodeId,pNodeId,'down');
                    node.nodeKey = node.nodeKey + num;
                    node.selected = true;
                    return;
                }
            }
        }
    },
    //左移
    nodeMoveLet(){
        const root = this.rootData
        const node = this.nodeData
        const currentNode  = this.addnodeDAta
        //移动节点的上级节点
        const nodeParentKey =  node.parent;
        const nodeId = node.id;
        debugger;
        if(nodeParentKey){
            let parentNode = root[nodeParentKey];
            let parentId = parentNode.node.id;
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(currentNode);
            const moveleft = root.find(el => el.nodeKey === parentNode.parent).node
            parent.children.splice(index, 1);
            moveleft.children.splice(index+1, 0, currentNode)
            // levelMove(nodeId, parentNode.parent, 'left');
        }
    },
    //右移
    nodeMoveRight(){
        const root = this.rootData
        const node = this.nodeData
        const currentNode  = this.addnodeDAta
        const nodeParent =  node.parent;
        const nodeId = node.id;
        const nodeKey = currentNode.nodeKey
        debugger;
        var num = 1;
        if(nodeKey > 0){
            for(let i=nodeKey-1;i>=0;i--){
                let pNode = root[i];
                let pNodeId = pNode.node.id;
                if(pNode.parent == nodeParent){
                    const parentKey = root.find(el => el === node).parent
                    const parent = root.find(el => el.nodeKey === parentKey).node
                    const moveRight = root.find(el => el.nodeKey === pNode.nodeKey).node
                    console.log(moveRight)
                    const index = parent.children.indexOf(currentNode)
                    parent.children.splice(index, 1)
                    moveRight.children.splice(index+1,0,currentNode);
                    return;
                }
            }
        }
        //移动节点的上级节点
        // console.log()

        // if(nodeParentKey > 0){
        //     for(let i = nodeParentKey;i>0;i--){
        //         let pNode = root[i];
        //         if(pNode.nodeKey === node.parent){
        //             console.log(1)
        //             const 
        //             const parentKey = root.find(el => el === node).parent;
        //             const parent = root.find(el => el.nodeKey === parentKey).node;
        //             const index = parent.children.indexOf(currentNode);
        //             // parent.children.splice(index, 1);
        //             const moveRight = root.find(el => el.nodeKey === pNode.nodeKey).node
        //             console.log('moveRight', moveRight)
        //             console.log('node', node)
        //             console.log('currentNode', currentNode)
        //             // moveRight.children.push(currentNode)
        //             // levelMove(node.id,pNode.id,"right");
        //         }
        //     }
        // }
    },
    renderContent (h, { root, node, data }) {
        return h('span', {
            style: {
                display: 'inline-block',
                width: '100%'
            }
        }, [
            h('span', {
                props: {
                    type: 'ios-paper-outline'
                },
                on: {
                    click: () => { 
                        this.handelGetTreeNode(root, node, data, event) 
                    }
                }
            }, [
                h('span', {
                    style: {
                        marginRight: '5px',
                        cursor: 'pointer'
                    }
                }, data.title)
            ])
        ]);
    },
    remove () {
        if(this.addnodeDAta) {
            const root = this.rootData
            const node = this.nodeData
            const data = this.addnodeDAta
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            parent.children.splice(index, 1);
        } else {
            this.$Message.error('请选择节点')
        }
    },
    handelGetTreeNode(root, node, data, event) {
        // console.log('root', root)
        // console.log('node', node)
        // console.log('data', data)
        const targetArea = event.target || event.srcElement
        // console.log(targetArea)
        if (this.hasClass(targetArea, 'ivu-tree-selected')) {
            this.removeClass(targetArea, 'ivu-tree-selected')
            this.addnodeDAta =  null,
            this.rootData = [],
            this.nodeData = {}
        } else {
            this.addClass(targetArea, 'ivu-tree-selected')
            this.rootData = root
            this.nodeData = node
            this.addnodeDAta = data
        }
    },
    addNode() {
        if(this.addnodeDAta) {
            const parms = this.addnodeDAta
            const children = parms.children || [];
            children.push({
                title: this.value,
                expand: true
            });
            this.$set(parms, 'children', children)
        } else {
            this.$Message.error('请选择节点')
        }
    },
    addClass(obj, cls) {
        const obj_class = obj.className
        const blank = (obj_class != '') ? ' ' : ''
        const added = obj_class + blank + cls
        obj.className = added
    },
    removeClass(obj, cls){
        const obj_class_1 = ' '+ obj.className+' '
        const obj_class = obj_class_1.replace(/(\s+)/gi, ' ')
        const rm = obj_class.replace(' '+cls+' ', ' ')
        const removed = rm.replace(/(^\s+)|(\s+$)/g, '')
        obj.className = removed
    },
    hasClass(obj, cls){
        const obj_class = obj.className
        const obj_class_lst = obj_class.split(/\s+/)
        for(const x in obj_class_lst) {
            if(obj_class_lst[x] === cls) {
                return true;
            }
        }
        return false;
    }
  }
}
</script>

<style>
.ivu-tree-selected {
    padding: 3px 5px;
    background: #d5e8fc;
    border-radius: 3px;
}
</style>
