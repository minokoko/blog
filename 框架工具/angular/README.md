### 概述
> 通篇文章以AngularJS v1.6.0为基准

最近，工作职责被调换了一下，负责的项目与angular相关。以前angular用也就用了，没有考虑过内部原理，源码这些。趁着这次机会整理一下。  
angular源码大概有3w多行......没有必要通读源码，这即耗费时间又很容易让人迷失岛angular独特的代码逻辑中，得不偿失。为了能过做到读而有用，将技术转化为自己的，我们应该从angular核心去入手。  
angular核心：  
1. MVVM
2. 模块化
3. 依赖注入
4. 指令系统

### MVVM  
对于angular来说，我们组织代码的形式更容易让我们认为是MVC模式。但是它已具备的了MVVM的特性。angular中的$scope对象对等于ViewModel，controller层是ViewModel的组织者。  
其实，无论是MVC还是MVVM，都是为了解决问题而存在；MVVM又是对MVC扩展优化，没有必要纠结于它属于什么模式，关键是知道如何利用它解决问题。  
理解angular这部分，从两个方面出发：MVC、双向绑定($scope)。  
### 模块化  
angular官方文档介绍，可以将模块当成项目中不同部分的容器。例如，controllers、services、filters、directives等。  
> You can think of a module as a container for the different parts of your app – controllers, services, filters, directives, etc.

根据官方文档，模块化有以下优势：  
1. 声明式启动过程简单易懂；
2. 可以将代码打包成可重用模块；
3. 模块可以以任何顺序加载，因为本身模块是延迟执行的；
4. 单元测试可以只加载指定相关模块，这让测试执行单纯快速；
5. 可以加载额外模块重写配置来完成端到端的测试；

angular建议将应用拆分成一下模块： 
1. 业务功能模块
2. 可重用的模块，例如指令、过滤器
3. 一个依赖以上模块的应用级模块，并包含初始化代码

这里angular中的module与我们所知AMD/CMD、commonjs不同，它是一种命名空间namespace或者package，表示一类功能单元的集合。理解angular的module涉及到了module的创建、加载、依赖。  
### 依赖注入  
依赖注入全称Dependency Injection(DI)。它是一种软件设计模式，它用于解决组件如何加载其它依赖。  
我们在书写某个特定View对应的Controller时，会以如下形式组织代码：  
```javascript
angular.module('someApp', ['xxx.ui', 'xxx.helper']).
    service('someServ', someService).
    controller('someController', ['$scope', '$timeout', 'someServ', function($scope, $timeout, someServ){
    ...
    }]);
```
这种写法**[['$scope', '$timeout', 'someServ', function($scope, $timeout, someServ){...}]**是angular推荐的首选写法，被称为inline Array Annotation。这种写法的好处：我们可以自由的定义对应的实现方法，而只要与注入参数名一致；而且，它是按需加载的。  
依赖注入还涉及到一个原则：依赖倒置原则。充分理解了此原则有利于加入对依赖注入的理解。  
### 指令系统  
> At a high level, directives are markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell AngularJS's HTML compiler ($compile) to attach a specified behavior to that DOM element (e.g. via event listeners), or even to transform the DOM element and its children.

指令是DOM元素上的标记，使元素拥有特定的表现以及行为。当然，这些前提是在angular环境下。  
指令系统为我们提供一种全新的页面开发形式-它允许你创造可重复利用的单元。你完全可以用一个个不同的单元去组织项目中的所有页面。它体现了组件化开发的思想，在某种意义上它是web components的一种实现。  
了解组件化开发和web components标准有助于了解指令系统重要作用，开发理念。

### 总结  
四个个核心点，后面会从原理解析、源码解析、自行实现三方面深入理解。