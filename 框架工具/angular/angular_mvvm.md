### MVVM核心原理  
MVVM模式是**Model-View-ViewModel**的简称。其是MVC的扩展和优化，都是通过分离关注点优化应用开发。MVVM关键是内部双向绑定，并引入ViewModel(视图模型)，来实现Model与View的“自动同步”。进一步解耦了View与Model。  
其核心思想：提出了ViewMode(视图模型)理念，由ViewModel构建视图数据，最为View状态的抽象。然后，通过双向绑定技术关联ViewModel与View。这样，ViewModel中数据的变更可以直接反馈到View上，View视图的改变也直接同步到ViewModel上。  
![MVVM](http://ozp3e2myx.bkt.clouddn.com/mvvm.jpg)  
MVVM的关键是：ViewModel的建立、双向绑定的实现。  
### angular中MVVM  
angular组织代码的风格，更像是MVC模式。在angular中，View是包含angular声明指令的HTML模板；Controller并不是承担我们所熟知的Controller职责，它是$scope的组织者；Model由angular中factory(service)提供。  
然而，不同于MVC时，V与Model没有直接关联，而是通过$scope联系；也不需要手动同步Model与View，双向绑定机制帮我们实现了"自动同步"。所以angular已经具备MVVM的特性，也保留了MVC的设计模式。说Angualr为MVVM框架是可以的。  
在angular中：  
1. View指的是包含angular指令的视图模板
2. ViewModel，angular中$scope充当这个角色
3. Model封装了相关的业务数据，主要是通过ajax从后台获取。在angular中由service封装处理这些Model数据。
4. Controller，angular中的controller主要是操作ViewModel即$scope的。同时，它也组合了angular提供的多个service模块。

#### MVC
#### 双向绑定
### 实现双向绑定