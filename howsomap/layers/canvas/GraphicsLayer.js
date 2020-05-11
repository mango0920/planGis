/**
 * 描述：canvas图层
 * 作者：houlu
 * 创建时间：2019/5/14
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "../../Graphic",
    "../../geometry/GeometryType",
    "../../symbols/SymbolType",
    "../../renderer/canvas/ImageRenderer",
    "../../renderer/canvas/LineRenderer",
    "../../renderer/canvas/PolygonRenderer",
    "../../renderer/canvas/TextRenderer"

], function (declare,Graphic,GeometryType,SymbolType,ImageRenderer,LineRenderer,PolygonRenderer,TextRenderer) {
    var d = declare("howsomap.layers.canvas.GraphicsLayer",null, {
        /**
         * 构造函数
         * @param  options:{map,clicked,
         */

        constructor: function (options) {
            this._map=options.map;
            this.onclick=options.onClick;
            this._bindEvent(this._map);
            this._initCanvas(this._map);
            this._initClickedCanvas();
            this.graphics=[];
            this.visible=true;

            this._clickedCanvas.style.cssText = " position: absolute; opacity:1; display: block;pointer-events:none";
            //this.opacity=1;
        },

        /**
         * 添加到指定容器
         * @param container
         */
        addToContainer:function(container){
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
         * 添加graphic，不会引起重绘
         * @param graphic
         */
        addGraphic:function(graphic,index){
            if(typeof(index) != "undefined" &&  typeof(index) != "null"){
                this.graphics.splice(index, 0, graphic);
            }else{
                this.graphics.push(graphic);
            }
            graphic.setDrawFunction(this._setDrawFunction);
        },



        /**
         * 移除graphic，不会引起重绘
         * @param graphic
         */
        removeGraphic:function(graphic){
            var index=this.graphics.indexOf(graphic);
            this.graphics.splice(index, 1);
        },

        /**
         * 获取graphic的索引
         * @param graphic
         * @returns {number}
         */
        getGraphicIndex:function(graphic){
            return this.graphics.indexOf(graphic);
        },

        /**
         * 设置是否可见
         * @param visible
         */
        setVisible:function(visible){
            this.visible=visible;
            this.draw();
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
            this.graphics=[];
            this.draw();
        },

        /**
         * 让指定graphic显示在最上面
         * @param graphic
         */
        showGraphicTop:function(graphic){
            var index=this.graphics.indexOf(graphic);
            if(index>=0){
                this.graphics.slice(index,1);
                this.graphics.push(graphic);
            }
        },

        /**
         * 绘制
         */
        draw:function(){
            this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height);
            if(this.visible){
                //this.symbol.draw();
                let graphic;
                for(var i=0;i<this.graphics.length;i++){
                    graphic=this.graphics[i];
                    graphic.draw(graphic.geometry,this._ctx);
                }

            }

        },



        /**
         * 地图绑定事件
         * @param map
         * @private
         */
        _bindEvent:function(map){
            if(map){
                map.on("extent-change",this._extentChanged.bind(this));
                map.on("pan",this._pan.bind(this));
                map.on("resize",this._resized.bind(this));
                map.on("zoom",this._zoom.bind(this));
                map.on("click", this._clicked.bind(this));

            }
        },

        /**
         * 初始化canvas
         * @param map
         * @private
         */
        _initCanvas:function(map){
            this._canvas = document.createElement("canvas");
            this._ctx = this._canvas.getContext("2d");


            this._canvas.style.cssText = " position: absolute; opacity:1; display: block;pointer-events:none";
            this._canvas.width = map.width;
            this._canvas.height = map.height;
            this._canvas.style.top = 0;
        },



        /**
         * 地图移动响应
         * @param event
         * @private
         */
        _pan:function(event){
            var transform = "matrix(1,0,0,1," + event.delta.x + "," + event.delta.y + ")";
            this._canvas.style.transform = transform;
            this._canvas.style.WebkitTransform = transform;
            this._canvas.style.MozTransform = transform;
            this._canvas.style.OTransform = transform;
            this._canvas.style.msTransform = transform;
        },

        /**
         * 缩放效果
         * @param event
         * @private
         */
        _zoom:function(event){
            var scale= event.zoomFactor;
            var anchor=event.anchor;
            var center={x:this._map.width/2,y:this._map.height/2};
            var newCenter={
                x:anchor.x+(center.x-anchor.x)*scale,
                y:anchor.y+(center.y-anchor.y)*scale
            };
            var left=-(center.x-newCenter.x);
            var top=-(center.y-newCenter.y);
            var transform = "matrix("+scale+",0,0,"+scale+"," + left + "," + top + ")";
            this._canvas.style.transform = transform;
            this._canvas.style.WebkitTransform = transform;
            this._canvas.style.MozTransform = transform;
            this._canvas.style.OTransform = transform;
            this._canvas.style.msTransform = transform;
        },

        /**
         * 地图范围改变响应
         * @param event
         * @private
         */
        _extentChanged:function (event) {
           // console.log(1111);
            //将canvas移到初始位置
            var delta = {delta: {x: 0, y: 0}};
            this._pan(delta);
            //重绘
            this.draw();
        },

        /**
         * 地图大小改变响应
         * @param event
         * @private
         */
        _resized:function(event){
            this._canvas.width=event.width;
            this._canvas.height=event.height;
        },

        /**
         * 点击响应
         * @param event
         * @private
         */
        _clicked:function(event){
            let clickedGraphics=[];
            let ctx=this._clickedCtx;
            if(!this.onclick){
                return;
            }
            let x=event.clientX;
            let y=event.clientY;
            for(let i=0,length=this.graphics.length;i<length;i++){
                let graphic=this.graphics[i];
                ctx.clearRect(0,0,this._clickedCanvas.width,this._clickedCanvas.height);
                graphic.draw(graphic.geometry,ctx,{x:x,y:y});
                let imgData=ctx.getImageData(0,0,this._clickedCanvas.width,this._clickedCanvas.height).data;
                for(let j=3;j<imgData.length;j+=4){
                    if(imgData[j]>0){
                        clickedGraphics.push(graphic);
                        break;
                    }
                }

            }


            if(clickedGraphics.length>0){
                this.onclick(clickedGraphics);
            }

        },

        /**
         * 设置绘制方法
         * @param graphic
         */
        _setDrawFunction:function(graphic){
            let geoType=graphic.geometry.type;
            let symbolType=graphic.symbol.type;
            let symbol=graphic.symbol;
            let renderer;
            //点
            if(geoType===GeometryType.POINT){
                if(symbolType===SymbolType.PICTUREMARKERSYMBOL){
                    renderer=new ImageRenderer(symbol);
                    graphic.draw=renderer.drawImage.bind(renderer);
                }else if(symbolType===SymbolType.TEXTSYMBOL){
                    renderer=new TextRenderer(symbol);
                    graphic.draw=renderer.drawText.bind(renderer);
                }
            }
            //线
            else if(geoType===GeometryType.POLYLINE){
                if(symbolType===SymbolType.LINESYMBOL){
                    renderer=new LineRenderer(symbol);
                    graphic.draw=renderer.drawLine.bind(renderer);
                }
            }
            //面
            else if(geoType===GeometryType.POLYGON){
                if(symbolType===SymbolType.FILLSYMBOL || symbolType===SymbolType.LINESYMBOL){
                    renderer=new PolygonRenderer(symbol);
                    graphic.draw=renderer.drawPolygon.bind(renderer);
                }
            }
            //扇形
            else if(geoType===GeometryType.SECTOR){
                if(symbolType===SymbolType.FILLSYMBOL || symbolType===SymbolType.LINESYMBOL){
                    renderer=new PolygonRenderer(symbol);
                    graphic.draw=renderer.drawSector.bind(renderer);
                }
            }
        },


        /**
         * 判断graphic是否点中
         * @param graphic
         * @private
         */
        _isClicked:function(graphic){
            let ctx=this._clickedCtx;
            ctx.clearRect(0,0,this._clickedCanvas.width,this._clickedCanvas.height);
            //graphic
        },


        /**
         * 初始化用于判断小区是否点击的canvas
         * @private
         */
        _initClickedCanvas:function(){
            this._clickedCanvas=document.createElement("canvas");
            this._clickedCtx=this._clickedCanvas.getContext("2d");
            this._clickedCanvas.style.cssText = " position: absolute; opacity:1; display: block;pointer-events:none";
            this._clickedCanvas.width=2;
            this._clickedCanvas.height=2;
        },

    });
    return d;
})