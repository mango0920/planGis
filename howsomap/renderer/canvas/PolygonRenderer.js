/**
 * 描述：多边形渲染
 * 作者：houlu
 * 创建时间：2019/5/14
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "../../symbols/SymbolType",
    "../../geometry/GeometryType"

], function (declare,SymbolType,GeometryType) {
    var d = declare("howsomap.renderer.canvas.PolygonRenderer", null,{
        /**
         * 构造函数
         * @param symbol
         */
        constructor: function (symbol) {
            this._style={
                fillColor:undefined,
                lineColor:undefined,
                lineWidth:undefined,
                lineDash:[],
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
            //设置的是填充样式
            switch(symbol.type){
                case SymbolType.FILLSYMBOL:
                    this._setFillSymbol(symbol);
                    break;
                case SymbolType.LINESYMBOL:
                    this._setLineSymbol(symbol);
                    break;
            }
        },

        /**
         * 绘制扇形
         * @param geometry type Sector {}
         */
        drawSector:function(geometry,ctx,offset){
           this._setStyleToCtx(ctx);
            //x:pt.x,y:pt.y,r:r,begin:this.beginAzi,end:this.endAzi,angle:this.angle
           let sector=geometry.toPixel();
            if(typeof offset==="undefined"){
                offset={x:0,y:0};
            }
           ctx.beginPath();
           ctx.moveTo(sector.x-offset.x,sector.y-offset.y);
            ctx.arc(sector.x-offset.x,sector.y-offset.y,sector.r,sector.begin,sector.end);
            ctx.closePath();
            if(this._style.fillColor){
                ctx.fill();
            }
            if(this._style.lineColor){
                ctx.stroke();
            }

        },



        /**
         * 绘制多边形 暂时不支持带孔的
         * @param geometry
         * @param ctx
         */
        drawPolygon:function(geometry,ctx,offset){
            this._setStyleToCtx(ctx);
            let rings=geometry.toPixel();
            if(typeof offset==="undefined"){
                offset={x:0,y:0};
            }
            for(let i=0;i<rings.length;i++){
                let ring=rings[i];
                ctx.beginPath();
                for(let j=0,length=ring.length;j<length;j++){
                    let pt = ring[j];
                    if (j == 0) {
                        ctx.moveTo(pt.x-offset.x, pt.y-offset.y);
                    } else {
                        ctx.lineTo(pt.x-offset.x, pt.y-offset.y);
                    }
                }
                ctx.closePath();
                if(this._style.color){
                    ctx.fill();
                }
                if(this._style.lineColor){
                    ctx.stroke();
                }
            }
        },

        /**
         * 设置填充样式
         * @param symbol{
         *     color:填充颜色,
         *     outline:线样式
         * }
         * @private
         */
        _setFillSymbol:function(symbol){
            this._style.fillColor=symbol.color;
            //填充样式里包含了线样式
            if(typeof symbol.outline!=="undefined"){
                this._setLineSymbol(symbol.outline);
            }
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
            this._style.lineColor=symbol.lineColor;
            this._style.lineWidth=symbol.lineWidth;
            this._style.lineDash=symbol.lineDash;
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