### 概述  
**MV\*(Model-View-x)**是常见的软件架构模式，通过对系统各部分的分离来解决复杂系统架构问题。不同于设计模式，只为了解决一类共性问题而提出的抽象方法。一种架构模式往往包含多种设计模式。  
MVC、MVP、MVVM本质上是一样的，都强调了各部分的分离。其不同在于C(Controller)、P(Presenter)、VM(ViewModel)，其相同之处是MV(Model-View)。  
### 共性-MV  
> Model(数据模型): 封装了业务数据以及数据的处理方法。Model是对整个业务场景的高度抽象，不依赖与其它部分，也就是它定义了数据处理方法，但不关心是如何被调用的。但是，Model的变化会通过一种刷新机制来通知View进行改变(**观察者模式**)。    
View(视图): 数据的界面化展示。视图不应该包含任何业务逻辑。  

为了更好的理解三种模式，我们举个栗子：一个输入框，一个资料卡片。输入人名，enter键确认，可在资料卡上展示部分资料。  
![DEMO](http://ozp3e2myx.bkt.clouddn.com/demo_mvx.jpg)  

#### Model  
Model职责：  
1. 业务数据模型
2. 数据处理相关方法

```javascript
var demoApp = {};

function Model(){
    this.user_name = '';
    this.objs = [{
        userName: 'carey',
        userSex: '男',
        userVip: 'vip1',
        userReset: '111'
    },{
        userName: 'lili',
        userSex: '女',
        userVip: 'vip2',
        userReset: '222'
    },{
        userName: 'momo',
        userSex: '男',
        userVip: 'vip3',
        userReset: '11'
    },{
        userName: 'caicai',
        userSex: '男',
        userVip: 'vip4',
        userReset: '32'
    }];
}
Model.prototype.setUserNameInput = function(val){
    this.user_name = val;
}
Model.prototype.getObj = function(){
    var inputName = this.user_name;
    var i = 0;
    var l = this.objs.length;
    var tmp;

    for(;i<l;i++){
        tmp = this.objs[i];
        if(tmp.userName == inputName){
            break;
        }else{
            tmp = null;
        }
    }
    return tmp;
}

//设定Model
demoApp.Model = Model;
```
#### View  
View职责： 视图层，视图展示。

```javascript
function View(){
    //视图元素
    this.$input = document.getElementById('user_name');

    this.$card = {};
    this.$card.$userName = document.getElementById('name');
    this.$card.$userSex = document.getElementById('sex');
    this.$card.$userVip = document.getElementById('vip');
    this.$card.$userReset = document.getElementById('reset');
}
View.prototype.render = function(data){
    var $card = this.$card;
    for(var key in $card){
        if($card.hasOwnProperty(key)){
            $card[key].innerHTML = data[key.replace(/\$/g, '')];
        }
    } 
}
//设定view
demoApp.View = View;
```

### MVC  
#### 简介
![mvc](http://ozp3e2myx.bkt.clouddn.com/mvc.jpg)  
MVC流程：[由View接受操作指令，触发view绑定事件 >] Controller响应View事件或直接接收操作命令，调用Model对应的数据处理方法 >  Model更新数据，Model并不在乎谁执行了更新方法 > 通过刷新机制(观察者模式)，View更新视图。由此，可得出MVC的通信、数据流动是单向的。  

MVC成功解决复杂系统的管理、分工开发问题。它通过对系统的分割(Model、View、Controller)，并明确各部分的职责，降低了系统的复杂度。但是它的缺陷也是显而易见的。  
缺陷：  
1. 同时维护3个对象和和它们之间的交互，过多的对象和交互会使系统维护困难
2. 对于前端来说，controller其实只占很小的比例，甚至可能没有。这就导致了Model和View将会十分复杂
3. Model与View耦合严重  

这里解释下2。在前端commond主要是DOM Event，在View中已经做好了处理，如果我们还在Controller中在对应的一一声明事件，这层代码将会十分臃肿，业务逻辑也会重复，并且不利于View的组件化。所以在很多框架中Controller可能就只是一层router。  
#### 实现  
观察者模式关联Model与View。  
Model:  
```javascript
var demoApp = {};

function Model(){
    this.user_name = '';
    this.objs = [{
        userName: 'carey',
        userSex: '男',
        userVip: 'vip1',
        userReset: '111'
    },{
        userName: 'lili',
        userSex: '女',
        userVip: 'vip2',
        userReset: '222'
    },{
        userName: 'momo',
        userSex: '男',
        userVip: 'vip3',
        userReset: '11'
    },{
        userName: 'caicai',
        userSex: '男',
        userVip: 'vip4',
        userReset: '32'
    }];

    this.views = [];
}
Model.prototype.setUserNameInput = function(val){
    this.user_name = val;
}
Model.prototype.getObj = function(){
    var inputName = this.user_name;
    var i = 0;
    var l = this.objs.length;
    var tmp;

    for(;i<l;i++){
        tmp = this.objs[i];
        if(tmp.userName == inputName){
            break;
        }else{
            tmp = null;
        }
    }
    return tmp;
}
Model.prototype.register = function(view){
    this.views.push(view);
}
Model.prototype.notify = function(){
    var _this = this;
    var i = 0;
    var views = _this.views;
    var l = views.length;
    var data = _this.getObj();
    if(!data){
        return;
    }
    for(;i<l;i++){
        views[i].render(data);
    }
}

demoApp.Model = Model;
```

使用策略模式关联View与Controller。  

```javascript
function View(controller){
    this.ctrl = controller;
    this.$input = document.getElementById('user_name');

    this.$card = {};
    this.$card.$userName = document.getElementById('name');
    this.$card.$userSex = document.getElementById('sex');
    this.$card.$userVip = document.getElementById('vip');
    this.$card.$userReset = document.getElementById('reset');

    this.bind();
}
View.prototype.bind = function(){
    var ctrl = this.ctrl;
    var _this = this;
    document.addEventListener('keydown', function(e){
        if(e.keyCode == 13){
            ctrl.update();
        }
    }, false);

    _this.$input.addEventListener('input', function(e){
        var val = this.value;
        ctrl.updateInput(val);
    }, false)
}
View.prototype.render = function(data){
    var $card = this.$card;
    for(var key in $card){
        if($card.hasOwnProperty(key)){
            $card[key].innerHTML = data[key.replace(/\$/g, '')];
        }
    } 
}
demoApp.View = View;

function Controller(){
    this.model = null;
}
Controller.prototype.init = function(){
    var model = this.model = new demoApp.Model();
    var view = new demoApp.View(this);

    model.register(view);
    model.notify();
}
Controller.prototype.updateInput = function(val){
    this.model.setUserNameInput(val);
}
Controller.prototype.update = function(){
    this.model.notify();
}

demoApp.Controller = Controller;
```

当我们想实现不同的View响应时，只需要更改Controller实例。  

Model中添加views属性(views 观察者)，并提供了注册观察者的方法和通知方法；View通过策略模式，引入controller实例；Controller在初始化时，创建Model与View实例，在创建View实例时，传入自身作为controller参数，并通过model方法注册view实例。

### MVP  
#### 简介  
MVP是对MVC的优化改良。View将不在和Model进行任何关联，一切都有P进行中转。  
![mvp](http://ozp3e2myx.bkt.clouddn.com/mvp.jpg)  
MVP解耦了View和Model，使各部分的职责更加清晰；此时，View不在依赖Model，完全可以将View抽离做成组件，前提是需要Presenter提供一系列的接口。  
Presenter此时还需要维护View与Model的同步代码，这样最后Presenter会十分臃肿，维护困难。即便我们可以将View抽离为组件，Presenter也是需要频繁改动的。  

#### 实现  
Presenter承担了同步View与Model的任务。  
Model将不在添加观察者。  
```javascript
var demoApp = {};

function Model(){
    this.user_name = '';
    this.objs = [{
        userName: 'carey',
        userSex: '男',
        userVip: 'vip1',
        userReset: '111'
    },{
        userName: 'lili',
        userSex: '女',
        userVip: 'vip2',
        userReset: '222'
    },{
        userName: 'momo',
        userSex: '男',
        userVip: 'vip3',
        userReset: '11'
    },{
        userName: 'caicai',
        userSex: '男',
        userVip: 'vip4',
        userReset: '32'
    }];

}
Model.prototype.setUserNameInput = function(val){
    this.user_name = val;
}
Model.prototype.getObj = function(){
    var inputName = this.user_name;
    var i = 0;
    var l = this.objs.length;
    var tmp;

    for(;i<l;i++){
        tmp = this.objs[i];
        if(tmp.userName == inputName){
            break;
        }else{
            tmp = null;
        }
    }
    return tmp;
}

//设定Model
demoApp.Model = Model;
```
Presenter将关联View与Model。  
```javascript
function View(){
    this.presenter = null;
    //视图元素
    this.$input = document.getElementById('user_name');

    this.$card = {};
    this.$card.$userName = document.getElementById('name');
    this.$card.$userSex = document.getElementById('sex');
    this.$card.$userVip = document.getElementById('vip');
    this.$card.$userReset = document.getElementById('reset');

}
View.prototype.init = function(){
    this.presenter = new demoApp.Presenter(this);
    this.bind();
}
View.prototype.bind = function(){
    var presenter = this.presenter;
    var _this = this;
    document.addEventListener('keydown', function(e){
        if(e.keyCode == 13){
            presenter.update();
        }
    }, false);

    _this.$input.addEventListener('input', function(e){
        var val = this.value;
        presenter.updateInput(val);
    }, false)
}
View.prototype.render = function(data){
    var $card = this.$card;
    for(var key in $card){
        if($card.hasOwnProperty(key)){
            $card[key].innerHTML = data[key.replace(/\$/g, '')];
        }
    } 
}
//设定view
demoApp.View = View;

function Presenter(view){
    this.model = null;
    this.view = view;

    this.init();
}
Presenter.prototype.init = function(){
    var model = this.model = new demoApp.Model();
    var view = this.view;
    if(model.getObj()){
        view.render(model.getObj());
    }
}
Presenter.prototype.updateInput = function(val){
    this.model.setUserNameInput(val);
}
Presenter.prototype.update = function(){
    var data = this.model.getObj();
    this.view.render(data);
}

demoApp.Presenter = Presenter;
```
以View为启动入口，启动时创建对应的Presenter实例，并在Presenter关联好当前的View实例与创建的Model实例。当View触发事件时，由Presenter响应。此时，将调用对用Model数据处理方法，数据更新完成后，再调用View render方法更新视图。  

### MVVM
#### 简介
VM全称ViewModel，即Model of View。很好理解，视图的模型，用Model的形式表示视图的数据、事件等等。  
![mvvm](http://ozp3e2myx.bkt.clouddn.com/mvvm.jpg)  
MVVM提出了视图建模的理念。把过去由事件驱动的编码形式转为了数据驱动，使开发人员更加专注业务逻辑。MVVM封装了MVP中Presenter的手动同步，采取数据绑定的形式，实现同步自动化。  
但是同样的也对开发人员提出了新的要求：  
1. 思维逻辑的转变，以数据为驱动；
2. 要对底层的同步实现有充分的了解，必要时可自己实现；
3. 可以透过数据现象看到代码本质，能够解决更深层次的BUG、性能问题；
4. 对新技术的接受能力，毕竟此时前端开发将于jquery时代完全不同，不同MVVM框架可能会有不同的表现形式。

Vue、Angular、ember、react都是MVVM框架。实现我们将以Vue为例。  
#### 实现  
这里讲不在给出具体代码，有兴趣的可以自行查看Vue的实现。  
关于MVVM还有一些必须要关注理解的技术。  
1 数据绑定 DataBinding
以Vue为例，准确的说是**双向数据绑定**。可以简单的理解为，Model改变时自动更新View，View改变时自动更新Model，而不需要手动同步更新。 
在主流的MVVM框架中实现数据绑定的技术大致有以下几种：  
1. 数据劫持+发布订阅模式
2. 发布订阅模式
3. 脏检查  

2 状态管理  
MVVM为开发人员提供了更便捷的开发思路。同样的也有隐患，数据状态失控，这将是开发过程需要密切关注的问题。  
Vue提供了Vuex管理状态。
Reat有Flux、Redux、Mobx等等管理状态。


### 相关代码
[CODE](https://github.com/careycui/blog/tree/master/%E6%A1%86%E6%9E%B6%E5%B7%A5%E5%85%B7)

