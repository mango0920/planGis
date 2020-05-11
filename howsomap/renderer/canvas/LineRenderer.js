/**
 * 描述：线渲染
 * 作者：houlu
 * 创建时间：2019/5/15
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "../../symbols/SymbolType",
    "../../geometry/GeometryType"

], function (declare,SymbolType,GeometryType) {
    var d = declare("howsomap.renderer.canvas.LineRenderer", null,{
        /**
         * 构造函数
         * @param symbol
         */
        constructor: function (symbol) {
            this._style={
                lineColor:undefined,
                lineWidth:undefined,
                lineDash:[]
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
            //设置的是线样式
            switch(symbol.type){
                case SymbolType.LINESYMBOL:
                    this._setLineSymbol(symbol);
                    break;
            }
        },


        /**
         * 绘制线
         * @param geometry
         * @param ctx
         */
        drawLine:function(geometry,ctx,offset){
            this._setStyleToCtx(ctx);
            let paths=geometry.toPixel();
            if(typeof offset==="undefined"){
                offset={x:0,y:0};
            }
            for(let i=0;i<paths.length;i++){
                let path=paths[i];
                for(let j=0,length=path.length;j<length;j++){
                    let pt = path[j];

                    if (j == 0) {
                        ctx.moveTo(pt.x-offset.x, pt.y-offset.y);
                    } else {
                        ctx.lineTo(pt.x-offset.x, pt.y-offset.y);
                    }
                }

            }
            ctx.stroke();
        },


        /**
         * 设置线样式
         * @param symbol{
         *     color:边线颜色,
         *     lineWidth:边线宽度,
         *     lineDash:[a,b],虚线
         * }
         * @private
         */
        _setLineSymbol:function(symbol){
            var lineSymbol=symbol.outline;
            this._style.lineColor=lineSymbol.lineColor;
            this._style.lineWidth=lineSymbol.lineWidth;
            this._style.lineDash=lineSymbol.lineDash;
        },

        /**
         * 给canvas的context附样式
         * @param ctx
         * @private
         */
        _setStyleToCtx:function(ctx){
            if(ctx.fillStyle!==this._style.fillColor){
                ctx.fillStyle=this._style.fillColor;
            }
            if(ctx.strokeStyle!==this._style.lineColor){
                ctx.strokeStyle=this._style.lineColor;
            }
            if(ctx.lineWidth!==this._style.lineWidth){
                ctx.lineWidth=this._style.lineWidth;
            }
            ctx.setLineDash(this._style.lineDash||[]);
        },

    });
    return d;
})