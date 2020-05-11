/**
 * 描述：图片样式
 * 作者：houlu
 * 创建时间：2018/10/10
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./SymbolType"
], function (declare,SymbolType) {
    var d = declare("howsomap.symbols.PictureMarkerSymbol",null, {
        /**
         * 构造函数
         * @param
         */
        constructor: function (options) {
            this.width=options.width||20;
            this.height=options.height||20;
            this.offsetX=options.offsetX||0;
            this.offsetY=options.offsetY||0;
            this.image=options.image;
            this.type=SymbolType.PICTUREMARKERSYMBOL;

        },



        /**
         * 绘制图片
         * @param pt
         * @param ctx
         */
        drawPoint:function(pt,ctx){
            ctx.drawImage(this.image,pt.x-this.width/2+this.offsetX,pt.y-this.height/2+this.offsetY);
        },




    });
    return d;
})