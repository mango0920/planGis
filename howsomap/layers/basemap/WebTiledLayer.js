;
/**
 * 描述：网络地图
 * 作者：houlu
 * 创建时间：2019/5/20
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
define([
        "dojo/_base/declare",
        "esri/SpatialReference",
        "./TiledMapLayer"
    ],
    function(declare,SpatialReference,TiledMapLayer){
        var d=declare("WebTiledLayer",TiledMapLayer,{


            /**
             * 构造函数
             * @param url  图片路径
             * @param startLevel  地图起始等级
             * @param endLevel    地图最大等级
             */
            constructor: function ( url, startLevel, endLevel) {
                this._mapUrl=url;
            },

            /**
             * 计算切片图路径
             * @param level  地图等级
             * @param row	  行号
             * @param col     列号
             * @returns {string}  切片图路径
             */
            getTileUrl: function ( level, row, col ) {
                return this.inherited(arguments);
            },
        });

        return d;
    }
);


