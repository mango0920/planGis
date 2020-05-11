/**
 * 描述：点
 * 作者：houlu
 * 创建时间：2018/10/9
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./Geometry",
    "./GeometryType"
], function (declare,Geometry,GeometryType) {
    var d = declare("howsomap.geometry.Point", Geometry,{
        /**
         * 构造函数
         * @param  map:地图对象
         */
        constructor: function (map,x,y) {
            this._map=map;
            this.x=x||0;
            this.y=y||0;
            this.type=GeometryType.POINT;
        },

        /**
         * 转像素坐标
         */
        toPixel:function(){
            let pixelScale=this.getPixelScale();
            return this._toScreenPt(this.x,this.y,pixelScale);
        },

        /**
         * 是否包含点坐标
         * @param pt 平面坐标
         */
        contains:function(point){
            return false;
        },



        // /**
        //  * 是否在地图显示范围内
        //  */
        // isInMapExtent:function(){
        //     var expandExtent=this._map.expandExtent;
        //     if(this.x>expandExtent.xmin && this.x<expandExtent.xmax && this.y>expandExtent.ymin && this.y<expandExtent.ymax){
        //         return true;
        //     }
        //     return false;
        // }








        









    });
    return d;
})