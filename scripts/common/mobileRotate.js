/**
 * Created by GuoXiang on 2016/10/6.
 */
;(function ($, window, document) {
    "use strict"
    function Mrotate(context, options) {
        var self = this;
        this.context = context;
        this.defaults = {
            containerWidth: '290',
            containerHeight: '186',
            posterWidth: '186',
            posterHeight: '186',
            scale: 0.73,
            speed: 200,
            delay: 1000,
            autoplay: true
        }
        this.posterList = context.find(".posterList");
        this.eachPoster = context.find(".circleBg");
        // this.number = context.find(".number");
        // this.text = context.find(".curr-text");
        this.options = $.extend({}, this.defaults, options);
        this.firstPoster = this.eachPoster.first();
        this.lastPoster = this.eachPoster.last();
        this.otherPoster = this.eachPoster.slice(1);
        this.rotateFlag = true;
        // 设置第一帧的位置
        this.setFirstPosterItem();
        // 设置其他帧的位置
        this.setOtherPosterItems();
        //判断滑动方向，绑定滑动事件
        this.bindSlideEvent();

        if (this.options.autoplay) {
            this.autoplay();
            this.context.hover(function () {
                clearInterval(self.timer);
            }, function () {
                self.autoplay();
            })
        }
    }

    Mrotate.prototype = {
        constructor: Mrotate,
        setFirstPosterItem: function () {
            this.firstPoster.css({
                "width": this.options.posterWidth,
                "height": this.options.posterHeight,
                "zIndex": Math.ceil((this.eachPoster.length) / 2),
                "left": (this.options.containerWidth - this.options.posterWidth) / 2,
                "top": 0
            });
            this.firstPoster.find(".number").css({
                "paddingTop": this.options.posterHeight * 0.35
            });
            this.firstPoster.find(".curr-text").css({
                "paddingTop": this.options.posterHeight * 0.07
            });
        },
        setOtherPosterItems: function () {
            var that = this;
            var level = Math.floor((this.otherPoster.length) / 2);
            var leftItems = this.otherPoster.slice(0, level);
            var rightItems = this.otherPoster.slice(level);
            var sideBlank = (this.options.containerWidth - this.options.posterWidth) / 2;
            var gap = sideBlank / level;
            var i = 1;
            var leftIndex = level;
            this.otherPoster.find(".number").css({
                "paddingTop": this.options.posterHeight * this.options.scale * 0.3
            });
            this.otherPoster.find(".curr-text").css({
                "paddingTop": this.options.posterHeight * this.options.scale * 0.03
            });
            leftItems.each(function (index, item) {
                $(this).css({
                    "width": that.options.posterWidth * that.options.scale,
                    "height": that.options.posterHeight * that.options.scale,
                    "zIndex": leftIndex--,
                    "left": sideBlank - i * gap,
                    "top": (that.options.containerHeight - that.options.posterHeight * that.options.scale) / 2,
                });
                i++;
            });
            var j = level;
            var rightIndex = 1;
            rightItems.each(function (index, item) {
                var rightWidth = that.options.posterWidth * that.options.scale;
                $(this).css({
                    "width": rightWidth,
                    "height": that.options.posterHeight * that.options.scale,
                    "zIndex": rightIndex++,
                    "left": that.options.containerWidth - (sideBlank - j * gap + rightWidth),
                    "top": (that.options.containerHeight - that.options.posterHeight * that.options.scale) / 2,
                });
                j--;
            });

        },
        bindSlideEvent: function () {
            var that = this;
            $('body').on('touchstart',function(e) {
                var touch = e.originalEvent,
                    startX = touch.changedTouches[0].pageX,
                    direction = null;
                that.context.on('touchmove', function(e) {
                    e.preventDefault();
                    touch = e.originalEvent.touches[0] ||
                        e.originalEvent.changedTouches[0];
                    if (touch.pageX - startX > 10) {
                        console.log("右划");
                        that.context.off('touchmove');
                        direction =  "right";
                        if(that.rotateFlag){
                            that.rotateFlag = false;
                            that.rotateItem(direction);
                        }
                    } else if (touch.pageX - startX < -10) {
                        console.log("左划");
                        that.context.off('touchmove');
                        direction =  "left";
                        if(that.rotateFlag){    // 防止快速重复滑动
                            that.rotateFlag = false;
                            that.rotateItem(direction);
                        }
                    };
                });

                // Return false to prevent image
                // highlighting on Android
                return false;

            }).on('touchend', function() {
                that.context.off('touchmove');
            });
        },
        autoplay: function () {
            var self = this;
            this.timer = setInterval(function () {
                self.rotateItem('left');
            }, self.options.delay);
        },
        rotateItem: function (type) {
            var that = this,
                zIndexArray = [];
            if (type == 'left') {
                this.eachPoster.each(function (index, item) {
                    var self = $(this);
                    var prevItem = $(this).next().get(0) ? $(this).next():that.firstPoster;
                    var width = prevItem.css("width"),
                        height = prevItem.css("height"),
                        left = prevItem.css("left"),
                        top = prevItem.css("top"),
                        zIndex = prevItem.css("zIndex"),
                        selfWidth = self.css("width");
                    zIndexArray.push(zIndex);
                    self.animate({
                        "width": width,
                        "height": height,
                        "left": left,
                        "top": top
                    },that.options.speed,function () {
                        that.rotateFlag = true;
                        if(selfWidth<width){
                            self.find(".number").css({
                                "paddingTop": that.options.posterHeight * 0.35
                            });
                            self.find(".curr-text").css({
                                "paddingTop": that.options.posterHeight * 0.07
                            });
                        }else if(selfWidth>width){
                            self.find(".number").css({
                                "paddingTop": that.options.posterHeight * that.options.scale * 0.3
                            });
                            self.find(".curr-text").css({
                                "paddingTop": that.options.posterHeight * that.options.scale * 0.03
                            });
                        }
                    });
                });
                this.eachPoster.each(function (index,item) {
                    var self = $(this);
                    self.css("zIndex",zIndexArray[index]);
                    if(zIndexArray[index]==2){
                        $(".hpaTitle").html();
                        $(".hpaTitle").html(self.attr('data-title'));
                    }
                })

            }
            if (type == 'right') {
                this.eachPoster.each(function (index, item) {
                    var self = $(this);
                    var nextItem = $(this).prev().get(0) ? $(this).prev():that.lastPoster;
                    var width = nextItem.css("width"),
                        height = nextItem.css("height"),
                        left = nextItem.css("left"),
                        top = nextItem.css("top"),
                        zIndex = nextItem.css("zIndex"),
                        selfWidth = self.css("width");
                    zIndexArray.push(zIndex);
                    self.animate({
                        "width": width,
                        "height": height,
                        "left": left,
                        "top": top
                    },that.options.speed,function () {
                        that.rotateFlag = true;
                        if(selfWidth<width){
                            self.find(".number").css({
                                "paddingTop": that.options.posterHeight * 0.35
                            });
                            self.find(".curr-text").css({
                                "paddingTop": that.options.posterHeight * 0.07
                            });
                        }else if(selfWidth>width){
                            self.find(".number").css({
                                "paddingTop": that.options.posterHeight * that.options.scale * 0.3
                            });
                            self.find(".curr-text").css({
                                "paddingTop": that.options.posterHeight * that.options.scale * 0.03
                            });
                        }
                    });
                });
                this.eachPoster.each(function (index,item) {
                    var self = $(this);
                    self.css("zIndex",zIndexArray[index]);
                    if(zIndexArray[index]==2){
                        $(".hpaTitle").html();
                        $(".hpaTitle").html(self.attr('data-title'));
                    }
                })

            }
        }

}


$.fn.mobileRotate = function (options) {
    var $this = $(this);
    return $this.each(function () {
        new Mrotate($this, options);
    });
}


})
(jQuery, window, document)