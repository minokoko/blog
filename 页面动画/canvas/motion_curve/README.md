> 学用canvas系列  

随着HTML5定稿，CSS3动画、canvas动画、svg动画，各种形式的动画开始应用到各式各样的页面中。年关将近，对这一年的动画做一个总结。  
## 动画效果-运动轨迹，运动曲线  
### 为什么需要动画效果？  
无论是CSS3动画、javascript动画、canvas动画、svg动画，它们服务的目标是一致的，均是为了增强页面的表现力。  
简单来说动画效果可以从以下两个方面提高页面效果:  
1. 视觉效果
    这点我们可以从现在风靡的H5海报去理解。  
    举个例子：在冬至时要吃饺子(习俗，习俗，我也不知道为啥o(╯□╰)o)，刚好要做一个普及这一习俗的H5海报页，我们可以通过飘飞的雪花、热气腾腾饺子等去提高页面的表现力，营造出冬至的氛围。  
    ![冬至飘雪](http://ozp3e2myx.bkt.clouddn.com/snow2.gif)  
    这里就有动画效果对视觉效果的提升：**营造氛围，更契合主题**。
2. 视觉引导
    重点突出‘引导’，可以间接的提示页面各个部件的位置，作用。  
    举个例子：购物网站在将产品加入购物车时，产品飞入了边缘的购物车图标上。如下：  
    ![视觉引导](http://ozp3e2myx.bkt.clouddn.com/lead.gif)  
    这里就有动画效果的引导作用：**1. 告诉用户购物车的位置 2. 告知用户加入购物车成功**  

无论哪种类型的动画效果，“自然”的动画才能有用于页面。

### 自然的动画效果  
自然的动画效果应该符合我们现实生活中物理运动轨迹，我们应该避免做出形而上学的动画效果。例如，小球弹跳的动画，路径上是随着弹跳高度越来越小直至不动，速度上会越来越慢直至为零。而这些改变的背后，是可以用牛顿运动方程式表达的。也就说要想做出自然的动画，我们需要掌握各种函数曲线(书到用时方恨少/(ㄒoㄒ)/\~\~)......。  

再看看我们做过的、介绍这些动画效果，其背后最大的功臣就是以下两位：  
1. 运动轨迹的变化  
2. 运动曲线与缓动函数  

而它们哥俩包含了各种各样的函数表达式。

### 运动轨迹  
运动轨迹从简单直线运动到复杂的无规则运动都是有自己的函数表达式。这里介绍几种动画效果中常用的运动轨迹表达式。  

注：以下demo均采用canvas实现
#### 1. 圆形轨迹
    > 相关表达式
    > (x-a)^2+(y-b)^2=r^2;
    > a b为圆心，x y为坐标
    > 通过弧度求x y坐标
    > x = r \* cos(wt)
    > y = r \* sin(wt)  

![三角函数](http://ozp3e2myx.bkt.clouddn.com/sanjiao.png)

小球运动-圆形轨迹demo  
![小球运动-圆形](http://ozp3e2myx.bkt.clouddn.com/arcdemo.gif)  
画圆关键：
```javascript
//R：常量圆形轨迹的半径；
//a , b常量 圆形轨迹的圆心
var x = R * Math.cos(deg*Math.PI/180) + a;
var y = R * Math.sin(deg*Math.PI/180) + b;

requestAnimationFrame(move);
```

这里需要注意：**在关于角度的计算表达式中一般使用弧度制**， 关于弧度与角度的转换：  
    > 1度 = Math.PI/180
    > 1deg = 180/Math.PI

#### 2. 椭圆轨迹  
椭圆其实我是很抗拒的，连圆相关的计算表达式都还给老师，别说它了。咳咳，仍然还是需要了解椭圆的。  
照例表达式如下：  
> |PF1|+|PF2|=2a (2a>|F1F2|)

(๑•ᴗ•๑) 这是个啥。。。。。。
> 椭圆（Ellipse）是平面内到定点F1、F2的距离之和等于常数（大于|F1F2|）的动点P的轨迹，F1、F2称为椭圆的两个焦点。其数学表达式为：|PF1|+|PF2|=2a（2a>|F1F2|）。  
> 方程式：  
> 焦点在X轴, x^2/a^2 + y^2/b^2 = 1
> 焦点在Y轴，y^2/a^2 + x^2/b^2 = 1

如果想更深入的拾取高中知识，请自行解决。   
转化成我们可用的计算表达式:  
> x = a*cos(wt) ， y = b*sin(wt)

在canvas中没有提供画椭圆的API，这里通过椭圆方程式利用lineTo方法画椭圆(其他绘制椭圆的方法，可自行思考或搜索)。  
关键代码：  
```javascript
function drawEllipse(context, x, y, a, b){
     //max是等于1除以长轴值a和b中的较大者
    //i每次循环增加1/max，表示度数的增加
    //这样可以使得每次循环所绘制的路径（弧线）接近1像素
    var step = (a > b) ? 1 / a : 1 / b;
    context.beginPath();
    context.strokeStyle="#ff0";
    context.moveTo(x + a, y); //从椭圆的左端点开始绘制
    for (var i = 0; i < 2 * Math.PI; i += step)
    {
        //参数方程为x = a * cos(i), y = b * sin(i)，
        //参数为i，表示度数（弧度）
        context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
    }
    context.closePath();
    context.stroke();
}
```
小球运动-椭圆轨迹  
![小球运动-椭圆轨迹](http://ozp3e2myx.bkt.clouddn.com/ellipse.gif)  
椭圆轨迹关键:  
```javascript
//ar, br：常量椭圆轨迹的焦点距离；
//a , b常量 椭圆轨迹的中心
var x = ar * Math.cos(offset*Math.PI/180) + a;
var y = br * Math.sin(offset*Math.PI/180) + b;

requestAnimationFrame(move);
```
#### 3. 抛物线轨迹
关于抛物线，截取圆或者椭圆的某一部分可以当做抛物线，或者贝塞尔曲线也可以模拟出抛物线。但是，抛物有着自己的函数表达式。  
照例表达式如下:  
> y=ax^2+bx+c
为了便于计算，我们都假设抛物线经过原点(0, 0)，那么可以得到**y=ax^2+bx**。a类似常量弧度由我们给定值，剩下的只需要求解b的值。
> b = (y-ax^2)/x

另外一个关键知识点，抛物线线上的相邻点的切线可以反映出抛物线的轮廓，切线的公式：
> y` = 2ax + b

![切线相连可以看到抛物线轮廓](http://ozp3e2myx.bkt.clouddn.com/qiexian.jpg)

那么，我们就可以通过多个点的切线相连得到抛物线。关键是如何确定每个坐标点。  
每次坐标的增量或者称为变化率(专业词)，我们也可以通过一些切线相关的表达式计算。  
t1 t2两点无线接近，割线就是变成了切线。那么，我们可以得到增量(变化率,切线,斜率)的表达式:  
> x^2+y^2=incr
> 公式推导
> tangent = y` = y/x
> y = tangent*x
> (tangent*x)^2 + x^2=incr
> 转化为js表达式
> x = Math.sqrt(incr/(tangent*tangent+1));

![切线求速率](http://ozp3e2myx.bkt.clouddn.com/qianxian_speed.jpg)  
通过推到出的公式就可以画出我们所需要的抛物线轨迹。 

关键代码：  
```javascript
function ParaCurve(ctx,start,target,a){
    this.start = start;
    this.target = target;
    this.dx = target.x - start.x;
    this.dy = target.y - start.y;
    this.a = a || 0.002;//a>0抛物线开口向上，a<0抛物线开口向下
    this.b = (this.dy-this.a*this.dx*this.dx)/this.dx;

    this.draw(ctx);
}
ParaCurve.prototype.draw = function (ctx){
    var b = this.b;
    var a = this.a;
    var start = this.start;
    var ox = start.x;
    var oy = start.y;
    var dx = this.dx;
    var startx = 0;
    var starty = 0;
    var incr = 0;

    ctx.beginPath();
    ctx.strokeStyle="#ff0";
    ctx.moveTo(ox, oy);
    while(startx < dx){
        incr = 2*a*startx + b;
        startx = startx + Math.sqrt(16/(incr*incr + 1));
        starty = a*startx*startx + b*startx;
        ctx.lineTo(ox+startx, oy+starty);
    }
    ctx.stroke();
}
```
小球运动-抛物线  
![抛物线](http://ozp3e2myx.bkt.clouddn.com/para.gif)
#### 4. 三角函数类轨迹
选取正弦曲线作为案例。  
照例表达式:  
> y=sin(x)

关键代码： 
```javascript
function drawSin(ctx, x0, y0, w, h){
    ctx.beginPath();
    ctx.strokeStyle='#ff0';
    var x = 0;
    var y = 0;
    ctx.moveTo(x0, y0);
    for(var i=0;i<=2*Math.PI;i+=0.01){
        x = i*w/(2*Math.PI);
        y = Math.sin(i)*h;
        ctx.lineTo(x0+x, y0 + y);
    }
    ctx.stroke();
}
drawSin(ctx, 0, 200, 200, 100);
```
![正弦曲线](http://ozp3e2myx.bkt.clouddn.com/sin.gif)

**y=sin(x)**我们称之为标准纯正的正弦函数公式，而实际应用的通用正弦曲线表达式为:  
> y=Asin(kx-wt-Φ)

A称之为波幅(纵轴偏移量)，k为可控制周期数(波数)，wt为改变的弧度，Φ为相偏移(横轴左右)。
这里还有一个相关实例[正弦波动画](https://github.com/careycui/blog/tree/master/%E9%A1%B5%E9%9D%A2%E5%8A%A8%E7%94%BB/canvas/wave)
![正弦波动画](http://ozp3e2myx.bkt.clouddn.com/sin_wave.gif)
#### 5. 扩展三角函数-应用于元素自身改变
我们可以通过三角函数的正弦曲线来获得一组循环的变量，使用这组变量就可以完成一个脉冲动画。  
> y = sin(x) + 1
> 0<= y <=1

完成效果图：  
![脉冲](http://ozp3e2myx.bkt.clouddn.com/pulse.gif?1111)

如果有兴趣可以对该例进行扩展，完成一个完整的音频谱的背景。

**同样的，我们都可以扩展这些函数表达式，以它们为变化因子，应用到不同的动画中。**

最后，附上一个关于运动轨迹的综合例子  

![地图转移](http://ozp3e2myx.bkt.clouddn.com/map.gif)  

代码:[源码](https://github.com/careycui/blog/blob/master/%E9%A1%B5%E9%9D%A2%E5%8A%A8%E7%94%BB/canvas/map/map.html)

### 运动曲线
对于动画效果，运动曲线其实指的就是某一动画属性在一段时间内的速度变化。它其实是由动画属性变化量连接时间变化量的点组成一条线段。它存在多种形式。  
#### 理解运动曲线  
一个例子，小球在4s内移动1000个像素点。如下图：  
![匀速直线运动](http://ozp3e2myx.bkt.clouddn.com/uniformline.gif)  
> 相关代码：[CODE](https://github.com/careycui/blog/tree/master/%E9%A1%B5%E9%9D%A2%E5%8A%A8%E7%94%BB/canvas/motion_curve/twoAxis.html)  

上面是一个简单的匀速直线运动曲线，小球从始到终的运动速度是一样。通过我们所学的物理知识可知：v = Δy/Δt。v就是我们常说的**速度**。那么，v就是所画出的那条斜线。 在生活的中速度是由方向，我们称之为速度向量。
#### 速度向量
速度向量不同于速度，速度向量还包含**方向**这一重要因素。而方向对于动画来说必不可以，确定轨迹后还要确定沿轨迹运动的方向。
对于平面（2d动画）来说，可以将速度向量分为两类：  
1. 沿单一轴速度向量
2. 沿双轴速度向量

对于单一轴来说，很好理解。就如上图一样小球一直沿X运动，速度向量的方向也是沿x轴。同样Y轴也一样。这里不过多介绍。 

双轴速度向量涉及到速度的分解与合成。这里我们要用的我们的三角函数知识。  
看下面的例子：  
![斜向上匀速直线运动](http://ozp3e2myx.bkt.clouddn.com/uniformline_direction.gif)  
> 相关代码：[CODE](https://github.com/careycui/blog/tree/master/%E9%A1%B5%E9%9D%A2%E5%8A%A8%E7%94%BB/canvas/motion_curve/uniform.html)  

如例子所示小球是沿着x y轴一定的夹角向上运动的。这时小球的速度可分解为沿X Y轴的速度。此时我们就可以利用三角函数去求得这个夹角，然后分别求得X Y上的速度。  
关键代码：  
```javascript
var deg = Math.atan2(dy, dx);
var sin = Math.sin(deg);
var cos = Math.cos(deg);
var vx = v*cos;
var vy = v*sin; 

//同样的移动距离  
var dx = d*cos;
var dy = d*sin;
```

然而，现实生活的运动中速度并不是一成不变。运动曲线也可能是多种多样的。如下所示：  
![运动曲线](http://ozp3e2myx.bkt.clouddn.com/css-animations-motion-curves-fig26_large-opt.png)


所以我们还需要了解另外一个重要的概念：**加速度**。

#### 加速度
同速度向量一样，加速度也是向量，包括方向。  
对于平面（2d动画）来说，可以将加速度分为两类：  
1. 沿单一轴加速度
2. 沿双轴加速度  

一个简单的例子阐述加速度，加入了匀速运动的对比。  
![匀加速运动](http://ozp3e2myx.bkt.clouddn.com/acc.gif) 

至于沿双轴的加速度，不在赘述。同样需要用到三角函数来计算加速度的合成和分解。
关键代码：  
```javascript
var ax = a*Math.cos(deg);
var ay = a*Math.sin(deg);

var vx += ax;
var vy += ay;
```

> 注：因为加速度是有方向的，所以存在加速运动和减速运动

总结一下:  
1. 速度和加速度的是控制动画运动的基本元素，它们都是向量，即都包含**方向**
2. 速度和加速度的关键是**合成与分解**，其中运用到了三角函数

这里介绍一下-重力加速度。
##### 重力加速度  
重力加速度，高中物理知识，如果都还给老师了的话，先自己查阅一下。 
重力加速度对应的坐标系中：元素在Y轴的一个加速度，加速度的数值控制着元素的降落；当元素接触到边界时(对应canvas的width/height)，小球反弹回来，因为动能衰减弹跳高度将小于上一次，循环往复直至静止。  
![弹跳小球](http://ozp3e2myx.bkt.clouddn.com/gravity.gif)  
> 相关代码：[CODE](https://github.com/careycui/blog/tree/master/%E9%A1%B5%E9%9D%A2%E5%8A%A8%E7%94%BB/canvas/motion_curve/gravity.html)  

#### 多变的运动曲线
熟悉了加速度后，在回到那条弯曲的运动曲线上。不知道还记不记得我们在会抛物线轨迹时用到的**切线**。  
![切线相连可以看到抛物线轮廓](http://ozp3e2myx.bkt.clouddn.com/qiexian.jpg)  
有没有发现什么？其实，切线就是该点的**速度**。那么，运动曲线就是很多个切点线段组成的曲线，匀速运动恰好所有的切点都位于一条直线上。  
我们再看一个对比的例子：  
1. 第一个小球4s移动800px的长度，v=200
2. 第二个小球4s移动600px的长度，v=150
3. 第三个小球4s移动1000px的长度，v=250

如下:  
![速度对比](http://ozp3e2myx.bkt.clouddn.com/uni_compare2.gif)  
> 相关代码：[CODE](https://github.com/careycui/blog/tree/master/%E9%A1%B5%E9%9D%A2%E5%8A%A8%E7%94%BB/canvas/motion_curve/uniform_com.html)   

得到了什么结论？  
思考。。。。。。  
结论：**速度线与x轴的夹角越小，速度值越小。或者，反应到运动曲线上则是，线段越陡速度越快，线段越平缓速度越慢。**  
### 写在最后  
我们的初衷：如何做更自然的动画效果？  
我们通过阐述动画效果中涉及到路径变化、运动速度变化两个方面来将动画效果与我们在现实生活中的运动相结合，让我们看到更自然的动画效果。这也正是动画效果的两个技巧：  
1. 寻找参照物
2. 恰到好处的easing-速度变化  

