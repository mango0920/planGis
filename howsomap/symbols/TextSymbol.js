/**
 * 描述：文本样式
 * 作者：houlu
 * 创建时间：2018/10/9
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./SymbolType",
    "howsomap/base/TextCalculate"
], function (declare,SymbolType,TextCalculate) {
    var d = declare("howsomap.symbols.TextSymbol", null,{
        /**
         * 构造函数
         * @param  options:{text,font:z字体,fontColor:字体颜色,background:{color,borderColor,borderWidth}}
         */
        constructor: function (options) {
            this.text=options.text;
            this.font=options.font;
            this.fontColor=options.fontColor;
            this.background=options.background;
            this.offsetX=options.offsetX||0;
            this.offsetY=options.offsetY||0;
            this.type=SymbolType.TEXTSYMBOL;
        },



        /**
         * 绘制图片
         * @param pt
         * @param ctx
         */
        drawPoint:function(pt,ctx){
            var padding=5;
            var size=this.getSize(this.text);
            var rows=this.text.split("\n");
            size={width:size.width+padding,height:size.height+rows.length*padding};
            this._size=size;
            //判断是否需要绘制背景
            if(this.background){
                ctx.strokeWidth=this.background.borderWidth;
                ctx.strokeStyle=this.background.borderColor;
                ctx.fillStyle=this.background.color;
                //是否画填充色
                if(this.background.color) {
                    ctx.fillRect(pt.x - size.width / 2, pt.y - size.height / 2, size.width, size.height);
                }
                //是否画边框
                if(this.background.borderColor){
                    ctx.strokeRect(pt.x - size.width / 2, pt.y - size.height / 2, size.width, size.height);
                }
            }

            //绘制文字
            ctx.fontStyle=this.font;
            ctx.fillStyle=this.fontColor;
            ctx.textAlign = "center";		//设置文字水平居中
            ctx.textBaseline = "middle";	//设置文字垂直居中
            //如果只是一行直接绘制
            if(rows.length==1){
                ctx.fillText(rows[0],pt.x,pt.y);
                return;
            }
            //如果是多行，需要计算每行文字的大小
            var width=size.width;
            var height=size.height/rows.length;
            var startx=pt.x-size.width/2;
            var starty=pt.y-size.height/2;
            //绘制的文字左对齐，离左边界padding/2，离上边界padding/2
            for(var i=0;i<rows.length;i++){
                var rowTextSize=this.getSize(rows[i]);
                ctx.fillText(rows[i],startx+rowTextSize.width/2+padding/2,starty+rowTextSize.height/2+padding/2);
                starty+=height;
            }
        },

        /**
         * 获取文字大小
         * @param text
         */
        getSize:function(text){
            return TextCalculate.calculateTextSize(text,this.font);
        }
    });
    return d;
})