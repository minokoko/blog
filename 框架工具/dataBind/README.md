> MVVM数据双向绑定的实现原理 

# Object.defineProperty实现双绑
## 数据劫持-Object.defineProperty + 订阅发布模式
> 主要是利用在定义一个对象的属性时，可以设置其set和get方法，用于对对象的该属性进行设置或者读取时的“拦截”操作，类似于"钩子"，即在一定的情况下执行特定的逻辑；目前使用该方案实现的MVVM框架有avalon、vue等，但是目前比较流行的angularjs框架确使用为人诟病的"脏检查"机制实现，这也是其性能遭人吐槽低的一个原因，据说目前angularjs2会改造这一实现机制。
### 1. 用法
``` javascript
    Object.defineProperty(obj, key, descriptor);
```
- 参数说明
>   obj:必需。目标对象  
    key:必需。需要定义或修改的属性的名字  
    descriptor:必需。目标属性所拥有的特性  

- 为对象定义property属性 

```javascript
var obj = {};
Object.defineProperty(obj,'a',{
    set:function(){
        console.log('set方法被调用');
    },
    get:function(){
        console.log('get方法被调用');
    }
});
obj.a;//调用get方法
obj.a = 'test';//调用set方法
```
> get和set方法内部的this都指向obj，这意味着get和set函数可以操作对象内部的值。另外，访问器属性的会"覆盖"同名的普通属性，因为访问器属性会被优先访问，与其同名的普通属性则会被忽略（也就是所谓的被"劫持"了）

当调用a或赋值时，**get**或**set**方法会被调用。由此，我们可以实现数据劫持，在赋值或调用时添加需要的处理方法。

### 2. 实现简单的数据双向绑定绑定  
```javascript
var obj = {};
Object.defineProperty(obj,'a',{
    set:function(newVal){
        var valId = document.getElementById('test').getAttribute('data-for');
        document.getElementById(valId).innerHTML = newVal;
        document.getElementById('test').value = newVal;
    },
    get:function(){
        console.log('get方法别调用');
    }
});
document.getElementById('test').addEventListener('input',function(e){
    obj.a = e.target.value;
},false);
```
当在控制台或者inut框为**obj.a**赋值时，相对应数据也会改变。完成了
**model=>view、view=>model**的改变。

### 3. 分解任务
1. 页面初始化时，输入域与文本节点与model绑定
2. model变化时，输入域与文本节点相应变化**model=>view**
3. 输入域与文本节点变化时，model相应变化**view=>model**

任务一需要找到要绑定数据的**node**，这里采用了**DocumentFragment**（文档片段），其速度和性能远远超过直接操作DOM。在编译阶段**(绑定model)**,将整段需要绑定的子节点劫持到**DocumentFragment**，经过处理后，将其插入原挂载目标。

### 4. 数据初始化绑定
此步骤，需要完成
* 劫持子节点，遍历node找到需要绑定的元素
* 区分node类型，确定不同的处理方式
* 完成绑定，添加到原挂载目标

```javascript
//循环遍历node，不同类型分别处理
function compile(node,vm){
    //节点为元素element
    if(node.nodeType === 1){
        if(node.hasChildNodes()){
            var childs = node.childNodes;
            for(var i=0;i<childs.length;i++){
                arguments.callee(childs[i],vm);
            }
        }else{
            if(node.hasAttribute('v-model')){
                var key = node.getAttribute('v-model');
    
                node.value = vm.data[key]; // 将data的值赋给该node
                node.removeAttribute('v-model');
            }
        }
    }
    //节点为text
    if(node.nodeType == 3){
        var reg = /\{\{(.*)\}\}/;
        if (reg.test(node.nodeValue)) {
            var key = RegExp.$1; // 获取匹配到的字符串
            key = key.trim();
            
            node.nodeValue = vm.data[key];
        }
    }
}
//劫持子节点，处理完后返回
function nodeToFragment(node,vm){
    var flag = document.createDocumentFragment();
    var child;

    while( child = node.firstChild){
        compile(child,vm);
        flag.append(child);
    }
    return flag;
}

function Vue(options){
    var el = options.el;
    var dom = document.getElementById(el);
    
    var flag = nodeToFragment(dom,this);
    dom.appendChild(flag);
}

var vue = new Vue({
    el: 'app',
    data:{
        test: 'Hello world!'
    }
});
```
运行代码，查看结果。初始化数据已显示到输入框、文本节点中。

### 5、响应式数据绑定
数据响应式变化：当在输入域输入值时，model对应数据发生变化，并且反映到view对应页面元素上；当model数据发生改变时，对应view页面元素与输入框发生改变。结合开始的简单小例子，我们需要完成两个任务：
1. 输入域发生**input**(**change**)事件时,更新对应model值
2. model值发生改变时，通知对应的页面元素  

#### 5.1 我们先实现第一个小任务：为相关node添加input事件,在complie方法中添加。
```javascript
function compile(node,vm){
    //节点为元素element
    if(node.nodeType === 1){
        if(node.hasChildNodes()){
            var childs = node.childNodes;
            for(var i=0;i<childs.length;i++){
                arguments.callee(childs[i],vm);
            }
        }else{
            if(node.hasAttribute('v-model')){
                var key = node.getAttribute('v-model');
                node.addEventListener('input', function (e) {
                    // 给相应的data属性赋值，进而触发该属性的set方法
                    vm.data[key] = e.target.value;
                });

                node.value = vm.data[key]; // 将data的值赋给该node
                node.removeAttribute('v-model');
            }
        }
    }
    //节点为text
    if(node.nodeType == 3){
        var reg = /\{\{(.*)\}\}/;
        if (reg.test(node.nodeValue)) {
            var key = RegExp.$1; // 获取匹配到的字符串
            key = key.trim();
            
            node.nodeValue = vm.data[key];
        }
    }
}
```
运行代码，更改input框值，在控制台查看输入后的值，发现已经改变。  
那么该如何实现通知view上页面元素呢？需要用到**订阅/发布模式-观察者模式**。  
#### 5.2 第二个小任务：订阅/发布模式，为页面元素添加数据响应方法  
model数据为**发布者**，页面元素为**订阅者**。首先需要确定，在何时订阅，又在何时发布。  
订阅时机为：在进行初始化数据绑定时，会得到相关的node节点，此时进行对应mdoelde 订阅  
发布时机为：model值发生改变时，即需要在Object.defineProperty()的set方法中添加对应发布方法。
写好订阅/发布模式:  
```javascript
//订阅者容器
function Dep(){
    this.subs = [];//订阅者
}
//添加订阅者
Dep.prototype.addSub = function(sub){
    this.subs.push(sub);
};
Dep.prototype.notify = function(){
    this.subs.forEach(function(sub){
        sub.update();
    });
};
//订阅者对象
function Watcher(){
    
}
Watcher.prototype.update = function(){
    
};
Watcher.prototype.get = function(){
    
};
....
function compile(node,vm){
    //节点为元素element
    if(node.nodeType === 1){
        if(node.hasChildNodes()){
            var childs = node.childNodes;
            for(var i=0;i<childs.length;i++){
                arguments.callee(childs[i],vm);
            }
        }else{
            if(node.hasAttribute('v-model')){
                var key = node.getAttribute('v-model');
                node.addEventListener('input', function (e) {
                    // 给相应的data属性赋值，进而触发该属性的set方法
                    vm.data[key] = e.target.value;
                });

                //node.value = vm.data[key]; // 将data的值赋给该node
                node.removeAttribute('v-model');
                
                new Watcher( vm, node, key,'input'); //创建订阅（观察）者
            }
        }
    }
    //节点为text
    if(node.nodeType == 3){
        var reg = /\{\{(.*)\}\}/;
        if (reg.test(node.nodeValue)) {
            var key = RegExp.$1; // 获取匹配到的字符串
            key = key.trim();
            
            //node.nodeValue = vm.data[key];
            
            new Watcher( vm, node, key,'text'); //创建订阅（观察）者
        }
    }
}
```
那么，watcher中要做什么？
```javascript
function Watcher(vm, node, key, nodeType){
    Dep.target = this;
    this.key = key;
    this.node = node;
    this.vm = vm;
    this.nodeType = nodeType;
    this.update();
    Dep.target = null;
}
Watcher.prototype.get = function(){
    this.value = this.vm[this.key];
};
Watcher.prototype.update = function(){
    this.get();
    if(this.nodeType === 'input'){
        this.node.value = this.value;
    }
    if(this.nodeType === 'text'){
        this.node.nodeValue = this.value;
    }
};
```
首先，将自身付到了全局变量**Dep.target**中，并且保存当前node、vm的状态。  
其次，执行了更新方法，进而执行了个get方法，get处理内容将在下面一步完成。    
在次，根据不同的node类型，采用不同的策略赋值，然后更新视图。 
最后，清空了**Dep.target**，保证了它的唯一性。

为程序添加关键的数据劫持步骤(set,get),也是添加发布的时机:
其中，关键是如何添加get、set方法，这里和Vue一样将data内的数据加到实例对象上。
```javascript
function observe(obj,vm){
    Object.keys(obj).forEach(function(key){
        defineReactive(vm,key,obj[key]);
    });
}

function defineReactive(obj, key, val){
    var dep = new Dep();

    Object.defineProperty(obj, key, {
        get:function(){
            console.log('get方法被调用');
            if(Dep.target){
                dep.addSub(Dep.target);
            }
            return val;
        },
        set:function(newVal){
            console.log('set方法被调用');
            if(val == newVal){
                return;
            }
            val = newVal;

            dep.notify();
        }
    })
}
```
至此，实现简单双向数据绑定。
完整代码：
```javascript
function Dep(){
    this.subs = [];
}
Dep.prototype.addSub = function(sub){
    this.subs.push(sub);
};
Dep.prototype.notify = function(){
    this.subs.forEach(function(sub){
        sub.update();
    });
};

function Watcher(vm, node, key, nodeType){
    Dep.target = this;
    this.key = key;
    this.node = node;
    this.vm = vm;
    this.nodeType = nodeType;
    this.update();
    Dep.target = null;
}
Watcher.prototype.get = function(){
    this.value = this.vm[this.key];
};
Watcher.prototype.update = function(){
    this.get();
    if(this.nodeType === 'input'){
        this.node.value = this.value;
    }
    if(this.nodeType === 'text'){
        this.node.nodeValue = this.value;
    }
};

function observe(obj,vm){
    Object.keys(obj).forEach(function(key){
        defineReactive(vm,key,obj[key]);
    });
}

function defineReactive(obj, key, val){
    var dep = new Dep();

    Object.defineProperty(obj, key, {
        get:function(){
            console.log('get方法被调用');
            if(Dep.target){
                dep.addSub(Dep.target);
            }
            return val;
        },
        set:function(newVal){
            console.log('set方法被调用');
            if(val == newVal){
                return;
            }
            val = newVal;

            dep.notify();
        }
    })
}
//循环遍历node，不同类型分别处理
function compile(node,vm){
    //节点为元素element
    if(node.nodeType === 1){
        if(node.hasChildNodes()){
            var childs = node.childNodes;
            for(var i=0;i<childs.length;i++){
                arguments.callee(childs[i],vm);
            }
        }else{
            if(node.hasAttribute('v-model')){
                var key = node.getAttribute('v-model');
                node.addEventListener('input', function (e) {
                    // 给相应的data属性赋值，进而触发该属性的set方法
                    vm[key] = e.target.value;
                });

                node.value = vm.data[key]; // 将data的值赋给该node
                node.removeAttribute('v-model');

                new Watcher(vm, node, key, 'input');
            }
        }
    }
    //节点为text
    if(node.nodeType == 3){
        var reg = /\{\{(.*)\}\}/;
        if (reg.test(node.nodeValue)) {
            var key = RegExp.$1; // 获取匹配到的字符串
            key = key.trim();

            // node.nodeValue = vm.data[key];
            new Watcher(vm, node, key, 'text'); 
        }
    }
}
//劫持子节点，处理完后返回
function nodeToFragment(node,vm){
    var flag = document.createDocumentFragment();
    var child;

    while( child = node.firstChild){
        compile(child,vm);
        flag.append(child);
    }
    return flag;
}

function Vue(options){
    var el = options.el;
    var dom = document.getElementById(el);
    this.data = options.data;
    var data = this.data;

    //添加数据劫持（set，get）
    observe(data,this);
    
    var flag = nodeToFragment(dom,this);
    dom.appendChild(flag);
}

var vue = new Vue({
    el: 'app',
    data:{
        test: 'Hello world!'
    }
});
```