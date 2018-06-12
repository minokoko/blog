### javascript常用代码段  
#### 数据类型判断  
```javascript
function classValueOf(obj){
    if(obj === null){
        return 'Null';
    }
    if(obj === undefined){
        return 'Undefined';
    }
    return Object.prototype.toString.call(obj).slice(8, -1);
}
function isString(str){
    return (classValueOf(str) === 'String');
}
function isNumber(num){
    return (classValueOf(num) === 'Number');
}
function isArray(arr){
    if(Array.isArray){
        return Array.isArray(arr);
    }
    return (classValueOf(arr) === 'Array');
}
function isFunction(fn){
    return (classValueOf(fn) === 'Function');
}
function isNull(o){
    return (classValueOf(o) === 'Null');
}
function isUndefined(o){
    return (classValueOf(o) === 'Undefined');
}
```

### <=IE9浏览器<div>、<a> 在没有内容的情况下点击、hover无效  
**2017/10/10**  
添加**background-image:url(about:blank)**可解决  

### 查看浏览器是否支持video标签  
```javascript
var _enabledVideo = !!(document.createElement('video').canPlayType);
```

### Edge浏览器scrolltop全屏滚动无效
**2018/5/25**  
为给html、body设置最小高度为100%。  
```css
html, body{
    min-height: 100%;
}
```