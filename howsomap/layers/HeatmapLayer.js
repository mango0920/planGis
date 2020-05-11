/**
 * 描述：热力图层
 * 作者：houlu
 * 创建时间：2018/10/18
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare"
], function (declare) {
    var d = declare("howsomap.layers.HeatmapLayer2",null, {
        /**
         * 构造函数
         * @param  options:{map:地图,r:点的覆盖半径，density：密度，每平方米多少点 }
         */
        constructor: function (options) {
            this._map=options.map;
            //半径（米），点的范围
            this._r=options.r||100;
            //密度，每平方米多少点
            this._density=options.density||0.00005;
            //初始化显示热力图的canvas
            this._initCanvas(this._map);
            //绑定地图事件
            this._bindEvent(this._map);

            this.visible=true;
            //每个点代表的权重
            this._value=1;

            this._heatmap = h337.create({
                container: document.createElement("div") ,
                blur: .75
            });
        },

        /**
         * 添加到指定容器
         * @param container
         */
        addToContainer:function(container){
           // this._container=container;
            container.appendChild(this._canvas);
        },

        /**
         * 设置地图对象
         * @param map
         */
        setMap:function(map){
            this._map=map;
            this._bindEvent(this._map);
        },


        /**
         * 设置点数据
         * @param pts
         */
        setPoints:function(pts){
            this._pointArr=[];
            for(var i=0,length=pts.length;i<length;i++){
                pts[i].value=1;
            }
            this._pointArr=pts;
            //绘制canvas
            this._draw();
            //重置canvas大小和位置
            this._locateAndRedrawCanvas();
        },


        /**
         * 设置红色阈值的密度
         * @param value
         */
        setDensity:function(value){
            this._density=value;
            //绘制canvas
            this._draw();
            //重置canvas大小和位置
            this._locateAndRedrawCanvas();
        },



        /**
         * 设置是否可见
         * @param visible
         */
        setVisible:function(visible){
            this._visible=visible;
            if (visible) {
                this._canvas.style.visibility = "visible";
            } else {
                this._canvas.style.visibility = "hidden";
            }
        },


        /**
         * 设置透明度
         * @param opacity
         */
        setOpacity:function(opacity){
            this._canvas.style.opacity=opacity;
        },

        /**
         * 清除
         */
        clear:function(){
            this._pointArr=new Array();
            //清空canvas
            this._canvas.getContext("2d").clearRect(0, 0, this._map.width, this._map.height);
        },


        /**
         * 绘制
         */
        _draw:function(){
            if(!this._pointArr) {
                this._canvas.getContext("2d").clearRect(0,0,this._canvas.width,this._canvas.height);
                return;
            }
            //统计点的范围
            this._xmin=Number.MAX_VALUE;
            this._ymin=Number.MAX_VALUE;
            this._xmax=Number.MIN_VALUE;
            this._ymax=Number.MIN_VALUE;


            for (var i = 0,length=this._pointArr.length; i < length; i++) {
                var pt=this._pointArr[i];
                this._xmin=Math.min(pt.x,this._xmin);
                this._ymin=Math.min(pt.y,this._ymin);
                this._xmax=Math.max(pt.x,this._xmax);
                this._ymax=Math.max(pt.y,this._ymax);
            }
            this._xmin=this._xmin-1000;
            this._ymin=this._ymin-1000;
            this._xmax=this._xmax+1000;
            this._ymax=this._ymax+1000;

            //计算canvas大小
            this._calculHidedCanvasSize(this._xmin,this._ymin,this._xmax,this._ymax);
            //计算像素坐标
            var heatPtArr=[];
            var param=this._calculateParam(this._value);
            for(var i=0,length=this._pointArr.length;i<length;i++){
                var pt=this._pointArr[i];
                var pixelx=(pt.x-this._xmin)/(this._xmax-this._xmin)*this._canvasWidth;
                var pixely=(this._ymax-pt.y)/(this._ymax-this._ymin)*this._canvasHeight;
                heatPtArr.push({x:pixelx,y:pixely,value:pt.value,radius:param.r});

            }
            //影藏的canvas，用于拷贝
            if(!this._drawCanvas) {
                this._drawCanvas = document.createElement("canvas");
                this._drawCanvas.id="heatmap2";

               // this._container.appendChild(this._drawCanvas);
            }
            this._drawCanvas.width=this._canvasWidth;
            this._drawCanvas.height=this._canvasHeight;
            this._heatmap.setData({
                min: 0,
                max: param.max,
                data: heatPtArr,
                canvas:this._drawCanvas,
                width:this._canvasWidth,
                height:this._canvasHeight
            });
        },


        /**
         * 地图绑定事件
         * @param map
         * @private
         */
        _bindEvent:function(map){
            if(map){
                map.on("extent-change",this._extentChanged.bind(this));
                map.on("pan",this._panned.bind(this));
                map.on("resize",this._resized.bind(this));
            }
        },

        /**
         * 初始化canvas
         * @param map
         * @private
         */
        _initCanvas:function(map){
            //小区画板
            if(!this._canvas){
                this._canvas = document.createElement("canvas");
                this._ctx = this._canvas.getContext("2d");
                this._canvas.style.cssText = " position: absolute; opacity:1; display: block;pointer-events:none";
                this._canvas.id="heatmap";
            }

            this._canvas.width = map.width;
            this._canvas.height = map.height;


        },

        /**
         * 地图范围改变响应
         * @param event
         * @private
         */
        _extentChanged:function (event) {
            //重置大小和位置
            this._locateAndRedrawCanvas();
        },

        /**
         * 地图移动响应
         * @param event
         * @private
         */
        _panned:function(event){
            var x = event.delta.x;
            var y = event.delta.y;
            this._locateCanvas(x,y);
        },

        /**
         * 地图大小改变响应
         * @param event
         * @private
         */
        _resized:function(event){
            this._initCanvas(this._map);

            this._draw();
            this._locateAndRedrawCanvas();
        },


        /**
         * 计算隐藏的canvas大小
         * @param minx 最大最小地理坐标
         * @param miny
         * @param maxx
         * @param maxy
         * @private
         */
        _calculHidedCanvasSize:function(minx,miny,maxx,maxy){
            var scale=(maxy-miny)/(maxx-minx);
            if(scale>1){
                this._canvasWidth=this._map.height/scale;
                this._canvasHeight=this._map.height;
            }
            else{
                this._canvasWidth=this._map.width;
                this._canvasHeight=this._map.width*scale;
            }

            //初始的距离和像素比例，为了后面重新计算canvas大小
            this._oriPixelScale=(maxx-minx)/this._canvasWidth;

        },

        /**
         * 改变canvas位置和重绘
         * @private
         */
        _locateAndRedrawCanvas:function() {
            var map=this._map;
            this._locateCanvas(0,0);
            this._canvas.getContext("2d").clearRect(0,0,this._canvas.width,this._canvas.height);
            var extent_xmin=map.extent.xmin;
            var extent_ymin=map.extent.ymin;
            var extent_xmax=map.extent.xmax;
            var extent_ymax=map.extent.ymax;
            var pixelScale = (extent_xmax - extent_xmin) / map.width;

            //计算截取的位置
            var x=(extent_xmin-this._xmin)/this._oriPixelScale;
            var y=(this._ymax-extent_ymax)/this._oriPixelScale;
            x=x<0?0:x;
            y=y<0?0:y;
            //计算截取的大小
            if(this._xmax<extent_xmin || this._xmin>extent_xmax || this._ymax<extent_ymin || this._ymin>extent_ymax){
                return;
            }
            var left=(this._xmin-extent_xmin)/this._oriPixelScale;
            var bottom=(this._ymin-extent_ymin)/this._oriPixelScale;
            var top=(extent_ymax-this._ymax)/this._oriPixelScale;
            var right=(extent_xmax-this._xmax)/this._oriPixelScale;
            var width=0;
            var height=0;
            if(left>0){
                if(right>0){
                    width=this._canvasWidth;
                } else{
                    width=this._canvasWidth+right;
                }
            } else{
                if(right>0){
                    width=this._canvasWidth+left;
                } else{
                    width=this._map.width*pixelScale/this._oriPixelScale;
                }
            }
            if(top>0){
                if(bottom>0){
                    height=this._canvasHeight;
                }else{
                    height=this._canvasHeight+bottom;
                }
            }else{
                if(bottom>0){
                    height=this._canvasHeight+top;
                }
                else{
                    height=this._map.height*pixelScale/this._oriPixelScale;
                }
            }

            //计算绘制的位置
            var newx=(this._xmin-extent_xmin)/pixelScale;
            var newy=(extent_ymax-this._ymax)/pixelScale;
            newx=newx<0?0:newx;
            newy=newy<0?0:newy;

            //计算绘制的大小
            var newWidth=width*this._oriPixelScale/pixelScale;
            var newHeight=height*this._oriPixelScale/pixelScale;

            if (this._drawCanvas){

                this._canvas.getContext("2d").drawImage(this._drawCanvas, x, y,width,height,newx,newy,newWidth,newHeight);
            }
            // this._pixel_x=(this._xmin-this._map.extent.xmin)/pixelScale;
            // this._pixel_y=(this._map.extent.ymax-this._ymax)/pixelScale;
            // this._locateCanvas(this._pixel_x,this._pixel_y);

        },

        /**
         * 设置canvas的位置
         * @param x 像素坐标
         * @param y
         * @private
         */
        _locateCanvas:function(x,y){
            var translate = "translate(" + x + "px," + y + "px)";   //canvas平移中心点
            this._canvas.style.transform = translate;
            this._canvas.style.WebkitTransform = translate;
            this._canvas.style.MozTransform = translate;
            this._canvas.style.OTransform = translate;
            this._canvas.style.msTransform = translate;
        },

        /**
         * 计算热力图的一些参数
         * @param value
         * @private
         */
        _calculateParam:function(value){
            //计算个人范围的像素半径
            var pixelr=this._r/this._oriPixelScale;
            //像素半径不能小于3，否则绘制的热力图颗粒度太细或者绘制不出来
            if(pixelr<3){
                pixelr=3;
            }
            //再反算地理长度
            var r=pixelr*this._oriPixelScale;
            max=Math.PI*Math.pow(r,2)/2*this._density*value;
            return {max:max,r:pixelr};

        }



    });
    return d;
});


































/**************************************************************第三方插件*****************************************/

/*
 * heatmap.js v2.0.5 | JavaScript Heatmap Library
 *
 * Copyright 2008-2016 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.
 * Dual licensed under MIT and Beerware license
 *
 * :: 2016-09-05 01:16
 */
;(function (name, context, factory) {

    // Supports UMD. AMD, CommonJS/Node.js and browser context
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    }
    //这段注释掉，是因为和dojo的define冲突
    // else if (typeof define === "function" && define.amd) {
    //   //define(factory);
    // }
    else {
        context[name] = factory();
    }

})("h337", this, function () {

// Heatmap Config stores default values and will be merged with instance config
    var HeatmapConfig = {
        defaultRadius: 40,
        defaultRenderer: 'canvas2d',
        //defaultGradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
        defaultGradient: { 0.25: "rgb(0,0,255)", 0.5: "rgb(0,255,0)", 0.75: "yellow", 1.0: "rgb(255,0,0)"},
        defaultMaxOpacity: 1,
        defaultMinOpacity: 0,
        defaultBlur: .85,
        defaultXField: 'x',
        defaultYField: 'y',
        defaultValueField: 'value',
        plugins: {}
    };
    var Store = (function StoreClosure() {

        var Store = function Store(config) {
            this._coordinator = {};
            this._data = [];
            this._radi = [];
            this._min = 10;
            this._max = 1;
            this._xField = config['xField'] || config.defaultXField;
            this._yField = config['yField'] || config.defaultYField;
            this._valueField = config['valueField'] || config.defaultValueField;

            if (config["radius"]) {
                this._cfgRadius = config["radius"];
            }
        };

        var defaultRadius = HeatmapConfig.defaultRadius;

        Store.prototype = {
            // when forceRender = false -> called from setData, omits renderall event
            _organiseData: function(dataPoint, forceRender) {
                var x = dataPoint[this._xField];
                var y = dataPoint[this._yField];
                var radi = this._radi;
                var store = this._data;
                var max = this._max;
                var min = this._min;
                var value = dataPoint[this._valueField] || 1;
                var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

                if (!store[x]) {
                    store[x] = [];
                    radi[x] = [];
                }

                if (!store[x][y]) {
                    store[x][y] = value;
                    radi[x][y] = radius;
                } else {
                    store[x][y] += value;
                }
                var storedVal = store[x][y];

                if (storedVal > max) {
                    if (!forceRender) {
                        this._max = storedVal;
                    } else {
                        this.setDataMax(storedVal);
                    }
                    return false;
                } else if (storedVal < min) {
                    if (!forceRender) {
                        this._min = storedVal;
                    } else {
                        this.setDataMin(storedVal);
                    }
                    return false;
                } else {
                    return {
                        x: x,
                        y: y,
                        value: value,
                        radius: radius,
                        min: min,
                        max: max
                    };
                }
            },
            _unOrganizeData: function() {
                var unorganizedData = [];
                var data = this._data;
                var radi = this._radi;

                for (var x in data) {
                    for (var y in data[x]) {

                        unorganizedData.push({
                            x: x,
                            y: y,
                            radius: radi[x][y],
                            value: data[x][y]
                        });

                    }
                }
                return {
                    min: this._min,
                    max: this._max,
                    data: unorganizedData
                };
            },
            _onExtremaChange: function() {
                this._coordinator.emit('extremachange', {
                    min: this._min,
                    max: this._max
                });
            },
            addData: function() {
                if (arguments[0].length > 0) {
                    var dataArr = arguments[0];
                    var dataLen = dataArr.length;
                    while (dataLen--) {
                        this.addData.call(this, dataArr[dataLen]);
                    }
                } else {
                    // add to store
                    var organisedEntry = this._organiseData(arguments[0], true);
                    if (organisedEntry) {
                        // if it's the first datapoint initialize the extremas with it
                        if (this._data.length === 0) {
                            this._min = this._max = organisedEntry.value;
                        }
                        this._coordinator.emit('renderpartial', {
                            min: this._min,
                            max: this._max,
                            data: [organisedEntry]
                        });
                    }
                }
                return this;
            },
            setData: function(data) {
                var dataPoints = data.data;
                var pointsLen = dataPoints.length;


                // reset data arrays
                this._data = [];
                this._radi = [];

                for(var i = 0; i < pointsLen; i++) {
                    this._organiseData(dataPoints[i], false);
                }
                this._max = data.max;
                this._min = data.min || 0;
                this._width=data.width;
                this._height=data.height;
                this._canvas=data.canvas;
                this._onExtremaChange();
                this._coordinator.emit('renderall', this._getInternalData());
                return this;
            },
            removeData: function() {
                // TODO: implement
            },
            setDataMax: function(max) {
                this._max = max;
                this._onExtremaChange();
                this._coordinator.emit('renderall', this._getInternalData());
                return this;
            },
            setDataMin: function(min) {
                this._min = min;
                this._onExtremaChange();
                this._coordinator.emit('renderall', this._getInternalData());
                return this;
            },
            setCoordinator: function(coordinator) {
                this._coordinator = coordinator;
            },
            _getInternalData: function() {
                return {
                    max: this._max,
                    min: this._min,
                    data: this._data,
                    radi: this._radi,
                    width:this._width,
                    height:this._height,
                    canvas:this._canvas
                };
            },
            getData: function() {
                return this._unOrganizeData();
            }/*,

      TODO: rethink.

    getValueAt: function(point) {
      var value;
      var radius = 100;
      var x = point.x;
      var y = point.y;
      var data = this._data;

      if (data[x] && data[x][y]) {
        return data[x][y];
      } else {
        var values = [];
        // radial search for datapoints based on default radius
        for(var distance = 1; distance < radius; distance++) {
          var neighbors = distance * 2 +1;
          var startX = x - distance;
          var startY = y - distance;

          for(var i = 0; i < neighbors; i++) {
            for (var o = 0; o < neighbors; o++) {
              if ((i == 0 || i == neighbors-1) || (o == 0 || o == neighbors-1)) {
                if (data[startY+i] && data[startY+i][startX+o]) {
                  values.push(data[startY+i][startX+o]);
                }
              } else {
                continue;
              }
            }
          }
        }
        if (values.length > 0) {
          return Math.max.apply(Math, values);
        }
      }
      return false;
    }*/
        };


        return Store;
    })();

    var Canvas2dRenderer = (function Canvas2dRendererClosure() {

        var _getColorPalette = function(config) {
            var gradientConfig = config.gradient || config.defaultGradient;
            var paletteCanvas = document.createElement('canvas');
            var paletteCtx = paletteCanvas.getContext('2d');

            paletteCanvas.width = 256;
            paletteCanvas.height = 1;

            var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
            for (var key in gradientConfig) {
                gradient.addColorStop(key, gradientConfig[key]);
            }

            paletteCtx.fillStyle = gradient;
            paletteCtx.fillRect(0, 0, 256, 1);

            return paletteCtx.getImageData(0, 0, 256, 1).data;
        };

        var _getPointTemplate = function(radius, blurFactor) {
            var tplCanvas = document.createElement('canvas');
            var tplCtx = tplCanvas.getContext('2d');
            var x = radius;
            var y = radius;
            tplCanvas.width = tplCanvas.height = radius*2;

            if (blurFactor == 1) {
                tplCtx.beginPath();
                tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
                tplCtx.fillStyle = 'rgba(0,0,0,1)';
                tplCtx.fill();
            } else {
                var gradient = tplCtx.createRadialGradient(x, y, radius*blurFactor, x, y, radius);
                gradient.addColorStop(0, 'rgba(0,0,0,1)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                tplCtx.fillStyle = gradient;
                tplCtx.fillRect(0, 0, 2*radius, 2*radius);
            }



            return tplCanvas;
        };

        var _prepareData = function(data) {
            var renderData = [];
            var min = data.min;
            var max = data.max;
            var radi = data.radi;
            var data = data.data;
            var width=data.width;
            var height=data.height;
            var xValues = Object.keys(data);
            var xValuesLen = xValues.length;

            while(xValuesLen--) {
                var xValue = xValues[xValuesLen];
                var yValues = Object.keys(data[xValue]);
                var yValuesLen = yValues.length;
                while(yValuesLen--) {
                    var yValue = yValues[yValuesLen];
                    var value = data[xValue][yValue];
                    var radius = radi[xValue][yValue];
                    renderData.push({
                        x: xValue,
                        y: yValue,
                        value: value,
                        radius: radius
                    });
                }
            }

            return {
                min: min,
                max: max,
                data: renderData,
                width:width,
                height:height
            };
        };


        function Canvas2dRenderer(config) {
            var container = config.container;
            var shadowCanvas = this.shadowCanvas = document.createElement('canvas');
            var canvas = this.canvas = config.canvas || document.createElement('canvas');
            var renderBoundaries = this._renderBoundaries = [10000, 10000, 0, 0];

            var computed = getComputedStyle(config.container) || {};

            canvas.className = 'heatmap-canvas';
            canvas.id="heatmapCanvas";
            this._width = canvas.width = shadowCanvas.width = config.width || +(computed.width.replace(/px/,''));
            this._height = canvas.height = shadowCanvas.height = config.height || +(computed.height.replace(/px/,''));

            this.shadowCtx = shadowCanvas.getContext('2d');
            this.ctx = canvas.getContext('2d');

            // @TODO:
            // conditional wrapper

            canvas.style.cssText = shadowCanvas.style.cssText = 'position:absolute;left:0;top:0;';

            container.style.position = 'relative';
            container.appendChild(canvas);

            this._palette = _getColorPalette(config);
            this._templates = {};

            this._setStyles(config);
        };

        Canvas2dRenderer.prototype = {
            renderPartial: function(data) {
                if (data.data.length > 0) {
                    this._drawAlpha(data);
                    this._colorize();
                }
            },
            renderAll: function(data) {
                this.canvas=data.canvas;
                this.ctx=this.canvas.getContext("2d");
                this.setDimensions(data.width,data.height);

                this._clear();
                this._drawAlpha(_prepareData(data));
                this._colorize();

            },
            _updateGradient: function(config) {
                this._palette = _getColorPalette(config);
            },
            updateConfig: function(config) {
                if (config['gradient']) {
                    this._updateGradient(config);
                }
                this._setStyles(config);
            },
            setDimensions: function(width, height) {
                this._width = width;
                this._height = height;
                this.canvas.width = this.shadowCanvas.width = width;
                this.canvas.height = this.shadowCanvas.height = height;
            },
            _clear: function() {
                this.shadowCtx.clearRect(0, 0, this._width, this._height);
                this.ctx.clearRect(0, 0, this._width, this._height);
            },
            _setStyles: function(config) {
                this._blur = (config.blur == 0)?0:(config.blur || config.defaultBlur);

                if (config.backgroundColor) {
                    this.canvas.style.backgroundColor = config.backgroundColor;
                }

                this._width = this.canvas.width = this.shadowCanvas.width = config.width || this._width;
                this._height = this.canvas.height = this.shadowCanvas.height = config.height || this._height;


                this._opacity = (config.opacity || 0) * 255;
                this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
                this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
                this._useGradientOpacity = !!config.useGradientOpacity;
            },
            _drawAlpha: function(data) {
                var min = this._min = data.min;
                var max = this._max = data.max;

                var data = data.data || [];
                var dataLen = data.length;
                // on a point basis?
                var blur = 1 - this._blur;

                while(dataLen--) {

                    var point = data[dataLen];

                    var x = point.x;
                    var y = point.y;
                    var radius = point.radius;
                    // if value is bigger than max
                    // use max as value
                    var value = Math.min(point.value, max);
                    var rectX = x - radius;
                    var rectY = y - radius;
                    var shadowCtx = this.shadowCtx;




                    var tpl;
                    if (!this._templates[radius]) {
                        this._templates[radius] = tpl = _getPointTemplate(radius, blur);
                    } else {
                        tpl = this._templates[radius];
                    }
                    // value from minimum / value range
                    // => [0, 1]
                    var templateAlpha = (value-min)/(max-min);
                    // this fixes #176: small values are not visible because globalAlpha < .01 cannot be read from imageData
                    shadowCtx.globalAlpha = templateAlpha < .01 ? .01 : templateAlpha;

                    shadowCtx.drawImage(tpl, rectX, rectY);

                    // update renderBoundaries
                    if (rectX < this._renderBoundaries[0]) {
                        this._renderBoundaries[0] = rectX;
                    }
                    if (rectY < this._renderBoundaries[1]) {
                        this._renderBoundaries[1] = rectY;
                    }
                    if (rectX + 2*radius > this._renderBoundaries[2]) {
                        this._renderBoundaries[2] = rectX + 2*radius;
                    }
                    if (rectY + 2*radius > this._renderBoundaries[3]) {
                        this._renderBoundaries[3] = rectY + 2*radius;
                    }

                }
            },
            _colorize: function() {
                var x = this._renderBoundaries[0];
                var y = this._renderBoundaries[1];
                var width = this._renderBoundaries[2] - x;
                var height = this._renderBoundaries[3] - y;
                var maxWidth = this._width;
                var maxHeight = this._height;
//      //edit by houlu 2017/7/6
//      var maxWidth=this.ctx.canvas.width;
//      var maxHeight=this.ctx.canvas.height;
                var opacity = this._opacity;
                var maxOpacity = this._maxOpacity;
                var minOpacity = this._minOpacity;
                var useGradientOpacity = this._useGradientOpacity;

                if (x < 0) {
                    x = 0;
                }
                if (y < 0) {
                    y = 0;
                }
                if (x + width > maxWidth) {
                    width = maxWidth - x;
                }
                if (y + height > maxHeight) {
                    height = maxHeight - y;
                }

                var img = this.shadowCtx.getImageData(x, y, width, height);
                var imgData = img.data;
                var len = imgData.length;
                var palette = this._palette;


                for (var i = 3; i < len; i+= 4) {
                    var alpha = imgData[i];
                    var offset = alpha * 4;


                    if (!offset) {
                        continue;
                    }

                    var finalAlpha;
                    if (opacity > 0) {
                        finalAlpha = opacity;
                    } else {
                        if (alpha < maxOpacity) {
                            if (alpha < minOpacity) {
                                finalAlpha = minOpacity;
                            } else {
                                finalAlpha = alpha;
                            }
                        } else {
                            finalAlpha = maxOpacity;
                        }
                    }

                    imgData[i-3] = palette[offset];
                    imgData[i-2] = palette[offset + 1];
                    imgData[i-1] = palette[offset + 2];
                    imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha;

                }

                img.data = imgData;
                this.ctx.putImageData(img, x, y);

                this._renderBoundaries = [1000, 1000, 0, 0];

            },
            getValueAt: function(point) {
                var value;
                var shadowCtx = this.shadowCtx;
                var img = shadowCtx.getImageData(point.x, point.y, 1, 1);
                var data = img.data[3];
                var max = this._max;
                var min = this._min;

                value = (Math.abs(max-min) * (data/255)) >> 0;

                return value;
            },
            getDataURL: function() {
                return this.canvas.toDataURL();
            }
        };


        return Canvas2dRenderer;
    })();


    var Renderer = (function RendererClosure() {

        var rendererFn = false;

        if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
            rendererFn = Canvas2dRenderer;
        }

        return rendererFn;
    })();


    var Util = {
        merge: function() {
            var merged = {};
            var argsLen = arguments.length;
            for (var i = 0; i < argsLen; i++) {
                var obj = arguments[i]
                for (var key in obj) {
                    merged[key] = obj[key];
                }
            }
            return merged;
        }
    };
// Heatmap Constructor
    var Heatmap = (function HeatmapClosure() {

        var Coordinator = (function CoordinatorClosure() {

            function Coordinator() {
                this.cStore = {};
            };

            Coordinator.prototype = {
                on: function(evtName, callback, scope) {
                    var cStore = this.cStore;

                    if (!cStore[evtName]) {
                        cStore[evtName] = [];
                    }
                    cStore[evtName].push((function(data) {
                        return callback.call(scope, data);
                    }));
                },
                emit: function(evtName, data) {
                    var cStore = this.cStore;
                    if (cStore[evtName]) {
                        var len = cStore[evtName].length;
                        for (var i=0; i<len; i++) {
                            var callback = cStore[evtName][i];
                            callback(data);
                        }
                    }
                }
            };

            return Coordinator;
        })();


        var _connect = function(scope) {
            var renderer = scope._renderer;
            var coordinator = scope._coordinator;
            var store = scope._store;

            coordinator.on('renderpartial', renderer.renderPartial, renderer);
            coordinator.on('renderall', renderer.renderAll, renderer);
            coordinator.on('extremachange', function(data) {
                scope._config.onExtremaChange &&
                scope._config.onExtremaChange({
                    min: data.min,
                    max: data.max,
                    gradient: scope._config['gradient'] || scope._config['defaultGradient']
                });
            });
            store.setCoordinator(coordinator);
        };


        function Heatmap() {
            var config = this._config = Util.merge(HeatmapConfig, arguments[0] || {});
            this._coordinator = new Coordinator();
            if (config['plugin']) {
                var pluginToLoad = config['plugin'];
                if (!HeatmapConfig.plugins[pluginToLoad]) {
                    throw new Error('Plugin \''+ pluginToLoad + '\' not found. Maybe it was not registered.');
                } else {
                    var plugin = HeatmapConfig.plugins[pluginToLoad];
                    // set plugin renderer and store
                    this._renderer = new plugin.renderer(config);
                    this._store = new plugin.store(config);
                }
            } else {
                this._renderer = new Renderer(config);
                this._store = new Store(config);
            }
            _connect(this);
        };

        // @TODO:
        // add API documentation
        Heatmap.prototype = {
            addData: function() {
                this._store.addData.apply(this._store, arguments);
                return this;
            },
            removeData: function() {
                this._store.removeData && this._store.removeData.apply(this._store, arguments);
                return this;
            },
            setData: function() {
                this._store.setData.apply(this._store, arguments);
                return this;
            },
            setDataMax: function() {
                this._store.setDataMax.apply(this._store, arguments);
                return this;
            },
            setDataMin: function() {
                this._store.setDataMin.apply(this._store, arguments);
                return this;
            },
            configure: function(config) {
                this._config = Util.merge(this._config, config);
                this._renderer.updateConfig(this._config);
                this._coordinator.emit('renderall', this._store._getInternalData());
                return this;
            },
            updateColor: function (config) {
                this._config.defaultGradient = config.gradient;
                var renderer = this._renderer;

                var paletteCanvas = document.createElement('canvas');
                var paletteCtx = paletteCanvas.getContext('2d');
                paletteCanvas.width = 256;
                paletteCanvas.height = 1;
                var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
                for (var key in this._config.defaultGradient) {
                    gradient.addColorStop(key, this._config.defaultGradient[key]);
                }
                paletteCtx.fillStyle = gradient;
                paletteCtx.fillRect(0, 0, 256, 1);
                renderer._palette = paletteCtx.getImageData(0, 0, 256, 1).data;
            },
            repaint: function() {
                this._coordinator.emit('renderall', this._store._getInternalData());
                return this;
            },
            getData: function() {
                return this._store.getData();
            },
            getDataURL: function() {
                return this._renderer.getDataURL();
            },
            getValueAt: function(point) {

                if (this._store.getValueAt) {
                    return this._store.getValueAt(point);
                } else  if (this._renderer.getValueAt) {
                    return this._renderer.getValueAt(point);
                } else {
                    return null;
                }
            }
        };

        return Heatmap;

    })();


// core
    var heatmapFactory = {
        create: function(config) {
            return new Heatmap(config);
        },
        register: function(pluginKey, plugin) {
            HeatmapConfig.plugins[pluginKey] = plugin;
        }
    };

    return heatmapFactory;


});