/**
 * 图片滑动jquery组件
 *  针对拥有图片导航和图片数据的页面内容开发的插件---
 *    #[idPrefix]nav,#[idPrefix]data,#[idPrefix]img
 *    且导航图片需要提供正常态'[img]_n.png',悬浮态'[img]_h.png',点击态'[img]_c.png'三种状态图片(当然只是命名)
 *  
 * @date 2015/08/29
 * @author chy
 */
;(function(factory) {
    if (typeof define === 'function') {
        define(function(require, exports, modules) {
            factory(jQuery);
            return jQuery;
        });
    } else {
        factory(jQuery);
        return jQuery;
    }
})(function($) {
    /**
     * 图片滑动组件构造器
     *  初始化组件参数，执行初始化方法函数   
     *
     * @param {string} idPrefix 图片容器id前缀
     *  图片容器:idPrefix+'img',数据容器：idPrefix+'data',导航容器：idPrefix+'nav'
     * @param {boolean} ifInterval 是否打开自动轮播 
     * @param {number} itmeCyc 图片轮播周期
     *  ifInterval为true时有效
     * @param {string} fade 图片过渡动画效果
     *  暂时只支持渐隐渐出、左滑出、右滑出
     */
    function ImgSlider(config) {
        var defaults = {
            idPrefix: 'slider-',
            ifInterval: true,
            timeCyc: 2000,
            animation: 'fade' //动画效果fade/slide/3d-roll/flip
        };
        var that = this;
        that.ops = $.extend({}, defaults, config);
        that.imgs = [];
        that.navs = [];

        that.init();
        that.render();
        that.bindEvent();
        //打开轮播--整合为一个方法
        if (that.ops.ifInterval) {
            that.openInterval();
        }
    }
    /**
     * 图片轮播组件的初始化方法
     *     获得所需的data、dom,初始化相关变量
     * @return 
     */
    ImgSlider.prototype.init = function() {
        var that = this,
            ops = that.ops,
            imgConId = ops.idPrefix + 'img',
            navConId = ops.idPrefix + 'nav';

        var imgs = $('#' + imgConId).find('.img-item');
        var navs = $('#' + navConId).find('ul li');
        that.imgs = imgs;
        that.navs = navs;
        that.imgWidth = $(imgs[0]).width();
        that.showIndex = 0;

        if (that.navs.length < 1) {
            that.navs = false;
        }else{
            $(that.navs[that.showIndex]).addClass('active');
        }

        that.imgConId = imgConId;
    };
    /*
     * HTML 元素初始化添加
     */
    ImgSlider.prototype.render = function() {
        var that = this,
            ops = that.ops,
            animation = ops.animation,
            imgs = that.imgs;
        if (animation.indexOf('slide') > -1) {
            that.renderSlide();
        }else if(animation.indexOf('3d-roll') > -1){
            that.renderThirdRoll();
            //fade效果以及其它未指定时的效果
        }else if(animation.indexOf('fade') > -1){
            that.renderFade();
        }else if(animation.indexOf('flip')>-1){
            that.renderFlip();
        }

    };
    /*
     * 渐变效果HTML初始化
     */
    ImgSlider.prototype.renderFade = function(){
        var that = this,
            ops = that.ops,
            animation = ops.animation,
            imgs = that.imgs;

            imgs.each(function(i, ele) {
                var $ele = $(ele);
                if (i != that.showIndex) {
                    $ele.css({
                        display: 'none',
                        position:'absolute',
                        left:0,
                        top:0
                    });
                }
            });
    };
    /*
     * 滑动效果HTML初始化
     */
    ImgSlider.prototype.renderSlide = function(){
        var that = this,
            ops = that.ops,
            animation = ops.animation,
            imgs = that.imgs;

            imgs.each(function(i, ele) {
                var $ele = $(ele);
                $ele.css({
                    position: 'absolute',
                    left:0
                }); 
                if (i == that.showIndex) {
                    $ele.css({
                        zIndex: 1,
                    });
                } else {
                    $ele.css({
                        zIndex: 0,
                        display:'none'
                    });
                }
            });
    };
    /*
     * 3D滚动效果HTML初始化
     */
    ImgSlider.prototype.renderThirdRoll = function(){
        var that = this,
            imgConId = that.imgConId,
            ops = that.ops,
            imgs = that.imgs
            size = imgs.length;

        var curImg = imgs[that.showIndex];
        $('#'+imgConId).html(curImg).css('overflow','visible');
        var TDimgs = [];
        $.each(imgs,function(i,ele){
            var nowI = $(ele).find('img').clone();
            var next = imgs[(i+1)>=size?0:(i+1)];
            var nextI = $(next).find('img').clone();
            var imgObj = {
                nowImg:$('<div class="first"></div>').append(nowI),
                nextImg:$('<div class="second"></div>').append(nextI)
            };
            TDimgs.push(imgObj);
        });
        that.TDimgs = TDimgs;
    };
    /**
     * 翻页效果HTML初始化
     * @return 
     */
    ImgSlider.prototype.renderFlip = function(){
        var that = this,
            imgConId = that.imgConId,
            ops = that.ops,
            animation = ops.animation,
            imgs = that.imgs
            size = imgs.length;
            
    };
    /**
     * 为轮播组件绑定事件
     *     当前只针对nav导航添加事件
     *     TODO 新增跳转图标
     * @return 
     */
    ImgSlider.prototype.bindEvent = function() {
        var that = this,
            ops = that.ops,
            imgs = that.imgs,
            navs = that.navs;

        //针对img-item绑定事件
        if(ops.hoverStop && ops.ifInterval){
            imgs&&(imgs.each(function(i,ele){
                $(ele).on('mouseover',function(){
                    if (that.intervalId) {
                        clearInterval(that.intervalId);
                        that.intervalId = '';
                    }
                }).on('mouseout',function(){
                    that.openInterval();
                });
            }));
        }
        //针对NAVS绑定相关事件
        var mouse = {
            //更改屏幕图片
            //更改nav图片
            //隐藏其他图片
            clickhandler: function(index) {
                if (ops.ifInterval && that.intervalId) {
                    clearInterval(that.intervalId);
                    that.intervalId = '';
                }

                that.moveTo(index);
                if (ops.ifInterval && (!that.intervalId)) {
                    setTimeout(function() {
                        that.openInterval()
                    }, ops.timeCyc);
                }
            },
            overhandler: function(index) {
                if (index == that.showIndex) return;
                var $li = $(this);
                var index = index,
                    $curnav = $(navs[index]);

                var curNavImg = $curnav.find('img');
                var curNavSrc = $(curNavImg).attr('src');
                curNavImg.attr('src', getChangeSrc(curNavSrc, new RegExp(/[n]/), 'h'));
            },
            outhandler: function(index) {
                if (index == that.showIndex) return;
                var $li = $(this);
                var index = index,
                    $curnav = $(navs[index]);

                var curNavImg = $curnav.find('img');
                var curNavSrc = $(curNavImg).attr('src');
                curNavImg.attr('src', getChangeSrc(curNavSrc, new RegExp(/[h]/), 'n'));
            }
        };
        navs && (navs.each(function(i, ele) {
            $(ele).on('click', function() {
                mouse.clickhandler.call(this, i);
            });
        }));
    };
    /**
     * 图片移动方法
     *     包含了移动时动画效果的调用
     *     TODO 将动画效果从移动周期中排出，即效果结束进行下轮移动
     * @param  {number} index 将要移动到的图片索引值
     * @return 
     */
    ImgSlider.prototype.moveTo = function(index) {
        var that = this,
            index = index,
            ops = that.ops,
            animation = ops.animation,
            imgs = that.imgs,
            navs = that.navs,
            showIndex = that.showIndex,
            nextIndex = index + 1;

        if (index == that.showIndex) return;

        var $curimg = $(imgs[index]),
            $preimg = $(imgs[showIndex || 0]);

        if (navs) {
            var $curnav = $(navs[index]),
                $prenav = $(navs[showIndex || 0]);
        };

        //更换图片以及数据
        //此处可选择不同的动画效果
        if (animation.indexOf('slide') > -1) {
            that.slide($preimg, $curimg, showIndex, index);
        } else if(animation.indexOf('fade')>-1) {
            that.fade($preimg, $curimg);
        } else if(animation.indexOf('3d-roll')>-1){
            that.thirdRoll(showIndex,index);
        }
        //更改nav
        if (navs) {
           $prenav.removeClass('active');
            $curnav.addClass('active');
        }

        that.showIndex = index;
    };
    ImgSlider.prototype.fade = function($preimg, $curimg) {
        $preimg.fadeOut(1000);
        $curimg.fadeIn(1000);
    };
    ImgSlider.prototype.beforeSlide = function(nextIndex) {
        var that = this,
            ops = that.ops,
            showIndex = that.showIndex,
            nextIndex = nextIndex,
            imgs = that.imgs,
            imgWidth = that.imgWidth,
            nextimg = $(imgs[nextIndex]);

            nextimg.css({
                display:'block',
                zIndex:1,
                left:imgWidth
            });
    };
    ImgSlider.prototype.slide = function($preimg, $curimg, $nextimg, index) {
        var that = this,
            animation = that.ops.animation,
            imgWidth = that.imgWidth;

            that.beforeSlide(index);

            $preimg.animate({
                left:-imgWidth
            },500,function(){
                $preimg.css({
                    display:'none',
                    left:0,
                    zIndex:0
                });
            });
            $curimg.animate({
                left:0
            },500);
    };
    ImgSlider.prototype.thirdRoll = function(nowIndex, nextIndex) {
        var that = this,
            tDimgs = that.TDimgs,
            imgConId = that.imgConId,
            $imgCon = $('#'+imgConId);
        var nowTD = tDimgs[nowIndex];
        $imgCon.find('.img-item').empty();
        $imgCon.find('.img-item').append(nowTD.nowImg).append(nowTD.nextImg);
        $imgCon.find('.img-item').css({
            transition:'transform .5s',
            transform:'rotateY(-90deg)'
        });
        $imgCon.find('.img-item').off('webkitTransitionEnd').on('webkitTransitionEnd',function(){
            $(this).css({
                transition:'none',
                transform:'rotateY(0deg)'
            });
            $(this).empty().html(nowTD.nextImg.find('img').clone());
        });
    };
    ImgSlider.prototype.openInterval = function() {
        var that = this,
            ops = that.ops,
            imgs = that.imgs;
        if (that.intervalId) return;
        ops.ifInterval = true;
        var timeInterval = setInterval(function() {
            var index = that.showIndex + 1;
            if (index > imgs.length - 1) {
                index = 0;
            }
            that.moveTo(index);
        }, ops.timeCyc+500);

        that.intervalId = timeInterval;
    };
    ImgSlider.prototype.changeAnimate = function(animation){
        var that = this,
            imgs = that.imgs;
        if(!animation)return;
        $.each(imgs,function(i,ele){
            $(ele).removeAttr('style');
        });
        if(that.intervalId){
            clearInterval(that.intervalId);
            that.intervalId = '';
        }
        that.ops.animation = animation;
        that.init();
        that.render();
        that.bindEvent();
        if (that.ops.ifInterval) {
            that.openInterval();
        }
    };
    //内部方法
    function getPreEle(sign, curIndex, eles) {
        var $preEle;
        if (!eles) return;
        for (var i = 0; i < eles.length; i++) {
            var $ele = $(eles[i]);
            if (i != curIndex && ($ele.css('display') != sign)) {
                $preEle = $ele;
                break;
            }
        }
        return $preEle;
    }

    function getChangeSrc(src, regex, str) {
        var prefix = src.substring(0, src.indexOf('-') + 1);
        var replaceStr = src.substring(src.indexOf('-') + 1, src.indexOf('.png'));
        src = prefix + replaceStr.replace(regex, str) + '.png';
        return src;
    }

    $.fn.imgSlider = function(config, param) {
        return this.each(function() {
            var slider = $.data(this, 'slider');
            if (!slider) {
                return $.data(this, 'slider', new ImgSlider(config));
            }
            if (typeof config === 'string' && typeof slider[config] == 'function') {
                slider[config].apply(slider, param || []);
            }
        });
    };
});