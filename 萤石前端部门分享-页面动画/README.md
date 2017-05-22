## 一 我们为什么要使用动画效果？  
在做某个动画效果之前，可能没有考虑过**为什么**，都是顺着感觉走的。你可能会感觉: 
1. 这是需求方让我做的，我满足了他们的需求
2. 效果好酷
3. 最近流行在页面添加效果
4. 周围的同事都在用啊
5. 呦，新技术搞一搞。。。  

等等  
当我们真的这样做，我们的页面也完蛋了，简单粗暴的反面例子  
[超棒动画,呵呵！](https://careycui.github.io/web-utils/)  
体验这个页面发现了什么？  
1. 流畅性没有保证
2. 兼容性
3. 多而无用的动画
4. 没有达到页面预期的表达效果  

所以需要正确的理解为什么需要运用动画效果。总的说动画效果作用:  
1. 提升用户体验度
2. 传达更深层次的气息  

简单的理解动画效果与用户体验的关系：  
交互上：
1. 元素反馈(hover,btn)
2. 页面平缓过渡
3. 反应真实物理作用  

传达信息:  
1. 营造氛围，例如符合节日气息
2. 达到与用户心情的共鸣（微信表情:生日快乐,想你了,XOXO）  

总之，动画效果**增强了页面的表达效果**
```
graph TD
一(为什么)-->二(应用场景)
```
## 二 动画效果应用场景  
那么，我们可以基本知道什么场景可以应用动画效果:  
1. 场景/元素
loading、按钮反馈、全屏切换、页面元素变换、页面交互引导、弹窗、下拉、轮播、滚动切入等等
2. 总结概括  
1、重点突出，吸引注意力
2、页面过渡转换
3、元素交互变换
4、向用户传递信息 
```
graph TD
二(应用场景)-->三(添加动画效果)
```
## 三 开始添加动画效果  
**假定有了一定的代码编写基础。**  
我们首先需要考虑：**如何实现动画**  
#### JS动画  

通过一个定时器setInterval/setTimeout间隔来改变元素样式，动画结束时clearInterval/clearTimeout即可。以及新的动画API requestAnimationFrame   
优点:  
1. 可控性强
2. 兼容性好  

缺点:  
1. 性能问题：往往伴随着大量的DOM操作
2. 缺乏统一标准：轮子一大堆，但是不知道有没有你熟悉的自行车。
3. 加重HTTP请求负担  

通过定时器实现动画有两种方式:保时动画,保帧动画。通常采用保帧动画。 
保时动画: 动画时长 = 时间差/(位移差/总位移)
保帧动画: 动画时长 = 总帧数 * 帧间隔
```javascript
//基于帧数的动画--保证播放的帧数，放弃播放时长和精度
//依据浏览器的动画帧数得到所需要运动的次数
function aini_FPS(el,opt){
    var FPS = 1000/13;
    el.style.position="absolute";
    el.style.left = '0px';
    var duration = opt.duration||1000;//动画周期
    var t = 0,
        step=Math.floor((duration/1000)*FPS);//以当前帧数，完成移动所需要的步数

    var X = pageX(el),
        Y=pageY(el);//获取当前元素页面位置

    var dx = opt.X-X,
        dy = opt.Y-Y;//计算出最终位置

    var startTime = new Date().getTime();
    var endTime = new Date().getTime();

    function _aini()
    {
        if(t<step)
        {
            el.style.left=tween.Linear_FPS(t,X,dx,step)+"px";//先只在X方向运动
            t++;
            setTimeout(arguments.callee,1000/FPS);
        }
        else
        {
            el.style.left=opt.X+"px";
            endTime = new Date().getTime();

            document.getElementById('info').innerHTML = 'duration: '+(endTime-startTime)+', step : '+t;
        }
    };
    _aini();
}

//基于时间的动画--保证动画时长，牺牲掉精度
//由时间进度计算出当前动画进度
function aini_Time(el,opt){
    var startTime = new Date().getTime(),
        endTime = new Date().getTime(),
        step = 0;

    var duration = opt.duration||1000;

    el.style.position="absolute";
    el.style.left = '0px';

    var X = pageX(el),
        Y=pageY(el);
    var dx = opt.X-X,
        dy = opt.Y-Y;

    function _aini(){
        var curTime = new Date().getTime();

        var dt = (curTime-startTime);//时间差

        var styleLeft = el.style.left,
            left = styleLeft.substring(0,styleLeft.indexOf('px'))*1;

        if(dt<=duration){
            left = tween.Linear_Time(X,dt,duration,dx);
            el.style.left = left+'px';

            setTimeout(arguments.callee, 13);
            step++;
        }else{
            el.style.left = opt.X+"px";
            endTime = new Date().getTime();

            document.getElementById('info1').innerHTML = 'duration: '+(endTime-startTime)+', step : '+step;
        }
    }
    _aini();
}
```  
#### CSS3动画  
两种方式实现: transition,animation  
优点:  
1. 易于实现，提供丰富的基础动画  
2. 统一标准(一定程度)  
3. 性能更好，速度更快，采用硬件加速  

缺点:  
1. 兼容性问题
2. 可控性差,无法动态修改或定义动画
3. 动画堆叠/同步问题（假设有一个球，动画效果1、从顶部掉落，模拟真实掉落场景；2、小球开始在底部心跳跳动,循环）  

**注，常用的CSS3动画都是补间动画**  
#### HTML5动画  
HTML5定义的绘图方式:**canvas/svg/webGL**。其中SVG是基于XML标签定义的，通过定义animate标签实现动画;canvas/webGL通过刷新画布实现动画。  
SVG动画  
优点：
1) 矢量图形，不受像素影响，这个特性在不同的平台或者媒体下表现良好；
2) SVG对动画支持较好，其DOM结构可以被其特定语法或者js控制
3) SVG的结构是XML，其可访问性、可操作性、可编程性、可被CSS样式化完胜Canvas。另外，其支持ARIA属性

缺点：
1) DOM比正常的图形慢，而且如果其节点多而杂，就更慢。
2) 不能动态修改动画内容
3）不能与HTML内容集成，整个SVG作为一个动画   

canvas动画  
优点：
1. 画2D图形中，页面渲染性能比较高，页面渲染性能受图形复杂度影响小，渲染性能只受图像的分辨率的影响
2. 画出来的图形可以直接保存为.png或者.jpg的图形
3. 最适合于画光栅图像（如游戏和不规则集合图形等） 

缺点：
1. 整个一张图，没有dom节点可供操作；
2. 没有实现动画的API，你必须依靠定时器和其他事件来更新Canvas
3. 对文本的渲染支持是比较差
4. 对要求有高可访问性（盲文、声音朗读等）页面，比较困难

WEBGL  
WebGL是一种3D绘图标准，这种绘图技术标准允许把JavaScript和OpenGL ES2.0结合在一起，通过增加OpenGL ES2.0的一个JavaScript绑定，WebGL可以为HTML5 Canvas提供硬件3D加速渲染，这样Web开发人员就可以借助系统显卡来在浏览器里更流畅地展示3D场景和模型, 还能创建复杂的导航和数据视觉化。

```
graph TD
三(添加动画效果)-->四(动画实现方案)
```
## 四 动画实现方案  
1. 增强页面效果→CSS3动画
2. 强调动画交互→js动画处理(定时/RAF)
3. 较为复杂繁琐动画，偏离页面元素形态→canvas/svg/webgl
4. 采用现行的动画库
......

了解了如何实现动画,迎面而来的是不可避免的共性问题:
1. 浏览器对动画的支持、标准不统一 
2. 性能问题 
3. 符合场景的动画
4. 满足需求  

```
graph TD
四(动画实现方案)-->五(实现动画是要考虑什么)
```

## 五 当应用动画效果时，要考虑什么？  
#### 1、动画效果与性能能达到预期么？  
页面的性能直接影响用户体验的流畅度。用户是什么？可以说我们的上帝。如果这个动画效果影响到了页面的流畅、平滑，那么我们就可以毫不犹豫砍掉它了，或者必须要改造它。  
#### 2、动画效果是否为页面展示提供了帮助？  
动画效果不是页面主体，它是一种辅助手段。动画效果应该有其目的性，或是突出某处页面内容，或是改变交互形态，或是营造一种氛围。  
单纯的为了动画，背道而驰。
#### 3、是否符合整个页面或者主题的特质  
每个页面都有页面本身的色调风格，一个相符的动画效果，会带来意想不到的效果。  
#### 4、动画效果是否符合需求者的要求?  
沟通，工作不是一个人做成，动画效果也不是给作者一个人看的。符合要求的动画效果，才是成功的。
#### 5、再次认真考虑性能问题  
性能优化达不到极致。  

## 六 常用的动画效果/工具    

按钮反馈
全屏切换
请求过渡
元素转换
轮播图
DOM节点变换

页面效果增强，Animate Css/Hover Css/Image Slider......
动画效果控制，Move Js/Anime Js
大型动画库，Velocityjs/白鹭

## 七 总结  
写在最后，不为动而动  


内容总结  
![实现动画效果](https://github.com/careycui/blog/blob/master/%E8%90%A4%E7%9F%B3%E5%89%8D%E7%AB%AF%E9%83%A8%E9%97%A8%E5%88%86%E4%BA%AB-%E9%A1%B5%E9%9D%A2%E5%8A%A8%E7%94%BB/asset/liucheng.png)
