> 该篇记录下如何编写Vue树组件,Vue官网也有对[树形视图](//cn.vuejs.org/v2/examples/tree.view.html)的详细案例。

## Vue构建树形组件  
[javascript处理树形结构](http://www.tudoustore.com/2017/11/16/javascript%E5%A4%84%E7%90%86%E6%A0%91%E5%BD%A2%E7%BB%93%E6%9E%84/#more)介绍了javascript处理树结构数据。这篇文章记录下如下开发一个Vue Tree Component。
### javascript树形结构数据表述  
Tree Component的内容数据。使用该篇[javascript处理树形结构](http://www.tudoustore.com/2017/11/16/javascript%E5%A4%84%E7%90%86%E6%A0%91%E5%BD%A2%E7%BB%93%E6%9E%84/#more)数据描述。
```javascript
var treeData = [{
    label: 'Container',
    key: 'c0',
    content:[{
        label: 'Section',
        key: 's0',
        content:[{
            label: 'Element',
            key: 'e0'
        }]
    }]
},{
    label: 'Container',
    key: 'c1',
    content:[{
        label: 'Section',
        key: 's1',
        content:[{
            label: 'Element',
            key: 'e1'
        }]
    },{
        label: 'Section',
        key: 's2',
        content:[{
            label: 'Element',
            key: 'e2'
        }]
    }]
},{
    label: 'Container',
    key: 'c2',
    content:[{
        label: 'Section',
        key: 's3',
        content:[{
            label: 'Element',
            key: 'e3'
        }]
    }]
}]
```
### Vue遍历树结构数据  
现在我们需要遍历treeData，并输入到页面上展示。分两步解决问题：  
1. Vue遍历treeData
2. 页面展示样式  
页面展示样式暂时略过，首先解决第一个问题。  
得到的遍历方法如下：  
```html
<template>
    <div class="tree-box">
        <ul v-for="td in treeData">
            <li>
                {{ td.label }}
                <ul v-for="td2 in td.content" v-if="td.content.length > 0">
                    <li>
                        {{ td2.label }}
                        <ul v-for="td3 in td2.content" v-if="td2.content.length > 0">
                            <li>
                                {{ td3.label }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        name: 'tree',
        data (){
            return {
                treeData: [{
                    label: 'Container 0',
                    key: 'c0',
                    content:[{
                        label: 'Section 0',
                        key: 's0',
                        content:[{
                            label: 'Element 0',
                            key: 'e0'
                        }]
                    }]
                },{
                    label: 'Container 1',
                    key: 'c1',
                    content:[{
                        label: 'Section 1',
                        key: 's1',
                        content:[{
                            label: 'Element 1',
                            key: 'e1'
                        }]
                    },{
                        label: 'Section 2',
                        key: 's2',
                        content:[{
                            label: 'Element 2',
                            key: 'e2'
                        }]
                    }]
                },{
                    label: 'Container 2',
                    key: 'c2',
                    content:[{
                        label: 'Section 3',
                        key: 's3',
                        content:[{
                            label: 'Element 3',
                            key: 'e3'
                        }]
                    }]
                },{
                    label: 'Container 3',
                    key: 'c3',
                    content:[{
                        label: 'Section 4',
                        key: 's4',
                        content:[]
                    }]
                }]
            }
        }
    }
</script>
<style lang="scss">
    ul{
        list-style: none;

        li{
            line-height: 1.5;
            border-top: 1px solid #333;
        }
    }
</style>
```
现在已经将treeData数据转化为页面节点，并有了初步的显示样式，如下图：  
![tree](http://ozp3e2myx.bkt.clouddn.com/tree_desc.png)
当前代码还遗留一个大问题：**渲染页面，treeData中有多少层嵌套，我们就需要编写多少层for循环**，这不符合实际需求。Vue提供了递归渲染的方案：[递归组件](https://cn.vuejs.org/v2/guide/components.html#递归组件)。我们将采用递归组件的方式解决循环嵌套渲染的问题。

### Vue组件实现递归调用  

> 组件在它的模板内可以递归调用自己。前提是：当它有name选项时才可以。  
 递归组件稍有不慎会导致"max stack size 
 exceeded"错误，所以需要确保递归调用有明确的终止条件( 比如递归调用时使用v-if并最终解析为false)  

引用自官网对递归组件调用的说明。现在观察渲染的模板代码，确定需要递归的子组件。最终提取如下复用代码:  
```html
<li>
    {{ td2.label }}
    <ul v-for="td3 in td2.content" v-if="td2.content.length > 0">
        <li>
            .......
        </li>
    </ul>
</li>
```
依据复用代码建立新的tree_node.vue树节点组件，用于树节点的递归渲染。
```html
<template>
    <li>
        {{ model.label }}
        <ul v-for="td in model.content" v-if="model.content.length > 0">
            <tree-node :model="td"></tree-node>
        </ul>
    </li>
</template>
<script>
    export default{
        name: 'treeNode',
        props:['model']
    }
</script>
```
tree_node组件通过props接受父组件传值，通过**v-if="model.content.length > 0**终止递归。完善后的tree组件如下：  
1. tree.vue组件
```html
<template>
    <div class="tree-box">
        <ul v-for="td in treeData">
            <tree-node :model="td"></tree-node>
        </ul>
    </div>
</template>
<script>
import TreeNode from './tree_node'

    export default{
        name: 'tree',
        components:{
            TreeNode
        },
        data (){
            return {
                treeData: [{
                    label: 'Container 0',
                    key: 'c0',
                    content:[{
                        label: 'Section 0',
                        key: 's0',
                        content:[{
                            label: 'Element 0',
                            key: 'e0'
                        }]
                    }]
                },{
                    label: 'Container 1',
                    key: 'c1',
                    content:[{
                        label: 'Section 1',
                        key: 's1',
                        content:[{
                            label: 'Element 1',
                            key: 'e1'
                        }]
                    },{
                        label: 'Section 2',
                        key: 's2',
                        content:[{
                            label: 'Element 2',
                            key: 'e2'
                        }]
                    }]
                },{
                    label: 'Container 2',
                    key: 'c2',
                    content:[{
                        label: 'Section 3',
                        key: 's3',
                        content:[{
                            label: 'Element 3',
                            key: 'e3'
                        }]
                    }]
                },{
                    label: 'Container 3',
                    key: 'c3',
                    content:[{
                        label: 'Section 4',
                        key: 's4',
                        content:[]
                    }]
                }]
            }
        }
    }
</script>
<style lang="scss">
    ul{
        list-style: none;

        li{
            line-height: 1.5;
            border-top: 1px solid #333;
            border-left: 1px solid #333;
        }
    }
</style>
```
2. tree_node.vue组件
```html
<template>
    <li>
        {{ model.label }}
        <ul v-for="td in model.content" v-if="model.content.length > 0">
            <tree-node :model="td"></tree-node>
        </ul>
    </li>
</template>
<script>
    export default{
        name: 'treeNode',
        props:['model']
    }
</script>
```

### 添加树常用功能  
完成一个简单的数组件，先简单添加以下两个功能：  
1. 可折叠打开子级节点
2. 节点可选中，选中高亮；并可获得当前选中节点

#### 折叠  
添加变量**open**控制子节点的折叠、展开。需要注意一点，不存在子节点时无法折叠、展开，所以添加了判断**isFolder**.修改后的tree_node.vue代码如下：  
```html
<template>
    <li>
        <div class="tree-text">
            <span v-if="isFolder" @click="toggle" class="tree-text__cntrl"> {{ open?'-':'+' }} </span>
            <span>{{ model.label }}</span>
        </div>
        <ul v-for="td in model.content" v-if="model.content.length > 0" v-show="open">
            <tree-node :model="td"></tree-node>
        </ul>
    </li>
</template>
<script>
    export default{
        name: 'treeNode',
        props:['model'],
        data () {
            return {
                open: false
            }
        },
        computed:{
            isFolder (){
                return (this.model.content && this.model.content.length > 0);
            }
        },
        methods:{
            toggle (){
                if(this.isFolder){
                    this.open = !this.open;
                }
            }
        }
    }
</script>
<style lang="scss">
    .tree-text__cntrl{
        display: inline-block;
        width: 20px;
        text-align: center;
        cursor: pointer;
    }
</style>
```  
#### 选中节点  
做一下前期准备：添加hover样式；添加选中高亮。
最终样式如下：  
![添加hover高亮](http://ozp3e2myx.bkt.clouddn.com/tree_hover.png)
同折叠一样，我们添加变量**active**来控制当前节点是否被选中。代码如下：
```html
<template>
    <li>
        <div class="tree-text" :class="{active: active}">
            <span v-if="isFolder" @click="toggle" class="tree-text__cntrl"> {{ open?'-':'+' }} </span>
            <span @click="nodeClick">{{ model.label }}</span>
        </div>
        ......
    </li>
</template>
<script>
    export default{
        name: 'treeNode',
        props:['model'],
        data () {
            return {
                open: false,
                active: false
            }
        },
       ......
        methods:{
           ......
            nodeClick (){
                this.active = !this.active;
            }
        }
    }
</script>
......
```
之后，该如何获取当前的选中节点呢？我们知道Vue提供了自定义事件，可以通过v-on为子组件绑定自定义事件，子组件通$emit通知绑定的父组件事件。假设父组件定义好了node click事件，代码如下：
```
//tree被调用的父组件内
<tree @nodeSelectedClick="nodeSelectedClick"></tree>
.....
//tree_node组件内
this.$emit('nodeSelectedClick', this.model);
```
**需要注意的一点是：组件的每一次递归调用，就是一次实例化，它们都有自己单独的作用域，所以必须要保证所有节点都可以访问到顶级节点的实例**，这边就是tree组件。   
那么，现在需要解决的问题是：如何在任何节点实例中访问到tree？  
关注两个技巧点：  
1. 可以通过**this.$parent**访问到上一层组件(父组件)
2. tree_node节点由递归创建，所以我们可以逐级将tree赋值给节点  
具体方法：  
1. 在tree中添加顶级作用域的标志
```javascritp
//tree.vue中添加created钩子函数
created (){
    this.isTree = true; //标志  此为树顶级实例
}
```
2. 在tree_node中添加实例变量并赋值
```javascript
created(){
    const parent = this.$parent;
    if(parent.isTree){
        this.tree = parent;
    }else{
        this.tree = parent.tree;
    }
}
```
3. 更改tree_node中的nodeClick方法
```javascript
nodeClick (model){
    this.active = !this.active;
    if(this.active){
        this.tree.$emit('nodeSelectedClick', model);
    }
}
```

以上两个功能，主要是提供了一下思路：  
1. 操作树DOM，改变样式
2. 添加自定义方法

这对于一个树组件还远远不够。当逐渐完善它时，还需要添加更多的属性和方法。这时候就需要创建树组件描述对象，它包含了树的所有变量、方法。有兴趣可以尝试编写，这里不再讲解。  