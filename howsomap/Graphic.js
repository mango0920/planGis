/**
 * 描述：Graphic
 * 作者：houlu
 * 创建时间：2019/5/16
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./geometry/GeometryType"
], function (declare,GeometryType) {
    var d = declare("howsomap.Graphic", null,{
        /**
         * 构造函数
         * @param
         */
        constructor: function (geometry,symbol,attributes) {
            this.geometry=geometry;
            this.symbol=symbol;
            this.attributes=attributes;
            this.visible=true;
            this.draw=undefined;
        },


        setDrawFunction:function(fun){
            fun(this);
        },

        setGeometry:function(geometry){
            this.geometry=geometry;
            if(this.symbol){
                this.setDrawFunction(this);
            }
        },

        setSymbol:function(symbol){
            this.symbol=symbol;
            if(this.geometry){
                this.setDrawFunction(this);
            }
        },




















    });
    return d;
})