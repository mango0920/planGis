/**
 * 描述：几何图形，父类
 * 作者：houlu
 * 创建时间：2018/10/9
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare"
], function (declare) {
    var d = {
        /**
         * 计算字符串size
         * @param text
         * @param font
         * @returns {{width: number, height: number}}
         */
        calculateTextSize:function(text,font){
            if(!this._textDiv){
                this._textDiv=document.createElement("div");
                this._textDiv.style.position="absolute";
                this._textDiv.style.visibility="hidden";

                document.body.appendChild(this._textDiv);
            }
            this._textDiv.style.font=font;
            this._textDiv.innerHTML=text;
            return {width:this._textDiv.offsetWidth,height:this._textDiv.offsetHeight}
        },

        /**
         * 利用canvas计算字符串size
         * @param text
         * @param font
         * @returns {{width: number, height: number}}
         */
        calculateTextSizeByCanvas:function(text,font){
            if(!this._ctx){
                let canvas=document.createElement("canvas");
                this._ctx=canvas.getContext("2d");
            }
            this._ctx.font=font;
            let size=this._ctx.measureText(text);
            return size;
        },




    }

    return d;
})