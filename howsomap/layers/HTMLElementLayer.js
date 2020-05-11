/**
 * 描述：页面元素图层
 * 作者：houlu
 * 创建时间：2019/5/30
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare"

], function (declare) {
    var d = declare("howsomap.layers.HTMLElementLayer",null, {
        /**
         * 构造函数
         * @param  options:{map,clicked,
         */
        constructor: function (options) {
            this._map=options.map;
           // this.onclick=options.onClick;
            this._bindEvent(this._map);
            this._initDivContainer();
            this._lastZIndex=999;
        },

        /**
         * 添加到指定容器
         * @param container
         */
        addToContainer:function(container){
            container.appendChild(this._divContainer);
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
        addElement:function(element,pt,offset){
            if(!this._elements){
                this._elements=[];
            }
            var obj={el:element,pt:pt,offset:{x:offset.x,y:offset.y},style:{top:0,left:0}};
            element.style.position="absolute";
            this._elements.push(obj);
            this._divContainer.appendChild(element);
            this._setElementPosition(obj);
        },


        /**
         * 设置是否可见
         * @param visible
         */
        setVisible:function(visible){
            this.visible=visible;
        },


        /**
         * 设置透明度
         * @param opacity
         */
        setOpacity:function(opacity){
            //this._canvas.style.opacity=opacity;
        },

        /**
         * 清除
         */
        clear:function(){
            if(this._elements){
                for(var i=0;i<this._elements.length;i++){
                    this._divContainer.removeChild(this._elements[i]);
                }
            }
            this._elements=[];
        },

        /**
         * 让指定graphic显示在最上面
         * @param graphic
         */
        setToTop:function(element){
            element.style.zIndex=this._lastZIndex;
            this._lastZIndex++;
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
                //map.on("click", this._clicked.bind(this));

            }
        },

        /**
         * 初始化Element容器
         * @param map
         * @private
         */
        _initDivContainer:function(map){
            this._divContainer = document.createElement("div");
            this._divContainer.style.cssText = " position: absolute; opacity:1;width:100%;height:100%; display: block;pointer-events:none";
        },



        /**
         * 地图移动响应
         * @param event
         * @private
         */
        _pan:function(event){
            var transform = "matrix(1,0,0,1," + event.delta.x + "," + event.delta.y + ")";
            this._divContainer.style.transform = transform;
            this._divContainer.style.WebkitTransform = transform;
            this._divContainer.style.MozTransform = transform;
            this._divContainer.style.OTransform = transform;
            this._divContainer.style.msTransform = transform;
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
            this._divContainer.style.transform = transform;
            this._divContainer.style.WebkitTransform = transform;
            this._divContainer.style.MozTransform = transform;
            this._divContainer.style.OTransform = transform;
            this._divContainer.style.msTransform = transform;
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
            this._resetPosition();
        },

        /**
         * 地图大小改变响应
         * @param event
         * @private
         */
        _resized:function(event){
            // this._divContainer.style.width=event.width+"px";
            // this._divContainer.style.height=event.height+"px";
        },



        /**
         * 重置所有的Element的位置
         * @private
         */
        _resetPosition:function(){
            for(var i=0;i<this._elements.length;i++){
                this._setElementPosition(this._elements[i]);
            }
        },

        _setElementPosition:function(element){
            var width=this._map.width;
            var height=this._map.height;
            var xmin=this._map.extent.xmin;
            var ymin=this._map.extent.ymin;
            var xmax=this._map.extent.xmax;
            var ymax=this._map.extent.ymax;
            var pixelx=(element.pt.x-xmin)/(xmax-xmin)*width;
            var pixely=(ymax-element.pt.y)/(ymax-ymin)*height;
            element.el.style.left=(pixelx+element.offset.x-element.el.width/2)+"px";
            element.el.style.top=(pixely+element.offset.y-element.el.height/2)+"px";
        },


    });
    return d;
})