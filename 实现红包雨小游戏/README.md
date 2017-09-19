## Phaser实现小游戏
### 起始-一纸需求  
某日，本程序猿正在假装孜孜不倦的努力工作。  
产品经理：“一会儿来参加个需求会议，这个先看看”;  
伴随着声音一张纸飘飘落下(不要问为什么需求写纸上，产品经理乐意)。
我快速拿起纸，慢腾腾地的浏览了一遍。  
**“红包雨小游戏”**，好么这就是我接下来要做的需求了。。。。。。    
本程序猿从来没有有做过游戏下呀！但是，不慌有谷歌！  
### 实现方案    
首先，考虑HTML5游戏开发实现方案。常用的实现方案有：  
1. 频繁操作DOM，结合CSS3实现游戏场景。缺点很明显，耗资源、占内存、卡顿，低端机无法运行  
2. 利用canvas技术自行编写核心代码实现游戏场景。缺点是花费时间长，成本大且没有统一的技术方案不便于扩展维护。
3. 利用游戏引擎实现。缺点是学习一个游戏引擎是需要时间成本，而且运用好游戏引擎，上面两个方案的缺点都可以解决掉。  
最后，考虑到小游戏也会成为以后工作一个方面，故选择了第三个方案。针对定位**“小游戏”**，选择了Phaser游戏引擎，它可以满足小游戏的一切要求。  
> 注：此处不讨论各游戏引擎优劣，适合范围，有兴趣的可从以下链接了解
> [HTML5游戏引擎深度测评](http://www.jianshu.com/p/0469cd7b1711)  
> [2016年最火的15款HTML5游戏引擎 - linshulin/diycode](https://www.diycode.cc/topics/16)
> [HTML5游戏引擎对比分析调研](https://fengmiaosen.github.io/2016/04/26/game-diff-study/)

### 关于Phaser 
先贴一下官网<http://phaser.io/>,可以去了解下。  
此项目是老外开源的项目，所以在国内传播度不大。国内较有名的当属白鹭了，从设计上就能看到浓浓的中国风。
Phaser的优点：  
1. 文档案例丰富。丰富的demo能提供很多问题的解决方案
2. 上手简单。支持原生js和typescript，适合不同开发人员。并且Phaser规定的游戏主体简单易懂，可轻松搭建出完整的游戏流程，开发人员有更多的经历丰富游戏内容。
3. 支持canvas、webgl可自由切换。
4. 专注于2D，游戏更高效。  

#### 搭建Phaser骨架  
##### 画布-游戏对象  
画布承载了整个游戏对象，Phaser会将一切游戏元素渲染到画布上。因为需要做的是移动端的游戏，画布一般是充满全屏的。  
首先，创建游戏对象：  
```javascript
var game = new Phaser.Game(w, h, Phaser.AUTO, '#container', {preload： preload, create: create, play: play, over: over});
```  
Phaser.Game Phaser提供的游戏对象构造器，通过new的方式创建Phaser游戏实例。  
需要的参数：  
1. w ，h 设置画布的大小，移动端一般充满全屏
2. Phaser.AUTO render的类型，AUTO由Phaser自动选择渲染为Phaser.WEBGL/Phaser.CANVAS/Phaser.HEADLESS
3. #container canvas画布需要渲染到的DOM节点ID
4. state 游戏场景，下文详细介绍

> 注：GAME对象还包含其他设置项，详细请查看官方文档。这几项配置已足够应付日常开发。  

##### STATE-游戏场景
场景，不是指游戏中的胡泊、沙漠、山林这些地图场景，而是指不同游戏阶段。通常可以将场景划分为一下四个阶段：  
1. preload 预加载阶段，加载游戏所需要的资源，展示加载进度条，过渡场景；当然，你仍然可以再另外其它任何阶段加载你所需要的资源  
2. create 游戏创建阶段，该阶段可展示游戏开始时需要的内容，例如开始按钮、活动规则、游戏时间等
3. play 游戏阶段，整个游戏的核心
4. over 游戏结束阶段，展示游戏最终结果  

当然这些场景并不是Phaser强制要求的，你可以按照自己的习惯、自己的理解去划分游戏阶段，然后你所需要做的只是：**告诉Phaser.Game对象全部的游戏场景，即调用GAME提供的添加state的方法**。  
然后，紧接上步创建全部state：  
``` javascript
//添加state方法一:
var game = new Phaser.Game(w, h, Phaser.AUTO, '#container', {preload： preload, create: create, play: play, over: over});
function preload(){}
function create(){}
function play(){}
function over(){}

//添加state方法二:
var game = new Phaser.Game(w, h, Phaser.AUTO, '#container');
var states = {
    preload: function(){},
    create: function(){},
    play: function(){},
    over: function(){}
};
game.state.add('preload', states.preload);
game.state.add('create', states.create);
game.state.add('play', states.play);
game.state.add('over', states.over);
```  
Phaser对场景的划分没有要求，但是对**场景本身构成**有严格的要求，因为场景拥有自己的生命周期。如下所示:

start | preload | loaded | paused | stop 
--- | --- | --- | --- | --- 
init | | | | 
 | preload | create | paused | 
 | loadUpate* | update* | pauseUpdate* 
 | | preRender* | | 
 | loadRender* | render* | pauseRender* | 
 | | | resumed | | 
 | | | | shutdown 

**Update and render calls (*) are repeated.**  
常用的生命周期回调方法有：preload 、create 、update 、render。  
那么，现在我们可以具体定义各阶段游戏场景了。
```javascript
var game = new Phaser.Game(w, h, Phaser.AUTO, '#container');
var states = {
    preload: function(){
        //预加载阶段
        this.preload = function(){
            console.log('preload : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('preload : create');
            setTimeout(function(){
                game.state.start('create');
            },2000);
        }
    },
    create: function(){
        //预加载阶段
        this.preload = function(){
            console.log('create : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('create : create');
            setTimeout(function(){
                game.state.start('play');
            },2000);
        }
    },
    play: function(){
        //预加载阶段
        this.preload = function(){
            console.log('play : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('play : create');
            setTimeout(function(){
                game.state.start('over');
            },2000);
        }
    },
    over: function(){
        //预加载阶段
        this.preload = function(){
            console.log('over : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('over : create');
            setTimeout(function(){
                console.log('game over'); 
            },2000);  
        } 
    }
};
game.state.add('preload', states.preload);
game.state.add('create', states.create);
game.state.add('play', states.play);
game.state.add('over', states.over);
//开始游戏场景
game.state.start('preload');
```
具体请查看：[index-state.html](https://github.com/careycui/blog/blob/master/%E5%AE%9E%E7%8E%B0%E7%BA%A2%E5%8C%85%E9%9B%A8%E5%B0%8F%E6%B8%B8%E6%88%8F/game-demo/index-state.html)  
现在已经搭好了游戏的骨架，游戏场景已经可进行切换。接下来就要加载游戏资源，编写游戏核心逻辑来丰富游戏场景。  
##### Loader-加载游戏资源  
Phaser提供了Loader对象用于加载各种游戏资源。每种资源都有自己的引用名字，loader通过添加引用名采用XHR方式完成资源的加载，并提供了加载进度和加载完成回调方法。  
>new Loader(game)
The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
The loader uses a combination of tag loading (eg. Image elements) and XHR and provides progress and completion callbacks.
Parallel loading (see enableParallel) is supported and enabled by default. Load-before behavior of parallel resources is controlled by synchronization points as discussed in withSyncPoint.
Texture Atlases can be created with tools such as Texture Packer and Shoebox  

介绍下常用资源加载方法：  
1. 加载图片
```
//key: 资源的唯一标识不可重复，用于添加到Phaser.cache中最为唯一标识
//url: 资源路径
game.load.image(key, url);
```  
2. 加载视频/音频  
```
game.load.video(key,urls);
game.load.audio(key,urls);
```
3. 加载图片序列 
由于要指定帧的宽高，因此一般是动画的连续帧，例如行走动画的每一帧合成的图片。
```
game.load.spritsheet(key, url, frameWidth, frameHeight);
```
需要注意的是，调用此方法后资源不是马上被加载，只是被加入到了准备加载的队列中。所以**load和add不能在同一个生命周期阶段内使用**。 

了解了资源加载的方法，接下来完成我们游戏的资源加载。  
```javascript
......
preload: function(){
    //预加载阶段
    this.preload = function(){
        game.stage.background = '';
        game.load.image('start', 'assets/images/start-bg.jpg');
        game.load.image('startBtn', 'assets/images/start.png');
        game.load.image('playBg', 'assets/images/bg.jpg');
        game.load.image('boom', 'assets/images/boom.png');
        game.load.image('awardBg', 'assets/images/over-bga.jpg');
        game.load.image('noneBg', 'assets/images/over-bgb.jpg');
        game.load.image('awardSign', 'assets/images/over-sign.png');
        game.load.image('noneSign', 'assets/images/over-none.png');
        game.load.image('redpacket', 'assets/images/redpacket.png');
        game.load.image('title', 'assets/images/title-icon.png');

        game.load.image('process', 'assets/images/processing.png');
        game.load.image('processBg', 'assets/images/process_bg.png');

        console.log('preload : preload');
    }
    //该场景创建阶段
    this.create = function(){
        console.log('preload : create');
        setTimeout(function(){
            game.state.start('create');
        },2000);
    }
}
......
```
接下来，因为资源加载的原因会出现页面空白的现象，我们需要添加资源加载进度监控，在加载资源的时间内展示加载进度。
可是使用Phaser提供以下方法监听加载进度: 
```javascript
//单个文件加载完成回调方法
//progress加载进度，取值0-100
//key 文件key
//totalLoaded 加载的资源数
//totalFiles 资源总数
game.load.onFileComplete.add(function(progress, key, success, totalLoaded, totalFiles){
    console.log(progress);
},this);

//全部文件加载完成回调方法
game.load.onLoadComplete.add(function(){
    alert('加载完毕');
});

//设置加载进度条
game.load.setPreloadSprite(sprite);
```
那么，我们需要做的就是设置好进度条、进度数据。
**因为图片加载和使用不能在同一个阶段**,需要修改一下资源加载顺序。
```javascript
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '#container');
var states = {
    loading: function(){
        this.preload = function(){
            game.stage.backgroundColor = '#791265';
            game.load.image('process', 'assets/images/processing.png');
            game.load.image('processBg', 'assets/images/process_bg.png');
        }
        this.create = function(){
            console.log('loading : create');
            game.state.start('preload');
        }
    },
    preload: function(){
        //预加载阶段
        this.preload = function(){
            game.stage.backgroundColor = '#791265';
            game.load.image('start', 'assets/images/start-bg.jpg');
            game.load.image('startBtn', 'assets/images/start.png');
            game.load.image('playBg', 'assets/images/bg.jpg');
            game.load.image('boom', 'assets/images/boom.png');
            game.load.image('awardBg', 'assets/images/over-bga.jpg');
            game.load.image('noneBg', 'assets/images/over-bgb.jpg');
            game.load.image('awardSign', 'assets/images/over-sign.png');
            game.load.image('noneSign', 'assets/images/over-none.png');
            game.load.image('redpacket', 'assets/images/redpacket.png');
            game.load.image('title', 'assets/images/title-icon.png');

            //loading menu
            game.add.sprite(game.width/2,game.height/2-2,'processBg').anchor.setTo(0.5,0);
            var preloadSprite = game.add.sprite(game.width/2,game.height/2,'process');
            preloadSprite.anchor.setTo(0.5,0);
            preloadSprite.visible = false;
            var loadText = game.add.text(game.width/2,game.height/2+22,'0%',{font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
            loadText.anchor.setTo(0.5,0);
            game.load.setPreloadSprite(preloadSprite);
            game.load.onLoadStart.add(function(){},this);
            game.load.onFileComplete.add(function(progress, cacheKey, success, totalLoaded, totalFiles){
                loadText.text = progress + '%('+totalLoaded+'/'+totalFiles+')';
            },this);
            game.load.onLoadComplete.add(function(){
                loadText.destroy();
            },this);

            console.log('preload : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('preload : create');
            setTimeout(function(){
                game.state.start('create');
            },2000);
        }
    },
    create: function(){
        //预加载阶段
        this.preload = function(){
            console.log('create : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('create : create');
            setTimeout(function(){
                game.state.start('play');
            },2000);
        }
    },
    play: function(){
        //预加载阶段
        this.preload = function(){
            console.log('play : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('play : create');
            setTimeout(function(){
                game.state.start('over');
            },2000);
        }
    },
    over: function(){
        //预加载阶段
        this.preload = function(){
            console.log('over : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('over : create');
            setTimeout(function(){
                console.log('game over'); 
            },2000);  
        } 
    }
};
game.state.add('loading', states.loading);
game.state.add('preload', states.preload);
game.state.add('create', states.create);
game.state.add('play', states.play);
game.state.add('over', states.over);
//开始游戏场景
game.state.start('loading');
```
完成后发现，进度条消失的时间不符合期望，我们可能更想控制进度条在加载完成后的消失时机，以便于在加载时间展示一些广告或其它信息。再修改一下进度条的消失时机，代码如下：  
```javascript
var processDead = false;
......
    preload: function(){
        //预加载阶段
        this.preload = function(){
            game.stage.backgroundColor = '#791265';
            game.load.image('start', 'assets/images/start-bg.jpg');
            game.load.image('startBtn', 'assets/images/start.png');
            game.load.image('playBg', 'assets/images/bg.jpg');
            game.load.image('boom', 'assets/images/boom.png');
            game.load.image('awardBg', 'assets/images/over-bga.jpg');
            game.load.image('noneBg', 'assets/images/over-bgb.jpg');
            game.load.image('awardSign', 'assets/images/over-sign.png');
            game.load.image('noneSign', 'assets/images/over-none.png');
            game.load.image('redpacket', 'assets/images/redpacket.png');
            game.load.image('title', 'assets/images/title-icon.png');

            //loading menu
            game.add.sprite(game.width/2,game.height/2-2,'processBg').anchor.setTo(0.5,0);
            var preloadSprite = game.add.sprite(game.width/2,game.height/2,'process');
            preloadSprite.anchor.setTo(0.5,0);
            preloadSprite.visible = false;
            var loadText = game.add.text(game.width/2,game.height/2+22,'0%',{font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
            loadText.anchor.setTo(0.5,0);
            this.loadText = loadText;
            game.load.setPreloadSprite(preloadSprite);
            game.load.onLoadStart.add(function(){},this);
            game.load.onFileComplete.add(function(progress, cacheKey, success, totalLoaded, totalFiles){
                loadText.text = progress + '%('+totalLoaded+'/'+totalFiles+')';
            },this);
            game.load.onLoadComplete.add(function(){
                processDead = true;
            },this);

            console.log('preload : preload');
        }
        //该场景创建阶段
        this.create = function(){
            console.log('preload : create');
            var _this = this;
            var onLoad = function(){
                if(processDead){
                    _this.loadText.destroy();
                    game.state.start('create');
                }else{
                    setTimeout(function(){
                        onLoad();
                    },1000);
                }
            }
            setTimeout(function(){
                onLoad();
            },2000);
        }
    },
......
game.state.add('loading', states.loading);
game.state.add('preload', states.preload);
game.state.add('create', states.create);
game.state.add('play', states.play);
game.state.add('over', states.over);
//开始游戏场景
game.state.start('loading');
```
具体请查看：[index-load.html](https://github.com/careycui/blog/blob/master/%E5%AE%9E%E7%8E%B0%E7%BA%A2%E5%8C%85%E9%9B%A8%E5%B0%8F%E6%B8%B8%E6%88%8F/game-demo/index-load.html)  
那么，接下来需要将资源渲染到游戏画布上，并让它动起来

##### Play-添加游戏内容  
上一步解决了加载资源的问题，这一步我们将要完成：资源的渲染、让游戏动起来。  
###### 1. 渲染资源
    image、sprite、graphics、btn、text、audio、video等这些都是我们常用的资源，
    Phaser为这些资源提供了渲染到画布的方法。
> add :Phaser.GameObjectFactory
> The GameObjectFactory is a quick way to create many common game objects using game.add.
Created objects are automatically added to the appropriate Manager, World, or manually specified parent Group.

GameObjectFactory见文知意，是一个工厂方法。它可以直接通过**game.add.xxx**这种简便的方式渲染指定的资源。以添加一个图片为例：  
```javascript
//x 相对于父容器的x坐标
//y 相对于父容器的y坐标
//key load资源是设定的唯一标示
//frame 引入资源为texture或雪碧图时，需要指定此参数
//group 添加到的组
game.add.image(x, y, key, frame, group);
```
其它资源添加大同小异，需要用到某种资源时查询官方文档即可，这里不再进行其它介绍。  

这里值得介绍的另外一个概念是**group(组)**。group是Spirtes、images等展示资源的合集。它方便多个资源的整体操控以及资源的重复利用，并且可以利用多个组设置层级。相关组的操作可查看官方示例<http://phaser.io/examples/v2/category/groups>。 
```javascript
//关于组的部分操作
//添加一个组
var group = game.add.group();
//组开启物理引擎
group.enableBody = true;

//创建一个组内元素
var asset = group.create(x,y,key);
//批量创建多个元素
var asserts = group.createMultiple(quantity, key);

//添加已创建元素
var assetExist = group.add(child);
......
```
了解，这些知识后就可以丰富游戏界面了。如下： 
```javascript
var processDead = false;
var totalTime = 30; 
var loadTimeDelay = 2000;
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameContainer');
var states = {
    loading: function(){
        this.init = function(){
            if(!game.device.desktop){
                game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                game.scale.forcePortrait = true;                
            }else{
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            //游戏居中
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.refresh();
        }

        ......

    },
    
    ......

    create: function(){
        //该场景创建阶段
        this.create = function(){
            var start = game.add.sprite(game.world.width/2, 0, 'start');
            start.anchor.setTo(0.5,0);
            start.width = game.world.width;
            start.height = game.world.height;

            var startBtn = game.add.image(game.world.width/2, game.world.height-80, 'startBtn');
            startBtn.scale.setTo(0.5);
            startBtn.anchor.setTo(0.5);

            startBtn.inputEnabled = true;
            startBtn.events.onInputUp.add(function(){
                game.state.start('play');
            },this);
        }
    },
    play: function(){
        //该场景创建阶段
        this.create = function(){
            var titleIcon = game.add.sprite(10, 10, 'title');
            titleIcon.scale.setTo(0.5);
            var title = game.add.text(20+titleIcon.width, 10+titleIcon.height/2, 'X',{fill:'#fff',fontSize:'16px',fontWeight: 400});
            title.anchor.setTo(0, 0.5);
            var score = game.add.text(40+titleIcon.width, 10+titleIcon.height/2, '0',{fill:'#fff',fontSize:'16px',fontWeight: 400});
            score.anchor.setTo(0, 0.5);

            var timeSecond = game.add.text(game.world.width-40, 10+titleIcon.height/2, totalTime+'s',{fill:'#fff',fontSize:'16px',fontWeight: 400});
            timeSecond.anchor.setTo(0, 0.5);
            this.timeSecond = timeSecond;

            this.timeLoop = game.time.events.loop(1000, this.updateTime, this);
        }
        this.updateTime = function(){
            if(totalTime*1000>=1000){
                totalTime  = totalTime - 1;
            }else{
                totalTime = 0;
                game.time.events.remove(this.timeLoop);
            }
            this.timeSecond.text = totalTime + 's';
        }
    },
    ......
};
......
```
有几处需要注意的地方：
1. 设置游戏的缩放模式  
```javascript
game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
```
> A scale mode that causes the Game size to change  
Use scaleModel NO_SCALE
>> 不使用任何缩放模式

> Fixed game size; scale canvas proportionally to fill its container
Use scaleMode SHOW_ALL.
>> 通过调整你的游戏大小，以适应父元素的大小，但会保持游戏的宽高比例。

> Fixed game size; stretch canvas to fill its container (uncommon)
Use scaleMode EXACT_FIT.
>> 将游戏的大小重设成适合父容器的大小，而且并不会保持游戏的宽高比例。

> Fixed game size; scale canvas proportionally by some other criteria
Use scaleMode USER_SCALE. Examine parentBounds in the resize callback and call setUserScale if necessary.
>> 自定义缩放模式

> Fluid game/canvas size
Use scaleMode RESIZE. Examine the game or canvas size from the onSizeChange signal or the Phaser.State#resize callback and reposition game objects if necessary.
>> RESIZE模式是创建一个和其父元素同样大小的Canvas元素，并且随父元素大小变化去适应窗口

2. 绑定操作事件
Phaser 提供了events对象，包含了所需要的所有操作事件。但，有一点需要注意：**渲染的元素需要设定inputEnabled=true**绑定事件才有效。如下：
```javascript
startBtn.inputEnabled = true;
startBtn.events.onInputUp.add(function(){
    game.state.start('play');
},this);
```
3. 时间对象
Phaser提供了操作时间的对象。此对象可以在失去焦点时，时间停止不再变化。如何：
```javascript
//add 
this.timeLoop = game.time.events.loop(1000, this.updateTime, this);
//remove
game.time.events.remove(this.timeLoop);
```
具体请查看：[index-paint.html](https://github.com/careycui/blog/blob/master/%E5%AE%9E%E7%8E%B0%E7%BA%A2%E5%8C%85%E9%9B%A8%E5%B0%8F%E6%B8%B8%E6%88%8F/game-demo/index-paint.html)  

###### 2. 让游戏动起来  
现在需要实现游戏逻辑，以及添加物理引擎效果。游戏逻辑不在多做介绍，因具体游戏而变。  
现在我们需要完成的是：红包降落的效果。为此将要用到物理引擎效果、动画效果。
使用物理引擎可以让我们轻松的实现例如碰撞、加速运动、摩擦力、重力降落等效果。而Phaser提供了三个物理引擎供我们使用。
* Arcade
最简单快速的物理引擎，因为只支持AABB式的碰撞，计算速度最快，实现简单的物理碰撞、接触、重力等效果最佳。
* P2
大而全的物理引擎，支持多种物理模型。
Ninja
Ninja，则是比较专注精确的多种模式的碰撞检测。

对以上物理引擎感兴趣的，可自行查找。  

对于简单降落效果，选用Arcade就足够了。关键代码：  
```javascript
// 开启物理引擎
game.physics.startSystem(Phaser.Physics.Arcade);

//第一种方式 设置降落速度
game.physics.arcade.gravity.y = 300;
//第二种方式 单个设定降落速度
pocket.body.gravity.y = 300；
```
设置元素加入物理效果
```javascript
game.physics.enable(pocket);
```
具体请查看：[index-play.html](https://github.com/careycui/blog/blob/master/%E5%AE%9E%E7%8E%B0%E7%BA%A2%E5%8C%85%E9%9B%A8%E5%B0%8F%E6%B8%B8%E6%88%8F/game-demo/index-play.html)

完成后还存在三个问题：  
点击红包后直接消失很突兀，需要添加动画效果;  
降落红包雨title栏的层级需要调整;  
缺少点中提示。  
现在，我们需要解决这三个问题。  
**点中提示效果，关键代码：**
```javascript
//创建过渡动画效果，并设定最终的效果
var showTween = game.add.tween(ani).to(properties, duration, ease, autoStart, delay, repeat, yoyo);
//动画效果结束回调方法
showTween.onComplete.add(listener,context);
```
**红包消失效果关键代码：**
```javascript
//红包点击爆炸效果
var score_explosions = game.add.group();
this.score_explosions = score_explosions;
score_explosions.createMultiple(30, 'boom');
score_explosions.forEach(this.setupInvader, this);

//调用效果
this.scoreKabom = function(alien){
    var explosions = this.score_explosions;
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x+alien.width/2, alien.body.y+alien.height/2);
    explosion.play('kaboom', 4, false, true);
}
```
**z-index，通过group解决，关键代码：**
```javascript
game.world.swap(titleGroup, pockets);
```
具体请查看: [index.html](https://github.com/careycui/blog/blob/master/%E5%AE%9E%E7%8E%B0%E7%BA%A2%E5%8C%85%E9%9B%A8%E5%B0%8F%E6%B8%B8%E6%88%8F/game-demo/index.html)  

###### 3. 完善游戏结束场景，完成整个游戏
最终代码请查看: [index-all.html](https://github.com/careycui/blog/blob/master/%E5%AE%9E%E7%8E%B0%E7%BA%A2%E5%8C%85%E9%9B%A8%E5%B0%8F%E6%B8%B8%E6%88%8F/game-demo/index-all.html)

##### Utils-常用工具
ArraySet
arrayset是一组数据结构（项目必须设置内是唯一的），同时维持秩序。

ArrayUtils
阵列的具体方法，如getrandomitem，洗牌，transposematrix，旋转和numberarray。

Color
相位。颜色是一组静态方法，协助色彩处理和转换。

Debug
关于游戏对象的调试信息的显示方法的集合。

LinkedList
基本的链表数据结构

Utils
Object 和 String 检查和修改的工具方法. 包括 getProperty, pad, isPlainObject, extend 和mixin.