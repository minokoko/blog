javascript我们常用字面量和new运算符创建对象。 今天了解一下new运算符。

### 创建用户自定义对象  
使用new创建对象，一般需要这么做：  
1. 编写Function函数来定义对象类型，此函数被称为构造函数。  
定义对象类型，需要为其指定名称、属性和方法函数。Function名称(构造函数名称)建议首字母大写。  
2. 通过new来创建对象。  
例如：  
```javascript
function Person(){}
var p = new Person();  
```

### new 做了什么？  
引用Person例子，套用官方解释：  

> 1、 一个继承自Person.prototype的新对象被创建。  
> 2、 使用指定的参数调用构造函数 Person ，并将 this 绑定到新创建的对象。new Person 
> 等同于 new Person()，也就是没有指定参数列表，Person 不带任何参数调用的情况。
> 3、 由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对
> 象，则使用步骤1创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主
> 动返回对象，来覆盖正常的对象创建步骤）

更通俗易懂的解释：  
1. 创建一个object空对象： var obj = {};
2. 将空对象obj.__proto__指向构造函数的prototype: obj.__proto__ = Person.prototype;
3. 空对象obj作为上下文调用构造函数: Person.call(obj)，即将this指定为obj;
4. 执行函数，默认return obj，若有指定return，则返回指定对象;  

我们用代码来尝试还原这一过程：  
定义Person类。Person有name属性和say方法。  
```javascript
function Person(){
    this.name = 'test';
}
Person.prototype.say = function(){
    console.log('I am' + this.name);
}
```  

分别使用new和不是new创建Person对象:  

```javascript
//new 创建自定义对象实例
var p1 = new Person();

//遵循new的原理用其它代码逻辑创建对象实例
//创建一个空对象
var p2 = {};
//继承
p2.__proto__ = Person.prototype;
//指定上下文（this设定）
Person.call(p2);

//判断p1 p2
p1 instanceof Person //true
p2 instanceof Person //true
p1.__proto__ === p2.__proto__ //true
```

### 创建自定义方法实现new
```javascript
function newObj(func){
    var toString = Object.prototype.toString;
    if(toString.call(func) !== '[object Function]'){
        return;
    }
    var obj = {};

    obj.__proto__ = func.prototype;

    var returnObj = func.apply(obj, Array.prototype.slice.call(arguments, 1));
    if((toString.call(returnObj) === '[object Object]' || toString.call(returnObj) === '[object Function]')){
        return returnObj;
    }
    return returnObj;
}
```
