/**
 * 描述：文字渲染
 * 作者：houlu
 * 创建时间：2019/5/14
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "../../symbols/SymbolType",
    "../../geometry/GeometryType",
    "../../base/TextCalculate"
], function (declare,SymbolType,GeometryType,TextCalculate) {
    var d = declare("howsomap.renderer.canvas.ImageRenderer", null,{
        /**
         * 构造函数
         * @param symbol
         */
        constructor: function (symbol) {
            this._style={
                text:undefined,
                font:undefined,
                fontColor:undefined,
                offsetX:undefined,
                offsetY:undefined,
                background:undefined
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
                case SymbolType.TEXTSYMBOL:
                    this._setTextSymbol(symbol);
                    break;
            }
        },


        /**
         * 绘制文字
         * *@param geometry
         * @param ctx
         */
        drawText:function(geometry,ctx,offset){
            if(typeof offset==="undefined"){
                offset={x:0,y:0};
            }
            let padding=5;
            let pt=geometry.toPixel();
            let size=this._getSize(this._style.text);
            let rows=this._style.text.split("\n");
            size={width:size.width+padding,height:size.height+rows.length*padding};
            //this._size=size;
            //判断是否需要绘制背景
            if(this._style.background){
                ctx.strokeWidth=this._style.background.borderWidth;
                ctx.strokeStyle=this._style.background.borderColor;
                ctx.fillStyle=this._style.background.color;
                //是否画填充色
                if(this._style.background.color) {
                    ctx.fillRect(pt.x-offset.x - size.width / 2, pt.y-offset.y - size.height / 2, size.width, size.height);
                }
                //是否画边框
                if(this._style.background.borderColor){
                    ctx.strokeRect(pt.x-offset.x - size.width / 2, pt.y-offset.y - size.height / 2, size.width, size.height);
                }
            }

            //绘制文字
            ctx.fontStyle=this._style.font;
            ctx.fillStyle=this._style.fontColor;
            ctx.textAlign = "center";		//设置文字水平居中
            ctx.textBaseline = "middle";	//设置文字垂直居中
            //如果只是一行直接绘制
            if(rows.length==1){
                ctx.fillText(rows[0],pt.x,pt.y);
                return;
            }
            //如果是多行，需要计算每行文字的大小
            let width=size.width;
            let height=size.height/rows.length;
            let startx=pt.x-size.width/2;
            let starty=pt.y-size.height/2;
            //绘制的文字左对齐，离左边界padding/2，离上边界padding/2
            for(var i=0;i<rows.length;i++){
                var rowTextSize=this.getSize(rows[i]);
                ctx.fillText(rows[i],startx+rowTextSize.width/2+padding/2,starty+rowTextSize.height/2+padding/2);
                starty+=height;
            }
        },


        /**
         * 设置文字样式
         * @param symbol{
         *     text:图片对象,
         *     width:图片宽度,
         *     height:图片高度,
         *     offsetX:x偏移,
         *     offertY:y偏移
         * }
         * @private
         */
        _setTextSymbol:function(symbol){
            this._style={
                text:symbol.text||"",
                font:symbol.font,
                fontColor:symbol.fontColor,
                offsetX:symbol.offsetX||0,
                offsetY:symbol.offsetY||0,
                background:{
                    color:symbol.background.color,
                    borderColor:symbol.background.borderColor,
                    borderWidth:symbol.background.borderWidth||1
                }
            };

        },

        /**
         * 给canvas的context附样式
         * @param ctx
         * @private
         */
        _setStyleToCtx:function(ctx){
            // ctx.fontStyle=this._style.font;
            // ctx.fillStyle=this.
        },


        /**
         * 获取文字大小
         * @param text
         */
        _getSize:function(text){
            return TextCalculate.calculateTextSize(text,this._style.font);
        }
    });
    return d;
})