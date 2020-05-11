/**
 * 描述：几何图形，父类
 * 作者：houlu
 * 创建时间：2018/10/9
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./GeometryType"
], function (declare,GeometryType) {
    var d = declare("howsomap.geometry.Geometry", null,{
        /**
         * 构造函数
         * @param  map:地图对象
         */
        constructor: function (map) {
            this._map=map;
            this.type=GeometryType.GEOMETRY;

        },


        /**
         * 获取像素坐标距离的比例
         * @returns {{x: number, y: number}}
         */
        getPixelScale:function(){
            return {
                x: this._map.extent.getWidth() / this._map.width,
                y: this._map.extent.getHeight() / this._map.height
            }
        },

        /**
         * 是否包含点坐标
         * @param pt 平面坐标
         */
        contains:function(pt,symbol){

        },

        /**
         * 地理坐标转像素坐标
         * @param x
         * @param y
         * @param pixelScale
         * @returns {{x: number, y: number}}
         * @private
         */
        _toScreenPt:function(x,y,pixelScale){
            return {
                      x:(x-this._map.extent.xmin)/pixelScale.x|0,
                      y:(this._map.extent.ymax-y)/pixelScale.y|0
            };
        }













    });
    return d;
})