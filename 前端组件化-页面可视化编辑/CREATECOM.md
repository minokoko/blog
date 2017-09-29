## 组件实现和组件化开发
接上篇[组件化](COMPONENTS.md)，现在聊聊如何实现组件和组件化开发。
### 组件设计思想和实现
Web Components还未成熟，不能很好的应用到实际项目中(*angular2称已全面拥抱，暂时还未了解*)。我们仍面临着-实现组件，这一问题。那么，抛开Web Components的四项技术，我们仍可遵循Web Components标准去实现更符合现在前端领域的组件实现方案。而在前端大牛们的努力下，为我们提供了多种组件的实现方案和框架。  
1. React Components
2. Vue Components
3. Angular Directives
4. Ember Components
5. Backbone Components 
......  

暂时不去考虑这些优秀的框架实现，我们尝试自己思考下如何去实现组件。  
通过上一篇文章，阐述了组件的外在表现形式：以自定义标签为入口，javascript为组织控制，HTML、css为外在表现层。即组件应该包含：
1. 自定义标签
2. UI模板(HTML、css)
3. 核心逻辑（javascript）  

然后细心地思考就会发现前端组件的一个特性：自定义标签是挂载到页面上的，只有在页面开始渲染时或后，javascript代码才能展现出它强大的功能。也就是说，javascript要依赖页面被浏览器加载渲染，才能起作用的，它不能作为入口。  
那么，我们首先要解决自定义标签问题：自定义标签被加载时，触发核心的javascript。
#### 创建自定义标签
该如何通过自定义标签触发javascript核心代码？  
**DOM操作**——自定义标签的切入点。如下：  
```javascript
<c-div id="cDiv"></c-div>
<script>
    document.addEventListener('DOMContentLoaded', function(){
        var cD = document.getElementById('cDiv');
        cD.style.width = '200px';
        cD.style.height = '200px';
        cD.style.backgroundColor = '#ff0';
        console.log(cD);
    }, false);
</script>
```
运行代码，结果是还真拿到了**c-div**，但是为其设定的样式却无效。回想web components自定义标签的一行关键代码：**var cInput = Object.create(HTMLElement.prototype)**，很明显它不具备页面原生元素的基本属性，它不属于HTMLElement。  
鉴于能拿到c-div，证明浏览器还是把它加载到DOM书中的。另想办法：可以为组件提供一个父节点容器，将自定义标签添加到此节点内，那么我们只需要判断出存在自定义的标签，就切人javascript代码。代码如下：
```javascript
<div class="app" id="app">
    <c-div id="cDiv"></c-div>
</div>
<script>
    document.addEventListener("DOMContentLoaded", function(){
        var app = document.getElementById('app');
        var childNodes = app.children;
        for(var i=0;i<childNodes.length;i++){
            console.log(childNodes[i].nodeName);
        }
    }, false);
</script>
```

运行结果拿到了自定义标签的nodeName,如此就可以从nodeName入手关联到javascript函数。如下代码：
```javascript
<div class="app" id="app">
    <c-div id="cDiv"></c-div>
</div>
<script>
    var cdiv = function(){
        alert('执行了c-div自定义标签');
    };
    document.addEventListener('DOMContentLoaded', function(){
        var app = document.getElementById('app');
        var childNodes = app.children;
        for(var i=0;i<childNodes.length;i++){
            var cNode = childNodes[i].nodeName;
            console.log(cNode);
            var comFn = cNode.replace(/\-/g, '').toLowerCase();
            console.log(typeof window[comFn]);
            (typeof window[comFn] === 'function') && window[comFn]();
        }
    }, false);
</script>
运行结果调用的了对应的组件方法。至此，我们完成自定义标签作为切入点的功能。
```
#### 初始化组件
#### 组件UI渲染
#### 核心业务逻辑

### 组件化的开发
### 核心——组件引擎
组件引擎
#### 组件引擎做什么
#### 实现引擎-组件描述
#### 实现引擎-组件加载
#### 实现引擎-组件更新
#### 实现引擎-组件销毁
#### 借鉴Vue