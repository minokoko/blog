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

