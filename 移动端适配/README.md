## rem适配  
### 什么是rem 
rem —— Font size of the root element，相对于根元素的字体大小。  
这里的根元素是**html**标签。  
示例：  
```html
<!DOCTYPE html>
<html lang="zh-CN" style="font-size: 10px;">
<head>
    <meta charset="utf-8">
    <title>rem demo</title>
    <style>
        p{
            color: #f0f;
            font-size: 1.4rem;
        }
    </style>
</head>
<body>
    <p>
        这是一行1.4rem的文字。
    </p>
    <div style="font-size: 20px">
        <p>
            这是一行嵌套到设置了font-size为20px的DIV内部的文字。
        </p>
    </div>
</body>
</html>
```
结果，两行P字号都为14px，非html标签设定的font-size对于rem无效。  
还需注意，大部分浏览器默认的字号是16px,若不设定具体的根font-size则以16px为标准。
### 适配原理 
利用了rem相对于**根元素**的这一特性，可以通过计算改变根元素的font-size来控制整体页面的布局。那么，如何计算就是关键。  
一般情况前端开发人员根据设计师给定的设计稿进行开发。而设计稿一般会根据iphone6进行设计，即设计稿宽度为750(注：iphone6 视口宽度为375px，dpr为2，则设备像素为750px)。那我们就以750px的设计稿进行基准REM的计算。  
1. 将750px的稿件10等分，每份为75px，则html的font-size设为75px。即1rem = 75px。（10等分为了便于计算，其他值也可以）
2. 不同设备的视口宽度不同，rem值不同。假设当前的设备视口宽度为x，rem为R，则可以得到：  
    R = x/750*75
3. 想办法获取设备视口宽度x  

上面还提到了几个概念：dpr、视口、设备像素。这里不对这几个概念进行介绍，可自行google。这里要说明一点：可以通过meta标签设置视口缩放，视口缩放与dpr的值相反。即dpr=2，则缩放值为0.5。那么，2中的公式则需要修正为：R = x/750*75*dpr。  
以iphone5为例：  
iphone 5 dpr = 2，视口宽度为320。那么，R = 320/750*75*2，R = 64。即**1rem=64px**。  
### 适配方案  
#### 1 视口缩放比恒为1  
设置页面视口如下的情况下。  
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
```
##### 方案1.1 仅通过CSS控制 
主要通过@media查询来控制不同尺寸屏幕根元素font-size的值。  
关键代码如下：
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <title>Media Rem</title>
    <style>
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .app{
            width: 10rem;
            margin: 0 auto;
            background-color: #fafafa;
        }
        .app-header{
            width: 100%;
            height: 2rem;
            background-color: #fff;
            border: 1px solid #dadada;
            text-align: center;
            font-size: .8rem;
        }
        .app-rec, .app-goods{
            width: 100%;
        }
        .app-rec:after, .app-goods:after{
            content: ' ';
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
        }
        .app-rec__item{
            float: left;
            width: 25%;
            height: 1rem;
            line-height: 1rem;
            vertical-align: middle;
            text-align: center;
            font-size: .5rem;
            border: 1px solid #dadada;
        }
        .app-goods__item{
            float: left;
            width: 50%;
            height: 3rem;
            line-height: 3rem;
            vertical-align: middle;
            text-align: center;
            font-size: 1rem;
            border: .133333rem solid #dadada;
        }
        @media screen and (max-width: 319px){
            html{
                font-size: 32px;
            }
        }
        @media screen and (min-width: 320px){
            html{
                font-size: 32px;
            }
        }
        @media screen and (min-width: 375px){
            html{
                font-size: 37.5px;
            }
        }
        @media screen and (min-width: 414px){
            html{
                font-size: 41.4px;
            }
        }
        @media screen and (min-width: 750px){
            html{
                font-size: 75px;
            }
        }
    </style>
</head>
<body>
    <div class="app">
        <div class="app-header">
            我是头部
        </div>
        <div class="app-rec">
            <div class="app-rec__item">
                推1
            </div>
            <div class="app-rec__item">
                推2
            </div>
            <div class="app-rec__item">
                推3
            </div>
            <div class="app-rec__item">
                推4
            </div>
        </div>
        <div class="app-goods">
            <div class="app-goods__item">
                商品
            </div>
            <div class="app-goods__item">
                商品
            </div>
            <div class="app-goods__item">
                商品
            </div>
            <div class="app-goods__item">
                商品
            </div>
            <div class="app-goods__item">
                商品
            </div>
            <div class="app-goods__item">
                商品
            </div>
            <div class="app-goods__item">
                商品
            </div>
            <div class="app-goods__item">
                商品
            </div>
        </div>
    </div>
</body>
</html>
```
这里在将px转换为rem时推荐使用[SASS](https://www.sass.hk/)，或者可以下载使用IDE的px2rem插件，例如sublime text3的[REM-PX](https://packagecontrol.io/packages/REM%20PX)。  
继续观察这个例子，可以发发现明显的缺陷：**不够灵活，适配繁琐**。  
##### 方案 1.2 javascript动态计算  
两个前提：  
1. javascript可以通过window.devicePixelRatio获取dpr值
2. javascript可以
因为我们限定了前提dpr恒为1，那么如下代码可满足计算需求。
```javascript
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.getBoundingClientRect().width;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '75px';
            }else{
                docEl.style.fontSize = (75 * (clientWidth / 750)) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
```
使用时只需要在页面头部引入即可。  

#### 2 设备缩放不为1  
这个方案下才真真正正的考虑到了不同dpr下页面的展示。上一个方案仅仅是视口越大，相应的元素越大；而这个方案则是依据设备自动设置合适的缩放，进而可以做到元素增大与可视元素增多的平衡。
在此引入下阿里的解决方案：
```javascript
;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));
```
**以上示例源码[demo]()