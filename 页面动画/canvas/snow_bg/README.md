> 学用canvas系列  

## 用canvas画个飘雪
### 被放在开头的成品
一个简单的demo，先上看例子  
![星空](http://ozp3e2myx.bkt.clouddn.com/winter.gif?1111)  

### 效果分析 
拆分一下最终达到的效果：  
1. 一张背景图，随便百度找来的
2. 飘落的雪花

至于背景图的添加和基本圆形API，前面文章已有介绍[流星](http://www.tudoustore.com/2018/01/02/CANVAS%E7%B3%BB%E5%88%97-%E6%B5%81%E6%98%9F%E5%88%92%E8%BF%87%E5%A4%9C%E7%A9%BA/#more)，重点介绍下**如何实现飘落的雪花**。同样的，仍然拆分下效果：  
1. 雪花
2. 飘落-位移变化

### 实现飘落的雪花
#### 雪花  
我们用白色的圆形来表示雪花，通过控制圆形的大小来表示远近。画圆很简单，采用canvas的**arc**API完成。完成结果如下：
```javascript
ctx.fillStyle = '#fff';

ctx.beginPath();
ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
ctx.fill();
```
![白色雪花](http://ozp3e2myx.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-01-11%2014.14.40.png)  
现在雪花的点缀显得十分突兀，我们现在需要让雪花更好的融入到背景中。解决办法就是：虚化圆形边缘。可以通过以下两种方法实现：  
1. 添加阴影**shadowColor**
2. 添加渐变填充色**createRadialGradient**

实际实现下来，**1**的完成度不十分符合，顾采用**2**的方案。结果如下：  
```javascript
var rg = ctx.createRadialGradient(this.x, this.y, this.r/4, this.x, this.y, this.r);
rg.addColorStop(0, "rgba(255,255,255,1)");
rg.addColorStop(1, "rgba(255,255,255,0.1)");
ctx.fillStyle = rg;
// ctx.fillStyle = '#fff';

ctx.beginPath();
ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
ctx.fill();
```
![完成版雪花](http://ozp3e2myx.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-01-11%2014.24.38.png)
#### 飘落-位移变化
飘落的本质就是坐标X、Y的连续变化。那么，关键就是每次画布刷新更改X、Y的值。  
首先，分析下雪花的运动轨迹：Y轴的持续增加和X轴的缓慢变化。
Y轴的持续增加和X轴的缓慢变化:  
```javascript
// s: start, e: end
function getRnd(s, e){
    return Math.floor(Math.random()*(e - s) + s);
}
// 雪花对象，存储雪花状态、行为
function Snow (ops){
    this.x = getRnd(0, maxWidth);
    this.y = (ops && ops.y) || getRnd(0, maxHeight);
    this.r = getRnd(2, 10); //雪花大小，半径
    this.deg = getRnd(-10, 10);
    this.offset = 0.5 * this.r; //Y轴变化，1/4个圆形
    this.offsetX = (Math.tan(this.deg*Math.PI/180)*this.offset).toFixed(2) * 1;//X轴通过正切函数获得
}
Snow.prototype.changePos = function(){
    this.y = this.y + this.offset;
    this.x = this.x + this.offsetX;
}
Snow.prototype.draw = function (ctx){
    this.changePos();
    var rg = ctx.createRadialGradient(this.x, this.y, this.r/4, this.x, this.y, this.r);
    rg.addColorStop(0, "rgba(255,255,255,1)");
    rg.addColorStop(1, "rgba(255,255,255,0.1)");
    ctx.fillStyle = rg;
    // ctx.fillStyle = '#fff';

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fill();
}
```
### 最终效果  
添加好画布持续刷新重绘方法后，就基本完成了飘雪的动画。成品还存在一个问题：**性能，重绘添加雪花时会出现卡顿，帧数掉到30左右。**这篇文章对如何改进性能不在进行深入探索，提供一条思路：可以通过添加雪花的离屏绘制缓存提高性能。

> 相关代码[CODE](https://github.com/careycui/blog/tree/master/canvas/snow_bg)