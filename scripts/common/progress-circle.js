/**
 * Created by GuoXiang on 2016/10/8.
 */
;(function ($, document, window) {
    "use strict"
    function ProgressCircle(container, options) {
        var defaults = {
            radius: 50,
            barBgColor: '#EEFFAA',
            barWidth: 25,
            incrementBy: 1,
            frameTime: 10,
            direction: false,
            // colorValueMap: null
            perArray: null,
            colorArray: null
        }
        var self = this;
        this.container = container;
        this.options = $.extend({}, defaults, options);
        this.canvas = document.createElement("canvas");

        container.append(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.init();
    }

    ProgressCircle.prototype = {
        constructor: ProgressCircle,
        init: function () {
            var dim = (this.options.radius + this.options.barWidth) * 2,
                center = dim / 2,
                ctx = this.ctx;
            this.canvas.width = dim;
            this.canvas.height = dim;
            ctx.beginPath();
            ctx.arc(center, center, this.options.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = this.options.barBgColor;
            ctx.lineWidth = this.options.barWidth;
            ctx.stroke();
            this.imageData = ctx.getImageData(0, 0, dim, dim);
            ctx.closePath();
            this.animate();
            return this;
        },
        animate: function () {
            var inc = this.options.incrementBy,
                self = this,
                ctx = this.ctx,
                dim = (this.options.radius + this.options.barWidth) * 2,
                perArray = this.options.perArray,
                colorArray = this.options.colorArray,
                direct = this.options.direction;

            this.canvas.width = dim;
            this.canvas.height = dim;
            var counter = 0;
            this.lastAngle = -(Math.PI / 2);
            for (var i = 0; i < perArray.length; i++) {
                counter = counter + (direct ? -inc : inc);
                // var color = colorArray[i];
                // var percent = perArray[i];
                    var interObj = setTimeout(function (item,pointer) {
                        self.fillColor(pointer, colorArray[item], perArray[item]);
                        console.log("item=="+item);
                    }, self.options.frameTime,i,counter);
                if (counter >= perArray[i]) {
                    clearTimeout(interObj);
                }
                if ((!direct && counter >= perArray[perArray.length - 1]) || (direct && counter <= perArray[perArray.length - 1])) {
                    clearInterval(interObj);
                    return;
                }
            };


            ctx.closePath();
            return this;

        },
        fillColor: function (val, color, percent) {
            var ctx = this.ctx,
                quar = Math.PI / 2,
                dim = (this.options.radius + this.options.barWidth) * 2,
                center = dim / 2,
                circle = Math.PI * 2,
                self = this;
            ctx.putImageData(self.imageData, 0, 0);
            var currentAngle = this.calculatePer(percent);
            ctx.strokeStyle = color;
            ctx.lineWidth = self.options.barWidth;
            ctx.beginPath();
            ctx.arc(center, center, self.options.radius, this.lastAngle, currentAngle);
            ctx.stroke();
            this.lastAngle = currentAngle;
            self.imageData = ctx.getImageData(0, 0, dim, dim);

        }
        ,
        calculatePer: function (percent) {
            var result = -Math.PI / 2 + (percent / 100) * 2 * Math.PI;
            return result;
        }
    }

    if (!$) {
        alert("need jquery plugin!");
        return;
    }
    $.fn.progressCircle = function (options) {
        var $this = $(this);
        return $this.each(function () {
            new ProgressCircle($this, options);
        });
    }


})
(jQuery, document, window)