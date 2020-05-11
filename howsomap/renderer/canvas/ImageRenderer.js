/**
 * 描述：图片渲染
 * 作者：houlu
 * 创建时间：2019/5/14
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "../../symbols/SymbolType",
    "../../geometry/GeometryType"

], function (declare,SymbolType,GeometryType) {
    var d = declare("howsomap.renderer.canvas.ImageRenderer", null,{
        /**
         * 构造函数
         * @param symbol
         */
        constructor: function (symbol) {
            this._style={
                image:undefined,
                width:0,
                height:0,
                offsetX:0,
                offsetY:0,
            };
            if(typeof symbol!=="undefined"){
                this.setSymbol(symbol);
            }
        },

        /**
         * 设置样式
         * @param symbol
         */
        setSymbol:function(symbol){
            this._style={};
            //设置的是图片样式
            switch(symbol.type){
                case SymbolType.PICTUREMARKERSYMBOL:
                    this._setPictureSymbol(symbol);
                    break;
            }
        },


        /**
         * 绘制图片
         * @param geometry
         *
         * @param ctx
         */
        drawImage:function(geometry,ctx,offset){
            var pt=geometry.toPixel();
            if(typeof offset==="undefined"){
                offset={x:0,y:0};
            }
            ctx.drawImage(
                this._style.image,
                0,
                0,
                this._style.image.width,
                this._style.image.height,
                pt.x-offset.x-this._style.width/2+this._style.offsetX,
                pt.y-offset.y-this._style.height/2+this._style.offsetY,
                this._style.width,
                this._style.height
            );
        },


        /**
         * 设置picture样式
         * @param symbol{
         *     image:图片对象,
         *     width:图片宽度,
         *     height:图片高度,
         *     offsetX:x偏移,
         *     offertY:y偏移
         * }
         * @private
         */
        _setPictureSymbol:function(symbol){
            this._style={
                image:symbol.image,
                width:symbol.width||0,
                height:symbol.height||0,
                offsetX:symbol.offsetX||0,
                offsetY:symbol.offsetY||0
            };

        },

        /**
         * 给canvas的context附样式
         * @param ctx
         * @private
         */
        _setStyleToCtx:function(ctx){

        },

    });
    return d;
})