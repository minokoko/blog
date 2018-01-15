> 学用canvas系列  

## 用canvas画个流星划过的夜空
### 被放在开头的成品
一个简单的demo，先上看例子  
![星空](http://ozp3e2myx.bkt.clouddn.com/shootingstar.gif)  

### 效果分析 
拆分一下最终达到的效果：  
1. 一张背景图
2. 缓动闪烁的背景星星
3. 划过的夜空的流星 

然后，需要了解的基本技术：  
1. canvas绘图-圆形的API
    > arc(x, y, radius, startAngle, endAngle, anticlockwise)
    画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
2. canvas动画效果实现-canvas的刷新与重绘
    canvas动画效果实现原理类似浏览器的页面渲染，不同的是**canvas需要手动编写代码实现重绘**。我们可以通过  
    > content.clearRect(x, y, width, height);
    > //then elements repaint......

    实现刷新重绘。
3. 如何实现流星
    多个圆(圆角矩形)衔接绘制，通过调整颜色透明度来得到类似流星的图形。如下：  
    ![shooting](http://ozp3e2myx.bkt.clouddn.com/shooting.png?222)  
    这是什么不太想呀。。。我们在把它缩小了看看  
    ![shooting-small](http://ozp3e2myx.bkt.clouddn.com/shooting-small.png?222)  
    怎么样？是不是像多了o(*￣3￣)o 
    代码如下  

    ```HTML
    <style>
        canvas{
            margin: 0 auto;
            position: relative;
            left: 50%;
            margin-left: -350px;
            background: #000;
        }
    </style>
    <div>
        <canvas id="canvas" width="700px" height="600px"></canvas>
    </div>
    <script>
        var ctx = document.getElementById('canvas').getContext('2d');
        var drawStar = function (x, y){
            for(var i=0; i<30; i++){
                ctx.fillStyle = 'rgba(200, 255, 255,' + (i+1)/30 + ')';
                ctx.beginPath();
                ctx.arc(x - (i*1.5), (i*1.5)+y, 2, 0, Math.PI*2, true);
                ctx.fill();
            }

        };
        drawStar(400, 200);
    </script>
    ```
4. 如何添加背景图  
背景图的添加，我们通过添加额外的div层作为背景层。如下： 
```HTML
<style>
    *{
        margin: 0;
        padding: 0;
    }
    .bg{
        width: 700px;
        height: 600px;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -350px;
        background: url('bg.jpg') no-repeat center center;
    }
    canvas{
        margin: 0 auto;
        position: absolute;
        left: 50%;
        margin-left: -350px;
        z-index: 1;
    }
</style>
<div>
    <div class="bg"></div>
    <canvas id="canvas" width="700px" height="600px"></canvas>
</div>
<script>
    var ctx = document.getElementById('canvas').getContext('2d');
    var drawStar = function (x, y){
        for(var i=0; i<30; i++){
            ctx.fillStyle = 'rgba(200, 255, 255,' + (i+1)/30 + ')';
            ctx.beginPath();
            ctx.arc(x - (i*1.5), (i*1.5)+y, 2, 0, Math.PI*2, true);
            ctx.fill();
        }

    };
    drawStar(400, 200);
</script>
```
至于为何如此设置背景图，在完成动效时会进行说明。  

### 圆形API-实现星星闪烁  
1. 星星的实现，我们通过画圆来实现就可，实际中也不存在五角形的星星￣□￣｜｜。至于星星的位置，使用随机数随机生成x，y的坐标值即可。 
```javascript
var stars = [];
//星星对象，保存星星状态
function Star(){
    this.x = Math.floor(Math.random()*cas.width);
    this.y = Math.floor(Math.random()*cas.height);
    this.r = 0.3 + Math.random()*1;
    this.alpha = Math.random();
    this.alphaChange = 0.005;
    this.fillStyle = 'rgba(255, 255, 255, '+ this.a +')';

    stars.push(this);
}
Star.prototype.changeOps = function(){
    if(this.alpha >= 1){
        this.alphaChange = -0.01;
    }else{
        if(this.alpha <= 0.3){
            this.alphaChange = 0.02;
        }
    }
    this.alpha = this.alpha + this.alphaChange;
    this.fillStyle = 'rgba(255, 255, 255,'+ this.alpha +')';

    this.x = this.x + 0.05;
    if(this.x > 700){
        this.x = Math.floor(Math.random()*700);
    }
}
Star.prototype.draw = function(ctx, time){
        this.changeOps();

        ctx.beginPath();
        ctx.fillStyle = this.fillStyle;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        ctx.fill();
};
for(var i=0;i< 200;i++){
    new Star().draw(ctx);
}
```
为了便于管理星星的状态，通过Star对象了来储存星星的状态，这样我们就可以为每颗星星设定不同的动画。  
2. 闪烁  
如前言我们通过canvas的刷新重绘实现动画。其原理就是**通过定时器不断的清空canvas，然后再将改变后的星星重绘上去**。关键代码（这里使用requestAnimationFrame）:  
```javascript
function render(){
    ctx.clearRect(0, 0, 700, 500);
    for(var i=0;i< 200;i++){
        stars[i].draw(ctx);
    }
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);
```
这样完成星星背景的变化了，如下:  
![闪烁的星空](http://ozp3e2myx.bkt.clouddn.com/flashstar.gif)

### 圆形API-实现流星  
流星的实现上文已经实现，关键的是流星的运动-划过星空。其根本就是**短时间的坐标值变化**。同样的运用刷新重绘实现坐标的连续变化。  
对于流星的实现，我们同样通过创建对象来保存每个流星的状态。不同的是，流星是由多个圆组成的，需要同时绘制多个圆来实现流星。代码如下：  
```javascript
var shootingStars = [];//保存所有的流星
function ShootingStar(){
    this.offset = 10; //每次位移量
    this.x = (200 + Math.random()*cas.width).toFixed() * 1;
    this.y = -(Math.random()*100).toFixed() * 1;
    this.mx = 0;
    this.my = 0;
    this.count = 30;
    var qx = (0.5 + Math.random()).toFixed(2)*1;
    this.yoffset = this.offset * qx;

    this.stars = [];
    for(var i=0;i<this.count;i++){
        this.stars.push({
            color: 'rgba(200, 255, 255,' + ((i+1)/this.count).toFixed(3) + ')',
            x: this.x - i,
            y: (i*qx) - this.y
        });
    }
    shootingStars.push(this);
}
ShootingStar.prototype.changeOps = function (){
    if(this.mx > cas.width - this.x + 100 && this.my > cas.height - this.y + 100){
        this.mx = 0;
        this.my = 0;
    }
    this.mx = this.mx + this.offset;
    this.my = this.my + this.yoffset;
};
ShootingStar.prototype.moveDraw = function (){
    this.changeOps();
    for(var i=0;i<this.stars.length;i++){
        var tmp = this.stars[i];
        ctx.beginPath();
        ctx.fillStyle = tmp.color;
        ctx.arc(tmp.x - this.mx, tmp.y + this.my, 1, 0, Math.PI*2, true);
        ctx.fill();
    }
};
for(var j=0;j< 5;j++){
    new ShootingStar().moveDraw();
}
```
然后，将重绘方法添加到**render**方法中，实现动画。
```javascript
function render(){
    ctx.clearRect(0, 0, 700, 600);
    for(var i=0;i< stars.length;i++){
        stars[i].draw(ctx);
    }
    for(var j=0;j< shootingStars.length;j++){
        shootingStars[j].moveDraw();
    }
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);
```
### 关于背景图  
现在，背景图需要添加背景图层的原因应该已经能猜到了：背景图是静止不动的，没有必要花费额外的工作去在每次重绘时重画背景图。
### 最终效果  
所有代码完成后，流星划过天空基本完成了。但是观看动画时发现流星划过的尾巴没有了Σ(⊙▽⊙"a")。这里有一个小技巧：
> 现在，我们使用的是 clearRect 函数帮我们清除前一帧动画。若用一个半透明的 fillRect 函数取代之，就可轻松制作长尾效果。
ctx.fillStyle = 'rgba(255,255,255,0.3)';
ctx.fillRect(0,0,canvas.width,canvas.height);

现在又出现了新的问题：*背景图片没有了！*。莫慌，这是因为采用fillRect刷新后，canvas有了自己的填充色，现在我们只需要调整背景图的层级，添加适当的图名度即可。

此篇代码并没有进行性能考虑，仅做抛砖引玉。  
考虑性能可以从以下几个方面：  
1. 画布缓存技术
2. 尽量操作整数像素
3. 缩小画布重绘范围
4. 减少重复的调用canvas API

等等......

> 相关代码[CODE](https://github.com/careycui/blog/tree/master/canvas/night_star)